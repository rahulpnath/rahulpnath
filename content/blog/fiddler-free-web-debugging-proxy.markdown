---
author: [Rahul Nath]
title: 'Tip of the Week: Fiddler - Free Web Debugging Proxy'
  
tags:
  - TipOW
  - Tools
date: 2017-06-29
completedDate: 2017-06-29 13:43:35 +1000
keywords:
description:
thumbnail: ../images/fiddler.png
---

[Fiddler](http://www.telerik.com/fiddler) is an HTTP debugging proxy server application and captures HTTP and HTTPS traffic. It is one of the tools in my [essential toolkit list](/blog/tools-that-I-use/). Fiddler allows debugging traffic from PC, MAC, Linux and mobile systems. It helps inspect the raw requests and responses between the client and the server.

<img src="../images/fiddler_inspectors.png" alt="Fiddler" class="center" />

Some of the key features that I often use in Fiddler are

- [Inspect Request/Response](http://docs.telerik.com/fiddler/Observe-Traffic/Tasks/ViewSessionContent)
  Look into the request and response data to see if all the required headers/attributes are set, and the data is sent as expected

- [Compose Web Requests](/blog/using-fiddler-to-help-in-manual-testing/)
  Manually compose requests to send to server and test endpoints.

- [AutoRespond to Requests](/blog/simulating-delays-in-http-calls-for-manual-tests/)
  Intercept requests from the browser and send back a pre-defined response or create a delay in response to the actual client.

- [Statistics](http://docs.telerik.com/fiddler/Observe-Traffic/Tasks/ViewSessionStatistics)
  Fiddler statistics give an overview of the performance details of a web session, indicating where the time is spent in the whole request/response cycle.

- [Modify and Replay a Request](http://docs.telerik.com/fiddler/Generate-Traffic/Tasks/ResendRequest)
  Fiddler allows modifying the request by editing its contents and replay the message to the server.

- [Export and Import](http://docs.telerik.com/fiddler/Save-And-Load-Traffic/Tasks/CreateSAZ)
  Fiddler makes it easy to share captured traces with different people. All captured traffic or selected requests can be exported and shared with others. The exported saz file can be opened in Fiddler to view back all the session details.

These are some of the features that I use on a regular basis. Fiddler supports a lot more and is extensible to support custom requirements as well. I find it an indispensable tool when developing for the Web. [Get Fiddler](https://www.telerik.com/download/fiddler) if you have not already.
