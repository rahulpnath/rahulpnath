---
author: [Rahul Nath]
title: "Todoist Template Transformer - Transform Tasks to 'X' Days From Now"
  
tags:
  - Tools
  - FSharp
  - Productivity
date: 2017-05-09
completedDate: 2017-05-09 04:33:10 +1000
keywords:
description: Transform Todoist templates to start on a specific date
thumbnail: ../images/todoist_templates.png
---

<img src="../images/todoist_templates.png" alt="Todoist Templates" class="center" />

[Todoist Templates](https://blog.todoist.com/2015/11/19/new-way-to-create-todoist-templates/) is a simple way to create tasks for any of your recurring activities. Be it blogging, cooking, or any of your activities. With Todoist Templates, you can turn any project into a checklist that you can easily duplicate later. I have been using [Todoist](/blog/todoist-manage-your-todo-list/) for a long time and find it useful to keep track of tasks (both personal and at work)

#### **Problem**

I [plan my tasks](/blog/experimenting-with-pomodoro-technique/) for the upcoming week on Sunday morning. I pull in tasks for the upcoming week, and some of these tasks are template based. For e.g. for writing a blog post, I have the below template

```text
TYPE,CONTENT,PRIORITY,INDENT,AUTHOR,RESPONSIBLE,DATE,DATE_LANG,TIMEZONE
task,Blog: BlogTopic,4,1,Rahul (3565260),,,en,Australia/Melbourne
task,BlogTopic: Draft Body,4,2,Rahul (3565260),,today,en,Australia/Melbourne
task,BlogTopic: Refine Body,4,2,Rahul (3565260),,today,en,Australia/Melbourne
task,BlogTopic: Intro and Conclusion,4,2,Rahul (3565260),,tomorrow,en,Australia/Melbourne
task,"BlogTopic: Images, Proof Read and Publish",4,2,Rahul (3565260),,tomorrow,en,Australia/Melbourne
```

The dates on the template are relative to the day that you import the template in Todoist. So if I pull in the template on a Sunday, the tasks will start on Sunday. This is not something that I want; I want them to start on a Monday. Alternatively, I can update the template to start from tomorrow. Even in that case, I will always have to know the exact start day relative to the day that I intend to pull in. I usually plan for the tasks on a Sunday but still, like the flexibility to pull in tasks any day of the week.

### Todoist Template Transformer

The Todoist Template Transformer takes in a date and template path and adjusts all tasks in the template to start relative to the passed in date. In the above example, if I want to blog on Wednesday, I will input the Wednesday date and the template file path. The first two tasks will start on Wednesday and the third and fourth on Thursday. Running the transformer on a Sunday (07-May-2017) with the next Wednesday (10-May-2017) below is the new template

``` bash
TodoistTemplateTransformer.exe -startDate "10-May-2017" -templateFile "Blog Template.csv"
```

```text
TYPE,CONTENT,PRIORITY,INDENT,AUTHOR,RESPONSIBLE,DATE,DATE_LANG,TIMEZONE
task,Blog: BlogTopic,4,1,Rahul (3565260),,,en,Australia/Melbourne
task,BlogTopic: Draft Body,4,2,Rahul (3565260),,in 3 days,en,Australia/Melbourne
task,BlogTopic: Refine Body,4,2,Rahul (3565260),,in 3 days,en,Australia/Melbourne
task,BlogTopic: Intro and Conclusion,4,2,Rahul (3565260),,in 4 days,en,Australia/Melbourne
task,"BlogTopic: Images, Proof Read and Publish",4,2,Rahul (3565260),,in 4 days,en,Australia/Melbourne
```

This utility is written in FSharp the [source code is available here](https://github.com/rahulpnath/todoisttemplatetransformer) if you are interested. I am still in the initial stages of learning FSharp, so if you have any suggestions to improve the code, please raise a Pull Request or drop in a comment.
