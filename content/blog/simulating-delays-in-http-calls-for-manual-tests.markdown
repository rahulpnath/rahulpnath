---
author: [Rahul Nath]
title: 'Simulating delays in HTTP Calls For Manual Tests'
  
tags:
  - Testing
date: 2017-01-09
completedDate: 2016-12-25 05:59:51 +1100
keywords:
description: This post shows how to simulate delays in HTTP calls using Fiddler.
thumbnail: ../images/fiddler_delay.png
---

At one of my clients, we were facing an issue of missing some part of a form data when processing a _Submit_ request on the form. As per the current design, the form autosaves data to the database as and when user types in. When the user finally submits the form to be processed the Controller gets all the relevant data from the database and sends for processing. But we noticed that the processing requests missed parts of data in the request send for processing even though the database had those values. This was a clear case where the forms submit request got processed even before all the forms data was saved. The UI was enabling the Submit button right after all the UI validations were made and asynchronously firing off saves to the database.

Let's not go into the design discussion of whether the UI should be sending in all the data to be processed as part of the Submit request as opposed to just sending a reference id and have the controller get all the data from the database (which it is currently doing). The quick fix for this problem was to enable the submit button only after all the asynchronous save requests (the ones for autosave) came back with a success response. The fix was simple but testing this was a challenge.

> _We wanted to delay a few HTTP requests to check how the UI behaved_

When using automated tests there are a lot of frameworks that can help delay requests. But in this case, we were relying on manual tests.

## Using Fiddler to Delay Requests

[Fiddler](http://www.telerik.com/fiddler) is an HTTP debugging proxy server application, that captures HTTP and HTTPS traffic and displays to the user. It is one of the [tools that I use almost every other day](/blog/tools-that-I-use/). In Fiddler, we can create rules on web requests and modify how they are handled and responded. Most of the functionality is available under the [AutoResponder](http://docs.telerik.com/fiddler/KnowledgeBase/AutoResponder#latency) tab. We had seen earlier how to [compose web requests and also simulate error conditions in Fiddler](/blog/using-fiddler-to-help-in-manual-testing/). Here we will see how to use Fiddler to delay request/response time. In Fiddler, we can either delay the request itself being sent to the server or delay the handover of response back to the calling application once it is received from the server.

### Delay

By setting [delay](http://docs.telerik.com/fiddler/KnowledgeBase/AutoResponder#delay) on a request we can specify the time to delay sending the request to the server. The value is specified in milliseconds. When a request that [matches](http://docs.telerik.com/fiddler/KnowledgeBase/AutoResponder#matching-rules) the condition set (in this case an EXACT match with a URL) fiddler delays sending this request to the server by the set amount of time.

> _Delay sending request to the server by #### of milliseconds_

Drag'n Drop the request the URL (1) into the AutoResponder tab (2) and from the dropdown (3) under the Rule Editor choose delay and set the delay time. Click Save (4). Make sure that the request and rules are enabled (5 & 6).

<img class="center" alt="Posts per month - 2016" src="../images/fiddler_delay.png"/>

### Latency

By setting [latency](http://docs.telerik.com/fiddler/KnowledgeBase/AutoResponder#latency) on a request we can specify the delay before a response is received. When a request that [matches](http://docs.telerik.com/fiddler/KnowledgeBase/AutoResponder#matching-rules) the condition set fiddler sends the requests to the server immediately. Once the response is received it delays passing the response back to the calling application by the set delay time in milliseconds.

> _Induce a delay (latency) before a response is returned._

Drag'n Drop the request URL (1) into the AutoResponder tab (2). Right click on the URL and select 'Set Latency' (3). Enter the latency time in milliseconds and OK. Make sure that rules and latency options are enabled (4 & 5)

<img class="center" alt="Posts per month - 2016" src="../images/fiddler_latency.png"/>

Using these options we delayed all the autosave requests going off the form. This delayed saving the data in the database and the forms Submit request once processed did not have all the required data. It also helped us test after the fix and helped ensure that the submit button was enabled only after all form data was saved. In both the above examples, I chose EXACT match condition to set the delay/latency. This will delay only the specific requests. To modify all the requests you can use a different regex match condition. To simulate a random time delay or latency among different requests you can even use [Fiddler Scripting](http://docs.telerik.com/fiddler/KnowledgeBase/FiddlerScript/ModifyRequestOrResponse) and set the delay time using a random number. This helps simulate a slow internet connection scenario and test how the application responds to it.
