---
author: [Rahul Nath]
title: 'Tip of the Week: Text Editing - Split or Combine Multiple Lines'
  
tags:
  - TipOW
  - Productivity
date: 2017-10-13
completedDate: 2017-10-14 04:36:16 +1100
keywords:
description: Using a text editor to split or combine multiple lines of text.
thumbnail: ../images/textediting_split_combine.jpg
---

As a developer, I often end up needing to manipulate text. Sometimes this text can get quite large, and it might take a while to do it manually. If you have a text editor under your [tool belt](/blog/tools-that-I-use/), it often helps in situations like that. Let's looks at one of the common scenarios that I come across and how we can solve that using a text editor. I use [Sublime Text](https://www.sublimetext.com/) as my go-to editor for such text editing hacks, but you can do this in any text editor that supports [simultaneous editing](https://en.wikipedia.org/wiki/Simultaneous_editing).

Let's say I just get a list of comma separated values and need to insert double (or single) quotes around each value to use in a SQL query. To demonstrate this, I ended up going to [random.org](https://www.random.org/integers/) to generate a list of random values and had to use the same technique that I was to demonstrate as in the SQL query case. I generated 12 random numbers, and the site gave a tab separated list of values, as shown below.

```text
91    66    31    11    90
80    1    24    48    61
61    66
```

I now need to convert this into a comma-separated list. Let's see how we can go about doing this.

1. Select the recurring character pattern. In this case, it is the tab space.
2. Select all occurrences of the pattern. (Alt + F3 - Find All in Sublime)
3. Act on all the occurrences. In this case, I want to remove them, so I use _Del_
4. Since I want to introduce a comma between each of the numbers, I first split them into multiple lines using _Enter_. Now I have all the numbers on a separate line.
5. Select all the numbers and insert a cursor at the end of each. ( Ctrl + Shift + L)
6. Insert comma. We still have the cursor at the end of all lines, so just pressing _Delete_ again combines all the lines into one. Remove the trailing comma.

<div style="text-align: center;">
    <iframe width="560" height="315" src="https://www.youtube.com/embed/nDDWviJ5xHM" frameborder="0" allowfullscreen></iframe>
</div>

Though this is a specific example, I hope you get the general idea on how to go about manipulating text, to split and combine as required. I hope you will be able to insert double (or single) quotes around each value in the comma separated values that we have now, to use in a SQL query!
