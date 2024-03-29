---
author: [Rahul Nath]
title: 'Making Code Reviews Effective'
  
tags:
  - Programming
  - Thoughts
date: 2017-01-03
completedDate: 2016-12-24 04:28:12 +1100
keywords:
description: This post highlights on some learning and practices involved in Code Reviews.
thumbnail: ../images/codereview_friendly.png
---

Code review is an essential practice of the development life cycle. It helps improve the code quality, unify team practices, share knowledge, mentoring etc. over a longer period of time. It helps find mistakes that are overlooked while developing and helps improve the overall quality of the software. This helps accelerate the deployment process as changes are more likely to pass through testing.

> _Peer review—an activity in which people other than the author of a software deliverable examine it for defects and improvement opportunities—is one of the most powerful software quality tools available. Peer review methods include inspections, walkthroughs, peer desk checks, and other similar activities._

> -[** Karl E. Wiegers**](http://www.processimpact.com/articles/humanizing_reviews.html)

<img class="center" alt="Posts per month - 2016" src="../images/codereview_friendly.png"/>

Below are some of my thoughts on the various aspects involved in a Code Review.

## Sending a Review

Before sending for a code review make sure that only the necessary files for the change are added in the review. Often it happens that when we write code there are remains of things that we tried and discarded, like new files, packages, changes to project metadata files etc. Double check and make sure that the changes are what are just required. Ensure that the code builds successfully. If there are any build scripts that your team uses, make sure that those are run and passes successfully. When submitting a code review make sure that you reference the associated work item - be it a bug, story, task etc. Add [tests](/blog/category/testing/). Add in a description detailing the change and any reasoning behind it to add in more context. This will help the reviewer understand the code much faster. Add in relevant people for the review and submit a request. Check out [some great tips for a better-looking review request](http://blog.ploeh.dk/2015/01/15/10-tips-for-better-pull-requests/).

## Handling Review Comments

One of the key things in a code review and one that's often missed and drives people frustrated is that they try to take it all in.

> _Not all comments in a review needs to be addressed_

If a review comment points out a mistake in logic or business functionality or conflict with other code you need to fix them, unless you think the reviewer is wrong. But for suggestions on how better to structure your code or refactor into a more readable code, naming, style formatting etc needs addressing only if you feel they are adding value. But make sure to communicate well with the reviewer and reach an agreement.

Look at comments as a way to improve your code and help the team and business. Go in with a positive attitude. When seen as an overhead or an extra ritual, code reviews can be really painful and depressing. Make a note of commonly occurring comments or mistakes you are making and try to handle them at the time of development. Rather than mechanically going through the code review and making changes to the code, internalize on the change and try to see the benefits of a change. This helps to incorporate such suggestions in future reviews as well.

## Responding to a Code Review

I usually find myself following the below three variations when coming to replying to a code review request

- **Comment and Wait**
  I leave comments on the review but do not approve. This means that I would like to have those comments actioned and a new pull request be raised for that. This often falls into those cases where there are logic or business issues.

- **Comment and Approve**
  I leave comments (if any) but also approve the code review. This means that the code _Looks Good To Me_ (LGTM), but would be better with the comments addressed. These comments generally relate to better formatting, improved on naming or refactoring readability.

- **Add Relevant People**
  Add in reviewers that I feel are missed and relevant for the part of the code that is changed. This I do irrespective of the above two options if I feel someone else needs to take a look. In these cases, if it was my review that gets added in an extra reviewer I would wait to get a sign off from that person too.

### **Business Aspect**

When reviewing code look first for the functionality that the code change addresses. It is possible that we get carried away just by the technical aspect of code and ignore the business aspect altogether. If you have [Acceptance Criteria](https://www.leadingagile.com/2014/09/acceptance-criteria/) defined for tasks then it's worth reading it before doing the code review to get more context.

### **Technical aspect**

Once the business aspect is covered have a look at the technical aspect of the change. Whether the code is decoupled, has the correct abstractions, follows team conventions (best if automated). Check for commonly occurring problems like improper usage of dispose pattern, magic numbers, large methods, all code flow paths not handled etc. See if the new code fits into the overall architecture of the application. Look for tests and ensure the validity of the test data. Look out for [overengineering](https://en.wikipedia.org/wiki/Overengineering) or [not invented here syndrome](https://en.wikipedia.org/wiki/Not_invented_here).

### **Aesthetic**

Code formatting is as important as the code itself. Code is read more often than written, so we should try and optimize code for reading. I would prefer to automate this as far as possible so that people don't need to look for these in reviews. I feel that is often time not well spent and also tends to lead to longer discussions ([tabs vs Spaces](https://blog.codinghorror.com/death-to-the-space-infidels/)). When it is part of the build and automated people seldom complain about it and in a very short period of time, the formatting rules become second nature to them. If you currently do not have automated checks you can gradually [introduce formatting checks into your builds for a large code base](/blog/introducing-code-formatting-into-a-large-codebase/).

> _Don't go by 'It's done like that everywhere so I will keep it the same'_

There might be a lot of practices that is being followed over the period of time. But if you find any of the practices making it harder on a day-to-day functioning of the team, take a step towards changing the practice. I am not a fan of '_clean it all at once_' style of approach. I prefer to gradually introduce the change for two reasons

- No need to stop or allocate people to repeatedly do the same task of cleaning it everywhere. (Unless there is a very strong business justification to it)
- You get gradually introduced to the new way of doing things. This gives time to reflect and compare with the old way. You have time to correct yourself if the new approach is not fitting well either or causing more trouble than previous.

## Handling Conflicts

<img class="center" alt="Posts per month - 2016" src="../images/codereview_wtf.png"/>

Foster environments where you don't curb discussions or other people's ideas but encourage everyone to actively participate and throw around even the stupidest of an idea.

> _Psychological safety is a “shared belief, held by members of a team, that the group is a safe place for taking risks.” It is “a sense of confidence that the team will not embarrass, reject, or punish someone for speaking up,” Edmondson wrote in a 1999 paper. “It describes a team climate characterized by interpersonal trust and mutual respect in which people are comfortable being themselves._

> [**- Charles Duhigg**, _What Google Learned From Its Quest to Build the Perfect Team_](https://www.linkedin.com/pulse/what-google-learned-from-its-quest-build-perfect-team-charles-duhigg)

Code reviews should also be seen as a way to incorporate better practices from fellow developers and as a learning mechanism. Don't take comments personal, but look at it for what they are. When you have a conflicting opinion you can reply to the comment with your thoughts and cross check with the reviewer. Rarely it can happen that you have conflicting opinions on code review comments and you are not able to solve it among the people involved. Walk up to the person (if you are co-located) or have a conversation over your teams messaging application. But make sure that it stays healthy. In case the discussion is not going the intended way you can involve senior team members or other fellow team members to seek their opinions too. If such kinds of conflicts are happening more often then the team needs to analyze the nature of review comments that these occur on, if it's between specific groups of people or any visible patterns and try to address them.

When taken in isolation any practices that a team does take time. So disregard any activity just because it adds more time to your process. When seen as part of the overall development cycle and the benefits it brings to the business, Code Reviews proves to be an essential practice. Different teams tend to have different guidelines and checklists for the reviews. Follow what works best for your team. Do you do code reviews as part of your development cycle? What do you feel important in a Code Review? Sound off in the comments!
