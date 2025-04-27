---
title: "How to Use Docker Compose to Run Multiple Instances of a Service in Development"
description: "In this blog post, we’ll look at an example of how we can run multiple instances of a service with Docker Compose."
preview_image: /images/blog/2018/how-to-use-docker-compose-to-run-multiple-instances-of-a-service-in-development/article-header.png
section: blog
author:
  - Maximilian Störchle
author_url:
  - https://twitter.com/max_hoyd
date: 2018-10-29 8:00 UTC
tags: Development, Docker, Infrastructure
published: true
secret: false
---

At PSPDFKit, we use [Docker Compose][] for local development and for testing various configurations of [PSPDFKit Server][]. Because PSPDFKit Server supports [horizontal scaling][] via connecting multiple server nodes to a Postgres database, we need an easy way to develop and test system configurations with multiple instances of a service. Take a look at our [blog post about scaling PSPDFKit Server][scaling pspdfkit server] for more information about how we added scaling capabilities to PSPDFKit Server.

In this blog post, we’ll look at an example of how we can run multiple instances of a service with Docker Compose.

For an introduction to [Docker Compose][], take a look at a [previous blog post][docker compose blog post], which also explains how to manage multiple system configurations with Docker Compose.

# Example Docker Compose File

For this post, we’ll work with the following example Docker Compose file:

```yaml
version: "3"

services:
  db:
    image: postgres:latest
    environment:
      POSTGRES_USER: pspdfkit
      POSTGRES_PASSWORD: password
      # ... other environment variables
  pspdfkit:
    image: "pspdfkit/pspdfkit:latest"

    environment:
      PGUSER: pspdfkit
      PGPASSWORD: password
      # ... other environment variables
    depends_on:
      - db
    ports:
      - "5000:5000"
```

In this file, we defined two services: the `db` service that configures our [PostgreSQL][] database, and the `pspdfkit` service. In line 20, we defined the port mappings for the Docker container. For port mappings, Docker Compose uses the `HOST:CONTAINER` format. In our example, we expose the port `5000` from the container to the same port on the host machine. This way, we can access the server with the `http://localhost:5000` URL on our host machine.

# Docker Compose `--scale` flag

When we run the `docker-compose help up` command, we see all available options for the Docker Compose command. One of those options is `--scale`, which is exactly what we were looking for to run multiple instances of a service:

```
--scale SERVICE=NUM        Scale SERVICE to NUM instances. Overrides the
                           `scale` setting in the Compose file if present.
```

However, running `docker-compose up --scale pspdfkit=3` with our current Docker Compose configuration will result in the following errors:

```
Creating network "example" with the default driver
Creating example_db_1 ... done
WARNING: The "pspdfkit" service specifies a port on the host. If multiple containers for this service are created on a single host, the port will clash.
Creating example_pspdfkit_1 ... done
Creating example_pspdfkit_2 ... error
Creating example_pspdfkit_3 ... error

ERROR: for example_pspdfkit_2  Cannot start service pspdfkit: driver failed programming external connectivity on endpoint example_pspdfkit_2 (abcfabc2c11b38c773ce7977065da516cb426838248f077a700dfe6dc3afb271): Bind for 0.0.0.0:5000 failed: port is already allocated

ERROR: for example_pspdfkit_3  Cannot start service pspdfkit: driver failed programming external connectivity on endpoint example_pspdfkit_3 (18fe1a15cf0278886e08fb9e9d2e7325492fcc2c7c2d36b104998b3482620869): Bind for 0.0.0.0:5000 failed: port is already allocated

ERROR: for pspdfkit  Cannot start service pspdfkit: driver failed programming external connectivity on endpoint example_pspdfkit_2 (abcfabc2c11b38c773ce7977065da516cb426838248f077a700dfe6dc3afb271): Bind for 0.0.0.0:5000 failed: port is already allocated
ERROR: Encountered errors while bringing up the project.
```

The problem with our current configuration is that we’re trying to run three instances of the `pspdfkit` service and map them all to the same port on our host machine. Because the host machine can only bind an unallocated port to the container, we will get the `Bind for 0.0.0.0:5000 failed: port is already allocated` error for each additional `pspdfkit` service.

