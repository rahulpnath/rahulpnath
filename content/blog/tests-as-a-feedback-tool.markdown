---
author: [Rahul Nath]
title: 'Use Tests As A Feedback Tool To Improve Code'
  
tags:
  - TDD
  - Testing
  - AutoFixture
date: 2017-06-01
completedDate: 2017-04-10 16:12:50 +1000
keywords:
description: Listen to tests and act on it to improve the code you are writing.
thumbnail: ../images/test_feedback.png
---

A unit test suite provides immediate feedback when you make a change. A passing test suite gives the confidence on the changes made. It's the confidence that the team has on the tests suite that matters more than the [code coverage number](/blog/is-code-coverage-a-lie/). Tests also provide feedback about the code. It suggests how easy or difficult it is to use the code just written since tests are the first consumers of the code. Different kinds of [Test Smells](http://xunitpatterns.com/Test%20Smells.html) indicates a problem with the code that is getting tested or the test code itself and provides feedback to improve it.

<img alt = "Test Feedback" src="../images/test_feedback.png" class = "center" />

Let's take a look at a couple of Test Smells and see what changes can be made to improve the code.

### Multiple Asserts on Class Properties

Tests should ideally follow the Single Responsibility Principle (SRP). It should test one thing and try to limit that to one _Assert_ statement. Often I come across tests that assert multiple things. At times this could just be that we are testing all side-effects of the method that is getting tested. Such tests can be broken down into separate tests which test just one thing each. In certain other cases, the effects of the method that is getting tested itself are spread across multiple properties. Let's see a simple example of one such case. Below is a DateRange class which takes in a StartDate and EndDate and creates a DateRange class if the endDate is greater than startDate.

```csharp
public class DateRange
{
    public readonly DateTime StartDate;

    public readonly DateTime EndDate;

    public DateRange(DateTime startDate, DateTime endDate)
    {
        if (endDate < startDate)
            throw new ArgumentException("End date cannot be less than start Date");

        StartDate = startDate;
        EndDate = endDate;
    }

    public static DateRange MonthsFromDate(DateTime date, int numOfMonths)
    {
        return new DateRange(date   , DateTime.Today.AddMonths(numOfMonths));
    }

    public bool IsInRange(DateTime theDateTime)
    {
        return theDateTime >= StartDate && theDateTime <= EndDate;
    }
}
```

Let's take a look at one of the tests that check for the successful creation of a DateRange object using the MonthsFromDate function. In the tests below you can see that there are two statements to assert that the DateRange object is created successfully. In this particular case, the assertions are limited to two, but could often be more than that.

```csharp
[Theory]
[InlineData("01-Jan-2017", 2, "01-Mar-2017")]
[InlineData("01-Jan-2017", 0, "01-Jan-2017")]
[InlineData("01-Jan-2017", 27, "01-Apr-2019")]
public void MonthsFromDateReturnsExpected(
    string startDateString,
    int monthsFromNow,
    string endDateString)
{
    var startDate = DateTime.Parse(startDateString);
    var endDate = DateTime.Parse(endDateString);

    var actual = DateRange.MonthsFromDate(startDate, monthsFromNow);

    Assert.Equal(startDate, actual.StartDate);
    Assert.Equal(endDate, actual.EndDate);
}
```

