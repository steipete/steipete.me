---
title: "Docker import/export vs. load/save"
description:
  "A blog post that explains the difference between the Docker import/export and load/save
  commands."
preview_image: /images/blog/2019/docker-import-export-vs-load-save/article-header.png
section: blog
author:
  - William Meleyal
author_url:
  - https://meleyal.com/
date: 2019-10-23 8:00 UTC
tags: Web, Docker, Development
published: true
secret: false
---

In this post, we’ll look at the differences between Docker’s `import`/`export` and `load`/`save` commands. It’s intended for relative newcomers to Docker and covers some of the basics, such as images vs. containers. By the end of the post, you should have a good understanding of getting both images and containers into and out of your local Docker registry. And if, like me, the Docker command help (shown below) makes you go 🤔, then read on!

```sh
$ docker --help | grep -E "(export|import|load|save)"
  export      Export a container\'s filesystem as a tar archive
  import      Import the contents from a tarball to create a filesystem image
  load        Load an image from a tar archive or STDIN
  save        Save one or more images to a tar archive (streamed to STDOUT by default)
```

## A Basic Docker App

Let’s say we’ve created an app and are ready to package it with Docker to share it with the world. Our `Dockerfile` looks as follows:

```docker
FROM busybox
CMD echo $((40 + 2))
```

First, we need to build the image:

```sh
$ docker build --tag calc .
$ docker image ls

REPOSITORY          TAG                 IMAGE ID            CREATED             SIZE
calc                latest              5f3e5352a6e3        7 seconds ago       1.22MB
busybox             latest              db8ee88ad75f        7 days ago          1.22MB
```

Then we should verify it runs:

```sh
$ docker run calc
42
```

OK, it works for me™️. What if we send it to our colleague Alice?

```sh
$ docker save calc > calc.tar
$ rsync calc.tar alice@work:/tmp/
```

Alice imports our image and runs it:

```sh
$ docker import calc.tar calc
$ docker run calc
docker: Error response from daemon: No command specified.
See 'docker run --help'.
```

🙈 _Oof_. What happened here? In our contrived example, you might have noticed we ran `docker save`, while Alice ran `docker import`. Why does Docker have two seemingly similar but incompatible ways of doing things? Let’s find out!

## Saving and Loading Images

`save` and `load` work with Docker images. A Docker image is a kind of template, built from a `Dockerfile`, that specifies the layers required to build and run an app.

Our simple `Dockerfile` has two instructions corresponding to two layers. The first creates a layer from the `busybox` image (pulled from [Docker Hub][]), which is an embedded Linux distro. The second is the command we want to run within that environment:

```docker
FROM busybox
CMD echo $((40 + 2))
```

### Saving

To share or back up our image, we use the `docker save` command. The [documentation][docker save] describes `save` as follows:

> `docker save` – Save one or more images to a tar archive. Contains all parent layers, and all tags + versions.

Let’s save our image and inspect its contents (we could instead use `docker inspect` here, but it can be useful to know that our image just boils down to a list of files):

```sh
$ docker save calc > calc.tar
$ mkdir calc && tar -xf calc.tar -C calc
$ tree calc
calc
├── 41bfa732a8db4acc9d0ac180f869e1e253176b84748ba5a64732bd5b2ce8 # <- busybox layer
│   ├── VERSION
│   ├── json
│   └── layer.tar
├── 889226dbb27fd9ef2765ed48724bf22eb86b48bb984c2edbdb6f3e021e70.json # <- cmd layer
├── manifest.json
└── repositories

1 directory, 6 files
```

We can see our image has two layers, as expected. The BusyBox layer is more complicated, and as such, contains various files and folders, but our CMD layer is just a single JSON configuration file. Looking at this file, we see it has a `Cmd` entry, which is the same `CMD` we specified in our `Dockerfile` (just prefixed by Docker so that it runs correctly in the environment):

```889226dbb27fd9ef2765ed429928724bf22eb86b48bb984c2edbdb6f3e021e70.json
{
  ...
  "config": {
    ...
    "Cmd": ["/bin/sh", "-c", "echo $((40 + 2))"],
    ...
  },
  ...
}
```

Now that we understand what images are, have inspected their internals, and know how to save them, let’s move on to cover loading images _into_ Docker.

### Loading

To load an existing image, we use the `load` command. The [documentation][docker load] describes `load` as follows:

> `docker load` – Load an image or repository from a tar archive. It restores both images and tags.

To test our saved image, let’s first remove our original `calc` image from our local Docker registry:

```sh
$ docker image ls
REPOSITORY          TAG                 IMAGE ID            CREATED             SIZE
calc                latest              c93044af5b09        7 minutes ago       1.22MB
busybox             latest              19485c79a9bb        4 weeks ago         1.22MB
$ docker image rm c93044af5b09 19485c79a9bb
...
```

Then we’ll load our `calc` image from the saved TAR file:

```sh
$ docker load < calc.tar
0d315111b484: Loading layer [==================================>]  1.441MB/1.441MB
Loaded image: calc:latest
```

Checking our local images, we see that `calc` is present. Note that the `busybox` image is not there, as it’s now contained within `calc`:

