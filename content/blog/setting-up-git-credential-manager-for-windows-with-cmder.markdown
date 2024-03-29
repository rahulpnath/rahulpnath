---
author: [Rahul Nath]
title: 'Setting up Git Credential Manager for Windows with Cmder'
  
tags:
  - Tools
date: 2017-06-05
completedDate: 2017-06-03 06:18:15 +1000
keywords:
description: Do you enter your git credentials very often?
thumbnail: ../images/git_gcm.png
---

If you are wondering what Git Credential Manager (GCM) is, then possibly you see the below screen very often when you are interacting with your git repositories.

<img src="../images/git_gcm.png" alt="Enter your Credentials, git" class="center" />

On Windows, you can use [Git Credential Manager for Windows](https://github.com/Microsoft/Git-Credential-Manager-for-Windows) which integrates with git and provides the credentials whenever required. GCM removes the need for you to enter the credentials when using the git repositories.

[Cmder](/blog/cmder-portable-console-emulator-for-windows/) is a portable console emulator for Windows. I prefer to use git from the command line and find the cmder experience good. Check out the [youtube video](https://www.youtube.com/watch?v=fpxx8hlNTzc) for more details.

To set up GCM with Cmder download the [latest release of GCM](https://github.com/Microsoft/Git-Credential-Manager-for-Windows/releases) in the zip format. Unzip the package under the _vendor_ folder in cmder. Run the _install.cmd_ from within the unzipped GCM package.

<img src="../images/git_gcm_location.png" alt="Vendor folder under cmder" class="center" />

Once you run the install script, the git config will be updated to use the credential manager. Running _git config --list_ will show the _credential.helper_ set to _manager_. If this is not automatically set you can set it manually by running

```bash
git config --global credential.helper manager
```

For GUI prompts for entering credentials use

```bash
git config --global credential.modalprompt true
```

Hope that saves you some time if you were entering the credentials every time you push/pull from a git repository.
