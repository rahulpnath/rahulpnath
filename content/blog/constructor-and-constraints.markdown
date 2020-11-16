---
author: [Rahul Nath]
title: "Back To Basics: Constructors and Enforcing Invariants"
  
date: 2020-03-16
tags:
  - Programming
  - Basics
thumbnail: ../images/strong_code_contracts.jpg
---

In C# or any class-based object-oriented language, a Constructor is used to create an object. The constructor is responsible for initializing the object's data members and establishing the class invariants. A constructor fails and throws an exception when the class invariants are not met. An invariant is an assertion that is always held true.

> The invariant must hold to be true after the constructor is finished and at the entry and exit of all public member functions.

`youtube:https://www.youtube.com/embed/-9zzIS3R56w`

## Simple Invariants

E.g. If a constructor takes in a string and checks it to be not null before assigning it to its property, the invariant is that the string _Value_ can never be null.

```csharp
public class Name
{
    public string Value { get; set; }

    public Name(string name)
    {
        Value = name ?? throw new ArgumentNullException(nameof(name));
    }
}
```

However, in the above case, one can easily break the invariant on an instance by setting the _Value_ property to null after creating the object.

```csharp
var name = new Name("Rahul");
name.Value = null;
```

Make the set on the Value property private to stop this. The Value property cannot be set directly on the object instance.

```csharp
public class Name
{
  public string Value { get; private set; }
  ...
}
```

However, we can add a new method on Name class as below, which breaks the invariant.

```csharp
public class Name
{
  ...
  public void PrintName()
    {
        Console.WriteLine(Value);
        Value = null;
    }
}
```

To enforce the invariant, we can either make sure that we never do something like above inside of a class or mark the property as read-only. By marking it read-only, we ensure that it is set only inside the constructor and nowhere else (even within the class). Remember that _an invariant must hold to be true after the constructor is finished and at the entry and exit of all public member functions._

```csharp
public class Name
{
  public readonly string Value;
  ...
}
```

By marking it as read-only, we enforce that _Value_ can no longer be set to Null even within the class. The only place you can set the property is the constructor. Name is now an immutable - _value cannot be changed after it is created_.

## Multi-Property Invariants

The NotNull constraint is something we see often and are used to writing. However, those are not the only constraints. The best example is the DateTime class, which enforces that any date created is valid.

```csharp
var leapYear = new DateTime(2020, 02, 29);

// Throws exception
// Year, Month, and Day parameters describe an un-representable DateTime
var invalid_NotLeapYear = new DateTime(2019, 02, 29);
var invalid =  new DateTime(2020, 02, 30);
```

Similar checks are possible for custom classes that we write. E.g., let's take a DateRange class. In addition to StartDate and EndDate not being null, we have an additional invariant here that the end date cannot be less than the start date.

```csharp
public class DateRange
{
    public readonly DateTime StartDate;
    public readonly DateTime EndDate;

    public DateRange(DateTime startDate, DateTime endDate)
    {
        // Ignoring null checks
        if (endDate < startDate)
            throw new ArgumentException("End Date cannot be less than Start Date");

        this.StartDate = startDate;
        this.EndDate = endDate;
    }
}
```

## Business Invariants

Taking this to the next level, we can add business invariants as well. Let's take an example of a quote for mobile phones and associated accessories. A quote can be in many different states (Draft, Open Accepted, and Expired). There are a few rules associated with the creation of a Quote.

- A quote must have an associated Customer
- An Open quote must have an associated Phone
- Accessories are optional

> Adding business constraints to constructors makes illegal states unrepresentable. If you are on .Net 3.0 [turn on Nullable Reference Types](https://devblogs.microsoft.com/dotnet/try-out-nullable-reference-types/#turn-on-nullable-reference-types) and you can get these advantages at compile time as well.

```csharp
public class Quote
{
    public int Id { get; private set; }
    public QuoteStatus Status { get; private set; }
    public Customer Customer { get; private set; }
    public MobilePhone Phone { get; private set; }
    private readonly List<Accessories> _accessories = new List<Accessories>();
    public IReadOnlyCollection<Accessories> Accessories => _accessories;

    private Quote() { }

    public Quote(int id, Customer customer)
    : this(id, customer, MobilePhone.Empty, QuoteStatus.Draft) { }

    public Quote(int id, Customer customer, MobilePhone phone, QuoteStatus status)
    : this(id, customer, phone, status, new List<Accessories>()) { }

    public Quote(
        int id, Customer customer, MobilePhone phone,
        QuoteStatus status, List<Accessories> accessories)
    {
        Id = id;
        Customer = customer ?? throw new ArgumentNullException(nameof(customer));

        if (status != QuoteStatus.Draft && phone == null)
            throw new DomainException($"Mobile Phone cannot be null when status is {status}");

        Phone = phone;
        Status = status;
        _accessories = accessories ?? new List<Accessories>();
    }
}
```

Let's look at the different constraints that the Quote class enforces

- The private default constructor makes sure an empty Quote cannot be created.
- Quote with id and customer parameter forces the Quote to be in Draft status.
- All the other constructors use the constructor with all the properties. A Quote instance cannot exist without a customer. When a quote is not in the draft state, it must have an associated MobilePhone.

With these checks in place, we can be sure that some of the business constraints are enforced, and the objects cannot be created in an invalid state. We don't have to make any more assumptions about the Quote object in our code. We can be sure about some of the above-enforced constraints every time we use the Quote class. It helps [make the code contracts stronger](https://www.rahulpnath.com/blog/stronger-code-contracts/).

Constructors are the entry points to the instances. Make them fail fast if the state is illegal. It helps remove a lot of unnecessary defensive checks in other areas of our code.

Hope this helps!
