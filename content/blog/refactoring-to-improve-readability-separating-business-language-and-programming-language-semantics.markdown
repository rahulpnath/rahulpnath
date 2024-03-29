---
author: [Rahul Nath]
title: 'Refactoring to Improve Readability - Separating Business Language and Programming Language Semantics'
  
tags:
  - Refactoring
  - Programming
date: 2016-07-18 04:52:35
keywords:
description: Code should be readable and easy to reason about.
thumbnail: ../images/readable_code.jpg
---

Often we write ourselves or come across code that has both business language and the programming language semantics mixed together. This makes it very hard to reason about the code and also fix any issues. It's easier to read code that is composed of different smaller individual functions doing a single thing.

If you follow the _One Level of Abstraction per Function Rule_ or the _Stepdown Rule_ as mentioned in the book [Clean Code](http://www.amazon.com/gp/product/0132350882/ref=as_li_tl?ie=UTF8&camp=1789&creative=390957&creativeASIN=0132350882&linkCode=as2&tag=rahulpnath-20&linkId=CVCVZFAR5SBYVMJW) (I [recommend reading it](/blog/language-agnostic-books-for-every-developer-2/) if you have not already), it is easier to keep the business and programming language semantics separate.

> _We want the code to read like a top-down narrative. We want every function to be followed by those at the next level of abstraction so that we can read the program, descending one level of abstraction at a time as we read down the list of functions. Making the code read like a top-down set of TO paragraphs is an effective technique for
> keeping the abstraction level consistent._

Recently while fixing a bug in one of the applications that I am currently working on, I came across a code with the business and programming language semantics mixed together. This made it really hard to understand the code and fixing it. So I decided to refactor it a bit before fixing the bug.

[![Code should be readable](../images/readable_code.jpg)](http://www.slideshare.net/kvg452/the-art-of-readable-code-31322040)

The application is a subscription based service for renting books, videos, games etc. and enabled customers to have different subscription plans and terms. Currently, we are migrating away from the custom built billing module that the application uses to a SAAS based billing provider to make invoicing and billing easy and manageable. In code, a _Subscription_ holds a list of _SubscriptionTerm_ items, that specifies the different terms that a customer has for the specific subscription. A term typically has a start date, an optional end date and a price for that specific term. A null end date indicates that the subscription term is valid throughout the customer lifetime in the system.

```csharp
public class Subscription
{
    public List<SubscriptionTerm> Terms { get; set; }
}

public class SubscriptionTerm
{
    public int Id { get; set; }
    public double Price { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime? EndDate { get; set; }
}
```

But in the new system to which we are migrating to, does not support subscription terms that overlap each other with a different price. This had to be data fixed manually in the source system, so we decided to perform a validation step before the actual migration. The code below does exactly that and was working fine until we started seeing that for cases where there were more than one SubscriptionTerm without an end date and also when end date of one was the start date of another, there were no validation errors shown.

```csharp
public bool Validate(Subscription subscription)
{
    var hasOverlappingItems = false;
    foreach (var term in subscription.Terms)
    {
        var otherTerms = subscription.Terms.Where(a => a.Price != term.Price);
        if (otherTerms.Any())
        {
            if (
                (!term.EndDate.HasValue && otherTerms.Any(a => term.StartDate < a.EndDate)) ||
                (otherTerms.Where(a => !a.EndDate.HasValue).Any(a => a.StartDate < term.EndDate)) ||
                (otherTerms.Any(a => term.StartDate <= a.EndDate && a.StartDate <= term.EndDate))
            )
            {
                hasOverlappingItems = true;
                break;
            }
        }
    }

    return hasOverlappingItems;
}
```

The code, as you can see is not that readable and difficult to understand, which increases the chances of me breaking something else while trying to fix it. There were no tests covering this validator, which made it even harder to change it. While the algorithm itself to find overlappings can be improved (maybe a topic for another blog post), we will look into how we can refactor this existing code to improve its readability.

> _Code is read more than written, so it's much better to have code optimized for reading_

### Creating the Safety Net

The first logical thing to do in this case is to protect us with test cases so that any changes made does not break existing functionality. I came up with the below test cases (_test data shown does not cover all cases_), to cover the different possible cases that this method can take.

```csharp
[InlineData("10-Jan-2016", "10-Feb-2016", 1, "11-Feb-2016", "10-Dec-2016", 2, false)]
[InlineData("10-Jan-2015", "10-Feb-2015", 1, "20-Jan-2015", "1-Feb-2016", 2, true)]
public void ValidateReturnsExpected(
    string startDate1, string endDate1, double price1,
    string startDate2, string endDate2, double price2,
    bool expected )
{
    // Fixture setup
    var subscription = new Subscription();
    var term1 = createTerm(startDate1, endDate1, price1);
    var term2 = createTerm(startDate2, endDate2, price2);
    subscription.Terms.Add(term1);
    subscription.Terms.Add(term2);
    // Exercise system
    var sut = new OverlappingSubscriptionTermWithConflictingPriceValidator();
    var actual = sut.Validate(subscription);
    // Verify outcome
    Assert.Equal(expected, actual);
    // Teardown
}
```

All tests pass, except for those where there were issues in the destination system and I was about to fix.

### Refactoring for Readability

Now that I have some tests to back me up for the changes that I am to make, I feel more confident to do the refactoring. Looking at the original validator code, all I see is **DATETIME** - There is a lot of manipulation of dates that is happening, which strongly indicates there is some abstraction waiting to be pulled out. We had seen in, [Thinking Beyond Primitive Values: Value Objects](/blog/thinking-beyond-primitive-values-value-objects/), that any time we use a primitive type, we should think more about the choice of type. We saw that properties that co-exist (like DateRange) should be pulled apart as Value Objects. The StartDate and EndDate in SubscriptionTerm fall exactly into that category.

```csharp
public class DateRange
{
    public DateTime StartDate { get; private set; }

    public DateTime? EndDate { get; private set; }

    public DateRange(DateTime startDate, DateTime? endDate)
    {
        if (endDate.HasValue && endDate.Value < startDate)
            throw new ArgumentException("End date cannot be less than start Date");

        StartDate = startDate;
        EndDate = endDate;
    }
}
```

Since these properties are used in a lot of other places, I did not want to make a breaking change, by deleting the existing properties and adding in a new DateRange class. So I chose to add a new read-only property _TermPeriod_ to SubscriptionTerm which returns a DateRange, constructed from it's Start and End dates, as shown below.

```csharp
public DateRange TermPeriod
{
    get
    {
        return new DateRange(StartDate, EndDate);
    }
}
```

From the existing validator code, what we are essentially trying to check is if there are any SubscriptionTerms for a subscription that overlaps, i.e if one TermPeriod falls in the range of another. Introducing a method, _IsOverlapping_ on DateRange to check if it overlaps with another DateRange seems logical at this stages. Adding a few tests cases to protect myself here to implement the IsOverlapping method in DateRange class. I also added in the tests to cover the failure scenarios that were seen before.

```csharp
[InlineData("10-Jan-2016", "10-Feb-2016", "11-Feb-2016", "10-Dec-2016", false)]
[InlineData("10-Jan-2015", "10-Feb-2015", "20-Jan-2015", "1-Feb-2016", true)]
[InlineData("10-Jan-2015", null, "20-Jan-2016", null,  true)]
[InlineData("28-Jan-16", "10-Mar-16", "10-Mar-16", null, true)]
public void OverlappingDatesReturnsExpected(
    string startDateTime1,
    string endDateTime1,
    string startDateTime2,
    string endDateTime2,
    bool expected)
{
    // Fixture setup
    var range1 = CreateDateRange(startDateTime1, endDateTime1);
    var range2 = CreateDateRange(startDateTime2, endDateTime2);
    // Exercise system
    var actual = range1.IsOverlapping(range2);
    // Verify outcome
    Assert.Equal(expected, actual);
    // Teardown
}
```

```csharp
//  IsOverlapping in DateRange
public bool IsOverlapping(DateRange dateRange)
{
    if (!EndDate.HasValue && !dateRange.EndDate.HasValue)
        return true;

    if (!EndDate.HasValue)
        return StartDate <= dateRange.EndDate;

    if (!dateRange.EndDate.HasValue)
        return dateRange.StartDate <= EndDate;

    return StartDate <= dateRange.EndDate
        && dateRange.StartDate <= EndDate;
}
```

Given two DateRange's I can now tell if they overlap or not, which now can be used to check if two SubscriptionTerms overlap. I just need to check if their TermPeriod's overlap. The validator code is now much more easy to understand.

```csharp
// IsOverlapping in SubscriptionTerm
public bool IsOverlapping(SubscriptionTerm term)
{
    return TermPeriod.IsOverlapping(term.TermPeriod);
}
```

```csharp
// Validator after Refactoring
public bool Validate(Subscription subscription)
{
    foreach (var term in subscription.Terms)
    {
        var termsWithDifferentPrice = subscription.Terms.Where(a => a.Price != term.Price);
        return termsWithDifferentPrice
            .Any(a => a.IsOverlapping(term));
    }

    return false;
}
```

The code now reads as a set of TO Paragraphs as mentioned in the book [Clean Code](http://www.amazon.com/gp/product/0132350882/ref=as_li_tl?ie=UTF8&camp=1789&creative=390957&creativeASIN=0132350882&linkCode=as2&tag=rahulpnath-20&linkId=CVCVZFAR5SBYVMJW).

> _To check if a subscription is valid, check if the subscription has overlapping SubscriptionTerms with a conflicting price. To check if two subscriptions are overlapping, check if their subscription term periods overlap each other. To check if two term periods overlap check if start date of one is before the end date of other_

Readability of code is an important aspect and should be something that we strive towards for. The above just illustrates an example of why readability of code is important and how it helps us on a longer run. It makes maintaining code really easy. Following some basic guidelines like One Level of Abstraction per Function, allows us to write more readable code. Separating code into different small readable functions covers just one aspect of Readability, there are a lot of other practices mentioned in the book [The Art of Readable Code](http://shop.oreilly.com/product/9780596802301.do). The sample code with all the tests and validator is available [here](https://github.com/rahulpnath/Blog/tree/master/Refactoring/RefactoringForReadability).
