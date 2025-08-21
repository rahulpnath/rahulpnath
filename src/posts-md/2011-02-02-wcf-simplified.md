---
title: WCF Simplified
slug: wcf-simplified
date_published: 2011-02-02T13:58:56.000Z
date_updated: 2024-11-28T03:14:58.000Z
tags: Dotnet
---

Windows Communication Foundation(WCF) is basically a framework that assists in building  service oriented applications.I really felt it to be complicated in the early days that I got exposed to it,and always tried to keep away from it.But the more I tried to keep away,the more closer I needed to be with it(not sure whether that would be another of Murphy's law).So finally got to sit with a book for couple of days and this is what I came out  with.

*WCF is all about exposing CLR types as services and consuming services as CLR types*

WCF brings together all the previous distributed programming models that were there, like ASMX,remoting,MSMQ making everyones life easier.You get the power of all previous technologies just by changing a set of configurations in a config file.The keywords in WCF is ABC which itself can be termed Endpoint.Endpoint is nothing but the A(Address),B(Binding) and C(Contract) put together.So now what is this ABC.(I would be relating this to you and explaining as you yourself is a 'service'  in one way or the other.You provide a service to your family,friends,employer,government etc.)

- **A**ddress

This is nothing but the address where your service would be located and would also tell the transportation mechanism that would be used like HTTP,TCP,Peer Network,IPC,MSMQ.With respect to,'*you as a service*',this is exactly the address where one  can find you so that a consumer of your service can get the service that you provide.This can be your mail-id,phone number or house address,which also shows the mode of communication,depending on the kind of consumer that you are serving.

- **B**inding

It is just a set of grouped combinations of transport protocol,encoding of the message ,security, reliability,transaction ,interoperability etc.Again with regards to '*you as a service*',this can be seen as the langugae accent,how securely the information came on to you and things like that.

- **C**ontract

This just specifies what the service does.This specifies what functionalities the service provides and also the way the data can be passed in and given out.With respect to *'you as a service*' this can be seen as the functionalities/activities that you do,the language in which that you can communicate(Say Engligh,French etc).Contracts in WCF are basically of 4 types,Service contract,Data contract,Fault contract and Message contract.Service contract specifies the set of functionalities that the service provides,Data contract specifies the way the data is exchanged,Fault contract specifies how faults/exceptions would be communicated out and Message contract specifies the format of  the message that is actually send(this is used very rarely,unless there is a specific structure that is to followed).Contracts aim at supporting interoperability and so it is to be expressed in a technology independent way.

Another key word that might come in between to confuse you more would be Channels.Now this is nothing but,something related to Binding.Since in a binding you specify different things like security,encoding and what not,each of these specific things are handled in its on layer/channel.You can see that there is something called Channel Stack,i.e. a stack of  different classes,each providing a discrete set of functionality.This whole stack would in turn make up your binding.Based on the you choose binding different channels would be stacked up together,just like you have different burgers with different layers of toppings :).As in burgers,you always have the option of making a custom binding too.

Any message that comes in to this channel stack,gets acted upon by different channels providing it/wrapping the message with security,reliability,transaction etc ,so that it comes out of the stack with all the features applied.So this takes away all the extra effort,that otherwise you would have had to do manually.This wrapping happens on the sending side and unwrapping happens on the receiving side.Because of this kind of architecture,WCF's architecture is also called '*interception-based*' architecture,as at each point it is intercepted and injected with additional features.

WCF has an extensible model.This means that at any place you can plugin your own custom implementations if required .***System.ServiceModel*** is the one single namespace that turns life in the distributed world elegant and simple.So do explore it and start thinking everything around you as a service,so that you could relate things more to WCF :)

Suggested Reading

1. [Programming WCF Services: Mastering WCF and the Azure AppFabric Service Bus](https://www.amazon.com/gp/product/0596805489/ref=as_li_qf_sp_asin_tl?ie=UTF8&amp;camp=1789&amp;creative=9325&amp;creativeASIN=0596805489&amp;linkCode=as2&amp;tag=rahulpnath-20) by Juval Lowy

2. [Inside Windows Communication Foundation (Pro Developer)](https://www.amazon.com/gp/product/0735623066/ref=as_li_qf_sp_asin_tl?ie=UTF8&amp;camp=1789&amp;creative=9325&amp;creativeASIN=0735623066&amp;linkCode=as2&amp;tag=rahulpnath-20) by Justin Smith
