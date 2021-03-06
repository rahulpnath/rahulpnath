---
author: [Rahul Nath]
title: 'When your Architecture Screams Technology!'
date: 2015-05-03 22:43:55
  
tags:
  - Design
  - Programming
keywords:
description:
thumbnail: ../images/clean_architecture.jpg
---

In todays world the problem's that are solved by technology are innumerous and it is not just a single system that the customer is looking for. They usually need multiple systems solving different problems around their core domain. But as developers, we usually get carried away by the technology aspect of it, giving lesser importance to the problem or domain itself. Whenever we have multiple systems targeting the same core domain of the customer, we see that what gets reused across these systems are the '[Crosscutting concerns](https://msdn.microsoft.com/en-in/library/ee658105.aspx)' like Caching, Authentication, Logging, Exception Management etc. But is this what really should be getting shared? Are our customer trying to solve these crosscutting issues? Should it not be their core domain logics and rules and validations that get shared. The Architecture Screams Technology preventing anything else but these crosscutting concerns (which are not technology specific) the only thing that is shareable across systems.

### Common Traits of Technology Coupling

There are a lot of traits that indicate this dependency on technology and makes a system modeled around technology stand out from the one modeled around the domain. Below are some of the things that I have figured out are very strong hints indicating a tight coupling with the technology. The earlier we identify such smells the better we are to retract and get ourselves align to the needs of the domain and not the technology.

**Solution Folders and Projects**

Take a look at your solution directory from the top level and what do you infer that it is all about. Does it have folders reflecting technology stacks like ASP.Net, Web API, WPF, Ruby, NHibernate etc or does it reflect the domain space that you are trying to solve like Shipping, Stock Management, Customer Relations? This should give the first hint on what the Architecture of your application reflects. But you could easily get tricked here as 'what you see might not be what it is', so lets take a step in.
Before we do you might ask, Are we not building a web-site for the customer so what is wrong in having the structure indicate that? We are building a solution that solves certain problems for our customer, it is only that it is getting delivered or accessed via a web-site. Tomorrow this might be delivered via a mobile application or a rich desktop client or even a console application so having it tightly bound to web delivery mechanism is only going to hinder us on the way forward.

**Single Large Interface Project**

Having all the interfaces used across the application to be in a single interfaces project is something that I have come across quite often and this clearly indicates that something is definitely wrong here. As mentioned in [Agile Principles, Patterns, and Practices in C#](http://www.amazon.in/gp/product/0131857258/ref=as_li_tl?ie=UTF8&camp=3626&creative=24822&creativeASIN=0131857258&linkCode=as2&tag=rahulpnath-21&linkId=VVMXRINDZWYFRWP4) by [Uncle Bob](https://twitter.com/unclebobmartin), Interfaces should belong to the clients and should stay close to them. If multiple clients needs to use the same interface then probably you could move them out into a common library. But all interfaces in a single project possibly means you have more of [Header Interfaces](http://martinfowler.com/bliki/HeaderInterface.html) and not [Role interfaces](http://blog.ploeh.dk/2013/01/10/RoleInterfaceRoleHint/) as that would primarily be specific to the clients that use them. Also watch out for the references that these projects have and whether they have any technology specific references which would possibly indicate a [leaky abstraction](http://en.wikipedia.org/wiki/Leaky_abstraction).

**Single Large Entities Project**

Same as interfaces, this is another common thing that is quite common and might possible indicate a problem in the way a domain is modeled. In a complex domain it is highly likely that an entity is not the same everywhere and is very context specific. A customer might have a different meaning in the context of Shipping and totally different in context of Customer Relations, but having a single customer that is acts as a super set for all these contexts is a problem. Also having all the entities together probably means that enough thought has not been put into separating what parts of the system changes together and what does not. This is a clear indication of poorly modeled domain. On top of this if you are using any kind of O/RM technologies to map these to the database then it just adds on to your problems when you use a single large context to map to the database.

**No Explicit boundaries**

It's very likely that the application talks across difference boundaries and interacts with different systems. Some of them might be external, like a third party service and some other are internal, most commonly a database. If you see the same entities that are passed along at all these boundaries then its very likely that you have a leaky abstraction, which again would get reflected by looking at the reference folder of Entities/Interfaces project. This kind of abstractions tend to break the entire system when any of these boundaries changes, causing a rippling effect in the code.

**Source Control Commit History**

Looking at the previous commits in your source control you can tell if your dependencies are well managed and if there are a lot of technology coupling. If you have commits that have large number of files associated especially one's modified then it again means that you have a lot of leaking abstractions. This leak could be a technology leak or even a function leak, where the abstractions are not well contained which causes a ripple effect when anything associated changes.

**Anemic Domain Model**

This is one of the most common and greatest indication of technology coupling and lack of proper modeling of the problem domain. Open up any of the classes in your entities project and all you see are properties with getters and setters with hardly any function in them. Object Oriented Programming brought data and functions together, but hardly do we see them together. We either have classes that act as data bags or classes that use these data classes to perform transactions over them. [Anemic Domain Model ](http://www.martinfowler.com/bliki/AnemicDomainModel.html) works fine for applications that perform basic [CRUD](http://en.wikipedia.org/wiki/Create,_read,_update_and_delete) operations and with very less business logic in them, but as complexity grows it becomes very difficult to maintain and extend. Anemia in the entities is the biggest reason why we end up having only cross-cutting features to be shared across applications for the same domain.

### Onion Architecture

Technology should be only seen as enablers for solving the problems and it should never get in way of the original problem. Onion Architecture or Hexagonal Architecture try to solve this problem of keeping the domain model clean and separate and have the technology dependency point into it. This enables switching out the technology specific implementations at any point and also enabling us to reuse the core domain components across various systems or hosts.

> "The overriding rule that makes this architecture work is _The Dependency Rule_. This rule says that source code dependencies can only point inwards. Nothing in an inner circle can know anything at all about something in an outer circle. In particular, the name of something declared in an outer circle must not be mentioned by the code in the an inner circle. That includes, functions, classes. variables, or any other named software entity."

[![Image By Uncle Bob, from http://bit.ly/cleanarchitecture](../images/clean_architecture.jpg)](http://bit.ly/cleanarchitecture)

Screaming technology is a common thing in many a projects and it is not really a big problem when the domain you are trying to solve is not that complex. But usually that is not the case and we have very complex domain logics, multiple systems targeting for different areas and highly volatile requirements. These are just some of the most common indications that I have come across that indicate a tightly coupled solution. The [Mark IV Special Coffee Maker](http://www.objectmentor.com/resources/articles/CoffeeMaker.pdf) problem presented by Uncle Bob in his book [Agile Principles, Patterns, and Practices in C#](http://www.amazon.in/gp/product/0131857258/ref=as_li_tl?ie=UTF8&camp=3626&creative=24822&creativeASIN=0131857258&linkCode=as2&tag=rahulpnath-21&linkId=VVMXRINDZWYFRWP4), presents us with an interesting modeling problem, shows some most common errors, why they are errors and possible ways to tackle them. That just helps to get started to think on the right path, to tackle issues in larger domains, methodologies like [Domain Driven Design](http://www.amazon.in/gp/product/0321125215/ref=as_li_tl?ie=UTF8&camp=3626&creative=24822&creativeASIN=0321125215&linkCode=as2&tag=rahulpnath-21&linkId=F6WJ7JK5CYQOIJV6) would help us to solve the actual domain problems.
