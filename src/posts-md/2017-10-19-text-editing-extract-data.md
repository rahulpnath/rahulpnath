---
title: "Tip of the Week: Text Editing - Extract Data"
slug: text-editing-extract-data
date_published: 2017-10-19T00:00:00.000Z
date_updated: 2024-11-28T03:40:44.000Z
tags: Productivity
excerpt: Extract specific information from large text files.
---

At times you might need to extract data from a large text. Let's say you have a JSON response, and you want to extract all the *id* fields in the response and [combine them as comma separated](__GHOST_URL__/blog/text-editing-split-or-combine-multiple-lines/). Here's how you can easily extract data from large text using Sublime (or any other text editor that supports simultaneous editing).

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
    

Again the key here is to select the recurring pattern first. In this case, it is *"id":* and then selecting all occurrences of that. Once all occurrences are selected, we can select the whole line and extract that out. Repeat the same to remove the *id* text. Then follow the same steps we used to [combine text](__GHOST_URL__/blog/text-editing-split-or-combine-multiple-lines/).

Hope this helps you to extract data from large text files.