A simple way to fix these errors is to change line 20 in our Docker Compose file to `- "5000"`. This will expose the port `5000` of the container to an ephemeral unallocated port on the host machine. The only problem with this approach is that we won’t know the ports to access the services until the containers are started. To list the port mappings, run `docker-compose ps` after you’ve run `docker-compose up --scale pspdfkit=3` to start the containers:

```
      Name                      Command                  State                Ports
--------------------------------------------------------------------------------------------
example_db_1         docker-entrypoint.sh postgres    Up             5432/tcp
example_pspdfkit_1   /usr/bin/dumb-init -- /sbi ...   Up (healthy)   0.0.0.0:32776->5000/tcp
example_pspdfkit_2   /usr/bin/dumb-init -- /sbi ...   Up (healthy)   0.0.0.0:32775->5000/tcp
example_pspdfkit_3   /usr/bin/dumb-init -- /sbi ...   Up (healthy)   0.0.0.0:32777->5000/tcp
```

We see the port mappings in the last column of the table output. In this example, we have `pspdfkit` containers running at ports `32775`, `32776`, and `32777`.

# Adding a Load Balancer

In order to be able to access the `pspdfkit` service without knowing the port of the specific container and to distribute the requests to a container with load balancing mechanisms, we need to add a load balancer to the system configuration. In this example, we’ll use [NGINX][] as the load balancer. To add the load balancer to our Docker Compose system configuration, we create the following `nginx.conf` file in the same directory as the `docker-compose.yml` file:

```conf
user  nginx;

events {
    worker_connections   1000;
}
http {
        server {
              listen 4000;
              location / {
                proxy_pass http://pspdfkit:5000;
              }
        }
}
```

This will configure NGINX to forward the request from port `4000` to `http://pspdfkit:5000`. This will then be resolved by [Docker’s embedded DNS server][], which will use a [round robin][] implementation to resolve the DNS requests based on the service name and distribute them to the Docker containers.

Because the NGINX service will handle the requests and forward them to a `pspdfkit` service, we don’t need to map the port `5000` from the `pspdfkit` services to a host machine port. So we can remove the port mapping configuration from our Docker Compose file and only expose the port `5000` to linked services. And in order to load the NGINX configuration file we just created, we have to mount it as a volume in the `nginx` service and add port mappings to the host container for that server. In this example, we configured NGINX to listen on the port `4000`, which is why we have to add port mappings for this port.

This is what our final `docker-compose.yml` file looks like:

```yaml
version: "3"

services:
  db:
    image: postgres:latest
    environment:
      POSTGRES_USER: pspdfkit
      POSTGRES_PASSWORD: password
      # ... other environment variables
  pspdfkit:
    image: "pspdfkit/pspdfkit:latest"

    environment:
      PGUSER: pspdfkit
      PGPASSWORD: password
      # ... other environment variables
    depends_on:
      - db
    expose:
      - "5000"
  nginx:
    image: nginx:latest
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
    depends_on:
      - pspdfkit
    ports:
      - "4000:4000"
```

With this configuration, we are now able to start multiple instances of the `pspdfkit` service by setting the scale parameter of the Docker Compose command to the number of services we want to start — for example:

```
docker-compose up --scale pspdfkit=5
```

The above command will start five instances of PSPDFKit Server, which can be accessed at `http://localhost:4000`. The requests to this URL will get load balanced and distributed to one of the five `pspdfkit` Docker containers.

# Conclusion

Having a fast and easy way to spin up a system configuration with multiple instances of a service saves a lot of time when testing different system configurations for a scalable service with `docker-compose`.

[docker compose]: https://docs.docker.com/compose/
[pspdfkit server]: https://pspdfkit.com/guides/server/current/
[horizontal scaling]: https://pspdfkit.com/guides/server/current/deployment/horizontal-scaling/
[scaling pspdfkit server]: https://pspdfkit.com/blog/2018/scaling-pspdfkit-server/
[docker compose blog post]: https://pspdfkit.com/blog/2018/how-to-manage-multiple-system-configurations-using-docker-compose
[postgresql]: https://www.postgresql.org/
[nginx]: https://www.nginx.com/
[docker’s embedded dns server]: https://docs.docker.com/v17.09/engine/userguide/networking/configure-dns/
[round robin]: https://en.wikipedia.org/wiki/Round-robin_DNS
