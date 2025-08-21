---
title: Using Fiddler to help in Manual Testing
slug: using-fiddler-to-help-in-manual-testing
date_published: 2016-03-07T17:33:03.000Z
date_updated: 2016-03-07T17:33:03.000Z
tags: Testing, Tools
---

Fiddler is an HTTP debugging proxy server application, that captures HTTP and HTTPS traffic and displays to the user. It also enables modifying HTTP traffic when sent or received. Fiddler is [one of the tools that I use daily](__GHOST_URL__/blog/tools-that-I-use/) and is an indispensable one for any web developer.

This post gives an introduction on how you can use fiddler to help with 'manual testing'. We will see how to use Fiddler to create requests to Web API, modify and replay an existing request. We will also see how to test error scenarios to see how the application functions in those cases. The sample solution is the default Web API project in Visual Studio with a few changes.

### Composing a Request

When testing API's to see how it behaves with various inputs, one often needs to send in different parameters. Fiddler allows composing new requests and modifying existing ones.

Using the Fiddler composer window (shown in the image below), we can create new requests from scratch and execute them. It provides two modes to create requests:

- Parsed : This is an assisted form to create requests
- Raw : This allows to create raw http requests and issue them.

Fiddler also allows saving raw requests in the Scratchpad tab to execute as and when required. On clicking Execute Fiddler creates an HTTP request from the entered data and sends to the server. To modify requests you can either drag and drop the request from the displayed URL's list into the composer tab or right-click on an entry and *Unlock for Editing* (keyboard shortcut - F2). After making the changes to the request in the Inspector window, right-click on the request again to Replay -> Reissue ( R).
![Fiddler Composer tab](__GHOST_URL__/content/images/fiddler_composer.png)
### Testing Error Cases

Testing error cases is tricky, especially from a UI level. Things usually don't go wrong in the development/testing environment and [almost never on a developers machine](http://blog.codinghorror.com/the-works-on-my-machine-certification-program/) which makes it very hard to test for cases where something does not work. Fiddler makes it easy to test error scenarios with [AutoResponder](http://docs.telerik.com/fiddler/KnowledgeBase/AutoResponder), which allows returning handcrafted responses for requests, without actually hitting the server.

To create an auto response for a URL, select the URL from the URL's list and drag it into the AutoResponder tab or select the URL and click on Add Rule button on AutoResponder tab, which will create a new rule. By default Fiddler creates a rule with an exact match (Exact:) with the selected URL. Fiddler supports different [matching rules](http://docs.telerik.com/fiddler/KnowledgeBase/AutoResponder#matching-rules) which include regular expression matches. A list of default response text are available to choose from to respond to requests that match the URL matching rule. We can also create a custom response and save it for reuse. The next time a request with matching URL is found the custom response gets returned to the caller.

> *Make sure that the 'Unmatched requests passthrough' option is true in the AutoResponder tab to make sure that all other requests pass through to the server.*

![Fiddler AutoResponder tab](__GHOST_URL__/content/images/fiddler_autoresponder.png)
To create a custom response, choose 'Create a New Response' or 'Find a file' (if you already have the response saved in a text file). You can save custom responses in the *ResponseTemplates* folder in the root folder of Fiddler installation, to have them populated in the AutoResponder tab. When editing existing response data, make sure properties like Content-Length reflects the correct values. You can also set a [Latency](http://docs.telerik.com/fiddler/KnowledgeBase/AutoResponder#latency) for the response, to simulate response coming from a server. RIght click on the rules for the Set Latency option and enter the value in milliseconds.

With the AutoResponder set to matching URL, we can easily have it return error codes or simulated error messages to test how the UI handles them. You don't have to depend on 'actual server errors' to test if the UI handles error correctly. You can use this to test how application behaves with different return values by mocking with valid custom responses. Fiddler provides richer capabilities of using scripts to [modify a request or response](http://docs.telerik.com/fiddler/KnowledgeBase/FiddlerScript/ModifyRequestOrResponse).

Hope this helps you get started with using Fiddler for testing and manipulating requests/responses.
