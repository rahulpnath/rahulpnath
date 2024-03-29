---
author: [Rahul Nath]
title: 'Not All That Returns JSON is RESTful: Understanding HATEOAS'
date: 2014-11-10 01:38:56
  
tags:
  - Web Api
  - REST
thumbnail: ../images/not_restful.png
---

Though [REST](http://en.wikipedia.org/wiki/Representational_state_transfer) has been around for a very long time, it never came into highlight as RPC/SOAP was what used commonly when building services, abstracting away all the goodness of the underlying protocol(mostly HTTP) and building messages over it, to perform client-server communication. HTTP, an Application layer protocol was used just as a transport protocol, tunneling these messages through them.

It's not long back that we saw a new technology stack come up in ASP.Net, which redefined the way we were building services - [WCF to Web API](/blog/wcf-to-asp-net-web-api/). This was a major shift from the RPC/SOAP style of programming to the REST architectural pattern. The main things that changed as for a developer was to start returning JSON/XML instead of SOAP messages, use HTTP verbs for performing actions instead of the explicitly defined contracts and use a http client to invoke the services instead of a proxy. Thats where we (at least I) were or rather are at. But was this really what we wanted to achieve?

[![It's not RESTful](../images/not_restful.png)](http://geek-and-poke.com/geekandpoke/2013/6/14/insulting-made-easy)

REST was originally introduced by [Roy Fielding](http://roy.gbiv.com/) in his [dissertation](http://www.ics.uci.edu/~fielding/pubs/dissertation/top.htm) and this is how he had seen it.

> Representational State Transfer (REST) architectural style for distributed hypermedia systems, describing the software engineering principles guiding REST and the interaction constraints chosen to retain those principles, while contrasting them to the constraints of other architectural styles. REST is a hybrid style derived from several of the network-based architectural styles combined with additional constraints that define a uniform connector interface.

We, as developers, have totally missed **hypermedia** and it is rarely spoken about along with REST. In fact Roy himself has called this out loud - [REST APIs must be hypertext-driven](http://roy.gbiv.com/untangled/2008/rest-apis-must-be-hypertext-driven).

## Hypermedia and Why it is important

The World Wide Web is the best example for hypermedia and why it is really important, because we just have a single browser that can understand all web pages of the world and not browsers for each and every web site. We send across Hyper Text(HTML) which the browser understands and uses to render the page. In this case the servers that generate these hypermedia messages(HTML) are 'smart' enough to understand the state of the page and respond back with only the allowed actions/links back. This is the same thing that we would want our API's also to do - drive the application's state, than having the client drive the state of the application.

If we look at todays api's, we see that they return plain data and we have smart clients that are aware of the links to each resource and when and how to reach out to them. The client controls the state of the application and how to navigate through the application. An application developer would read the api documentation on what the links are for each of the actions and then hard code these details/urls into the client application. The client knows too much about the api and its structure which makes it very tightly coupled with the service, breaking it for even the slightest of change in the server.

## Hypermedia As The Engine Of Application State(HATEOAS)

Now we really know that we do not want smart clients, at least not clients this smart as this makes it very difficult for the api to evolve. The only thing that we can now make smarter is the messages that we send across - make them hypermedia. It should just not be data but also have related links, actions and maybe also the details on how the links can be reached. The links should reflect the applications state and drive what actions are allowed for that particular state.

Let us take an example on how a message would be in a non-hypermedia api and a RESTful api.

```json
// Smart Client Messages
{
  "account": {
    "name": "Rest",
    "accountnumber": "12345",
    "balance": "6000.00"
  }
}
```

```json
// HATEOAS Messages
{
  "account": {
    "name": "Rest",
    "accountnumber": "9963",
    "balance": "6000.00",
    "link": [
      {
        "rel": "self",
        "href": "/account/9963",
        "method": "get"
      },
      {
        "rel": "deposit",
        "href": "/account/9963/deposit",
        "method": "post"
      },
      {
        "rel": "withdraw",
        "href": "/account/9963/withdraw",
        "method": "post"
      }
    ]
  }
}
```

As we see the first one returns just pure JSON data and leaves everything to the client to decide on whether deposit/withdraw etc are possible and if at all they are how to reach them. In this case our 'smart client', would check the account balance and then decide on to allow deposit/withdraw only if there are sufficient funds. In the second case for the hypermedia messages, the server returns the allowed actions for the current account and also returns on how to perform these actions. So the server decides the possible actions for a given state of the account and the client would just render these out. The client all it would be interested is in the relations, indicated by the 'rel' attribute to decide on to show the required UI. The [Paypal api](https://developer.paypal.com/docs/integration/direct/paypal-rest-payment-hateoas-links/) is Hypermedia driven and is a good reference to understand more of this in detail.

### HATEOAS and Documentation

One of the most popular discussion that you see around is that, 'Oh we still need api documentation and developers still need them to develop for your api. So what are we really achieving'

> **HATEOAS is not about avoiding documentation.**

It just is not. We still need a documentation to detail out what the rel's are and how to reach them and what they mean. But you don't need to put out explicit url's saying that this is where you need to reach for this particular action. There are a lot of relations that are already [standardized](http://www.iana.org/assignments/link-relations/link-relations.xhtml), and for anything specific to the api can be documented. Also the state of the application is driven by the server and not by consuming client.

### Client and Server updates

Following the HATEOAS approach might end us with having even smarter clients which could automatically upgrade to a newer server version without any code change. Let's take an example of a social media site like Facebook which has two options today for any comment or post - Share and Like. If these were shown interpreting the links as provided from the server, we could easily add in a new option Dislike, in the server response and it would have automatically show up in the UI without any code change. This might not be true always but can definitely be an option.

> Smart messages gives us Smarter clients

### Hypermedia Types

Links are an integral part of hypermedia, but JSON/XML formats that are popular today, does not inherently support links.There are a couple of new media types that has emerged that provides support for hypermedia formats: HAL, JSON-LD, Collection+JSON, SIREN. A good discussion comparing these available options is available [here](http://sookocheff.com/posts/2014-03-11-on-choosing-a-hypermedia-format/).

[Richardson Maturity Model](http://martinfowler.com/articles/richardsonMaturityModel.html) is a good model while thinking about REST and can help us while building services.

Level 0 - The Swamp of POX  
Level 1 - Resources  
Level 2 - HTTP Verbs  
Level 3 - Hypermedia Controls

Though Level 3 is no litmus test for being RESTful, you are at least in clear sight of where we all want to be. It provides a step by step way in designing and achieving REST. Are you already building Hypermedia driven api's? If not, hope this at least makes you to give a thought the next time you develop an api.

Additional Resources:

- [Rest In Practice: Hypermedia and Systems Architecture ](http://www.amazon.com/gp/product/0596805829/ref=as_li_tl?ie=UTF8&camp=1789&creative=390957&creativeASIN=0596805829&linkCode=as2&tag=rahulpnath-20&linkId=DWVB6DWLT4IA2H3E)

* [RESTful Web APIs](http://www.amazon.com/gp/product/1449358063/ref=as_li_tl?ie=UTF8&camp=1789&creative=390957&creativeASIN=1449358063&linkCode=as2&tag=rahulpnath-20&linkId=QVBLKISYQTJ7HY2R)

- [Designing Evolvable Web APIs with ASP.NET](http://www.amazon.com/gp/product/1449337716/ref=as_li_tl?ie=UTF8&camp=1789&creative=390957&creativeASIN=1449337716&linkCode=as2&tag=rahulpnath-20&linkId=TD7FYXTI77G4P2GF)

* [Blogs and other links](https://delicious.com/rahulpnath/hypermedia)
