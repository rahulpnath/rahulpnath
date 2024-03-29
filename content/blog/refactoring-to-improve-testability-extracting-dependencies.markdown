---
author: [Rahul Nath]
title: 'Refactoring to Improve Testability: Extracting Dependencies'

tags:
  - Testing
  - TDD
  - Refactoring
date: 2016-04-03 03:14:28
keywords:
description:
thumbnail: ../images\coding.jpg
---

[![Refactoring](../images/coding.jpg)](https://pixabay.com/en/code-data-programming-code-944504/)

In the earlier post, [Removing Unnecessary Dependencies](http://rahulpnath.com/blog/refactoring-to-improve-testability-removing-unnecessary-dependencies/), we saw how having an unnecessary dependency hinders testability. In this post we will see just the opposite of that - extracting functionality out of a class and creating another class to separate responsibilities, making it easier to test and adhere to [Single Responsibility Principle](https://blog.8thlight.com/uncle-bob/2014/05/08/SingleReponsibilityPrinciple.html)(SRP).

> _Violating Single Responsibility Principle makes writings tests harder._

Some of the common tests smell (from XUnit Test Patterns by Gerard Meszaros, [a recommended read](/blog/language-agnostic-books-for-every-developer-2/)) that helps me to find these dependencies are [Hard-To-Test Code](http://xunitpatterns.com/Hard%20to%20Test%20Code.html) and [Fragile Tests](http://xunitpatterns.com/Fragile%20Test.html). In this post we will explore the refactoring with the help of an example - I have to process usages (anything like electricity, internet, water etc.) for a list of locations aggregated over for a day. There is a repository where the last processed date for the location is stored, and whenever this process runs we have to process for all the days from the last processed date till the current day.

The existing code looks like below, which loops through a list of locations passed in, fetches the last processed date from a repository , gets all the days to be processed till today (_DateTime.Now.Date_) and processes them for all the days.

```csharp
public class LocationsUsagesCalculator
{
    ILocationUsages locationUsages;
    IUsageRepository usageRepository;

    public void ProcessUsagesForLocations(IEnumerable<Location> locations)
    {
        foreach (var location in locations)
        {
            ProcessUsagesForLocation(location);
        }
    }

    private void ProcessUsagesForLocation(Location location)
    {
        DateTime lastProcessedDate = usageRepository.GetLastProcessedDateForLocation(location);
        IEnumerable<DateTime> datesToProcess = GetAllDaysTillTodayFromDate(lastProcessedDate);
        foreach (var dateToProcess in datesToProcess)
        {
            ProcessUsagesForLocationOnDate(location, dateToProcess);
        }
    }

    private void ProcessUsagesForLocationOnDate(Location location, DateTime dateToProcess)
    {
        locationUsages.ProcessUsagesForLocationOnDate(location, dateToProcess);
    }

    private IEnumerable<DateTime> GetAllDaysTillTodayFromDate(DateTime lastProcessedDate)
    {
        var dateCounter = lastProcessedDate.Date.AddDays(1);
        while (dateCounter <= DateTime.Now.Date)
        {
            yield return dateCounter;
            dateCounter = dateCounter.AddDays(1);
        }
    }
}
```

## Testability Issues with Current Design

The code is self-explanatory and does what's expected. But what interests us more is the test code for this. From a test perspective we need to make sure
that for all locations, usages gets processed for the pending days. Direct cases when last processed day is a day before, a couple of days before and different for each location are some of the likely scenarios. Let's see one of the cases where the last processed day is a few days before for all locations

```csharp
[Theory, AutoMoqData]
public void ProcessUsagesWithCoupleOfDaysBeforeAsLastProcessedProcessesAllDaysTillTodayForEachLocation(
   [Frozen]Mock<ILocationUsages> locationUsages,
   [Frozen]Mock<IUsageRepository> usageRepository,
   IEnumerable<Location> locations,
   LocationsUsagesCalculator sut)
{
    var days = 3;
    var threeDaysBefore = DateTime.Now.AddDays(-days);
    usageRepository
        .Setup(a => a.GetLastProcessedDateForLocation(It.IsAny<Location>()))
        .Returns(threeDaysBefore);

    sut.ProcessUsagesForLocations(locations);

    var expectedDates = Enumerable.Range(1, days).Select(a => threeDaysBefore.Date.AddDays(a));

    foreach (var location in locations)
        foreach (var date in expectedDates)
            locationUsages
                .Verify(a => a.ProcessUsagesForLocationOnDate(location, date), Times.Once());
}
```

Clearly this is not the kind of tests that I want to write! It has a lot of setup code and even some logics to generate _expectedDates_. Let's see the various dependencies that the SUT has:

- ProcessUsagesForLocationOnDate on ILocationUsages
- GetLastProcessedDateForLocation on IUsageRepository
- List of locations that it's processing
- Last processed date for each location
- Dates pending processing as of today

We clearly see that this one class does a lot more things than what its name suggests. Let's see how we can refactor this to improve our test code and manage the dependencies better.

### Refactoring the Code

Finding all the dates till a given date (today in this case) is not this classes responsibility and can easily be pulled out. Since the SUT depends on _IUsageRepository_ just to calculate the dates I can pull that out along with the refactoring. I have created a new interface, _IUsageDatesCalculator_, to return all the days pending process. With this interface, the test code looks a bit more clear and easier to write.

```csharp
[Theory, Tests.AutoMoqData]
public void ProcessUsagesProcessesForAllLocationForPendingDays(
    IEnumerable<DateTime> datesToProcess,
    [Frozen]Mock<ILocationUsages> locationUsages,
    [Frozen]Mock<IUsageDatesCalculator> usageDatesCalculator,
    IEnumerable<Location> locations,
    LocationsUsagesCalculator sut)
{
    usageDatesCalculator
        .Setup(a => a.GetDatesToCalculate(It.IsAny<Location>()))
        .Returns(datesToProcess);

    sut.ProcessUsagesForLocations(locations);

    foreach (var location in locations)
        foreach (var date in datesToProcess)
        locationUsages
            .Verify(a => a.ProcessUsagesForLocationOnDate(location, date), Times.Once());
}
```

This looks better and easy to write - we do not have to write any code in the test to generate the expected dates. All I need is a list of dates (no matter is what order) and I need to make sure that process calls all of those. We would also pull out a separate interface to process for a location, instead of a list of locations. This will further remove the need to loop through the locations list in the test.

### DateTime and Tests

Both in the original code and the refactored code, the logic that generates the dates to be processed depends on _DateTime.Now_ for getting the current date. Though this looks perfectly fine, it makes testing harder. In the original test code, I had to generate expected dates based on today (system time).

It's a good practice to inject a Time Provider into the consumer so that you can mock the value of Now(today) for tests. [DateTime.Now](https://msdn.microsoft.com/en-us/library/system.datetime.now(v=vs.110\).aspx) is a static dependency on a class property and makes it hard for tests.
Even using a [static TimeProvider](http://stackoverflow.com/a/2425739/1948745) and having overrides to set mocks for testing is not advised (also mentioned by Seemann in the [comments](http://stackoverflow.com/questions/2425721/unit-testing-datetime-now/2425739#comment38623763_2425739)), as it creates problems for parallel tests execution.

> _Inject a Time Provider into the consumer. Do not depend on any static time provider (including DateTime.Now)_

Refactoring the dependency with current time using a inject interface, _ITimeProvider_, makes setting the current day easy as shown in the tests below. I can now hard code my expected dates into the test code and not depend on a runtime generated list.

```csharp
[Theory]
[InlineAutoMoqData("2016-04-02","2016-03-29", "2016-03-30,2016-03-31,2016-04-01,2016-04-02")]
[InlineAutoMoqData("2016-04-02", "2016-04-02", "")]
[InlineAutoMoqData("2016-04-02", "2016-04-01", "2016-04-02")]
public void GetDatesToCalculateReturnsExpectedDates(
    string todayString,
    string lastProcessedDayString,
    string expectedDaysString,
    [Frozen]Mock<ITimeProvider> timeProvider,
    [Frozen]Mock<IUsageRepository> usageRepository,
    Location dummyLocation,
    UsageDatesCalculator sut)
{
    var expected = expectedDaysString
        .Split(new string[] { "," }, StringSplitOptions.RemoveEmptyEntries)
        .Select(a => DateTime.Parse(a));
    var lastProcessedDay = DateTime.Parse(lastProcessedDayString);
    var today = DateTime.Parse(todayString);

    timeProvider.Setup(a => a.Now).Returns(today.Date);
    usageRepository
        .Setup(a => a.GetLastProcessedDateForLocation(It.IsAny<Location>()))
        .Returns(lastProcessedDay);

    var actual = sut.GetDatesToCalculate(dummyLocation).ToList();

    Assert.Equal(expected, actual);
}
```

We have refactored various dependencies that the original code had and made it more testable. Testing is easier and [repeatable](https://pragprog.com/magazines/2012-01/unit-tests-are-first). Whenever writing tests become difficult - stop, think and refactor!
