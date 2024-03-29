---
author: [Rahul Nath]
title: 'Optimizing Octopress Workflow for New Posts'
  
tags:
  - Productivity
  - Blogging
date: 2016-01-20 22:51:03
keywords: octopress, performance, improving build speed, draft post
description:
---

Over the past month I had thought of migrating this blog to Hugo, a static site generator that is faster than the current one, Octopress. Lack of workflow for creating new posts and slower build times were the main reasons. I am the kind of person when writing post want to see often, how it looks like on the real site. With the current number of posts it takes around 40-50 seconds to build the entire site and it makes me to wander off to something else while the build is happening - at times it takes a long time to get back to writing!. But migrating to a new platform has a lot of challenges and time-consuming and I did not want to invest my time in that, so though of looking out for ways to optimize the current process. A bit of googling and playing around with Ruby, solved both of the major issues and I have an improved workflow!

## **Draft workflow**

I was lucky to find this [post](http://neverstopbuilding.com/how-to-enhance-your-octopress-draft-and-heroku-deploy-process) which handled most of the draft workflow process. Most of the code below is used from there with a very few minor additions. Newer versions of Jekyll support [working with drafts](http://jekyllrb.com/docs/drafts/) and uses the '_--drafts_' switch to build the drafts (instead of using published flag as in thr above linked post), that are in '_\_drafts_' folder. Drafts are posts which does not have date's, so I added in a placeholder text, '_thisIsStillADraft_', in the yaml front matter of the post which will later be replaced with the post publish date. Also added in the code to open the default writer with the newly created post

```ruby
# usage rake new_draft[my-new-draft] or rake new_draft['my new draft']
desc "Begin a new draft in #{source_dir}/#{drafts_dir}"
task :new_draft, :title do |t, args|
  if args.title
    title = args.title
  else
    title = get_stdin("Enter a title for your post: ")
  end
  raise "### You haven't set anything up yet. First run `rake install` to set up an Octopress theme." unless File.directory?(source_dir)
  mkdir_p "#{source_dir}/#{drafts_dir}"
  filename = "#{source_dir}/#{drafts_dir}/#{title.to_url}.#{new_post_ext}"
  if File.exist?(filename)
    abort("rake aborted!") if ask("#{filename} already exists. Do you want to overwrite?", ['y', 'n']) == 'n'
  end
  puts "Creating new draft: #{filename}"
  open(filename, 'w') do |post|
    post.puts "---"
    post.puts " "
    post.puts "author: [Rahul Nath]
title: \"#{title.gsub(/&/,'&amp;')}\""
    post.puts "  "
    post.puts "tags: "
    post.puts "tags: "
    post.puts "thisIsStillADraft:"
    post.puts "keywords: "
    post.puts "description: "
    post.puts "---"
  end
  system %{cmd /c "start #{filename}"}
end
```

The publish draft task just asks for the post to publish and replaces the placeholder text with the current date time. Also it moves the post from the '_\_drafts_' folder to the '_\_posts_' folder with the file name appended with the date time. Since I run this just before deploying a post, the date on the post will be the actual publish date, and not the date I started writing the post (usually writing a post spans over multiple days).

```ruby
# usage rake publish_draft
desc "Select a draft to publish from #{source_dir}/#{drafts_dir} on the current date."
task :publish_draft do
  drafts_path = "#{source_dir}/#{drafts_dir}"
  drafts = Dir.glob("#{drafts_path}/*.#{new_post_ext}")
  drafts.each_with_index do |draft, index|
    begin
      content = File.read(draft)
      if content =~ /\A(---\s*\n.*?\n?)^(---\s*$\n?)/m
        data = YAML.load($1)
      end
    rescue => e
      puts "Error reading file #{draft}: #{e.message}"
    rescue SyntaxError => e
      puts "YAML Exception reading #{draft}: #{e.message}"
    end
    puts "  [#{index}]  #{data['title']}"
  end
  puts "Publish which draft? "
  answer = STDIN.gets.chomp
  if /\d+/.match(answer) and not drafts[answer.to_i].nil?
    mkdir_p "#{source_dir}/#{posts_dir}"
    source = drafts[answer.to_i]
    filename = source.gsub(/#{drafts_path}\//, '')
    dest = "#{source_dir}/#{posts_dir}/#{Time.now.strftime('%Y-%m-%d')}-#{filename}"
    puts "Publishing post to: #{dest}"
    File.open(source) { |source_file|
      contents = source_file.read
      contents.gsub!(/^thisIsStillADraft:$/, "date: #{Time.now.strftime('%Y-%m-%d %H:%M')}")
      File.open(dest, "w+") { |f| f.write(contents) }
    }
    FileUtils.rm(source)
  else
    puts "Index not found!"
  end
end
```

With these two new rake tasks, I can now create as many draft posts at a time and publish them once ready.

### **Improving the build time**

Jekyll build command options provides a switch, '_configuration_', that allows to pass a configuration file instead of using '_\_config.yml_'. In the configuration file we can specify a 'exclude' option to exclude the directories and/or files from the build. I created a new task for building only the current drafts, by specifying the '_--drafts_' switch and a dynamically generated configuration file, _\_previewconfig.yml_, which excludes the '_\_posts_' folder. This dramatically increases the build time, and completes almost immediately after a making a change to a post. This fits perfectly into my workflow, as while writing new posts I do not want to see any already published posts. You can add the dynamically generated configuration file name to the _.gitignore_ as I do not delete it in the tasks. I did not want to use the '_rake isolate_' task that is already present in the rakefile, as that does not integrate with the draft workflow and unnecessarily moves all the posts to a temporary place.

```ruby
desc "preview the site in a web browser with all the draft posts"
task :previewdrafts do
  raise "### You haven't set anything up yet. First run `rake install` to set up an Octopress theme." unless File.directory?(source_dir)
  puts "Starting to watch source with Jekyll and Compass. Starting Rack on port #{server_port}"
  system "compass compile --css-dir #{source_dir}/stylesheets" unless File.exist?("#{source_dir}/stylesheets/screen.css")
  File.open("_config.yml") { |source_file|
      contents = source_file.read
      File.open("_previewconfig.yml", "w+") { |f|
      f.write(contents)
      f.puts("exclude: [\"#{posts_dir}\"]")
      }
    }

  jekyllPid = Process.spawn({"OCTOPRESS_ENV"=>"preview"}, "jekyll build --watch --drafts --config _previewconfig.yml")
  compassPid = Process.spawn("compass watch")
  rackupPid = Process.spawn("rackup --port #{server_port}")

  trap("INT") {
    [jekyllPid, compassPid, rackupPid].each { |pid| Process.kill(9, pid) rescue Errno::ESRCH }
    exit 0
  }

  [jekyllPid, compassPid, rackupPid].each { |pid| Process.wait(pid) }
end
```

### **Dropbox integration**

At times, I have started to draft blog posts while commuting to work from my mobile device, so I wanted to sync my draft posts to [Dropbox](https://db.tt/bvYw3pL6), so that I can edit it from my [mobile phone](/blog/review-two-months-and-counting-android-and-nexus-5/). Apps like [MarkDrop](https://play.google.com/store/apps/details?id=net.keepzero.markdrop&hl=en)/[JotterPad](https://play.google.com/store/apps/details?id=net.keepzero.markdrop&hl=en) integrates with Dropbox and supports Markdown editing. I set up a drafts folder on my Dropbox folder on laptop, which is automatically synced using the [Dropbox application](https://www.dropbox.com/install). I then used [Mklink](https://technet.microsoft.com/en-us/library/cc753194.aspx) to create a symbolic link from the folder on Dropbox to my drafts folder in my blog repository. Whenever a new draft post is added, it gets automatically inserted into the Dropbox folder, which will then be synced to cloud and available for edit on my mobile phone too. (Part of this post is written from my mobile!)

```text
mklink /D "C:\blog\_drafts" "C:\dropbox\_drafts"
```

### **Cmder integration**

[Cmder](http://cmder.net/) is a portable console emulator for Windows and provides a good nice looking feature rich console experience on Windows and is one of my [favourite tools](/blog/tools-that-I-use/). Creating alias for commands is one of the features, that allows to create a short key combination for an otherwise long command. You can use this to create commands for the task in Octopress like below

```text
alias rp=rake previewdrafts

// Below are the list of alias that I have for the rake tasks
rp=rake previewdrafts
rps=rake preview // Preview the whole site
rd=rake deploy
rnd=rake new_draft["$"] // Takes in the post name as parameter
rpd=rake publish_draft
rd=rake deploy
```

**So my new workflow is**

rnd Optimizing Octopress Workflow for New Posts  
rp  
rpd  
rps  
rd

It's much faster, cleaner and easier publishing new posts. To see the latest code for the rake tasks head over to the original file on [github](https://github.com/rahulpnath/rahulpnath.com/blob/master/Rakefile).
