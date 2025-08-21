---
title: Introduce Tests when Fixing Bugs
slug: introduce-tests-when-fixing-bugs
date_published: 2016-09-26T00:00:00.000Z
date_updated: 2024-11-28T03:26:33.000Z
tags: Testing, Programming
excerpt: Refactoring to add tests when fixing bugs helps increase your confidence and grow your test coverage.
---

*When creating a subscription for a client, the calculated number of months was off by one at times* - This was a bug reported from production application that I was currently working on. Though, not a blocker, it was creating enough issues for the end users that it required a hotfix. One of my friends picked this issue up and started working on it. A while later, while I was checking the status of that bug I noticed him playing around with [Linqpad](https://www.linqpad.net/). He was testing a method to calculate the number of months between two dates with different values.
[![Testing](__GHOST_URL__/content/images/testing.jpg)](https://www.flickr.com/photos/toomore/23066277453)
We often test our code elsewhere because it's coupled with other code making it difficult to test at the source itself. The fact that we need to test an isolated part of a larger piece of code is a '[Code smell](https://en.wikipedia.org/wiki/Code_smell)'. There possibly is a class or method that can be extracted and unit tested separately.

> *Having to test code elsewhere other than the source is a Smell. Look for a method or class waiting to be extracted*

In this specific case, below is how the code that calculates month difference between two dates looked like. As you can see below, the code is coupled with the newAccount, which in turn is coupled with a few other entities that I have omitted. Added to this, this method existed in an MVC controller, which had other dependencies.

    ...
    var date1 = newAccount.StartDate;
    var date2 = newAccount.EndDate;
    int monthsApart = Math.Abs(12 * (date1.Year - date2.Year) + date1.Month - date2.Month) - 1;
    decimal daysInMonth1 = DateTime.DaysInMonth(date1.Year, date1.Month);
    decimal daysInMonth2 = DateTime.DaysInMonth(date2.Year, date2.Month);
    decimal dayPercentage = ((daysInMonth1 - date1.Day) / daysInMonth1)
                          + (date2.Day / daysInMonth2);
    var months = (int)Math.Ceiling(monthsApart + dayPercentage);
    ...
    

This explains why it was easier to copy this code across and test it in Linqpad. It was difficult to construct the whole hierarchy of objects and to test this. So the easiest thing to fix the bug in is to test elsewhere and fit back in its original place.

## Extract Method Refactoring

This is one of the scenario where [Extract Method](http://refactoring.com/catalog/extractMethod.html) Refactoring fits in best. According to the definition

> *You have a code fragment that can be grouped together. **Turn the fragment into a method whose name explains the purpose of the method.***

Extract Method Refactoring is also referred in [Working Effectively With Legacy Code](http://www.amazon.com/gp/product/0131177052/ref=as_li_tl?ie=UTF8&amp;camp=1789&amp;creative=390957&amp;creativeASIN=0131177052&amp;linkCode=as2&amp;tag=rahulpnath-20&amp;linkId=TTKEEYQLEMTOXPPQ) and [xUnit Test Patterns](http://www.amazon.com/gp/product/0131495054/ref=as_li_tl?ie=UTF8&amp;camp=1789&amp;creative=390957&amp;creativeASIN=0131495054&amp;linkCode=as2&amp;tag=rahulpnath-20&amp;linkId=XR55UAOEPPMVMFK3) (to refactor test code). It helps separate logic from rest of the object hierarchy and test individually. In this scenario, we can extract the logic to calculate the number of months between two dates into a separate method.

For [Test driving](http://butunclebob.com/ArticleS.UncleBob.TheThreeRulesOfTdd) the extracted method, all I do initially is to extract the method. As the method purely depends on its passed in parameters and not on any instance variables, I mark it as a static method. This removes the dependency from the MVC controller class parameters and the need to construct them in the tests . The test cases includes the failed 'off by one' case (*("25-Aug-2017", "25-Feb-2018", 6)*). With tests that pass and fail it's now safe to make changes to the extracted method to fix the failing cases.

    [Theory]
    [InlineData("10-Feb-2016", "10-Mar-2016", 1)]
    [InlineData("10-Feb-2016", "11-Mar-2016", 2)]
    [InlineData("10-Feb-2015", "11-Mar-2016", 14)]
    [InlineData("01-Feb-2015", "01-Mar-2015", 1)]
    [InlineData("21-Sep-2016", "22-Sep-2016", 1)]
    [InlineData("25-Aug-2017", "25-Feb-2018", 6)]
    [InlineData("12-Aug-2016", "15-Mar-2019", 32)]
    public void MonthsToReturnsExpectedMonths(
        string date1,
        string date2,
        int expected)
    {
        var actual = SubscriptionController.MonthsTo(DateTime.Parse(date1), DateTime.Parse(date2));
        Assert.Equal(expected, actual);
    }
    

More than the algorithm used to solve the original issue what is more important is in identifying such scenarios and extracting them as a method. Make the least possible change to make it testable and fix step by step.

> *Whenever there are code fragments that depend only on a subset of properties of your class or function inputs, it could be extracted into a separate method.*

    // Extracted method after Refactoring.
    public static int MonthsTo(DateTime date1, DateTime date2)
    {
        int months = Math.Abs(12*(date1.Year - date2.Year) + date1.Month - date2.Month);
        if (date2.Date.Day > date1.Date.Day)
            months = months + 1;
    
        return months;
    }
    

## Introduce Value Object

Now that we have fixed the bug and have tests covering the different combinations, let's see if this method can live elsewhere and make it reusable. The start date and end date on account always go together and is a domain concept that can be extracted out as an 'Account Term Range'. It can be represented as a DateRange [Value Object](__GHOST_URL__/blog/thinking-beyond-primitive-values-value-objects/). We can then introduce a method in the DateRange Value Object to return the number of months in the range. This makes the function reusable and also [code more readable](__GHOST_URL__/blog/refactoring-to-improve-readability-separating-business-language-and-programming-language-semantics/). I made the original refactored method as an extension method on DateTime and used it from DateRange Value Object.

    public static class DateTimeExtensions
    {
        public static int MonthsTo(this DateTime date1, DateTime date2)
        {
            int months = Math.Abs(12*(date1.Year - date2.Year) + date1.Month - date2.Month);
            if (date2.Date.Day > date1.Date.Day)
                months = months + 1;
    
            return months;
        }
    }
    
    public class DateRange
    {
        public DateTime StartDate { get; private set; }
        public DateTime EndDate { get; private set; }
    
        public DateRange(DateTime startDate, DateTime endDate)
        {
            // Ignoring null checks
            if (endDate < startDate)
                throw new ArgumentException("End Date cannot be less than Start Date");
    
            this.StartDate = startDate;
            this.EndDate = endDate;
        }
    
        public int GetMonths()
        {
            return StartDate.MonthsTo(EndDate);
        }
    }
    ... // Rest of Value Object Code to override Equals and GetHashCode
    

If you are new to TDD or just getting started with tests, introducing tests while fixing bugs is a good place to start. This might also help make code decoupled and readable. Try [covering a fix with tests](__GHOST_URL__/blog/is-code-coverage-a-lie/) the next time you fix a bug!
