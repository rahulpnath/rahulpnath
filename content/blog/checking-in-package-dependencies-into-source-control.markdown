---
author: [Rahul Nath]
title: 'Checking in Package Dependencies into Source Control'
  
tags:
  - Programming
  - Thoughts
date: 2016-04-26 12:21:21
keywords:
description:
thumbnail: ../images/nuget_package_sources.png
---

_This post looks into why we should include packages in the source control and not resolve it via configuration files at build time._

Over the past few years, [Package Managers](https://en.wikipedia.org/wiki/Package_manager) have gained an important role in the way software gets developed. There is an [increasing number of package managers](https://github.com/showcases/package-managers) catering to different programming languages and areas of development, making the distribution of reusable libraries and plugins easy. The convention that's usually followed with these package dependencies is to exclude them from source control, and use a configuration file ([package.json](https://docs.npmjs.com/files/package.json), [packages.config](https://docs.nuget.org/consume/package-restore)) to retrieve all the packages at build time. Even the [GitHub’s collection](https://github.com/github/gitignore) of [.gitignore](https://git-scm.com/docs/gitignore) file templates ignores the packages folders of various package managers.

```text
# NuGet Packages
*.nupkg
# The packages folder can be ignored because of Package Restore
**/packages/*
...
# Dependency directories
node_modules
jspm_packages
```

## Common Arguments for not Checking in Packages

Since checking in packages is not a common practice, let's first see some of the arguments for not doing this and how it compares to having them checked in.

### **Storage**

_Packages are something that can be resolved at runtime and keeping them excluded saves that extra space on the source control system._

Yes, this might have been a good reason few years back, but these days this is not a good reason as storage has become really cheap. Moreover popular source control systems charge by the [number of repositories](https://github.com/pricing/plans) and not by the space it occupies (although it has [limits](https://help.github.com/articles/what-is-my-disk-quota/) on it).

### **Time**

_The clone is faster when you do not have packages in the source control repository as opposed to having them._

But for the project to build we need the packages restored first. So the time is either spent in the clone or in the restore. But if the packages are included in the git clone then you can immediately start working on the project after a clone and do not need any internet connectivity to make the project build. This is also of advantage if you want to run a '[git clean](https://git-scm.com/docs/git-clean)' - which cleans the working tree by recursively removing files that are not under version control. With packages not under the source control, you have to restore them every time you run it - This is not a problem if you have internet connectivity, but will block your work if you do it when you don't.

> _Without checking in dependent packages, you can't git clone and get on a flight nor can you git clean while on a [flight](https://en.wikipedia.org/wiki/Airplane_mode)_

Moreover cloning a repository is a one-time activity, while a clean can be done any time a developer wants to. So it actually saves more time to keep the packages checked in.

## More Reason for Checking in Packages

Now that we have seen most of the common arguments are not valid, let's see more reasons on why including the packages into the source control is actually better.

### **Explicit Dependencies**

It's always better to be explicit about your code dependencies and not have them resolved by a package manager.

> _Packages are nothing but code and can alter the behaviour of the application._

There are possibilities of specific package versions getting [removed from the package manager](http://blog.npmjs.org/post/141577284765/kik-left-pad-and-npm), which your application is still dependent on and leads to build breakage! If your package configuration is set up in such a way to resolve the latest available package of the specific dependency, there are possibilities that the package owner pushes an update that is not backward compatible, causing the build to break! Given that these possibilities exist there is no reason to exclude package dependencies from checked in.

### **Package Source Downtime**

Though the publicly available package sources like NuGet, npm are available almost all the time, it is likely that they too [can go down](http://stackoverflow.com/questions/17806889/nuget-feed-reliability). The last thing you would want is to get blocked by the downtime of these services - be it failure to build locally or on a server or even block a critical deployment. With the packages available in your source control, you have one less moving part in your whole deployment pipeline and it is better to have lesser dependencies.

### **Custom Package Sources**

Many times I have had to update my Package sources in Visual Studio and break my head on the specific order of these entries to get the project building. This is very common when using custom packages sources like [ProGet](http://inedo.com/proget) or [MyGet](https://myget.org/). Such dependencies make project setup harder and is easily avoided if all the dependent assemblies are available within the repository. You can still have them as custom NuGet sources but have the dependencies included into the repository and update the references whenever source changes. This makes project ramp up easier and faster, with one less configuration step.

<img class="center" alt="Nuget custom package source" src="../images/nuget_package_sources.png" />

Do you still see any reason for not checking in package dependencies into the source control? If not let's go and change that package folder exclude and have them included in the source. (I just updated [CLAL](/blog/clal-command-line-application-launcher/) to [include dependencies.](https://github.com/rahulpnath/clal/commit/736023d9ab4bd285cb077ff54acd1bbaad142a08))
