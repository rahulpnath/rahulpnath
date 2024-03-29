---
author: [Rahul Nath]
title: 'Static Generator is All a Blog Needs - Moving to Octopress'
date: 2014-08-27 21:34:12
  
tags:
  - Blogging
---

Wordpress is what that has been powering my blog for sometime and it definitely is a blogging engine to [get started with](/blog/get-started-with-your-blog/) ease. But with time, I have been noticing that the load time is very high and there are a lot of plugins in the processing pipeline, even to do very small things. This definitely is not that great for a simple blog, where users(including me) expect fast page load times.

> For blogging, Wordpress is just extra baggage that you keep along that never gets used. Except for discussions, a blog is just static content and that is all it requires.

There are a lot of [static site generators](https://www.staticgen.com/) out there today and any of them should be just fine. I wanted to choose a platform that was not on Microsoft stack and Octorpess was just perfect, it being on Ruby.[Octopress](http://octopress.org/), which is [Jekyll](http://jekyllrb.com/) based, provides almost all the features that a blog needs out of the box or via plugins. The [documentation](http://octopress.org/docs/setup/) for Octopress is very good and takes you through setting it up with ease.

## Migrating from Wordpress

The [exitwp](https://github.com/thomasf/exitwp) tool is what I used to get all my posts from Wordpress into Markdown format, so that it can be imported into Octopress. The steps are direct and is detailed out in the readme. Code formatting was an issue after the migration. I had been mainly using [SyntaxHighlighter](http://alexgorbatchev.com/SyntaxHighlighter/) for code formatting in Wordpress. Formatting this took a bit of time, as I had to go through each post and do the necessary modifications to use the [Backtick Code Blocks](http://octopress.org/docs/plugins/backtick-codeblock/).

**Mapping the images** from the wp_content folder to a new folder was one another task. I added a [new variable in the config](http://jekyllrb.com/docs/variables/), to track the images folder so that I can change this to something else too later(like a CDN) and used that to refer images. In cases where the images needs to be aligned to a specific side, I used the [image tag directly](http://stackoverflow.com/questions/255170/markdown-and-image-alignment).

```
![Microsoft Community Contributor Award Certificate for Rahul P Nath](../images/mcca_rahulpnath.png)

<img class="left" src="../images/Outlook_folders_productivity.png" alt="Outlook_folders_productivity" />

```

Also updated the _\_config.yml_ with the required details, permalink structure, google analytics, asides that are required and linked the social accounts. Linking social accounts is important for [Content Authorship](https://plus.google.com/authorship), and everybody should be doing that, irrespective of the blogging engine. Disqus commenting system is supported in Octopress, You can use [Disqus Wordpress plugin](https://wordpress.org/plugins/disqus-comment-system/) to export the comments from the exiting blog to disqus.I have also added in some custom plugins that are listed out [here](https://github.com/rahulpnath/rahulpnath.com/blob/master/MyPlugins.markdown). Also setup a [search](https://www.google.co.in/cse/) for your site that would help readers find what they want.

**Deploy**

The blog is deployed to github and pushed to azure from there using [coninuous integration](http://azure.microsoft.com/en-us/documentation/articles/web-sites-publish-source-control/). This blogpost [here](http://www.ewal.net/2012/08/28/octopress-plus-windows-azure-web-sites/) details out on how to set up rake_deploy to push the blog to azure. Basically, we have a folder named _\_azure_, that is gitignored in the source branch of the blog and included in the one that gets deployed. This would contain only the generated static files required for the blog that gets generated with _rake generate_

**Tuning the blog for improving load time**

Once everything is setup it is really good to run some tools to check how your site is performing. Here are a couple that I found really useful.

- [YSlow](https://developer.yahoo.com/yslow/)
- [PageSpeed Insights](https://developers.google.com/speed/pagespeed/insights/)

Running one of these, would really set you back for sometime and provide you with some performance improvement suggestions.

- Caching: - To enable caching, I added the required configuration entries in the [web.config](https://github.com/rahulpnath/rahulpnath.com/blob/blog/web.config)(as I am hosting in azure). Since the site is all static content you can safely set caching to all the items.

```
<staticContent>
	<mimeMap fileExtension="woff" mimeType="application/font-woff" />
    <clientCache httpExpires="Sun, 29 Mar 2020 00:00:00 GMT" cacheControlMode="UseExpires" />
</staticContent>
```

- Images: [Optimizing images](https://developers.google.com/speed/docs/insights/OptimizeImages) includes multiple steps of getting the image sizes correct as required, removing out any unnecessary metadata to reduce size, reducing the pixels. Couple of tools like [ImageMagick](http://www.imagemagick.org/), [PngGauntlet](http://pnggauntlet.com/) would definitely help in reducing and optimizing the images. This is a must do exercise and will definitely improve the load time.

- Favicon: With lots of devices, browsers and clients out there, a single favicon no more serves the purpose. [Real Favicon Generator](http://realfavicongenerator.net/) is there to the resue, where you can upload a single image and it will give you all the required formats and sizes.

**Finding Broken Links:**
This is a good time to find out any broken links in your blog that has been lying around since some time.Make sure that you run [Xenu's Link Sleuth](http://home.snafu.de/tilman/xenulink.html), to find and fix them.

**Writing New Posts:**
I have been a great fan of [Windows Live Writer](http://www.microsoft.com/en-in/download/details.aspx?id=8621http://www.microsoft.com/en-in/download/details.aspx?id=8621) for blogging on Wordpress. But now that I can use Markdown to write posts, I am currently using [MarkdownPad](http://markdownpad.com/). For editing the blog settings, layout, config I use [Sublime Text](http://www.sublimetext.com/), which is a great light weight text editor. I am yet to find a good Markdown plugin for it on Windows, so that I can stick to just using this one super cool editor. (Please do let know if you know of any good plugins for Markdown on Sublime in Windows, that provides live preview feature too). Also since this is integrated into git, it really fits into the workflow and keeping backups is more easy.

The blog is so light weight and loads faster as compared to Wordpress. After all the blog is composed of just static pages and it does not demand a database and lots of other processing that comes with Wordpress. So moving out to a static generated site is something that you should think of if you have not already or have you already moved out. What are your thoughts on this!
