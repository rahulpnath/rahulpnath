---
author: [Rahul Nath]
title: 'Tip of the Week: AutoFixture - Make Your Unit Tests Robust'
  
tags:
  - TipOW
  - Testing
  - AutoFixture
  - TDD
date: 2017-04-06
completedDate: 2017-04-06 04:22:03 +1000
keywords:
description: AutoFixture is an open source library for .NET designed to minimize the 'Arrange' phase of your unit tests in order to maximize maintainability
thumbnail: ../images/autofixture.jpg
---

> _[AutoFixture](https://github.com/AutoFixture/AutoFixture) is an open source library for .NET designed to minimize the '[Arrange](http://wiki.c2.com/?ArrangeActAssert)' phase of your unit tests in order to maximize maintainability. Its primary goal is to allow developers to focus on what is being tested rather than how to setup the test scenario, by making it easier to create object graphs containing test data._

<img alt ="AutoFixture" class = "center" src="../images/autofixture.jpg" />

If you are on .NET platform and write tests (there is no reason you wouldn't) you should check out AutoFixture. AutoFixture makes test data setup easy. It is a generalization of the [Test Data Builder](http://www.natpryce.com/articles/000714.html) pattern and helps make your tests more robust and maintainable. Below is a sample (as taken from the GitHub page) shows how minimal setup is required for testing. Check out the post, [Refactoring Test Code: Removing Constructor Dependency](/blog/refactoring-test-code-removing-constructor-dependency/) to see in detail how AutoFixture can be used to make the tests more stable against changes.

```csharp
[Theory, AutoData]
public void IntroductoryTest(
    int expectedNumber, MyClass sut)
{
    int result = sut.Echo(expectedNumber);
    Assert.Equal(expectedNumber, result);
}
```

If you are new to AutoFixture, I highly recommend checking out the [Cheat Sheet](https://github.com/AutoFixture/AutoFixture/wiki/Cheat-Sheet) to get started. Check out my post on [Populating Data for Tests](/blog/populating-data-for-tests/) for some common patterns of using AutoFixture and how it can reduce setup code. Understanding the [Internal Architecture](https://github.com/AutoFixture/AutoFixture/wiki/Internal-Architecture) of AutoFixture helps if you want to extend it for customization. AutoFixture integrates well with the different testing frameworks and support libraries that are popular. I mostly use it with [xUnit](https://xunit.github.io/) and [Moq](https://github.com/Moq/moq4/wiki/Quickstart).

Hope this helps with your testing!

_I am happy to have [contributed](https://github.com/AutoFixture/AutoFixture/pulls?q=is:pr+is:closed+author:rahulpnath) (minor) to such a great library._
