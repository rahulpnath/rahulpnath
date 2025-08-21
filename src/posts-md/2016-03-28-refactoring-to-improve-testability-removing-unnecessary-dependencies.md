---
title: "Refactoring to Improve Testability: Removing Unnecessary Dependencies"
slug: refactoring-to-improve-testability-removing-unnecessary-dependencies
date_published: 2016-03-28T04:27:03.000Z
date_updated: 2024-11-28T03:27:06.000Z
tags: Testing, Programming
---

[![Refactoring](__GHOST_URL__/content/images/refactoring.jpg)](https://unsplash.com/photos/5Ntkpxqt54Y)
Nowadays I am trying to stick to [TDD](http://butunclebob.com/ArticleS.UncleBob.TheThreeRulesOfTdd) (with the test first approach) and have found it to be of great help. One of the biggest reward doing TDD is that it helps me to [stay in the flow](https://vimeo.com/97419151) and regain speed faster after a distraction. This post explains how to refactor code to remove unnecessary dependencies, which is easily found when writing tests.

Unnecessary dependencies are those components which a [SUT](http://xunitpatterns.com/SUT.html) depends on, but does not directly affect any of its functionalities. Some of the common tests smell (from XUnit Test Patterns by Gerard Meszaros, [a recommended read](__GHOST_URL__/blog/language-agnostic-books-for-every-developer-2/)) that helps me to find these dependencies are [Test Code Duplication](http://xunitpatterns.com/Test%20Code%20Duplication.html) and [Fragile Tests](http://xunitpatterns.com/Fragile%20Test.html).

> *Cut-and-Paste code reuse for fixture setup happens often when there is an unnecessary dependency.*

While looking for an example to write on, I came across a post from my friend [Bappi](https://twitter.com/zpbappi), where he explains [Testing Codes with ConfigurationManager](http://zpbappi.com/testing-codes-with-configurationmanager-appsettings/). It's a good read on how to remove the dependency with various Configuration Providers by creating an abstraction over it.

## Testability Issues with Current Design

While abstracting the Configuration Manager by using an interface is a good idea, you should also be careful on how the application classes depend on it. Configurations live at the application root and it is a good idea to restrict dependencies with it at that level. Rest of the application must be dependent only on the configuration value and not the configuration itself. Inner components having dependency with the configuration provider brings in unnecessary complexities and makes code fragile. Some common issues are

- Class needs to know of Configuration key
- Extra mocking while testing

As you see below, the test case from the original post has to set up the Configuration provider mock to return values before testing the class. MyService (assuming that it is not a Factory class, which I confirmed from Bappi) is unnecessarily depending on IAppSettings and coupling itself with the configuration name, which really is not its concern. This leads to brittle code and tests!

    [Subject(typeof(MyService))]
    public class MyServiceTests
    {
        Establish context = () =>
            {
                otherDependency = Substitute.For<IMyOtherDependency>();
    
                var appSettings = Substitute.For<IAppSettings>();
                appSettings["app.name"].Returns("My Test Application");
    
                myService = new MyService(otherDependency, appSettings);
            };
    
        Because of = () => result = myService.PerformOperations();
    
        It should_call_my_dependency_utility_method_once = () => otherDependency.Received(1).UtilityMethod();
        It should_execute_successfully = () => result.ShouldBeTrue();
    }
    

### Refactoring the Code

Refactoring such code is as easy as removing the dependency on IAppSettings and taking in the value of 'app.name' as the dependency. This removes the interface dependency and requires only the string value to be passed in. Here I am passing in [an anonymous Name](https://blogs.msdn.microsoft.com/ploeh/2008/11/17/anonymous-variables/), as the value is not of concern for this test.

    [Subject(typeof(MyService))]
    public class MyServiceTests
    {
        Establish context = () =>
            {
                otherDependency = Substitute.For<IMyOtherDependency>();
                var anonymousName = "Anonymous Name";
                myService = new MyService(otherDependency, anonymousName);
            };
    
        Because of = () => result = myService.PerformOperations();
    
        It should_call_my_dependency_utility_method_once = () => otherDependency.Received(1).UtilityMethod();
        It should_execute_successfully = () => result.ShouldBeTrue();
    }
    

> *When looked at isolation these are minor code changes that hardly removes a line or two. But it has a cumulative effect when applied to all the tests for the class and makes code more robust.*

When looked at isolation, this is a seemingly minor change of not mocking an interface and is just one line of code, which you could live with. But you need to mock that for all tests of that class, which is when you start to see the real benefit. Also, you have made the tests more resilient by not taking an unnecessary dependency. Even if you decide to change the configuration name to '*ApplicationName*', none of the tests break now, whereas with the original code all of them would have.

*One possible argument with this refactoring is, ** What if I need an extra value from the dependency (app.domain in the above case), I now have to update the class constructor**.*

Agreed, but then this violates [Open Closed Principle](https://blog.8thlight.com/uncle-bob/2014/05/12/TheOpenClosedPrinciple.html), which states 'You should be able to extend a classes behaviour without modifying it.' If you need a new configuration value, you are essentially changing the components functionality, so you should either extend current functionality or write a new component. This also opens up a hidden code smell with the existing code and an anti-pattern - [Service Locator](http://blog.ploeh.dk/2010/02/03/ServiceLocatorisanAnti-Pattern/). So the refactoring still holds good!

Hope this helps you find dependencies with unnecessary components and remove them.
