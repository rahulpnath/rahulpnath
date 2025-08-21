---
title: "Tip of the Week: Track Current File in Visual Studio Solution Explorer"
slug: track-current-file-in-visual-studio-solution-explorer
date_published: 2017-03-08T00:00:00.000Z
date_updated: 2024-11-28T03:45:14.000Z
tags: Productivity, Programming
excerpt: Keep Visual Studio Solution Explorer in sync with the current working file.
---

While working on large codebases, I want my Solution Explorer to be synchronized with the current working file. With the solution explorer in sync, it makes navigating to other related files, adding new classes in the same location, renaming files, etc. faster.
![Track Active Item in Solution Explorer, Visual Studio](__GHOST_URL__/content/images/visualstudio_trackActiveItem.png)
The setting to keep the items in sync is configurable in Visual Studio and is turned off by default. You can enable this by checking the '***Track Active Item in Solution Explorer***' under *Options -> Projects and Solutions -> General*. You can navigate there quickly using [Visual Studio Quick Launch (Ctrl + Q)](__GHOST_URL__/blog/quick-launch-in-visual-studio/). Just type '*Track active*' and you will get the quick link to the setting. Keep it checked, and off you go, the solution explorer and the current file will be in sync.

PS: Visual Studio 2017 is now available.[Get it](https://www.visualstudio.com/downloads/) if you have not already!
