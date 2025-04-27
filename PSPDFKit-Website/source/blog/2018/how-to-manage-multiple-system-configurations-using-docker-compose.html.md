---
title: "How to Manage Multiple System Configurations Using Docker Compose"
description: "This blog post is a short introduction to Docker Compose and will explain how we use it to manage different system configurations that are built off the same base configuration."
preview_image: /images/blog/2018/how-to-manage-multiple-system-configurations-using-docker-compose/article-header.png
section: blog
author:
  - Maximilian Störchle
author_url:
  - https://twitter.com/max_hoyd
date: 2018-04-26 12:00 UTC
tags: Development, Docker, Infrastructure
published: true
---

At PSPDFKit, we use [Docker Compose](https://docs.docker.com/compose/) for local development and for testing various configurations of [PSPDFKit Server](https://pspdfkit.com/guides/server/current/). This blog post is a short introduction to Docker Compose and will explain how we use it to manage different system configurations that are built off the same base configuration.

# What Is Docker Compose?

Docker Compose is a tool for running applications and systems containing multiple Docker containers by using a YAML file to configure all the containers. Docker Compose already ships with [Docker for Mac](https://docs.docker.com/docker-for-mac/install/) and [Docker for Windows](https://docs.docker.com/docker-for-windows/install/). On Linux, you can install Docker Compose with the following commands:

```bash
sudo curl -L https://github.com/docker/compose/releases/download/1.17.1/docker-compose-`uname -s`-`uname -m` -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

To check which version of Docker Compose is installed on your machine, use the following:

```bash
docker-compose --version
```

Although Docker Compose is a very effective tool when configuring a local development system, staging servers, and CI, it is not recommended to use it in production. For this purpose, it’s better to use a Docker orchestration tool like [Kubernetes](https://kubernetes.io/) or
[Amazon ECS](https://aws.amazon.com/ecs/).

# Getting Started with Docker Compose

To use Docker Compose, create a `docker-compose.yml` in the root directory of your project. An example Docker Compose file looks like this:

```yml
# Version of docker-compose
version: "3"

services:
  db:
    image: postgres:9.6
    environment:
      POSTGRES_USER: pspdfkit
      POSTGRES_PASSWORD: password
      POSTGRES_DB: pspdfkit
      POSTGRES_INITDB_ARGS: --data-checksums
      PGDATA: /var/lib/postgresql/data/pgdata
    volumes:
      - pgdata:/var/lib/postgresql/data
  pspdfkit:
    image: "pspdfkit/pspdfkit:latest"

    environment:
      PGUSER: pspdfkit
      PGPASSWORD: password
      PGDATABASE: pspdfkit
      PGHOST: db
      PGPORT: 5432

      # Activation key for your PSPDFKit Server installation.
      ACTIVATION_KEY: ${ACTIVATION_KEY}

      # Secret token used for authenticating API requests.
      API_AUTH_TOKEN: secret

      # Base key used for deriving secret keys for the purposes of authentication.
      SECRET_KEY_BASE: secret-key-base

      # Public key used for verification of JWTs from web clients. It has to be in the PEM format.
      JWT_PUBLIC_KEY: |
        -----BEGIN PUBLIC KEY-----
        MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBALd41vG5rMzG26hhVxE65kzWC+bYQ94t
        OxsSxIQZMOc1GY8ubuqu2iku5/5isaFfG44e+VAe+YIdVeQY7cUkaaUCAwEAAQ==
        -----END PUBLIC KEY-----
      JWT_ALGORITHM: RS256

      # Credentials to access the admin dashboard.
      DASHBOARD_USERNAME: dashboard
      DASHBOARD_PASSWORD: secret

    depends_on:
      - db
    ports:
      - "5000:5000"
volumes:
  pgdata:
```

The line `version: '3'` at the top of the file defines the Docker Compose file version that will be used for this configuration. For this blog post, I will be focusing on version 3 since it is the newest version for Docker Compose files.

After the version header, all the services (Docker containers) used in the configuration will be configured. Each service has a name. In our example, we have two services, called `db` and `pspdfkit`.

Each service defines a Docker image, from which the Docker container should be built. Here we define the `postgres` image with the tag `9.6` (version) to be pulled from the [official Docker Hub](https://hub.docker.com/) repository. The `pspdfkit` service pulls the `pspdfkit` image with the `latest` (version) tag from a private Docker repository (`docker.pspdfkit.com`). Alternatively, you can configure a service in Docker Compose to build a new image from a `Dockerfile` by setting the build path to the Dockerfile and using `build` instead of `image` and the path as the value.

Under `environment`, the environment variables that are set for the container will be defined. You can also pass any currently defined environment variables to Docker Compose by using the `${ENV_VARIABLE}` syntax.

The `depends_on` key defines which other services the service depends on and ensures that a network between the containers will be built.

With the `ports` key, it is possible to expose ports from the container to your host machine in order to access the service. The ports are configured with the `"HOST_PORT:CONTAINER_PORT"` syntax.

[Docker volumes](https://docs.docker.com/engine/admin/volumes/volumes/) provide a way of storing the data across containers and prevent data loss when removing a container. For this, the `volume` key in the service configuration defines the path where the specified volume should be mounted in the container.

After you have defined your configuration in a Docker Compose file, you can start the whole system by executing the following command:

```bash
docker-compose up
```

When this command is executed, Docker Compose will pull all the images necessary for the setup, generate all the services configured in the Docker Compose file, create the network between the containers, set the environment variables for the containers, and expose the configured ports. This makes local development and testing a system, both of which are dependent on external services, very easy.

To stop and remove all containers that are configured in Docker Compose, execute the following:

```bash
docker-compose down
```

When you also want to remove all named volumes that are declared in the `volumes` section of the Docker Compose file, run this:

```bash
docker-compose down --volumes
```

Additionally, there is an option to remove the images that are used to build the containers defined in Docker Compose:

```bash
docker-compose --rmi all
```

This is very helpful when you use the `latest` tag for an image and you want to ensure the image will get pulled from the defined repository again. Otherwise, Docker Compose will use the older image with the latest tag in your local repository instead of downloading the newest image.

# Using Multiple Docker Compose Files

At PSPDFKit, we use Docker Compose to test all the [configuration options](https://pspdfkit.com/guides/server/current/configuration/overview/) that are available in [PSPDFKit Server](https://pspdfkit.com/guides/server/current/). Because of the flexibility that
[PSPDFKit Server](https://pspdfkit.com/guides/server/current/) provides in where your PDF documents and assets are stored, we have a few Docker Compose files to test the interactions between different services. Although each Docker configuration is different, they all often share a base configuration. To be able to have a flexible and manageable Docker Compose testing configuration, we use Docker Compose override files, which will override a base Docker Compose file.

## Docker Compose Override

By default, Docker Compose reads two files: a `docker-compose.yml` file, and a `docker-compose.override.yml` file. The latter defines overrides for the services defined in `docker-compose.yml` and new services. With the `-f` option of Docker Compose, you can also define multiple override files, where each file extends the configuration of the previous one. This makes Docker Compose a very effective tool for testing multiple environments or configurations.

## How We Use Docker Compose Override to Share and Merge Different Configuration Setups for Testing Purposes

To test the [PSPDFKit Server](https://pspdfkit.com/guides/server/current/) image with different configuration options and integration with different external services, we use a base Docker Compose image, which sits in the root directory of our configuration testing directory. This is how the configuration directory for testing different configurations of [PSPDFKit Server](https://pspdfkit.com/guides/server/current/) looks:

```bash
$ tree configurations
.
├── assets-minio
│   ├── README.md
│   ├── docker-compose.override.yml
│   ├── docker-compose.yml -> ../docker-compose.base.yml
├── assets-built-in
│   ├── docker-compose.override.yml
│   └── docker-compose.yml -> ../docker-compose.base.yml
├── assets-s3
│   ├── README.md
│   ├── docker-compose.override.yml
│   └── docker-compose.yml -> ../docker-compose.base.yml
...
└── docker-compose.base.yml
```

The base Docker Compose file is called `docker-compose.base.yml`, and each of the subfolders — which represent different configurations — contains a symbolic link to the top-level base Docker Compose file. We renamed the symbolic link to `docker-compose.yml` to be able start the system with `docker-compose up` and not have to set the file option with the `-f` parameter. An example of such a Docker override file is `docker-compose.override.yml` in the `assets-s3` directory, which defines the environment variables necessary to integrate [PSPDFKit Server](https://pspdfkit.com/guides/server/current/) with [Amazon S3](https://aws.amazon.com/s3/):

```
version: '3'

services:
  pspdfkit:
    environment:
      # aws
      ASSET_STORAGE_BACKEND: S3
      ASSET_STORAGE_S3_BUCKET: ${AWS_S3_BUCKET}
      ASSET_STORAGE_S3_ACCESS_KEY_ID: ${AWS_ACCESS_KEY_ID}
      ASSET_STORAGE_S3_SECRET_ACCESS_KEY: ${AWS_SECRET_ACCESS_KEY}
      ASSET_STORAGE_S3_REGION: eu-central-1
```

# Conclusion

Using Docker Compose helped our team implement an easy-to-use setup for testing different configuration options and integration with external services for our products. Having a base Docker Compose file, which can be overwritten by other Docker Compose files, makes it a lot easier to manage and configure these setups.