I can think if two ways to solve the above problem. One is to refactor the test code and the other to refactor the DateRange class itself. Both methods involve creating the expected DateRange object upfront and then comparing against it for equality. The tests can be refactored using [SemanticComparison](https://www.nuget.org/packages/SemanticComparison) library.

```csharp
// Refactor Test using SemanticComparison
[Theory]
[InlineData("01-Jan-2017", 2, "01-Mar-2017")]
[InlineData("01-Jan-2017", 0, "01-Jan-2017")]
[InlineData("01-Jan-2017", 27, "01-Apr-2019")]
public void MonthsFromDateReturnsExpectedUsingSemanticComparison(
   string startDateString,
   int monthsFromNow,
   string endDateString)
{
    var startDate = DateTime.Parse(startDateString);
    var endDate = DateTime.Parse(endDateString);
    var expected = new DateRange(startDate, endDate);

    var actual = DateRange.MonthsFromDate(startDate, monthsFromNow);

    expected
        .AsSource()
        .OfLikeness<DateRange>()
        .ShouldEqual(actual);
}
```

In this particular case looking closely at the [system under test (SUT)](http://xunitpatterns.com/SUT.html), the DateRange class, we understand that it can be a [Value Object](/blog/thinking-beyond-primitive-values-value-objects/). Any two instances of DateRange with the same start and end date can be considered equal. Equality is based on the value contained and not on any other identity. Though in all cases that you observe this behavior it might not be possible for you to convert it into a value object. In those case use the approach mentioned below. But in cases where you have control over it, override [Equals and GetHashCode](/blog/thinking-beyond-primitive-values-value-objects/) to implement value equality. The test is much simpler and had less code

```csharp
// Refactor DateRange to ValueObject
[Theory]
[InlineData("01-Jan-2017", 2, "01-Mar-2017")]
[InlineData("01-Jan-2017", 0, "01-Jan-2017")]
[InlineData("01-Jan-2017", 27, "01-Apr-2019")]
public void MonthsFromDateReturnsExpectedUsingValueObject(
   string startDateString,
   int monthsFromNow,
   string endDateString)
{
    var startDate = DateTime.Parse(startDateString);
    var endDate = DateTime.Parse(endDateString);
    var expected = new DateRange(startDate, endDate);

    var actual = DateRange.MonthsFromDate(startDate, monthsFromNow);

    Assert.Equal(expected, actual);
}
```

### Complicated Test Setup and Test Code Duplication

At times we run into cases where setting up the sut is complicated and is a lot of code. Complicated setup often leads to [Test code duplication](http://xunitpatterns.com/Test%20Code%20Duplication.html).

> *A complicated test setup warrants '*cut-copy-paste*' to test different aspects of the sut.*

From my experience, I have seen this happen more for the test setup phase. The test setup phase is identical across a set of tests with only the assertions being different. Let us look into some common reasons why test setup can becoming complicated leading to test code duplication as well.

#### **Violating Single Responsibility Principle (SRP)**

The test setup can get complicated when the sut violates Single Responsibility Principle (SRP). When there are too many things that are getting affected by the sut, the setup and the verification phases become complex. In these cases extracting the responsibilities as injected dependencies help reduce complexity. The tests can then use mocks to test the sut in isolation. The post, [Refactoring to Improve Testability: Extracting Dependencies](/blog/refactoring-to-improve-testability-extracting-dependencies/) looks into an end to end scenario of this case and how it can be improved.

Violating SRP also leads to test code duplication as multiple aspects need testing and the setup looks almost similar. Refactoring the sut and the test code are ways that test code can be made more robust in these cases.

#### **SUT Constraints**

Test Code Duplication can occur when there are constraints on a constructor, and the test needs to construct it. Let's take the example of DateRange class we saw above. The DateRange constructor takes in two dates, startDate and endDate. But the constructor has a rule enforced that endDate must be greater than startDate. In such cases, I often see tests that have DateRange as a property directly or indirectly (as properties on other objects) creating them explicitly.

```csharp
// Explicitly create objects with Constraints
[Theory]
[InlineData("1 Jan 2016", "1 Mar 2016", "20 Feb 2016")]
[InlineData("11 Apr 2016", "30 Mar 2017", "26 Dec 2016")]
public void DateInBetweenStartAndEndDateIsInRangeManualSetup(
    string startDateString,
    string endDateString,
    string dateInBetween)
{
    var startDate = DateTime.Parse(startDateString);
    var endDate = DateTime.Parse(endDateString);
    var date = DateTime.Parse(dateInBetween);
    var sut = new DateRange(startDate, endDate);

    var actual = sut.IsInRange(date);

    Assert.True(actual);
}
```

We cannot depend on the default behavior of AutoFixture to generate a DateRange object for us, as it does not know about this constraint and will always pass two random dates to the constructor. The below test is not repeatable and can fail at times if AutoFixture sends the endDate less than the start date.

```csharp
// Using AutoFixture on classes that have constraints can lead to tests that are not repeatable
[Theory]
[InlineAutoData]
public void DateInBetweenStartAndEndDateIsInRange(DateRange sut)
{
    var rand = new Random();
    var date = sut.StartDate.AddDays(rand.Next(0, (sut.EndDate - sut.StartDate).Days - 1));
    var actual = sut.IsInRange(date);

    Assert.True(actual);
}
```

To make the test repeatable, we must be able to generate a DateRange class successfully every time we ask AutoFixture for one. For this, we add a DateRange [customization and plug it into the Fixture creation pipeline](https://github.com/AutoFixture/AutoFixture/wiki/Internal-Architecture). The customization makes sure that the DateRange class constructor parameters match the constraints.

```csharp
public class InlineCustomizedAutoDataAttribute : AutoDataAttribute
{
    public InlineCustomizedAutoDataAttribute()
        : base(new Fixture().Customize(new DateRangeCustomization()))
    {
    }
}

public class DateRangeCustomization : ICustomization
{
    public void Customize(IFixture fixture)
    {
        fixture.Customizations.Add(new DateRangeSpecimenBuilder());
    }
}
public class DateRangeSpecimenBuilder : ISpecimenBuilder
{
    public object Create(object request, ISpecimenContext context)
    {
        var requestAsType = request as Type;
        if (typeof(DateRange).Equals(requestAsType))
        {
            var startTime = context.Create<DateTime>();
            var range = context.Create<uint>();
            return new DateRange(startTime, startTime.AddDays(range));
        }

        return new NoSpecimen();
    }
}
```

The tests can now be updated to use the _InlineCustomizedAutoDataAttribute_ instead of the default _InlineAutoDataAttribute_. The tests are repeatable now as we can be sure that AutoFixture will always generate a valid DateRange object.

### Public vs. Private for Tests

It often happens that we get into discussions on whether a function should be private or public. We think it is a bad idea to write production code in a way to suit tests. To test private methods, you can employ techniques of reflection or use [InternalsVisibleTo attribute](https://msdn.microsoft.com/en-us/library/system.runtime.compilerservices.internalsvisibletoattribute). But this is a smell in itself.

Tests should be through public API of the class. If it gets difficult to test through the API, it hints that the code is dealing with different responsibilities or has too many dependencies.

> _There are valid use cases for the private and internal access modifiers, but the majority of the time I see private and internal code, it merely smells of poor design. If you change the design, you could make types and members public, and feel good about it._

> -[_Unit Testing Internals, Mark Seemann_](http://blog.ploeh.dk/2015/09/22/unit-testing-internals/)

Consider refactoring your code so that it is easier to test. Tests are the first consumers of code, and it helps shape the public API and the way it gets consumed. It is fine to have tests affect the way you write code. What is not fine is to have explicit loops within the production code, just for test code. The problem with having such code is that the other code loop never gets tested.

Tests act as a feedback tool and it is important that you listen to it. If you decide to bear the pain of writing tests ignoring the feedback just to meet some [code coverage numbers](/blog/is-code-coverage-a-lie/) then you are doing it wrong. Most of the cases you will end up with hard to maintain code and fragile tests. Listen to the feedback and incorporate it into the code you write.
