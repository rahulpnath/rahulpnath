---
title: 'Migrating My Blog From Hugo To Gatsby'
thumbnail: ../images/migrate_hugo_to_gatsby.jpg
tags:
  - Blogging
keywords:
description: 'Migrating from Hugo to Gatsby'
date: 2020-06-05
---

I am migrating my blogs again. It is not the first time, so it's no surprise.

I have migrated in the past from [Blogspot](rahulpnath.blogspot.com) to [Wordpress.com](rahulpnath.wordpress.com), then to [self-hosted Wordpress](https://www.rahulpnath.com/blog/azure-web-sites-moving-wordpress-to-cloud/).

It didn't end there. I moved again to a Static generator because I thought [that's all a blog needs](https://www.rahulpnath.com/blog/static-generator-is-all-a-blog-needs-moving-to-octopress/).

No, not Hugo. Not there yet!

I moved it to [Octopress](https://www.rahulpnath.com/blog/static-generator-is-all-a-blog-needs-moving-to-octopress/) and from there finally to [Hugo](https://www.rahulpnath.com/blog/migrating-octopress-to-hugo/).

But wait, that was not final. I moved again, just now - Where?

To **Gatsby**

Good that I write about other things as well. Otherwise, this blog would just be about migrating from one platform to another.

For those unfamiliar with [Gatsby](https://www.gatsbyjs.org/), it is a free, open-source framework based on React and helps build websites and apps.

## The Main Contenders

I have been wanting to add more features to this blog, like adding in a landing page, a newsletter, email subscription form, set up related articles, etc. Doing all these felt painfully slow with Hugo - mainly because I am not much familiar with the Go programming language and the Hugo templating engine. I had learned just enough to make minor adjustments and tweaks to keep the blog running over the past one and a half years with Hugo. I did not find much incentive to learn the Go programming language.

> Initially, I didn't want to migrate to another Static generator site, and Gatsby was not my natural first choice.

I wanted to migrate to a hosted service like Squarespace, where I would not have to bother about hosting, managing services for the newsletter, configuring a landing page, etc. It is all click and set or drag and drop design.

I was considering using Squarespace or Ghost initially- both managed platforms. Both have a free trial period (which they are willing to extend if need be).

During the trial, I tried migrating a couple of posts to the platform. It helped me understand what was involved and the overall experience. If you want to migrate to any managed platform, I highly recommend doing this to get a feel for the platform.

### Squarespace

Squarespace is an excellent service if you want to create generic websites, add a blog, and managed content.

Squarespace is highly flexible and allows adding content the way you like with lots of customization options. It has an easy drag and drop setup and supports various integrations, including newsletter subscriptions, selling content, etc.

However, migration capabilities are minimal and constrained. It does support a few [migration options if you are on Wordpress, Blogger or Tumblr](https://support.squarespace.com/hc/en-us/articles/115006390227-Moving-an-existing-site-to-Squarespace/#toc-step-4---import-old-content). For Markdown content (static sites), the general direction is to copy the data to the Squarespace UI editor manually. The [Markdown block](https://support.squarespace.com/hc/en-us/articles/205813788-Markdown-Blocks) makes this possible. It felt painfully slow to me (especially with around 280+ posts on this blog).

The content and styling are tightly coupled and mixed. Any future migrations will be harder. The UI editor was a bit sluggish while adding posts and, at times, not responding immediately.

By default, syntax highlighting is supported only for HTML, CSS, and Javascript. For other languages, we need to add custom script and styles, for example, [using PrismJS](https://www.bitbuildr.com/tech-blog/using-code-highlighting-with-squarespace). However, what I didn't like is having to add a code block with _pre, code_ tag wrappers. Its way may more overhead, given this is primarily a blog with lots of code. I much prefer using the [three backticks and language name](https://gohugo.io/content-management/syntax-highlighting/#highlighting-in-code-fences).

Even though I liked Squarespace, it didn't feel the place I wanted to be, especially paying \$18 (at the time of writing) every month.

### Ghost

[Ghost](https://ghost.org/) is primarily for bloggers, and it has all the features a blogger needs.

> Ghost Pro is gold if you 'have the gold'!

I fell in love with Ghost, immediately after trying it out. It has a [standard, well-documented format on the website](https://ghost.org/docs/api/v3/migration/) that you can convert your existing content to and import into Ghost. You can also bulk import all your images along with the posts. Converting from markdown to the [Ghost format](https://ghost.org/docs/api/v3/migration/#converting-markdown) is quickly done with a few lines of code. I was up and running with my full website migrated over (to the trial account) under 30 minutes.

I loved the experience!

**_Price is the only reason I did not choose Ghost!_**

It is \$29 (at the time of writing) per month for 100k views/month. I am nowhere near that many visits. It is an overhead to pay so much to keep the blog running.

My next choice was to self-host Ghost on [Azure](https://bitnami.com/stack/ghost/cloud/azure) or [Digital Ocean](https://marketplace.digitalocean.com/apps/ghost), I did try this out on my Azure Subscription was up and running again in under 30 minutes, running it off a Virtual Machine. There are ways to host this on an Azure Web app as well; however, I did not experiment with it. I did not want to deal with handing manual backups, updates, patching all by myself.

### Gatsby

It's when playing around with Ghost I came across Gatsby. [Ghost has a Gatsby starter kit](https://www.gatsbyjs.org/starters/TryGhost/gatsby-starter-ghost/), which reads the content from the Ghost CMS and hosts it as a static generated site. You can author your content in Ghost CMS editor and serve it as a static site. The starter site makes it easy to set up, and all you need to do is add a few API keys to the gatsby site.

However, I did not feel many advantages here, as Ghost was just an extra piece in the whole picture now. The only thing would be I can write in the Ghost editor. It was not compelling enough to me as I don't mind writing in VSCode and committing it to a git repository. I was more interested in Gatsby and started exploring more.

## Migrating To Gatsby

If you are new to Gatsby, I recommend checking out the [Tutorials](https://www.gatsbyjs.org/tutorial/). It is detailed and to the point and helps get started with the Gatsby platform. Since I am familiar with the React ecosystem, following along with Gatsby was easy

`Finding a theme` was the hardest with the whole migration process. The [Gatsby Starters(https://www.gatsbyjs.org/starters/?v=2) do have a lot of options, but I didn't like any.

I ended up forking off [Ismail's website](https://smakosh.com/) (of course [with permission](https://twitter.com/rahulpnath/status/1263681056906993665?s=20)) and modifying it to match what you see now.

With the theme finalized, I had a few `changes to my frontmatter` in the markdown posts. I also did some clean up of the frontmatter that was long pending. Achieved most of it using the Find and Replace feature in Visual Studio Code. I also modified the post folder structure to match my needs with all posts in a flat folder structure and images in another folder.

[GraphiQL](https://github.com/graphql/graphiql), the integrated IDE for GraphQL is handy for making `changes to GraphQL queries` for Gatsby. When Gatsby's development server is running, it is accessible at http://localhost:8000/___graphql. For query changes, I use the UI to build the query and copy it to the source code. It makes writing queries extremely easy.

### Checking Existing Links

Making sure that all existing links work after the migration is the most critical part. For this, I first took a copy of the current site's sitemap. Hugo does ship with a [built-in template for sitemaps](https://gohugo.io/templates/sitemap-template/). All links in the sitemap were pointing to my blog domain, rahulpnath.com. From the XML sitemap, I used [VS Code Extract data](https://www.youtube.com/watch?v=ouKm7Wkldp0&list=PL59L9XrzUa-kMD1KhQF8CnDLGVwK6G0qZ&index=2) technique, to get out all the URL's and updated it to the localhost server of the Gatsby website.

The [Screaming Frog SEO Spider](https://www.screamingfrog.co.uk/seo-spider/) tool, supports a [List Mode](https://www.screamingfrog.co.uk/how-to-use-list-mode/), where we can specify a list of URL's to crawl. Giving the URL's from the sitemap, I was quickly able to verify and fix links broken with the migration.

I also have the site linked to [Google Search Console](https://search.google.com/search-console/about) and [Bing Webmasters tool](https://www.bing.com/toolbox/webmaster), which will alert me of errors after deploying.

### Netlify Hosting

I use [Netlify under the free plan](https://www.netlify.com/pricing/) for hosting.

Netlify supports updating the build setting under the Continuos Deployment section. It means I can use the same site and no DNS changes!

![Netlify changes when migrating from Hugo To Gatsby](../images/migrate_hugo_to_gatsby_netlify.jpg)

I linked to the [new repository in GitHub](https://github.com/rahulpnath/rahulpnath/) and updated the build commands to use gatsby, instead of hugo.

That's it. I am up and running on Gatsby!

### Gotchas

Two days after migration, I noticed a sudden dip in traffic to my website.

![](../images/migrate_hugo_to_gatsby_analytics_gotcha.jpg)

I thought I might have to rollback since it was a significant drop in traffic from what I usually get. I quickly realized that I had forgotten to update my Google Analytics id in the blog that was causing the issue. Pushing up my id got the numbers back on track.

Other than the analytics dip for two days, I have not found any issues after the migration. In case you find any issues or have any other feedback drop in the comments.

You can now subscribe to this blog right here. Please do subscribe with your email below to be notified the next time I post!

See you soon!
