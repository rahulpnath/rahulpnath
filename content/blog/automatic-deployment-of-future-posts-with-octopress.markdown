---
author: [Rahul Nath]
title: 'Automatic Deployment of Future Posts With Octopress'
  
tags:
  - Blogging
  - Productivity
date: 2016-09-12
completedDate: 2016-08-19 06:36:11 +1000
keywords:
description: Scheduling posts in the future and automatically deploy them in Octopress.
thumbnail: ../images/blog_scheduled.png
---

Since the start of this year, I have been trying to blog to a schedule and publish posts more often. The goal that I have set myself with is to post four posts a month, preferably one each week. I have been sticking to it till now, and I hope it continues. Initially, I did not have this upper limit on the number of posts in a month. In the month of March 2016, I went a bit aggressive and published nine articles. It made me think more about setting an upper limit on the number of posts so that I don't end up having higher expectations out of myself.

## Staying Ahead

Having published nine posts, also made me realize that I could write faster if required and have posts ready for future. It will help me to stay ahead of the posting schedule and give me some off-time when I need it. But this also presented me with a new problem on how to manage and schedule posts for the future.

> _The more I automate the mundane tasks of blogging, the more I can concentrate on the writing part_

## Jekyll Future flag

[Octopress](http://octopress.org/docs/) is over [Jekyll](https://jekyllrb.com/) and it provides all the capabilities that Jekyll provides. The [_future_ flag](https://jekyllrb.com/docs/configuration/) in Jekyll indicates **_whether or not to publish posts or collection documents with a future date._** With the flag set to false, Jekyll will not generate posts that have a date in the future. It works perfectly for me as all I need to do is to publish posts into the _\_posts_ directory once it's ready, with a date in the future. I have a [draft workflow](http://www.rahulpnath.com/blog/optimizing-octopress-workflow-for-new-posts/), which puts posts into a _\_drafts_ folder and move them into the _\_posts_ folder once ready. I updated the rake script that publishes drafts as posts, to take in a publish date and use that to update the post date.

```Ruby
task :publish_draft do
...
puts "Publish Date?"
publishDateString = STDIN.gets.chomp
publishDate = DateTime.parse(publishDateString)
...
dest = "#{source_dir}/#{posts_dir}/#{publishDate.strftime('%Y-%m-%d')}-#{filename}"
puts "Publishing post to: #{dest}"
File.open(source) { |source_file|
contents = source_file.read
contents.gsub!(/^thisIsStillADraft:$/, "date: #{publishDate.strftime('%Y-%m-%d')}\ncompletedDate: #{DateTime.now.strftime('%Y-%m-%d %H:%M:%S %z')}")
...
```

The rake script appends the publish date to the post file name and also the yaml date information and moves it from the _\_drafts_ to _\_posts_ folder. It also adds a completedDate set to the current time with the timezone information, just for reference.

## Integrating with Travis CI

I have the [deployment of my blog automated via Travis CI](/blog/continuos-delivery-of-octopress-blog-using-travisci-and-docker/), which builds and deploys the site when committing to the [GitHub repository](https://github.com/rahulpnath/rahulpnath.com). For future posts since there might not be a commit on the publish date, I need to trigger the build on those days, to publish the posts scheduled. The [Azure Scheduler](https://azure.microsoft.com/en-us/services/scheduler/) enables scheduling requests and also provides out of the box support to invoke web service endpoints over HTTP/HTTPS. [Travis CI exposes an API](https://docs.travis-ci.com/api) to interact with the build system and is the same API that the official Web interface uses. The API supports [triggering builds](https://docs.travis-ci.com/user/triggering-builds) by making a POST request with an API token and the build details. The API has [an existing bug](https://github.com/travis-ci/travis-ci/issues/5101) that requires the slash separating username and repository name in the trigger URL be encoded(%2F). Azure, however, does not like this and treats it as an invalid URL with the bellow error.

<img class="center" alt="Azure Scheduler Encoded URL error" src="../images/blogtrigger_scheduler_url_error.png" />

The only way now is to have to custom write this code and have it scheduled. I chose the one with the least work involved - Azure Automation. [Azure Automation](https://azure.microsoft.com/en-us/services/automation/) allows to create Run books and automatically trigger it on a schedule. The Azure Automation has a [pricing plan with 500 minutes free](https://azure.microsoft.com/en-us/pricing/details/automation/) Job run time in a month, which meets my requirements. I created a [PowerShell script](https://azure.microsoft.com/en-us/documentation/articles/automation-runbook-types/#powershell-runbooks) and added in the token (_TravisToken_) and the build URL (_TravisBuildUrl_) as [parameters to the script](https://azure.microsoft.com/en-us/documentation/articles/automation-runbook-input-parameters/).

```powershell
$travisBlogTriggerApiUrl = Get-AutomationVariable -Name 'TravisBuildUrl'
$token = Get-AutomationVariable -Name 'TravisToken'

$body = "{""request"": {""message"":""Scheduled Automated build"",""branch"":""master""}}"
$headers = @{
    'Content-Type' = 'application/json'
    'Accept' = 'application/json'
    'Travis-API-Version' = '3'
    'Authorization' = 'token ' + $token
}

Invoke-WebRequest -Method Post $travisBlogTriggerApiUrl -Body $body -Headers $headers -UseBasicParsing
```

The script runs on a schedule every day and triggers the Travis CI build. It deploys the latest generated site to Azure WebApp that hosts the site. Any posts scheduled for the current date gets picked up by Jekyll and included in the site generation.

<figure>
    <img alt="Automatic Deployment of Future Posts With Octopress" src="../images/blog_scheduled.png" />
    <figcaption><em>Scheduler triggers TravisCI build. For details on how TravisCI is set up check <a href="/blog/continuos-delivery-of-octopress-blog-using-travisci-and-docker/">Continuos Delivery of Octopress Blog Using TravisCI and Docker</a></em></figcaption>
</figure>

## Post to Social Media

With the posts getting deployed automatically, I want to update all my social networks. I already use [Buffer](https://buffer.com/) to post updates to all social networks. Buffer is like '**_Write Once, Post Everywhere_**' kind of service. It clubs all your social media profiles into one place and allows you to post to all of them by just writing it once.

[IFTTT](https://ifttt.com/recipes)('_If This Then That_') is a service that helps connect different apps and devices together based on a trigger. As the name says, you can trigger an action based on a trigger. IFTTT has many [Channels](https://ifttt.com/channels) that can act as a source of the trigger. In my case, the trigger is a post getting published and I can hook into that event using the [Feed Channel](https://ifttt.com/feed). The feed channel has an option to trigger when a [new item is available](https://ifttt.com/channels/feed/triggers/5-new-feed-item) on the feed. I use this to trigger an update to Buffer. [Buffer](https://ifttt.com/buffer) is available as a channel on IFTTT but allows only update to one of the connected accounts in Buffer, which requires me to setup a recipe per social media account. I chose to use [update via email feature](https://buffer.com/guides/email) in Buffer. It allows me to have just one recipe in IFTTT to update to all of my connected profiles in Buffer.

<img class="center" alt="Trigger Buffer Email When New Post is Published" src="../images/blog_ifttt.png" />

With the Automated publishing of posts and ability to schedule them, I can concentrate more on just the writing part. I no longer have to push out posts manually. I had never thought that I would be scheduling posts in the future. But now that it is happening it's a great feeling when there are posts for a few weeks ahead all ready to go.

_[My Morning Routine](http://www.rahulpnath.com/blog/morning_routine/) was the first posts to be deployed using the schedule._
