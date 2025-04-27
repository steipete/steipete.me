---
title: "Moving a Git Repository into Its Submodule"
description: "How we improved our Git repository setup by moving our PDF Viewer for iOS repository into our PSPDFKit repository."
preview_image: /images/blog/2020/moving-a-git-repository-into-its-submodule/article-header.png
section: blog
author:
  - Douglas Hill
author_url:
  - https://twitter.com/qdoug
date: 2020-01-15 8:00 UTC
tags: iOS, Development, How-To
cta: viewer
published: true
secret: false
---

We recently improved our Git repository setup for [PDF Viewer][viewer] on both iOS and Android, which reduces overhead so that we have more time to work on improvements and new features.

READMORE

Almost all the powerful functionality in PDF Viewer comes from our [PSPDFKit SDK][sdk]. Nevertheless, PSPDFKit is a dependency of PDF Viewer, so when we initially set up the Git repositories for Viewer on iOS and Android, they each had our [PSPDFKit repository][] as a submodule. In this post I’ll use iOS as an example, but we applied the same technique to our PDF Viewer for Android repository.

```
Viewer-iOS --------> PSPDFKit
           submodule
```

There were several problems with this arrangement:

- PSPDFKit SDK changes could inadvertently break PDF Viewer. We wouldn’t know until the submodule was updated by someone on the team, and it’s possible the person doing this might have been slower working out the correct way to update Viewer.
- We had to coordinate two pull requests on GitHub — one for each of the repositories.
- Many Viewer branches updated the submodule, resulting in multiple conflicts.
- We always wanted the PDF Viewer master branch to be up to date with the latest changes from the PSPDFKit master branch, in order to take advantage of improvements to PSPDFKit. But as a result, a huge proportion of Viewer commits just bumped the PSPDFKit submodule.

To address these problems, we decided to change the structure so that the PDF Viewer project files resided in a subfolder of the main PSPDFKit repository:

```
* PSPDFKit/
└─┬ iOS/
  └── Viewer/
```

As a result, now:

- Pull requests changing the PSPDFKit SDK trigger PDF Viewer jobs on our continuous integration system, so we know immediately if the change breaks PDF Viewer.
- Changes can be synced up between the SDK and Viewer in a single pull request.
- There are no longer any submodule conflicts.
- There are no commits bumping the submodule; the SDK is always up to date.

In fact, we think the only disadvantage of this arrangement is the increased size of the PSPDFKit repository, which slows down some Git operations. This also means it takes more space to clone, even for people who work on PSPDFKit but not on PDF Viewer for iOS.

All that said, one of the things we wanted to do during this restructuring was preserve the history during the move, and that required some advanced Git! To show how this worked, I’ll now walk through the steps we took. I hope this is useful as a reference if you need to solve a similar problem in your Git repositories.

## Preparations

Because we moved the master branch, we first made sure there were no open pull requests for PDF Viewer.

Naturally, both repositories needed to be cloned on the machine doing the moving. It was easiest to have them side by side in the same parent folder:

```
*
├── PSPDFKit/
└── Viewer-iOS/
```

The first step in preparing the Viewer repository was to [remove the submodule][git docs]:

```sh
cd ~/Viewer-iOS
git checkout -b repo-merge
git rm Viewer/Vendor/PSPDFKit
git commit
```

## Rewriting Paths in the History

The Viewer history needed to be rewritten so that it appeared as though the files were always under the path `iOS/Viewer/` instead of at the repository root. This was done using `git filter-branch`:

```sh
# We need the tab character for sed (macOS sed does not understand \t).
TAB="$(printf '\t')"

# The desired path prefix.
# The slash needs escaping because we use it as the separator in sed below.
TARGET_PATH="iOS\/Viewer"

FILTER="git ls-files -s | sed \"s/${TAB}/${TAB}${TARGET_PATH}\//\" | GIT_INDEX_FILE=\${GIT_INDEX_FILE}.new git update-index --index-info && mv \${GIT_INDEX_FILE}.new \${GIT_INDEX_FILE}"

git filter-branch \
    --force \
    --index-filter "${FILTER}" \
    --tag-name-filter 'echo viewer-ios-`cat`' \
    HEAD
```

The above was adapted from [git-rewrite-to-subfolder by Lucas Jenß][gist]. We use tags for release version numbers, and since version numbers will be shared with other projects in the destination repository, this script also rewrites tag names, for example, from `1.2.3` to `viewer-ios-1.2.3`. The use of `--force` disables a backup created by Git, but I found the command often refused to run without this argument.

## Moving the History

After the Viewer repository was ready, we moved its history to the PSPDFKit repository using a Git “remote” pointing to the local repository:

