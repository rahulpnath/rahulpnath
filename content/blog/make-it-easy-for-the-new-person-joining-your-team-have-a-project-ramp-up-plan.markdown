---
author: [Rahul Nath]
title: 'Make it Easy for the New Person Joining the Team - Have a Project Ramp up Plan'

tags:
  - Thoughts
  - Programming
date: 2016-05-18 12:38:24
keywords:
description:
thumbnail: ../images\rampup_plan.png
---

Recently I was in a discussion with my friend/colleague on conducting a few ramp up sessions for the new hires in our team. The discussion went as below,

> _Me: We should hold a few sessions to make the new guys in team more comfortable_  
> _Friend: It's too early for it. We should let them find their own way and not 'spoon-feed' them with information._  
> _Me: But we are not 'spoon-feeding' them, we are just making their learning process faster and giving then an overview on how all the technology fits together in our world of things._  
> _Friend: But 'I did not have any ramp up when I joined, and I felt it was better to have learned it on my own, though it took a lot more time._

[![Rampup Plan](../images/rampup_plan.png)](http://www.mindtickle.com/wp-content/uploads/2014/02/new_employee_orientation_business_strategy_research.png)

Just like there are company-wide induction/onboarding sessions, I have always felt that project specific onboarding plans are also required and help new hires be part of the team and be more productive with their day-to-day activities faster. As mentioned in this [article](http://www.fastcompany.com/3029820/work-smart/infographic-the-real-ways-to-hold-on-to-new-hires/3), _New hires care more about effective job training and clear guidelines, and it's time you provide that for them._ It's best to have a plan in place when you have someone new joining your team and you along with the team are the best people to put that plan together.

## Boy Scout Rule

The Boy Scouts have a [rule](http://programmer.97things.oreilly.com/wiki/index.php/The_Boy_Scout_Rule) - _"Always leave the campground cleaner than you found it."_ New hires are like 'new camp group' at a campground, so it's the duty of the 'existing team' there to make it a good experience for them.

> _'Refactor' your experiences to make it better for the next person who is about to take on the same journey_

It's not that my friend was intentionally trying not to pass on any information, but he felt that learning on their own would be better. Even I agree with him that learning on your own is far better than 'spoon-feeding' - but a ramp up plan is not spoon-feeding. A ramp up plan is only to speed up the learning process and to make it more comfortable for someone joining new.

## When to create the plan?

The need for such a plan is there only when there has been enough progress made on the project, after which there is someone new joining the team. So when a new hire is scheduled to join is a good time to create the 'draft' plan. Once the new hire has gone through it and updated back with his own experiences it could become the first version of the plan, which can then be confidently shared to anyone joining after as it has worked for at least one person.

## What should be there in the plan

_It depends!_

It's totally up to the team to decide what should be there in the plan. Some of the things that I usually have are

- **Overview of the project and what problem it is trying to solve**

  It's really important that everyone on the team knows what the application is trying to solve and have a common goal to work towards. It's not just about the code we write but about the problem we are solving and that needs to be clearly defined. I would record a video, when this is done the first time and share it with anyone joining after that, as most of the core concepts of a project rarely change. There could be a follow-up session post watching the video, to also have a quick walk through and fill any missing gaps.

- **Introduction to various technologies used in the project and how everything fits together**

  Technology changes so fast these days that it is nearly impossible to stay updated with all the available options. So a walk through of the different technologies and pointers to resources that worked for you and the team will be of help. If there are any specific libraries, frameworks getting used, an introduction to those should also help.

- **Release cycle and Release management**
  Every project has its own model of delivering the end product and everyone on the team should understand this process well. Having a continuous build is becoming more common these days and helps reduce the complexity of release. An end to end walk-through of the deployment process helps understand the application better and provides exposure to all the moving parts in the system.

- **Environment/Machine setup**
  Software installation is one of the biggest pain when setting up a new machine for a project, especially with having specific versions of the software. Having a documented list of all the project dependencies (hardware and software) makes setting the project environment easy. It's preferable to have these [scripted](https://chocolatey.org/). Have a common place, where you can find links to all the various environments (dev, at,prod etc) and related resources.

- **Patterns and Conventions**
  Every project has its own conventions and certain core patterns that are followed. It's good to have these patterns available for reference so that it helps understand the code better and helps reduce code-review cycles. Than having one big boring document, what I prefer more is to have multiple blog articles targeting each of those. I try to generalize commonly used patterns in the projects that I have worked on and create blog posts. This also helps generate content for [your blog](/blog/get-started-with-your-blog/).

- **Tips & Tricks**
  This could range from how to easily navigate the code base, scripts to do some commonly occurring task and general things to keep an eye for.

These are just some of the things I generally try to include in a ramp up plan but as said it totally depends on the team and the project.

### Sharing the plan

Depending on the plan, if it has confidential information, you could split this into two (or more) different documents and share it at different phases of onboarding. Once a new hire is confirmed it's good to share the parts which do not have any confidential information. Technology stack, conventions used, machine setup ([BYOD](https://en.wikipedia.org/wiki/Bring_your_own_device)) are usually not confidential and can be shared well before actual employment. Once all employment agreements are in place the rest too can be shared. It's also a good idea to have some walk-through of the plan itself to make it easier to follow.

### Iterate and Improve

Updating back with the experiences of the people using the plan is important to keep it current and valuable. Suggesting improvements and updates should be an item in the plan so that this does not get missed. To make updates manageable, the plan must be accessible to all and preferably version controlled if they are documents.

What are your thoughts on having a ramp up plan?
