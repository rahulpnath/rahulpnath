---
author: [Rahul Nath]
title: 'Tip of the Week: Using Git Locally in a TFVC Repository'
  
tags:
  - TipOW
  - Productivity
  - Programming
date: 2017-06-21
completedDate: 2017-06-21 06:33:54 +1000
keywords:
description: Use the power of git even with TFVC source control.
thumbnail: ../images/tfvc_local_git.png
---

The project that I am currently working on using [Team Foundation Version Control](https://www.visualstudio.com/en-us/docs/tfvc/overview)(TFVC) as it's source control. After [using Git](/blog/git-checkout-tfs/) for a long time it felt hard to move back to TFVC. One of the biggest pain for me is losing the short commits that I do when working. Short commits help keep track of the work and also quickly revert unwanted changes. Branching is also much easier with Git and allows to switch between work without much hassle of '_shelving -> undoing -> pulling back the latest as with TFS._'

<img src="../images/tfvc_local_git.png" alt="Use Git Locally in a TFVC Repository" class="center" />

The best part with git is that you can use it to work with any folder in your system and does not need any setup. By just running '_[git init](https://git-scm.com/docs/git-init)_' it initializes a git repository in the folder. Running _init_ against my local TFVC source code folder, I initialized a git repository locally. Now it allows me to work locally using git - make commits, revert, change branches, etc. Whenever I reach a logical end to the work, I create a shelveset and push the changes up the TFVC source control from Visual Studio.

If you want to interact with the TFVC source control straight from the command line, you can try out [git-tfs](https://github.com/git-tfs/git-tfs) - a Git/TFS bridge. For me, since I am happy working locally with git and pushing up the finished work as shelvesets from Visual Studio I have not explored the git-tfs tool.

Hope this helps someone if you feel stuck with TFVC repositories!
