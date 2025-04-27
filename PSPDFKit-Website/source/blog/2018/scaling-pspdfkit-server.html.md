---
title: "Scaling PSPDFKit Server"
description: "A quick look at how we added horizontal scalability to PSPDFKit Server."
preview_image: /images/blog/2018/scaling-pspdfkit-server/article-header.png
section: blog
author:
  - Silvio Doblhofer
author_url:
  - https://twitter.com/sido378
date: 2018-06-26 12:00 UTC
tags: Products, PSPDFKit Server, Scaling, Performance
published: true
---

PSPDFKit Server was designed and built so that a single server can serve real-time updates to tens of thousands of clients. That said, one might reach the point where PSPDFKit Server becomes the bottleneck of distributing documents and synchronizing changes across its clients. READMORE We wanted to make sure our customers are able to scale their PSPDFKit infrastructure to fit their current and future needs, so [we added horizontal scaling support](https://pspdfkit.com/guides/server/current/deployment/horizontal-scaling/) with our release of PSPDFKit Server 2017.7.

In this blog post, we’ll cover how we added horizontal scaling capabilities to PSPDFKit Server and provide a brief overview of how you can set up a cluster to take advantage of this.

## How We Added Horizontal Scaling Capabilities

The problem we needed to solve was distributing changes made by one client connected to a single server to all other clients, regardless of the node in the PSPDFKit Server cluster they are connected to. Each node can have one or more clients currently waiting for changes in a single document. As such, it needs to be aware when changes happen to the document so that it’s able to forward those changes to its clients. Since all nodes connect to the same Postgres database, we leverage the LISTEN/NOTIFY feature of Postgres to let the nodes notify each other about new changes.

Postgres’ LISTEN/NOTIFY feature allows you to use the [publish–subscribe](https://en.wikipedia.org/wiki/Publish%E2%80%93subscribe_pattern) model via your database. Postgres connections can `LISTEN` (subscribe) to a specific channel and will get a notification when a connection sends a message to that channel via `NOTIFY` (publish). While `NOTIFY` only allows string payloads consisting of up to 8,000 bytes, you can simply encode your strings to be able to send more complex payloads. In case 8,000 bytes are not enough, Postgres recommends saving the data to a database table and sending the key of the record.

In our case, because the list of changes can theoretically be very large, we only send a notification that contains information about which document has changed, and every node is individually responsible for fetching and distributing the actual changes to its clients.

The use of Postgres’ LISTEN/NOTIFY feature for cross-node communication allows us to rely on a trusted and well-used technology we are already using heavily — all without having to add another dependency or technology to our infrastructure or develop a costly and error-prone feature ourselves.

## How to Set Up Your Cluster

To add a new PSPDFKit Server instance to your cluster, all you have to do is start up another Docker container. Please note that all your containers have to use the same configuration. This is important, because if the secrets don’t match or the asset storage backend is not the same across all nodes, client authentication might fail, depending on the node, or uploaded documents might only be accessible from certain nodes. As soon as multiple nodes are connected to the same database, they’ll notify each other of changes happening to any documents.

The next step is setting up a load balancer to distribute clients across nodes in your cluster. Depending on your deployment environment, this could mean setting up nginx load balancing, or if you are using a cloud platform provider, using the provided load balancing solution like Elastic Beanstalk Load Balancer.

For a short guide on how to deploy PSPDFKit Server to various cloud services, please take a look at our [Deployment](https://pspdfkit.com/guides/server/current/deployment/getting-started/) guides section.
