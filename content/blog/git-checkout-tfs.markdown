---
author: [Rahul Nath]
title: 'git checkout TFS'
  
tags:
  - Productivity
  - Programming
date: 2016-04-15 05:23:08
keywords:
description:
thumbnail: ../images/git_featurebranch_workflow.png
---

It's been a year since using [Git](https://git-scm.com/) as my mainstream version control system and I am loving it! Before Git, I had used Team Foundation Version Control (TFVC) for a very long time and was so used to it that I found Git a bit complex and overwhelming in the beginning. Team Foundation Server (TFS) is the whole product suite from Microsoft that provides source code management. Until TFS 2013, it supported only TFVC which is when it introduced [Git in TFS](https://blogs.msdn.microsoft.com/mvpawardprogram/2013/11/13/git-for-tfs-2013/). Even today people use TFS and TFVC synonymously (like in the title of this post) though they are not the same.

## Fundamental shift in thinking

By design, Git is a Distributed VCS, whereas TFS is centralized one. It takes quite a while to get your head around this and what it actually means. By definition

> **\*TFVC**: Uses a single, centralized server repository to track and version files. Local changes are always checked in to the central server where other developers can get the latest changes.\*
>
> **\*Git**: Git is a distributed version control system. Each developer has a copy of the source repository on their dev machine. Developers can commit each set of changes on their dev machine and perform version control operations such as history and compare without a network connection.\*

You. may not see the real Distributed benefits if you are working off a central repository (hosted on a server like GitHub or Bitbucket) and using [TFS way of development](https://www.atlassian.com/git/tutorials/comparing-workflows/centralized-workflow) :

*Get latest code => Make your changes => Merge latest +> Check in (*Commit and push*)*

The real power of Git is better understood when you start working disconnected, use branches to keep unrelated development activities separate and merge those into the main trunk (_master_) once comfortable. You get a local copy of the project and lets you make changes independent of all the other changes in the project.

> _Git feels so lightweight and never gets in the way of doing things._

## Make command line your friend

If you are a UI savvy person then Git might a good starting point to start using the command line. At first, it definitely feels hard especially if you were TFS/Visual Studio users and might be tempted to use the GUI tools available ([GitHub Desktop](https://desktop.github.com/) or [SourceTree](https://www.sourcetreeapp.com/))

> _Repetitive tasks become more evident when you use a command line and easily automatable._

I use Cmder ([one of my favourite tools](/blog/tools-that-I-use/)) with Git and have [set up SSH](https://help.github.com/articles/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent/) to Bitbucket and Github (expected soon on TFS), secured by a paraphrase, so that I do not have to key in the credentials every time I interact with the repositories. I [start the ssh-agent the very first time I open Cmder](https://github.com/cmderdev/cmder/issues/193#issuecomment-63040989), which prompts for my paraphrase and continues to run in the background. Alternatively, you can also use [Credential Manager](https://github.com/Microsoft/Git-Credential-Manager-for-Windows) to store credentials, when working with HTTP enabled Git repository. For the common commands, I have set up aliases like below, to save a bit on the keystrokes.

```text
gl=git log --oneline --all --graph --decorate  $*
gs=git status
ga=git add -A
gp=git pull
gpp=git push
gc=git commit -m "$*"
gcc=git commit
```

## Different workflows

Git can be used in many ways and which makes it hard to get started. There are a few popular [workflows](https://www.atlassian.com/git/tutorials/comparing-workflows/) that one can use. Currently, I am using - [Feature Branch workflow](https://www.atlassian.com/git/tutorials/comparing-workflows/feature-branch-workflow) -
which means that all work happen on independent feature branches and once completed gets merged into the main trunk (master branch). Code Reviews happens on the way it gets pulled into the main branch, which ensures code quality and familiarity.

[![Git Feature Branch Workflow](../images/git_featurebranch_workflow.png)](https://www.atlassian.com/git/images/tutorials/collaborating/comparing-workflows/feature-branch-workflow/01.svg)

### Not Just for Code

Git is a version control system and does not limit itself to storing code. You can use it for [version controlling any of your work](http://readwrite.com/2013/11/08/seven-ways-to-use-github-that-arent-coding/). For example, this blog is [hosted on Github](https://github.com/rahulpnath/rahulpnath.com) and all the [changes are version controlled](https://github.com/rahulpnath/rahulpnath.com/commits/master), which gives me the flexibility to work and commit locally. Since the blog is [static generated](/blog/static-generator-is-all-a-blog-needs-moving-to-octopress/) I can also preview all the changes locally. I use git whenever I work on any documents or [presentations](https://github.com/rahulpnath/Speaking) so that I can avoid manual copy of files and renaming with suffixes like '_Draft_, '_Draft1_,_Final_,"_FinalRevision_' etc. (if that sounds any similar)

## Managing Commits

When coming to commits, which are nothing but checkpoints of meaningful work done, people might have a different definition for '_meaningful_' - for some it might be really granular, for others a bit coarse and for yet another it means all the work is done. I tend to commit quite often - even a rename of a variable leads to a commit so that I do not have to backtrack if at all something goes wrong immediately after that.

if you really like the idea of committing often (locally), but want the pushes to remotes more coarse, you can '**[squash your commits](http://stackoverflow.com/questions/5189560/squash-my-last-x-commits-together-using-git)**', before pushing it to remote branch. This allows you to commit often locally and still push meaningful commit in the main source history. Make sure that the [commit messages and clear and communicates the intent](http://chris.beams.io/posts/git-commit/) and helps [keep a good looking history](http://megakemp.com/2014/08/14/the-importance-of-a-good-looking-history/).

Git is one of the best things that happened to developers and hopes it stays long!

**References**

- [Git Reference](http://gitref.org/index.html)
- [Pro Git](https://git-scm.com/book/en/v2)
