---
author: [Rahul Nath]
title: 'Automated Deployment of AsmSpy to Chocolatey Using AppVeyor'
tags:
  - Open Source
  - Tools
date: 2016-08-01 04:32:19
keywords:
description: Using AppVeyor to Automatically deploy AsmSpy to Chocolatey.
thumbnail: ../images/asmspy.png
---

Recently I have been trying to contribute to open source projects, to build the habit of reading others code. I chose to start with projects that I use regularly. [AsmSpy](https://github.com/mikehadlow/AsmSpy) is one such project.

> _AsmSpy is a Command line tool to view assembly references. It will output a list of all conflicting assembly references. That is where different assemblies in your bin folder reference different versions of the same assembly._

![AsmSpy assembly conflicts](../images/asmspy.png)

I started with an [easy issue](https://github.com/mikehadlow/AsmSpy/pull/20) to get familiar with the code and to confirm that the project owner, [Mike Hadlow](https://github.com/mikehadlow), accepts Pull Requests (PR). Mike was fast to approve and merge in the changes. There was a feature request to make AsmSpy available as [Chocolatey](https://chocolatey.org/) package. Chocolatey is a package manger for Windows, to automate software management. AsmSpy, being a tool that's not project specific, it makes sense to deliver this via Chocolatey and makes installation easier. Mike added me as a project [collaborator](https://help.github.com/articles/permission-levels-for-a-user-account-repository/), which gave better control over the repository.

## Manually Releasing the Chocolatey Package

AsmSpy is currently distributed as a [zip package](http://static.mikehadlow.com/AsmSpy.zip). Chocolatey supports packaging from a URL with a PowerShell script [_Install-ChocolateyZipPackage_](https://github.com/chocolatey/choco/wiki/HelpersInstallChocolateyZipPackage). For the first release I [used this helper script to create the Chocolatey package](https://github.com/mikehadlow/AsmSpy/pull/22) and uploaded it to my account. After fixing a few review comments the [package got published](https://chocolatey.org/packages/asmspy/1.0.0).

![choco install asmspy](../images/asmspy_choco.png)

## Automating Chocolatey Releases

Now that I have to manage the AsmSpy Chocolatey package installations, I decided to automate the process of Chocolatey package creation and upload. Since I had used AppVeyor for [automating Click-Once deployment](/blog/automated-clickonce-deployment-of-a-wpf-application-using-appveyor/) of [CLAL](https://github.com/rahulpnath/clal), I decided to use AppVeyor for this.

### **The Goal**

I wanted to automatically deploy any new version of the package to Chocolatey. Any time a [tagged commit](https://git-scm.com/book/en/v2/Git-Basics-Tagging) is made in the main branch (master) it should trigger a deployment and push the new package to Chocolatey. This will give us the flexibility to control version numbers and decide when we actually want to make a release.

### **Setting up the Appveyor Project**

Since now I am a collaborator on the project, AppVeyor shows the AsmSpy GitHub repository in my AppVeyor account too. Setting up a project is really quick in AppVeyor and most of it is automatic. Any commits now to the repository triggers an automated build

<img alt="Appveyor add new project" src="../images/asmspy_appveyor_addProject.png" />

After playing around with different Appveyor project settings and build scripts, I noticed that AppVeyor was no longer triggering builds on commit pushes in the repository. I tried deleting and adding the AppVeyor project, but with no luck.

> The @appveyor project suddenly stopped triggering auto builds on pushes.Deleted and added new project https://t.co/qfV8P2fmWN any thoughts?  
> — Rahul P Nath (@rahulpnath) [_July 17, 2016_](https://twitter.com/rahulpnath/status/754764006976466944)

The AppVeyor team was quick to respond and suggested a possible problem with the Webhook URL not configured under the GitHub repository. The Webhook URL for AppVeyor is available under the projects settings. Since I did not have access to the Settings page of the GitHub repository, I reached out to Mike, who promptly updated the Webhook URL for AppVeyor under GitHub project settings. This fixed the issue of builds not triggering automatically when commits are pushed to the GitHub repository.

<img alt="Github webhook url for appveyor" src="../images/asmspy_github_webhook.png"/>

### **Creating Chocolatey Package**

AppVeyor has [support for Chocolatey commands](https://www.appveyor.com/blog/2014/11/06/appveyor-with-a-hint-of-chocolatey) out of the box, which makes it easy to create packages on a successful build. I added in the [nuspec file](https://github.com/mikehadlow/AsmSpy/blob/master/AsmSpy/AsmSpy.nuspec) that defines the Chocolatey Package and added an after-build script to generate the package. AppVeyor exposes [environment variables](https://www.appveyor.com/docs/environment-variables), that are set for every build. In the 'after_build' scripts I trigger Chocolatey packaging only if the build is triggered by a commit with a tag (APPVEYOR_REPO_TAG_NAME). Every build generates the zip package that can be used to test the current build.

```yaml
version: 1.0.{build}
build:
  verbosity: minimal
after_build:
  - cmd: >-
      7z a asmspy.zip .\AsmSpy\bin\Debug\AsmSpy.exe
      if defined APPVEYOR_REPO_TAG_NAME choco pack .\AsmSpy\AsmSpy.nuspec --version %APPVEYOR_REPO_TAG_NAME%
      if defined APPVEYOR_REPO_TAG_NAME appveyor PushArtifact asmspy.%APPVEYOR_REPO_TAG_NAME%.nupkg -DeploymentName ReleaseNuget
artifacts:
  - path: asmspy.zip
    name: Zip Package
  - path: '\AsmSpy\bin\*.nupkg'
    name: Nuget Package
```

### **Setting up Chocolatey Environment**

Since Chocolatey is built on top of NuGet infrastructure, it supports deployment to it like you would do for a NugGet package. The [NuGet deployment provider](https://www.appveyor.com/docs/deployment/nuget) publishes packages to a NuGet feed. All you need to provide is the feed URL and the API key and the package to deploy. I created a NuGet deployment environment with the chocolatey NuGet URL, my account API key and the Artifact to deploy.

<img  alt="AppVeyor Chocolatey environment" src="../images/asmspy_appveyor_environment.png"/>

The projects build setting is configured to deploy to the Environment created above for a build triggered by a commit with a tag.

```yaml
deploy:
  - provider: Environment
    name: AsmSpy Chocolatey
    on:
      branch: master
      APPVEYOR_REPO_TAG: true
```

From now on any tagged commit is pushed into the master branch on the repository it will trigger a release into Chocolatey. I have not tested this yet as there were no updates to the tool. I might trigger a test release sometime soon to see if it all works well end to end. Since with this automated deployment, we no longer use the zip URL to download the package in Chocolatey. The exe gets bundled along with the package. There might be some extra build scripts required to support the upgrade scenario for Chocolatey. <strikethrough>I will update the post after the first deployment using this new pipeline!</strikethrough>. From version [1.2.0](https://chocolatey.org/packages/asmspy/1.2.0) it uses this new pipeline
