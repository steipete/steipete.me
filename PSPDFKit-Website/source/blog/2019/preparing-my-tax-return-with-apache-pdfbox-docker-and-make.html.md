---
title: "Preparing My Tax Return with Apache PDFBox, Docker, and Make"
description: "How I combined Apache PDFBox, Docker, and Make to streamline my tax return workflow."
preview_image: /images/blog/2019/preparing-my-tax-return-with-apache-pdfbox-docker-and-make/article-header.png
section: blog
author:
  - Claudio Ortolina
author_url:
  - https://twitter.com/cloud8421
date: 2019-04-08 8:00 UTC
tags: Web, PDF
published: true
secret: false
---

I recently had to complete my tax return, which involves collecting receipts and invoices and sending them to my accountant.

While this is achievable with graphical tools (e.g. Preview on Mac), I decided to take some time to investigate if I could find a way to do this in a more automated fashion, i.e. by creating and running a script designed for this exact purpose.

I have all of my source documents for the relevant tax year (2017–2018) in categorized folders: expenses, invoices, and statements. Each folder contains a chronologically ordered list of PDF files.

![Initial folder structure](/images/blog/2019/preparing-my-tax-return-with-apache-pdfbox-docker-and-make/initial-folder-structure.png)

After running my script, I’d like to have three new master files inside 2017–2018: `expenses.pdf`, `invoices.pdf`, and `statements.pdf`.

It would also be useful to be able to:

- make this setup portable, as I often jump between two different computers. All my data is synced automatically, but I want to make sure I can regenerate these files at any time.
- make the script lazy. If I don’t add, remove, or modify one of the source files, the program should skip the generation of the relevant master file.

After some investigation, I decided to try [Apache PDFBox][], a Java-based library that allows manipulation of PDF files. What really piqued my interest is that it also exposes a fairly straightforward command line API, which is perfect for my scripting needs.

To make it portable, I’ll be using [Docker][] and [this Docker image][], as this way I won’t have to worry about having the correct Java version installed on my machine.

Finally, I’m going to wrap everything into a [Makefile][], which, by default, uses a lazy approach.

## Step 1: Running Apache PDFBox via Docker

The Apache PDFBox Docker image suggests using this approach:

```shell
docker run -it -v $PWD:/home crochik/pdfbox <command>
```

This means that:

- All files in the current directory (`$PWD`) will be mounted inside /home in the running container. For example, if we run this command from inside 2017–2018, the `invoices/2017-08.pdf` file will be available as `/home/invoices/2017-08.pdf`.
- We can pass any of the commands listed on the [Apache PDFBox Command-Line Tools][] reference page.

![Expenses folder contents](/images/blog/2019/preparing-my-tax-return-with-apache-pdfbox-docker-and-make/expenses.png)

For example, I can try to merge two invoices:

```
docker run -it -v $PWD:/home crochik/pdfbox PDFMerger invoices/2017-06.pdf invoices/2017-07.pdf invoices/merged.pdf
```

This successfully generates a new `invoices/merged.pdf` file. We’re on the right track!

![Expenses folder contents showing the new merged file](/images/blog/2019/preparing-my-tax-return-with-apache-pdfbox-docker-and-make/expenses-with-merged-pdf.png)

## Step 2: Writing a Makefile

We can create a Makefile inside the 2017–2018 directory and populate it with the following content:

```makefile
PDFBOX=docker run -it -v $(CURDIR):/home crochik/pdfbox

expenses.pdf: expenses/*.pdf
	$(PDFBOX) PDFMerger $? $@
```

First of all, we define a `PDFBOX` variable to abstract the Docker usage details and simplify the rest of the file. Note that while on the shell, we can use `$PWD`, but inside a Makefile, we need to switch to `$(CURDIR)` to have the exact same effect.

After that, we can define our first target, `expenses.pdf`. Its prerequisite (`expenses/*.pdf`) instructs Make to run the target every time a PDF file inside the expenses folder has changed.

The rule itself uses two variables that Make provides out of the box: `$?` gets replaced with the list of all prerequisites, which, in our case, ends up being all files contained in `expenses/*.pdf`. The other variable (`$@`) gets replaced by the target itself (`expenses.pdf`).

When I run `make`, it generates and runs the following command:

```shell
docker run -it -v /Users/cloud/Dropbox/tax/2017-2018:/home crochik/pdfbox PDFMerger expenses/2017-05-10-amazon.pdf expenses/2017-05-10-pimoroni.pdf expenses/2017-05-14-tfl.pdf expenses.pdf
```

The generated file, `expenses.pdf` is exactly what we want!

![Folder structure with the expenses master file](/images/blog/2019/preparing-my-tax-return-with-apache-pdfbox-docker-and-make/expenses-master-file.png)

Next, we only need to expand the Makefile to generate all the other targets:

```makefile
PDFBOX=docker run -it -v $(CURDIR):/home crochik/pdfbox

all: expenses.pdf invoices.pdf statements.pdf

expenses.pdf: expenses/*.pdf
	$(PDFBOX) PDFMerger $? $@

statements.pdf: statements/*.pdf
	$(PDFBOX) PDFMerger $? $@

invoices.pdf: invoices/*.pdf
	$(PDFBOX) PDFMerger $? $@
```

Running `make` with this file will default to the `all` target, which in turn will invoke all the other targets.

![Folder structure with all the master files](/images/blog/2019/preparing-my-tax-return-with-apache-pdfbox-docker-and-make/final-folder-structure.png)

Note that if you try to run `make` twice, it will stop straight away, as all the master files will already be up to date.

## Conclusion

I’m quite pleased with the setup I’ve described, as it does exactly what I needed it to do in order to make my accountant happy.

I hope you found this helpful. In the meantime, if you find yourself in need of more powerful PDF editing capabilities (especially for batches of files), please check out [PSPDFKit for Web][] with Server integration, which provides a server-to-server API that can be used to operate on large collections of documents.

[apache pdfbox]: https://pdfbox.apache.org/index.html
[docker]: https://www.docker.com
[this docker image]: https://hub.docker.com/r/crochik/pdfbox
[makefile]: https://www.gnu.org/software/make/manual/make.html
[apache pdfbox command-line tools]: https://pdfbox.apache.org/2.0/commandline.html
[pspdfkit for web]: https://pspdfkit.com/pdf-sdk/web/#deployment
