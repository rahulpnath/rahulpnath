---
author: [Rahul Nath]
title: 'Make Your Code Contracts Stronger'
  
tags:
  - Programming
date: 2016-12-12
completedDate: 2016-11-28 13:36:26 +1100
keywords:
description: In this post, we will see how we can improve the Code contracts in C# and avoid unnecessary Guard statements across our code base.
thumbnail: ../images/strong_code_contracts.jpg
---

How often have you gone into a class to see the implementation when consuming the class or an interface? I do this almost every other day and it's mostly to check how the code handles boundary conditions. What does it do when there is no value to return, does it need all parameters etc. Reading code is hard and time-consuming, even if it's a code that you yourself have written a few minutes back. Imagine every developer having to go into the implementation detail anytime they consume a class? Bertrand Meyer in connection with his design of the Eiffel programming language coined the term [Design By Contract](https://en.wikipedia.org/wiki/Design_by_contract), an approach for designing software. The central idea of Design By Contract is to improve the contracts shared between different components in the code base. In this post, we will see how we can improve our C# code and avoid unnecessary guard statements across out code base.

[![Stronger Code Contracts](../images/strong_code_contracts.jpg)](http://nebula.wsimg.com/6e7b8057c7f32b90d4f144424c8a7ae1?AccessKeyId=00F174C5B1CCF865161D&disposition=0&alloworigin=1)

## Leaky Abstraction

These days in programming we tend to abstract a lot more than what we really need. [Dependency Injection](/blog/category/dependency-injection/) and use of IOC containers have started forcing ourselves to think that everything needs to be an interface. But essentially this is not the case. But the bigger problem lies not in the abstraction, but on depending on the implementation details after abstracting. A [leaky abstraction](https://en.wikipedia.org/wiki/Leaky_abstraction) is an abstraction that exposes details and limitations of its underlying implementation to its users that should ideally be hidden away.

> _Consuming abstractions assuming a certain implementation is bad practice_

Recently I came across the below code during a code review. Even though an empty string was not a valid configuration value that was not being checked here as the repository implementation returns a null when there is no entry.

```csharp
string config = repository.GetConfig();
if(config == null)
{
    ...
}
```

This is a common practice and I have myself fallen for this a lot of times. The fact that the repository returns only a null value is an abstraction detail and is not clear from the contract that it exposes. Anyone could change the repository to start returning an empty string. This will then start failing this code. When taken in isolation the code that uses 'config' must check for null and empty to avoid invalid values. The abstraction contracts (function signatures) must convey whether it always returns a value, whether it can be empty or null. This helps remove unnecessary guarding code or makes guarding mandatory across the code base and also indicates a clear intent.

The [Robustness Principle](https://en.wikipedia.org/wiki/Robustness_principle) is a general design guideline for software

> _Be conservative in what you do, be liberal in what you accept from others (often reworded as "Be conservative in what you send, be liberal in what you accept")._

Applying this principle in this context, we must be conservative in what we return from our function (be it a class or interface) contract. The contract should be as explicit as possible to indicate the nature of values that it returns.

### Stronger Return Types

A repository returning a string is a weak contract, as it does not clearly express the nature of value it returns. It can return either of these three values - null, an empty string or a valid configuration string. In our application, assuming that null and empty string are invalid we should be having a single representation for this state in the application. C# by its very design encourages us to use this pattern as it embraces the concept of null's - [the billion dollar mistake](https://www.linkedin.com/pulse/20141126171912-7082046-tony-hoare-invention-of-the-null-reference-a-billion-dollar-mistake). But this does not mean we are restricted by it. We can bring in concepts from other languages to help us solve this problem. In F# for example, the Option type represents presence or absence of a value. This is similar to the [Nullable type in C#](https://msdn.microsoft.com/en-us/library/1t3y8s4s.aspx), but not just restricted to value types. [Option type](http://fsharpforfunandprofit.com/posts/the-option-type/) is defined as union type with two cases : Some and None. Whenever consuming an option type the compiler forces us to handle both the cases

> _In pure F#, [nulls cannot exist accidentally](https://fsharpforfunandprofit.com/posts/correctness-exhaustive-pattern-matching/). A string or object must always be assigned to something at creation, and is immutable thereafter_

```fsharp
let config = getConfig
match config with
| None -> printfn "Invalid config"
| Some c -> printgn "Valid config"
```

Though C# does not have anything out of the box to define optional values, we can define one of our own. The [Maybe](https://github.com/ploeh/Booking/blob/master/BookingDomainModel/Maybe.cs) class is one such implementation of an optional concept. The name is influenced by the option type in Haskell, [Maybe](https://wiki.haskell.org/Maybe). There are also other implementations of Maybe but the concept remains the same - we can represent an optional type in C#. The code contracts are stronger using Maybe as a return type. If a function always returns a value, say a string, the function contract should remain as a string. If a function cannot return a value always and can return null/empty (assuming that these are invalid values) then it returns a `Maybe<string>`. This makes it clearer for consuming code on whether they should check for null/empty values.

```csharp
Maybe<string> config = repository.GetConfig();
config.Do(value => LoadFromFile(value));
```

You can write different extension methods on the Maybe class, depending on how you want to process the value. In the above example, I have a Do extension method that calls on to a function with the configuration value if any exists. By explicitly stating that a value may or may not be present we have more clarity in code. No longer do we need any unnecessary null checks in the case where a value is always present. This is best achieved when agreed upon as a convention by the development team and enforced through tooling (like code analysis).

## Value Objects

One of the root problem for having a lot of null/empty checks scattered across the code is [Primitive Obsession](http://blog.ploeh.dk/2015/01/19/from-primitive-obsession-to-domain-modelling/). Just because you can represent a value as a string, it doesn't mean that you always should. Enforcing structural restrictions imposed by the business is best done by encapsulating these constraints within a class, also known as a [Value Object](/blog/thinking-beyond-primitive-values-value-objects/). This leads to classes for representing various non-nullable values for e.g. Name, configuration, Age etc. You can use this in conjunction with [Null Object](https://en.wikipedia.org/wiki/Null_Object_pattern) pattern if required. A value object is a class whose equality is based on the value that it holds. So two class instances with same values will be treated equally. In F# you get this by default but in C# you need to override Equals and GetHashCode functions to enforce this equality.

```csharp
public class Configuration
{
    private string configuration;

    public Configuration(string configuration)
    {
        if (string.IsNullOrEmpty(configuration))
            throw new ArgumentNullException(nameof(configuration), "Configuration value cannot be null");

        this.configuration = configuration;
    }

    // override Equals and GetHashCode
}
```

Modeling concepts in the domain as classes helps you to contain the domain/business constraints in a single place. This prevents the need to have null checks elsewhere in the code. Value objects being immutable helps enforce class invariants.

The above two methods help create a stronger contract in code. As with any conventions, this is useful only when followed by the whole team. Conventions are best followed if enforced through tooling. You can create custom code analysis rules to enforce return type to be of type if any method is returning null. Even if you are introducing this into a large existing code base you can do this incrementally, by starting to enforce them on commits (if you are using git) like when [introducing styling into an existing project](/blog/introducing-code-formatting-into-a-large-codebase/). What other contracts do you find helpful to make the code more expressive?
