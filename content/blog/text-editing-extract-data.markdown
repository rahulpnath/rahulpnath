---
author: [Rahul Nath]
title: 'Tip of the Week: Text Editing - Extract Data'
  
tags:
  - TipOW
  - Productivity
date: 2017-10-19
completedDate: 2017-10-19 05:32:35 +1100
keywords:
description: Extract specific information from large text files.
thumbnail: ../images/textediting_extract_data.png
---

At times you might need to extract data from a large text. Let's say you have a JSON response, and you want to extract all the _id_ fields in the response and [combine them as comma separated](/blog/text-editing-split-or-combine-multiple-lines/). Here's how you can easily extract data from large text using Sublime (or any other text editor that supports simultaneous editing).

```json
// https://jsonplaceholder.typicode.com/posts
[
  {
    "userId": 1,
    "id": 1,
    "title": "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
    "body": "quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto"
  },
  {
    "userId": 1,
    "id": 2,
    "title": "qui est esse",
    "body": "est rerum tempore vitae\nsequi sint nihil reprehenderit dolor beatae ea dolores neque\nfugiat blanditiis voluptate porro vel nihil molestiae ut reiciendis\nqui aperiam non debitis possimus qui neque nisi nulla"
  },
  ...
]
```

Again the key here is to select the recurring pattern first. In this case, it is _"id":_ and then selecting all occurrences of that. Once all occurrences are selected, we can select the whole line and extract that out. Repeat the same to remove the _id_ text. Then follow the same steps we used to [combine text](/blog/text-editing-split-or-combine-multiple-lines/).

<div style="text-align: center;">
    <iframe width="560" height="315" src="https://www.youtube.com/embed/ouKm7Wkldp0" frameborder="0" allowfullscreen></iframe>
</div>

Hope this helps you to extract data from large text files.
