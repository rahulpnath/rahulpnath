---
author: [Rahul Nath]
title: 'Continuos Delivery of Octopress Blog Using TravisCI and Docker'
  
tags:
  - Blogging
  - Productivity
date: 2016-09-01 04:11:12
keywords:
description: Setting up the automatic deployment of my blog.
thumbnail: ../images/blog_ci.png
---

It's been a while since I have wanted to deploy my blog automatically whenever there is a new commit pushed into the associated [git repository](https://github.com/rahulpnath/rahulpnath.com). I use Octopress as my blog engine and have been [tweaking it to my blogging workflow](/blog/optimizing-octopress-workflow-for-new-posts/). Octopress is a static blog generator built over Jekyll. So anytime I make any updates to the blog, I need to build the blog with the accompanying rake tasks and push the generated output (HTML, JavaScript, and CSS) to an Azure Web App that hosts my blog. For this I use the [git deployment feature](https://azure.microsoft.com/en-us/documentation/articles/web-sites-deploy/#continuousdeployment) of web apps, so just pushing the built output to a git repo (branch) deploys it to my website. As you see every time, I make a change I have to build the site and push it to the git repository and this can be automated. Since Octopress is in Ruby, I decided to use [Travis CI](https://travis-ci.org/) for the build and deploy.

## Local Build Environment with Docker

I am on an older repository fork of Octopress and have not updated to latest version. So it has hard dependencies with specific versions of gem packages that it needs and also on the Ruby and Jekyll version. So every time I change laptop it's difficult to set up the blog environment. In the past, I manually installed the dependencies whenever I got a new laptop. As changing laptop does not happen frequently, I had been delaying creating any script for this. But now since I had to setup the Travis build environment, I thought of also having a local build environment to test before pushing it up to Travis. Travis provides a Docker image that matches exactly their build environment.

Setting up Docker is just a few steps:

1. [Install](https://docs.docker.com/docker-for-windows/) the Docker components
2. Load the [Docker image](https://quay.io/organization/travisci)

```text
docker run -it -p 4000:4000 quay.io/travisci/travis-ruby /bin/bash
```

Once in the container, you can run the same build scripts that you manually run yo deploy and check. I had a few issues with the gem packages and [fixed it by specifying hard package dependency](https://github.com/rahulpnath/rahulpnath.com/commit/abefbf58e3696384c7931d5a4918239a41700106#diff-8b7db4d5cc4b8f6dc8feb7030baa2478). To launch the site hosted in Docker from host system [I expose incoming ports through the host container](https://github.com/wsargent/docker-cheat-sheet#exposing-ports). Once I have the local server running in the docker container (in port 4000) I can access it via _localhost:4000_ from my host computer.

## Post Dates and TimeZones

When building from the container, I noticed that the dates of posts were off by 1. For posts that were on month start (like Aug 1), it started coming up in July, on the archive page. After a bit of investigation, I realized that Jekyll parses the date time from the post and converts them into local system time. The container was running in UTC and when generating the site it converted post DateTime to UTC. All the posts that I had written after coming to Sydney had an offset of +1000 (or +1100) and most were published early in the morning. So it converted those posts to the previous date.
Since I am not that worried about the time zone of the post, I decided to remove it. I removed timezone information getting set for new posts in my Rake scripts. For the existing posts, [I removed all the timezone information from the _datetime_ YAML header in the posts](https://github.com/rahulpnath/rahulpnath.com/commit/1d8902fa69a1aad9ad6615ee3c47e3474b6cd263). I set the config.yml to built in UTC irrespective of the system timezone that it is getting build.

## Setting up TravisCI

Setting up automated build on Travis CI is smooth and easy process TDK. I just added a travis.yml with the '_rake generate_. TDK The post build script does the following

- Clones the current statically generated code from my _blog_ branch.
- Perform a rake deploy that updates the cloned code above with the latest site.I updated the existing rake deploy to use GitHub token in push URL. As I did not want the token to be logged on to the Travis console I redirect the output using _[&> /dev/null](http://askubuntu.com/questions/12098/what-does-outputting-to-dev-null-accomplish-in-bash-scripts)_.

```yml
language: ruby
rvm:
  - 1.9.3
branches:
  only:
    - master
script: bundle exec rake generate;
after_success: |
  if [ -n "$GITHUB_PUSH_URL" ]; then
    cd "$TRAVIS_BUILD_DIR"
    git clone -b blog --single-branch https://github.com/rahulpnath/rahulpnath.com.git _azure &> /dev/null
    bundle exec rake gitdeploy["$GITHUB_PUSH_URL"] &> /dev/null
    echo "Deployed!"
  fi
```

Every time I make a commit to the GitHub master branch, the automated build triggers and deploys the latest generated site.

## Current Blogging Workflow [![Build Status](https://travis-ci.org/rahulpnath/rahulpnath.com.svg?branch=master)](https://travis-ci.org/rahulpnath/rahulpnath.com)

<img class="center" alt="Continuos Delivery of Octopress Blog" src="../images/blog_ci.png" />

- Write posts on my phone or laptop. ([Using Dropbox to sync posts across devices](/blog/optimizing-octopress-workflow-for-new-posts/))
- Publish and Push to Github from laptop
- Travis builds triggered by Github webhook
- Travis pushes back generated site into Github (_[blog branch](https://github.com/rahulpnath/rahulpnath.com/tree/blog)_).
- Azure Web App triggers automated deployment from Github.

With the automated deployment, I have one less thing to take care of when writing posts. The whole process might feel a bit complicated, but it is not. It is just that I have been tweaking few things to ease blogging. And since I am a programmer, I like hacking things. If you are new to blogging you do not need them and don't get overwhelmed (if at all you are). All you need to make sure is to [have a blog](/blog/get-started-with-your-blog/) and you [own the URL](/blog/own-your-urls/).
