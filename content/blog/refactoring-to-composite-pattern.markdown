---
author: [Rahul Nath]
title: 'Refactoring to Composite Pattern'
  
tags:
  - Refactoring
  - Programming
date: 2017-04-13
completedDate: 2017-03-18 05:10:13 +1100
keywords:
description: Composite Pattern is a useful technique to keep code maintainable and readable.
thumbnail: ../images/composite_pattern.png
---

I often come across functions that do multiple things. Many times such functions have a common pattern where multiple sections within the function use the same parameters for calculations. The results from these different code sections within the function are either separated by conditionals (if, switch, etc.) or combined using various arithmetic operators. The most obvious refactoring in such scenarios is to move the code sections into different functions within the same class. Having it in separate functions keeps the code readable. But on closer observation, such functions can be moved into different classes, keeping each of these code sections as the only responsibility.

## Identifying the Refactoring

Within a function when a similar pattern of code repeats, it could be refactored into multiple classes and composed to give the same functionality. Let us take a simple example of a function where we are validating an Account object based on different criteria. The various criteria end up as conditionals within the function. This function can soon get big and difficult to manage. It also makes it harder to test. If you are adding more validations to this class over a period you are violating the Open-Closed Principle (OCP), the O in [SOLID](http://butunclebob.com/ArticleS.UncleBob.PrinciplesOfOod). Depending on the level of abstraction that we are looking at, the class also violates the Single Responsibility Principle(SRP), the S in SOLID. The function handles validations based on different criteria.

```csharp
public List<string> Validate(Account account)
{
    var result = new List<string>();

    if (string.IsNullOrEmpty(account.Email))
        result.Add("No email");
    else if (!IsValidEmailFormat(account.Email))
        result.Add("Email not valid");

    if (account.BillingDetails == null)
        result.Add("Billing Details does not exists");

    ...

    return result;
}
```

### The Composite Pattern

[Composite pattern](https://en.wikipedia.org/wiki/Composite_pattern) is appropriate when the client ignores the difference between the composition of objects and individual objects. The pattern helps developers to maintain the complexity of the code and also separate out class responsibilities.

> _Compose objects into tree structures to represent part-whole hierarchies. Composite lets clients treat individual objects and compositions of objects uniformly_

<img alt="Composite Pattern" src="../images/composite_pattern.png" />

## Refactoring

In the Account validation above, the function checks for an email and validates the format, checks for valid billing details, etc. The validations could also extend on to users attached to the account and check if there is at least one user, the user has email, phone number, etc. Each of these validations can be moved into separate classes and composed together in one class so that they are all executed when an account needs to be validated. You can see a tree like hierarchy forming here, and the actual validation is composed of all these validations

<img alt="Account Validation hierarchy" src="../images/composite_pattern_validation.png" />

The actual C# code looks like this after the refactoring.

```csharp
public interface IValidateAccount
{
    IEnumerable<string> Validate(Account account);
}

public class AccountValidators : IValidateAccount
{
    public readonly IEnumerable<IValidateAccount> Validators;
    public AccountValidators()
    {
        Validators = new List<IValidateAccount>()
        {
          new AccountHasEmailValidator(),
          new AccountEmailIsValidValidator(),
          new AccountHasBillingDetailsValidator()
          ... // Add more validators
        };
    }
    public IEnumerable<string> Validate(Account account)
    {
        return Validators.SelectMany(validator => validator.Validate(account));
    }
}

public class AccountHasEmailValidator : IValidateAccount
{
    public IEnumerable<string> Validate(Account account)
    {
        if (account != null && string.IsNullOrEmpty(account.Email))
            yield return "No email";
    }
}

public class AccountEmailIsValidValidator : IValidateAccount
{
    public IEnumerable<string> Validate(Account account)
    {
        if (account != null && account.Email != null && !IsValidEmail(account.Email))
            yield return "Email not valid";
    }
}
```

After the refactoring, we have separate classes for each of the validation rules. The _AccountValidators_ class composes all the other validators and provides the same uniform interface for the consumers to validate an account. It calls on to all the Validators iteratively and invokes the Validate method on them. You can use Dependency Injection to inject in all validators to this class if you are not comfortable hard-wiring them. The IoC container can be setup using [registration by convention](/blog/ioc-registration-by-convention/), which prevents the needs for explicit registration for any new validators.

One other worry that I have seen common when moving to such a pattern is that - _We now have a lot more classes. Does that not affect the performance?_. If you are following SOLID principles to the core and want to maintain loose coupling in your code then creating more classes is something you cannot avoid. We do not want any
[God Classes](http://wiki.c2.com/?GodClass) in our code and the first step towards it is to split them into different classes.

> _If an Object Oriented language cannot handle the creation of many classes and objects then why should we be using it in the first place?_

> -_[Big Object Graphs Up Front, Mark Seemann](https://vimeo.com/68378923)_

The composition can be complex conditions as in the case below. For, e.g., let's say we need to execute a different kind of algorithm to calculate based on a property.

```csharp
public class AccountCalculator : ICalculate
{
    public AccountCalculator(ICalculate calculate1, ICalculate calculate2, ICalculate calculate3)
    {
        ...
    }

    public int Calculate(Account account)
    {
        if(account.PropertyExists)
            return calculate1.Calculate();
        else
              return calculate2.Calculate() + calculate3.Calculate();
    }
}
```

The above composition makes it easy to test the composed parts and the composition separately. It also helps keep the tests simple and easy to understand. The code is separated into maintainable classes and each criteria can be modified independently.

Composite Pattern is a useful technique to keep code maintainable and readable. Identifying the pattern is a bit of a challenge, but the more you see it the more familiar you will be. Hope this helps!
