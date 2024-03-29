---
author: [Rahul Nath]
title: 'Being Explicit About Time when Handling Multiple Timezone'

tags:
  - Programming
  - Design
date: 2016-03-25 06:41:03
keywords:
description:
thumbnail: ../images\timezone.jpg
---

_This article is to put my thoughts together on a possible solution. Challenges of real world implementation are yet to be discovered._

Handling date/time in application's that affect different time zones is tricky! The general recommendation is that all dates be saved in UTC time and convert them as required. This works well if developers make sure of converting all dates to UTC at application boundaries and keep it consistent throughout the application.

[![Timezone](../images/timezone.jpg)](https://unsplash.com/photos/yBzrPGLjMQw)

At one of my clients, we are facing similar issues with date time, with an application that deals with different [time zones](https://en.wikipedia.org/wiki/Time_zone). The client sells office spaces across the globe and the application is for their employees to manage their clients. It integrates with various back-end systems and provides a single point of access for everything, aggregating data across those different systems and itself. Some of the backend systems are in different locations and deal with times local to them. This increases the challenge when sending and retrieving data from them. The application has defined a set of locations, identified by, three-letter codes (_SYD, TRV, SEA_), and these locations fall under different time zones. Office spaces are at these locations and the application allows to manage those from anywhere.

Across the domain, we use either [DateTime](https://msdn.microsoft.com/en-us/library/system.datetime(v=vs.110\).aspx) or [DateTimeOffset](https://msdn.microsoft.com/en-us/library/system.datetimeoffset(v=vs.110\).aspx) to represent time - there is a good recommendation on when to use what - [Choosing Between DateTime, DateTimeOffset, TimeSpan, and TimeZoneInfo](https://msdn.microsoft.com/en-us/library/bb384267(v=vs.110\).aspx). The problem with using either is that it does not play well with the domain concept to where time is related to - the location. We do have property name suffixes (not consistent though) indicating whether it is Coordinated Universal Time (UTC) or local - like _bookingDateUTC_, _paymentDateLocal_ etc. But it so happens that these naming conventions gets broken somewhere along the different layers and leads to conversion between time zone at the application boundary layers.

## Issues with Current Approach

DateTime and DateTimeOffset have by default time zones attached to it and it might go unnoticed till we face issues.

- The [Kind](https://msdn.microsoft.com/en-us/library/system.datetime.kind(v=vs.110\).aspx) property on DateTime indicates whether the time represents a [local time, UTC or neither](https://msdn.microsoft.com/en-us/library/shx7s921(v=vs.110\).aspx).
- The [Offset](https://msdn.microsoft.com/en-us/library/system.datetimeoffset.offset(v=vs.110\).aspx) property on DateTimeOffset indicates the time's offset from UTC

A common scenario in the current application is user selects a date time in the UI using a date picker, which gets send to the server as a string. This value flows through the entire system and is used to populate external systems. The problem here is that the time zone of the date time is not clear. The developer might treat this as UTC time, system local time or even time local to the location in context. This gives different results to the end user and puts the system in an inconsistent state.

```csharp
public string GetAvailability(string locationCode, DateTime? dateTime)
{
   // Code to Get as on date
}
```

Even worse this date time might get converted back and forth to different time zones, even by the same developer or other developers in the team. These conversions implicitly depend on the Kind property and goes unnoticed. One of the most common problems that we see as a result of this is that the dates might fall over to a day before or after or after, depending on where in the world the user, the server running the application is.

## Being Explicit Using Value Objects

> _The issue in dealing with time is about not being explicit. It's a good idea to tie your domain concept (location in this case) and time together_

Since time is always tied to a location (_SYD, TRV, SEA_) it's better to keep these together. Though DateTimeOffset and DateTime already has a timezone information attached it does not fit well into the domain, it makes more sense to have a [Value Object](/blog/thinking-beyond-primitive-values-value-objects/) encapsulating time and location. Timezone by itself is less likely to fit into a domain unless time zones are a domain concept. Most likely the domain would be dealing with a location, place, airport, station etc which falls under a timezone. So it's a good idea to tie your domain concept and the time together. Only for the creation of the Value Object, we need the location after which it is the date time it represents that is relevant. But if by default you want to get back the date time for the same location it was created for, then location can be saved along with the Value Object. In our case, we always want to show the time at the location, so I am keeping it in the Value Object.

```csharp
public class LocationDateTime
{
    public Location Location { get; private set; }
    public DateTime DateTimeInUTC { get; private set; }
    public DateTimeOffset DateTimeAtLocation { get; private set; }

    public LocationDateTime(Location location, DateTime dateTimeUTC)
    {
        if (location == null)
            throw new ArgumentNullException(nameof(location));

        if (dateTimeUTC == null)
            throw new ArgumentNullException(nameof(dateTimeUTC));

        if (dateTimeUTC.Kind != DateTimeKind.Utc)
            throw new ArgumentException("Date Time not in UTC");

        Location = location;
        DateTimeInUTC = dateTimeUTC;
        DateTimeAtLocation = TimeAtLocation(Location);
    }

    public static LocationDateTime AtLocation(DateTime locationDateTime, Location location)
    {
        if (locationDateTime.Kind != DateTimeKind.Unspecified)
            throw new ArgumentException("DateTimeKind should be unspecified");

        var utcTime = TimeZoneInfo.ConvertTimeToUtc(locationDateTime, location.TimeZoneInfo);
        return new LocationDateTime(location, utcTime);
    }

    public DateTimeOffset TimeAtLocation(Location location)
    {
        return TimeZoneInfo.ConvertTime((DateTimeOffset)DateTimeInUTC, location.TimeZoneInfo);
    }

    public override bool Equals(object obj)
    {
        var objAsLocationDateTime = obj as LocationDateTime;
        if ((System.Object)objAsLocationDateTime == null)
            return false;

        return objAsLocationDateTime.DateTimeInUTC == DateTimeInUTC;
    }

    public override int GetHashCode()
    {
        return DateTimeInUTC.GetHashCode();
    }
}
```

The Value Object mandates that all date time gets tracked as UTC and allows conversion to time at different locations. The public constructor enforces this by checking the Kind property on DateTime.

> _The Value Object Equality is only on the UTC time it represents_

[Location](https://github.com/rahulpnath/Blog/blob/master/ExplicitAboutDateTime/ExplicitAboutDateTime/Location.cs) is another Value Object, that encapsulates the code, name and the time zone it belongs to. There is a factory method that allows the creation of the value object at a location, which assumes any passed in DateTime as the time at location, and mandates the Kind property is Unspecified. You could update this to accept UTC/Local time depending on the passed in location's time zone, checking if both fall under the same time zone. You can also create an implicit operator to cast to DateTime or DateTimeOffset values and have it return the desired date time value that you want.

All occurrences of datetime in model classes can now be replaced with custom datetime value object. This makes creating a date explicit and mandates developers to make a decision on the location of datetime.

```csharp
public string Get(string locationCode, DateTime? dateTimeAtLocation)
{
    var location = GetLocation(locationCode);
    var locationDateTime = LocationDateTime.AtLocation(dateTimeAtLocation, location);
    // Code to Get as on date
}
```

Even with the above code, you cannot restrict what gets passed into the API/application boundary method, but this has made it explicit to the application on how to start treating the date time. This forces the developer to think and be explicit on the time format expected at the boundary. This might lead to better naming of the variables at the boundary - instead of _dateTime_ to _dateTimeAtLocation_ - and being more explicit to the outside world too!

## Custom Factories Using Extension Method

Depending on the use case there will be a lot of ways you want to create the value object and possibility of some being used over and over again is more. You can use factory methods to help you extract out this code duplication.

As [Uncle Bob](https://twitter.com/unclebobmartin) points out in [Agile Principles, Patterns, and Practices in C#](http://www.amazon.in/gp/product/0131857258/ref=as_li_tl?ie=UTF8&camp=3626&creative=24822&creativeASIN=0131857258&linkCode=as2&tag=rahulpnath-21&linkId=VVMXRINDZWYFRWP4), interfaces should be closer to the client. [Factories are nothing but an interface](http://blog.ploeh.dk/2014/12/24/placement-of-abstract-factories/), so it should be defined closer to where it's consumed. Creating a LocationDateTime is always tied to a DateTime object. Using [Extension Methods](https://msdn.microsoft.com/en-AU/library/bb383977.aspx) in C#, I have defined an extension on DateTime to create a LocationDateTime object.

```csharp
public static LocationDateTime ToLocationDateTime(this DateTime dateTime, Location location)
{
    if (dateTime == null)
        return null;

    if (location == null)
        throw new ArgumentNullException(nameof(location));

    return LocationDateTime.AtLocation(dateTime, location);
}
```

Now creating a LocationDateTime from a DateTime is easy. Similarly, extension methods can be defined on Location, LocationDateTime to provide custom capabilities as required by the consuming clients.

```csharp
var locationDateTime = dateTimeAtLocation.ToLocationDateTime(location);
```

By using a Value Object to represent the DateTime within the application enforces developers to be more explicit on the date time at the boundaries, results in better naming of the variables at boundaries, ensures that it remains the same within the application. You can also override some of the most commonly used operators with DateTime like greater than, less than, equal to, so that it seamlessly fits into the application.

Hoping this will work well in the application too, let me get on to fix it!

_Will update this post with more real life experiences once implemented!_
