---
author: [Rahul Nath]
title: "Don't Let Entity Framework Fool Your Constructors!"
  
date: 2020-04-01
tags:
  - Programming
  - Basics
description: Any state that an object can be in must be representable through the class constructor.
thumbnail: ../images/coding.jpg
---

In the previous post, [Back To Basics: Constructors and Enforcing Invariants](/blog/constructor_and_constraints/), we saw the importance of having well-defined constructors and how they help us maintain invariants. Most projects I work on use Entity Framework for the database interactions. We usually have the same Domain Model mapped to the database structure using the [Fluent API Configuration](https://www.learnentityframeworkcore.com/configuration/fluent-api). The configurations help keep the Domain Model agnostic of the database dependencies and mappings. The fluent configurations "act as a DTO class without needing to define one explicitly" and keeps the Domain classes 'clean'.

One thing I notice across projects is the class Constructors do not represent all the states that an object can take. It is not possible to create all states that an object can be in using the constructor. Let us look into the Quote class below for an example. It has the following [invariants enforced by the constructor](/blog/constructor_and_constraints/).

- A Quote must have a Customer
- A newly created quote always starts in Draft Status

```csharp
public class Quote
{
    public Guid Id { get; private set; }
    public QuoteStatus Status { get; private set; }
    public Customer Customer { get;}
    public MobilePhone Phone { get; private set; }
    private readonly List<Accessorry> _accessories = new List<Accessorry>();
    public IReadOnlyCollection<Accessorry> Accessories => _accessories;

    private Quote() { }

    public Quote(Guid id, Customer customer)
    {
        Id = id;
        Customer = customer ?? throw new ArgumentNullException(nameof(customer));
        Phone = MobilePhone.Empty;
        Status = QuoteStatus.Draft;
    }

    public void UpdatePhone(MobilePhone phone)
    {
        Phone = phone ?? throw new ArgumentNullException(nameof(phone));
    }

    public void OpenQuote()
    {
        if (Phone == MobilePhone.Empty)
            throw new DomainException("Cannot set quote to open with empty phone");

        Status = QuoteStatus.Open;
    }
    ...
}
```

You can add a phone to a Quote, open the Quote, and many more such actions (you get the idea). The Quote class is like an 'Aggregate Root' that enforces the constraints on its properties through the methods and constructors it exposes. You can see that a Quote cannot be in an Open state without an associated phone.

Below is a sample usage of this class to create and open a Quote within a console application. A new context mimics a new Controller endpoint, in case of a Web application. The below works as expected and allows us to create, add a phone to the Quote.

```csharp
var quoteId = Guid.NewGuid();
using (var context = new QuoteContext(optionsBuilder.Options))
{ // Create a New Draft Quote
    var customer = new Customer("Rahul", "rahul@rahul.com", "123 Fake Address");
    var quote = new Quote(quoteId, customer);
    context.Quotes.Add(quote);
    context.SaveChanges();
}

using (var context = new QuoteContext(optionsBuilder.Options))
{ // Add Phone to the Quote
    var quote = context.Quotes.First(a => a.Id == quoteId);
    var phone = new MobilePhone("IPhone", "X", 1000.00m);
    quote.UpdatePhone(phone);
    context.SaveChanges();
}
```

## EF Core and its Reflection Magic

With a phone attached to the Quote, we can now Open the Quote as shown below.

```csharp
using (var context = new QuoteContext(optionsBuilder.Options))
{ // Open quote
    var quote = context.Quotes.First(a => a.Id == quoteId);
    quote.OpenQuote();
    context.SaveChanges();
}
```

> **We do not have a constructor to create Draft Quote with a Phone. How is EF loading the data?**

How is EF loading the data?

EF Core [allows private properties](https://docs.microsoft.com/en-us/ef/core/modeling/constructors#read-only-properties) and have them populated when retrieving data. It is possible through the magic of [reflection](https://docs.microsoft.com/en-us/dotnet/csharp/programming-guide/concepts/reflection) and setting properties on the objects even though they are private setters.
We don't notice this unless we write tests or have other use cases in code to create a Quote in different states.

No offense to the magic, don't get me wrong here. I like it and use it a lot and makes it easier to write code to retrieve data from the database. However, let's not allow the magic to drive our Constructors and the class definitions. Let's write a test to make this more evident.

## EF Magic Makes Tests Fragile

Below is a test to verify that calling _OpenQuote_, sets the Quote to Open Status. However, note that we have to call the _UpdatePhone_ method to update the Quote object before calling _OpenQuote_.

```csharp
[Fact]
public void OpenQuoteSetsStatusToOpen()
{
    var customer = new Customer(
        "Rahul", "rahul@rahul.com", "123 Fake Address");
    var quote = new Quote(Guid.NewGuid(), customer);
    var phone = new MobilePhone("IPhone", "X", 1000.00m);
    quote.UpdatePhone(phone);

    quote.OpenQuote();

    Assert.Equal(QuoteStatus.Open, quote.Status);
}
```

It seems to be a trivial problem in isolation. However, any time we need a Quote object which has anything more than id and a customer, we need to call these methods. To write tests, we need to invoke a series of methods to put it into the correct state. This increases code coupling and makes the tests fragile.

To fix this, we need to add more constructors to Quote class that allows us to create Quote in the desired state. The constructor that we had before now calls on to the new one with the same parameters. The constructor now enforces any non-draft Quote needs an associated phone.

> Any state that an object can be in must be representable through the class constructor.

```csharp
public Quote(Guid id, Customer customer)
    : this(id, customer, MobilePhone.Empty, QuoteStatus.Draft) { }

public Quote(Guid id, Customer customer, MobilePhone phone, QuoteStatus status)
{
    Id = id;
    Customer = customer ?? throw new ArgumentNullException(nameof(customer));
    Phone = phone ?? throw new ArgumentNullException(nameof(phone));

    if (status != QuoteStatus.Draft && phone == MobilePhone.Empty)
        throw new DomainException($"Cannot set quote to {status} with empty phone");

    Status = status;
}
```

We can now rewrite the test to use the new constructor. We don't need to call the _UpdatePhone_ method here to get the Quote in the correct state.

```csharp
[Fact]
public void OpenQuoteSetsStatusToOpen()
{
    var customer = new Customer(
        "Rahul", "rahul@rahul.com", "123 Fake Address");
    var phone = new MobilePhone("IPhone", "X", 1000.00m);
    var quote = new Quote(Guid.NewGuid(), customer, phone, QuoteStatus.Draft);

    quote.OpenQuote();

    Assert.Equal(QuoteStatus.Open, quote.Status);
}
```

The constructor will have to be modified when you start adding accessories to the Quote. But I leave that to you. Constructors are the gateway to creating objects. Make sure they are not dependent on other frameworks that you use in the project. Make all states are representable through the constructor and not by invoking functions.

Does your constructor allow representing all states?
