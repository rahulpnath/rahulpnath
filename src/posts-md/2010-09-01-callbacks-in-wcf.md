---
title: Callbacks in WCF
slug: callbacks-in-wcf
date_published: 2010-09-01T09:48:00.000Z
date_updated: 2024-11-28T03:14:40.000Z
tags: Dotnet
---

Quite often in the client-server model,the requirement of getting notified of certain changes in the server pops up.Say for example in the movie ticket booking system.When a person selects a seat for booking,the selected seat should become disabled for all the users currently logged in,so that you can avoid the message 'Sorry the seat you were trying to book is already booked'.
In such scenarios polling the server for changes might be one way to go about it.
Another way might be the server calling back to all the clients when a seat selection happens.
This post is about the second way and when the booking system is developed using WCF :)
The WCF framework provides a easy way to achieve this.....[Callbacks](http://msdn.microsoft.com/en-us/library/system.servicemodel.servicecontractattribute.callbackcontract.aspx)

The whole concept is simple.The server keeps track of all the active clients and knows how to call them when the required change happens in the server.
Again its all about certain interfaces that you have implement and some attributes that you have to specify.
The [ServiceContract](http://msdn.microsoft.com/en-us/library/system.servicemodel.servicecontractattribute.aspx) that the client exposes also specifies the CallbackContract type.This is again another interface that the client needs to implement so that the server knows the type of client it is serving and can call back the functions on that interface.
This is much more like the eventing model.All functions in the CallbackContract would be like your event handlers,which would be invoked by the server on a particular event happening in the server.
You can go ahead and create a Publisher-Subscriber framework itself so that any future requirements of such nature would be easy to implement
[This ](http://msdn.microsoft.com/en-us/magazine/cc163537.aspx#S6)article by Juval Lowy suggest a good way to implement a publisher-subscriber framework in WCF using callbacks.

The code provided below shows a quick example of Callbacks.Run minimum of two clients,so you get to understand what it is all about :)

[Code Download](http://rapidshare.com/files/416414378/PublisherSubscriber.rar)
