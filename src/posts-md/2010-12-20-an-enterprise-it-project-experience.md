---
title: An enterprise IT project experience
slug: an-enterprise-it-project-experience
date_published: 2010-12-20T04:54:39.000Z
date_updated: 2010-12-20T04:54:39.000Z
tags: Dotnet
---

It's not been that long that I've been into the IT servicing industry.But still the learning curve I've had during the  past few years has been dramatic.The first time I was put into a '*live client facing project*' was almost one year after my industry entry.

Now what is the key takeaway from this post?

Nothing much maybe for a seasoned IT developer/professional.I am just trying to explain out what to look out for when developing an enterprise application as a beginner.How to approach things. Definitely its not like building an application that you might be used to creating during your college days(if at all you were ,coz I used not :) ).I was puzzled on where to start ,how to approach things,whats the right way.Here's what I figured out for my questions through my experiences.

So here's the disclamer....All views are just that of mine and only mine,just in case ..... :)

First thing I understood is there is nothing like '*perfect resource*' for a project.It's just that resources are molded to fit the requirement and the technologies.So you have to live with it and learn things the hard way.Try to get a view of things from a higher altitude,which means above technology.Try to understand the concept on which things are based on,rather than on how to use the particular implementation of a concept.For example a person working on .net should be flexible enough to move on to Java or any other OO(Object Oriented) language(this one is a personal experience again ).So trying to relate you learnings to OO concepts and seeing how it is implemented in .net would make you easily jump to a different language.Because you know what exactly to look out for there too.

On an implementation level,the process model that we had followed for the project,was waterfall,which by itself created a lot of problems on the requirement side.As the model advocates there was a big '*upfront design*' phase ,the output of which had very little resemblance to what came out in the end.But still it did exist with the key players being those like me,who were all just puzzled as I was,on what to do.Here I would like to mention the things that I felt towards the end of implementation,that I felt that I should have done during this phase.

1. Should have known/read of [SOLID](http://en.wikipedia.org/wiki/Solid_(object-oriented_design)) ,[GRASP](http://en.wikipedia.org/wiki/GRASP_(object-oriented_design)) principles.

1. Awareness of certain [design patterns](http://en.wikipedia.org/wiki/Design_pattern_(computer_science)) would have helped to create a better design.

Different approaches might be taken to tackle the same problem.But always make sure that the common cross cutting concerns are handled in a centralized manner.This includes things like exception handling,error logging,data validation,transaction and many other things.Handling this in a centralized manner makes things easier for you and targeting changes relating to any of these in an elegant,simple manner.The [Enterprise Library](http://msdn.microsoft.com/library/cc467894.aspx) is one such example which assists in the .net world.You could probably come up with your own frameworks.But always make sure you have,because I have learned this too..the hard way.

Refactoring,improving the design of the code after it has been written,is one process that any developer should start doing at his level,and better if implemented at a team level too.This really helps to remove 'smelly code' and also improve your design.It's true that most developers switch job when they start hating ,see their own code '*rot*'.Recheck the disclaimer, if you don't agree.This can be avoided to some extent by refactoring I guess,An added advantage to refactoring maybe :)

Presentation layer/UI layer is the one part that people tend to develop a bit fast,because they want to see something of their own efforts.Make sure you have a architectural pattern targeting this like MVC,PM,MVP,MVVM etc.This is really important,again something  learnt the hard way.Don't just go ahead the '*drag'n drop-double click-write code*' way which is highly supported in Visual Studio(for .net) or any other IDE's.This seems easy to start with,but as time and code starts growing it becomes a pain.Make sure your logics are neatly separated and highly re-used.UI is one part where re usability comes down,and this is mostly because of the lack of proper use of architectural patterns as mentioned above.

Through my experiences,I learned that there is no such '*one right way*' of doing things,but its in how well you do things the way that you do matters.It's in how well you manage your dependencies that matter in the last,and thats what counts.Even now,having had an experience in a project,I am no good in this.Its just that I have learned some of the ways that things should not be done.

Some of the books that I found very helpful,though I have not read all cover-to-cover are :

1. [CLR Via C#](http://www.microsoft.com/learning/en/us/book.aspx?ID=6522&amp;locale=en-us) by Jeffry Richter(MS Press Publications)

1. [Architecting Applications for the Enterprise](http://www.microsoft.com/learning/en/us/Book.aspx?ID=12863&amp;locale=en-us) by Dino Esposito & Andrea Saltarello(MS Press Publications)

1. [Patterns Of Enterprise Application Architecture](http://www.informit.com/store/product.aspx?isbn=0321127420) by Marin Fowler (Addison-Wesley Professional Publications)

1. [Domain Driven Design: Tackling Complexity in the heart of Software](http://www.amazon.com/Domain-Driven-Design-Tackling-Complexity-Software/dp/0321125215) by Eric Evans

1. [Dot Net Domain Driven Design with C#:Problem-Design-Solution](http://as.wiley.com/WileyCDA/WileyTitle/productCd-0470147563.html) by Tim McCarthy (Wiley Publications)

1. [Refactoring ](http://www.amazon.com/Refactoring-Improving-Design-Existing-Code/dp/0201485672)by Martin Fowler

1. [Applying UML and Patterns](http://www.amazon.com/Applying-UML-Patterns-Craig-Larman/dp/0137488807) by Craig Larman

Some of these books are technology specific,but most of them are not.Its just gives an approach to doing things,just using a technology as a medium of explaining.

Not sure whether this post would really target all audience,but if I had got to read some vague tips like this,the first time I face an enterprise project,it would have helped better,better in the sense,to make less mistakes maybe :)