```sh
cd ~/PSPDFKit
git remote add viewer-ios ../Viewer-iOS
git fetch viewer-ios repo-merge
git checkout -b viewer-history viewer-ios/repo-merge
git remote remove viewer-ios
```

While the `viewer-ios` remote was set up, you could also fetch tags reachable from the master branch so that the tags could be migrated.

## Complication: Large Files

Bearing in mind that the disadvantage of the target setups was the increased size of the main repository, we checked the impact of the `viewer-history` branch.

It was surprisingly large — hundreds of megabytes. We were able to check for large objects reachable from `HEAD` in a Git repository with this dense command adapted from [raphinesse on Stack Overflow][large objects]:

```sh
git rev-list --objects HEAD \
| git cat-file --batch-check='%(objecttype) %(objectname) %(objectsize) %(rest)' \
| sed -n 's/^blob //p' \
| sort --numeric-sort --key=2 \
| cut -c 1-12,41- \
| awk '$2 >= 2^20'
```

Almost all the cost was from binary dependencies. Since we were rewriting the history anyway, we decided to rewrite a little bit more to move these large objects into [Git Large File Storage (LFS)][lfs].

Git LFS is a Git extension developed by GitHub and Atlassian. It replaces large files in the repo with tiny pointer files. These large files are then stored at an LFS endpoint. Note that the use of LFS means your repository is no longer decentralized, but most of us use Git in a centralized manner anyway.

LFS works using Git hooks and is transparent once set up.

We were able to rewrite history to move all file versions at a particular path into LFS with the following:

```sh
git lfs migrate import \
--include="iOS/Viewer/Vendor/Intercom/Intercom.framework/Intercom" \
--include-ref=refs/heads/viewer-history
```

This was run multiple times for each path that needed migrating to LFS.

## Merging the History

At this point, the Viewer history was in the main repository. It was written so that files were at the expected path and large objects were removed. However, it was a line of history separate from the PSPDFKit master branch, so we began merging these histories with this command:

```sh
git checkout master
git checkout -b repo-merge
git merge -s ours \
  --no-commit \
  --allow-unrelated-histories \
  viewer-history
```

Since the histories were unrelated, we had to manually supply the current Viewer source files, so we copied all the Viewer source files to the `iOS/Viewer` folder in the PSPDFKit repo. Git LFS created a top-level `.gitattributes` file, so we added the contents of that to the already existing PSPDFKit `.gitattributes` file. Then we committed the merge and ended up with a commit graph that looked a bit like this:

```
           | [repo-merge] Merge viewer-history into repo-merge
          /|
[master] | | [viewer-history] Remove PSPDFKit submodule
         | |
         | |
PSPDFKit | | Viewer
```

Once the histories were merged, all that was left to do was update paths in the Viewer project so it could find PSPDFKit. Instead of being located at `Viewer/Vendor/PSPDFKit/iOS/`, it can now be found at `../`. And once everything was building and running properly, we made a pull request using the `repo-merge` branch to merge everything back into the PSPDFKit master branch. After merging that, the commit history was like this:

```
[master] |   Merge repo-merge into master
         |\
         | | Fix Viewer build
         | |
         | | Merge viewer-history into repo-merge
         |/|
         | | Remove PSPDFKit submodule
         | |
         | |
PSPDFKit | | Viewer
```

Relocated tags could also be pushed to the new repository. We had to be careful not to push tags that were not on the master branch, because these were not relocated with the rewritten history. If we had pushed them, the tag references would have kept the original history reachable in the repository.

## Results

We have been very pleased with this arrangement since switching. With no submodule to update and run tests with, it takes seconds to kick off a new build that will end up on TestFlight. It feels unremarkable, as a release process should.

## Addendum: Troubleshooting LFS

A common problem we encountered with other team members is that the Viewer build would fail with this cryptic build error:

```
ld: warning: ignoring file iOS/Viewer/Vendor/Intercom/Intercom.framework/Intercom, file was built for unsupported file format ( 0x76 0x65 0x72 0x73 0x69 0x6F 0x6E 0x20 0x68 0x74 0x74 0x70 0x73 0x3A 0x2F 0x2F ) which is not the architecture being linked (x86_64)
```

What this means is Git LFS pointer files are checked out in the working copy. This is caused by checking out the files before installing Git LFS. To fix this, ensure Git LFS is set up and explicitly instruct it to update:

```sh
git lfs install
git lfs pull
```

[viewer]: https://pdfviewer.io/
[sdk]: https://pspdfkit.com/pdf-sdk/ios/
[pspdfkit repository]: https://pspdfkit.com/blog/2019/benefits-of-a-monorepo/
[git docs]: https://git-scm.com/docs/gitsubmodules
[large objects]: https://stackoverflow.com/a/42544963
[lfs]: https://git-lfs.github.com/
[gist]: https://gist.github.com/x3ro/6242017
