---
title: "How to Run Your Phoenix Application with Docker"
description: "We’re taking a look at how to run Elixir applications within a Docker container, and how that can simplify the setup of development and deployment environments."
preview_image: /images/blog/2018/how-to-run-your-phoenix-application-with-docker/article-header.png
section: blog
author: 
  - Nicolas Dular
author_url: 
  - https://twitter.com/NicolasDular
date: 2018-02-13 12:00 UTC
tags: Development, Elixir, Docker
published: true
---

At PSPDFKit, we invested in Elixir very early. [PSPDFKit Server](https://pspdfkit.com/guides/server/current/) is written completely in Elixir and delivers magical real-time collaboration features to our [PSPDFKit clients](https://pspdfkit.com/instant/). It was clear from the beginning that our customers wanted to host PSPDFKit Server within their existing infrastructure to retain complete control over their data. We obviously don’t want them to have to install and maintain Elixir and other dependencies on their server, so we decided to go with Docker, a software that provides an additional layer of abstraction of operating-system-level virtualization.

In this blog post, I will explain how you can run your Elixir application inside Docker. This is useful if you’re developing an API that your app developers are using: They don’t need to install Elixir; rather, they can simply install Docker and run your container. For simplicity’s sake, we will use the [Phoenix framework](http://phoenixframework.org) to serve a website from the Docker container.

## What Is Docker?

Docker makes it possible to package your application and use it in development and production by running it in a container. A container is like a virtual machine, but while the virtual machine actually runs its own OS, a container can reuse the underlying Linux kernel while still running completely isolated from its surroundings. This not only makes it possible to run many more containers on a single machine compared to virtual machines, but there’s the added benefit that containers start instantly.

### Getting Started
For the purpose of this post, I will assume you already have a Phoenix project that you now want to run within a Docker container. To get started with Docker, you first need to [install](https://docs.docker.com/engine/installation/) it for your environment.

## Dockerfile

A container is an instance of a Docker image. You can create your own images and start from a clean Linux distribution of your choice and install all required packages on your own, or you can use predefined images from [Docker Hub](https://hub.docker.com/). For our Elixir project, we can use the official [Elixir Docker image](https://hub.docker.com/_/elixir/) as our base image. The Elixir image itself uses an Erlang image as its base and extends it by installing the required [Elixir dependencies](https://github.com/c0b/docker-elixir/blob/50e579afdbacd31c2b9f77b1b4290e61331f8d95/1.5/Dockerfile).

We now create our own `Dockerfile` in our Elixir root directory:

```
# ./Dockerfile

# Extend from the official Elixir image
FROM elixir:latest

# Create app directory and copy the Elixir projects into it
RUN mkdir /app
COPY . /app
WORKDIR /app

# Install hex package manager
# By using --force, we don’t need to type “Y” to confirm the installation
RUN mix local.hex --force

# Compile the project
RUN mix do compile
```

In the Dockerfile, we specified what should be done when running the container:
- We created a separate `/app` folder which we copied our code to
- We installed hex to fetch the dependencies
- We compiled the project

While writing the Dockerfile, you may have noticed that we haven’t yet mentioned Postgres. Where should we run our database? If we want all of our infrastructure to run in containers, we should actually create our own container that runs Postgres. Luckily, there is also an official Postgres image that we can reuse. But all of this leaves us with more questions than before.

How can we create an image from our Dockerfile now? How can we start multiple containers at once? How can our Phoenix container communicate with the Postgres container?

The solution? Docker Compose.

## docker-compose.yml

`docker-compose.yml` is our file that defines which containers we are going to run and which images we need to create. Here is the full `docker-compose.yml` we will use for our app:

```yml
# Version of docker-compose
version: '3'

# Containers we are going to run
services:
  # Our Phoenix container
  phoenix:
    # The build parameters for this container.
    build:
      # Here we define that it should build from the current directory
      context: .
    environment:
      # Variables to connect to our Postgres server
      PGUSER: postgres
      PGPASSWORD: postgres
      PGDATABASE: database_name
      PGPORT: 5432
      # Hostname of our Postgres container
      PGHOST: db
    ports:
      # Mapping the port to make the Phoenix app accessible outside of the container
      - "4000:4000"
    depends_on:
      # The db container needs to be started before we start this container
      - db
  db:
    # We use the predefined Postgres image
    image: postgres:9.6
    environment:
      # Set user/password for Postgres
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      # Set a path where Postgres should store the data
      PGDATA: /var/lib/postgresql/data/pgdata
    restart: always
    volumes:
      - pgdata:/var/lib/postgresql/data
# Define the volumes
volumes:
  pgdata:
```

Because a container is stateless and can be destroyed and recreated at any time, Docker allows you to create volumes. Volumes are separate from the container and you can easily define them in `docker-compose.yml`.

## Up and Running… Nearly

Now we want to create our Docker image. We can do this by executing `docker-compose build` (it will take some time to download and install all the images). You should receive a success message, and via `docker images`, you will get a list of all Docker images available on your machine:

```shell
REPOSITORY           TAG                 IMAGE ID            CREATED             SIZE
helloworld_phoenix   latest              be0fed013a6b        2 minutes ago       917MB
elixir               latest              9d6cef9afe13        13 days ago         889MB
postgres             9.6                 d3ac03f9698d        4 weeks ago         268MB
```

We now can even start our Docker container via `docker-compose up`. However, if we go to `http://localhost:4000` we will see nothing. This is because, as you probably might have noticed, we never started our Phoenix application, nor did we create the database.

### Start Phoenix and Create Our Database

To start our Phoenix server, create our database, and do our database migrations, we will create a separate shell script that we call `entrypoint.sh`. (When creating this file, don’t forget to give it execution rights via `chmod +x entrypoint.sh`):

```bash
# entrypoint.sh

#!/bin/bash
# Docker entrypoint script.

# Wait until Postgres is ready
while ! pg_isready -q -h $PGHOST -p $PGPORT -U $PGUSER
do
  echo "$(date) - waiting for database to start"
  sleep 2
done

# Create, migrate, and seed database if it doesn't exist.
if [[ -z `psql -Atqc "\\list $PGDATABASE"` ]]; then
  echo "Database $PGDATABASE does not exist. Creating..."
  createdb -E UTF8 $PGDATABASE -l en_US.UTF-8 -T template0
  mix ecto.migrate
  mix run priv/repo/seeds.exs
  echo "Database $PGDATABASE created."
fi

exec mix phx.server
```

#### Wait until Postgres starts

You might ask yourself: We already defined the Postgres container as a dependency of our Phoenix container, so why do we need to wait? Yes, `docker-compose` will wait until the Postgres container has started, but this does not mean that the Postgres server inside the container is already running. This is why we need wait until our Postgres server starts via `pg_isready` — I will explain later how we can install it. Inside the loop, we check if the Postgres server is already running. If that’s not the case, we wait two seconds and check the status of the server again. You can also see that we can use the environment variables defined in the `docker-compose` file for our `pg_isready` function.

#### Create the database

After we know that Postgres has started, we can create our database if it doesn’t yet exist and run our migrations and seed data.

#### Start our Phoenix server

In the end, we can execute `mix phx.server` and this will finally start our server.

## Updating Our Dockerfile

We now need to execute the `entrypoint.sh` script in our Dockerfile. We also need to install the package `postgresql-client` to run `pg_isready` within that script:

```
# Use an official Elixir runtime as a parent image
FROM elixir:latest

RUN apt-get update && \
  apt-get install -y postgresql-client

# Create app directory and copy the Elixir projects into it
RUN mkdir /app
COPY . /app
WORKDIR /app

# Install hex package manager
RUN mix local.hex --force

# Compile the project
RUN mix do compile

CMD ["/app/entrypoint.sh"]
```

## Accessing the Postgres Server

One question still remains: How can we access the Postgres server within our Phoenix container? The Postgres container is available to us via the hostname `db` (the same name as the container). To actually use our environment variables in our configuration, we will overwrite the database configuration in our repo:

```elixir
defmodule YourApp.Repo do
  use Ecto.Repo, otp_app: :your_app

  def init(_, config) do
    config = config
      |> Keyword.put(:username, System.get_env("PGUSER"))
      |> Keyword.put(:password, System.get_env("PGPASSWORD"))
      |> Keyword.put(:database, System.get_env("PGDATABASE"))
      |> Keyword.put(:hostname, System.get_env("PGHOST"))
      |> Keyword.put(:port, System.get_env("PGPORT") |> String.to_integer)
    {:ok, config}
  end
end
```

Now we are finally done. We can run `docker-compose build` and `docker-compose up` again and our containers will start, create the database, and start the Phoenix server that is now accessible via [`http://localhost:4000`](http://localhost:4000).

## Useful Commands

Here is a small list of useful commands when dealing with Docker:

* `docker ps` lists all containers that are currently running
* `docker container ls --all` lists all containers that are available
* `docker logs <container>` shows the log of the given container
* `docker start/stop <container>` starts or stops a container
* `docker rm <container>` removes a container
* `docker images` lists all available images
* `docker rmi <image>` removes an image
* `docker-compose down --volumes` destroys the created volumes


## Conclusion

Even if it takes you some time to create the Dockerfile and `docker-compose.yml`, you will benefit from it in the long run. Everyone on our team can now run this Docker container without the need to install any dependencies. It’s also easy to not only recreate the container again if something went wrong, but also reuse the container in your test and production environment.