```sh
$ docker image ls
REPOSITORY          TAG                 IMAGE ID            CREATED             SIZE
calc                latest              889226dbb27f        2 months ago        1.22MB
```

Running the imported `calc` image, we can see it works. Finally, a portable calculator in only a couple hundred lines of Docker configuration 😅:

```sh
$ docker run calc
42
```

## Exporting Containers

`export` works with Docker containers. If images are the template describing our app, containers are the resulting environment created from the template, or the place where our app actually runs. Containers run inside the Docker Engine, which abstracts away the host OS/infrastructure, allowing our apps to “run anywhere.”

Docker automatically creates a container for us when we run an image. If we check our list of containers, we should see `calc` already listed there. As our app just starts, prints, and then exits, we need to pass the `-all` flag to also list stopped containers:

```sh
$ docker container ls --all
CONTAINER ID        IMAGE               COMMAND                  CREATED
a8b14091b4e7        calc                '/bin/sh -c echo $(…'    2 minutes ago
```

### Exporting

To export a container, we use the `docker export` command. The [documentation][docker export] describes `export` as follows:

> `docker export` – Export a container’s filesystem as a tar archive.

Let’s export our container and inspect its contents:

```sh
$ docker export a8b14091b4e7 > calc-container.tar
$ mkdir calc-container && tar -xf calc-container.tar -C calc-container
$ tree -L 1 calc-container
calc-container
├── bin
├── dev
├── etc
├── home
├── proc
├── root
├── sys
├── tmp
├── usr
└── var

10 directories, 0 files
```

As we can see, this is just a regular old Linux file system — the BusyBox file system created when running our image, to be precise.

Why is this useful? Imagine our app is more complicated and takes a long time to build, or it generates a bunch of compute-intensive build artifacts. If we want to clone or move it, we could rebuild it from scratch from the original image, but it would be much faster to `export` a current snapshot of it, similar to how you might use a prebuilt binary as opposed to compiling one yourself.

## Importing Images

While `save` and `load` are easy to understand, both accepting and resulting in an image, the relationship between `import` and `export` is a little harder to grok.

There’s no way to “import a container” (which wouldn’t make sense, as it’s a running environment). As we saw above, `export` gives us a file system. `import` takes this file system and imports it as an image, which can run as-is or serve as a layer for other images.

To import an exported container as an image, we use the `docker import` command. The [documentation][docker import] describes `import` as follows:

> `docker import` – Import the contents from a tarball to create a filesystem image.

Let’s import our container’s file system image and see what it can do:

```sh
$ docker import calc-container.tar calcfs:latest
$ docker image ls
REPOSITORY          TAG                 IMAGE ID            CREATED              SIZE
calcfs              latest              27ebbdf82bf8        About a minute ago   1.22MB
calc                latest              889226dbb27f        2 months ago         1.22MB
$ docker run -t -i calcfs /bin/sh
/ # ls
bin   dev   etc   home  proc  root  sys   tmp   usr   var
/ # echo "we have a shell!"
we have a shell!
/ #
```

As you can see, Docker happily runs our exported file system, which we can then attach to and explore.

## Conclusion

To summarize what we’ve learned, we now know the following:

- `save` works with Docker images. It saves everything needed to build a container from scratch. Use this command if you want to share an image with others.
- `load` works with Docker images. Use this command if you want to run an image exported with `save`. Unlike `pull`, which requires connecting to a Docker registry, `load` can import from anywhere (e.g. a file system, URLs).
- `export` works with Docker containers, and it exports a snapshot of the container’s file system. Use this command if you want to share or back up the result of building an image.
- `import` works with the file system of an exported container, and it imports it as a Docker image. Use this command if you have an exported file system you want to explore or use as a layer for a new image.

When I was new to Docker, this caused me some confusion. Had I RTFM’d a little more, digging into the subcommands, I might have noticed that `export` only applies to containers, while `import`, `load`, and `save` apply to images 🤦‍♂️:

```sh
$ docker container --help | grep -E "(export|import|load|save)"
  export      Export a container\'s filesystem as a tar archive

$ docker image --help | grep -E "(export|import|load|save)"
  import      Import the contents from a tarball to create a filesystem image
  load        Load an image from a tar archive or STDIN
  save        Save one or more images to a tar archive (streamed to STDOUT by default)
```

The result of all this learning is that [PSPDFKit for Web][] is now available on both Docker Hub and npm, meaning first-class PDF support for your web apps is only a [`docker pull`][] or [`npm install`][] away 🎉.

[docker hub]: https://hub.docker.com/_/busybox
[docker save]: https://docs.docker.com/engine/reference/commandline/save/
[docker load]: https://docs.docker.com/engine/reference/commandline/load
[docker export]: https://docs.docker.com/engine/reference/commandline/export/
[docker import]: https://docs.docker.com/engine/reference/commandline/import/
[pspdfkit for web]: /pdf-sdk/web/
[`docker pull`]: https://hub.docker.com/r/pspdfkit/pspdfkit
[`npm install`]: https://www.npmjs.com/package/pspdfkit
