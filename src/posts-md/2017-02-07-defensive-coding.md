---
title: Defensive Coding
slug: defensive-coding
date_published: 2017-02-07T00:00:00.000Z
date_updated: 2017-02-07T00:00:00.000Z
tags: Programming
excerpt: Is defensive coding good or bad?
---

Often when writing code or in code review discussions it comes up - '*Should I be doing a null check here?*.' and we start off long discussions. Like in most cases, there is no definite answer to this. In this post let us examine some of the pros and cons of having defensive checks and how and when we can avoid it to make the code more readable.
![Defensive Coding](__GHOST_URL__/content/images/defensive_coding.jpg)
Let's see an example to explore more. The below code aggregated details from different repository classes and returns a combined model. I have kept this simple with just three dependencies.

    public PersonDetails GetPersonDetails(Guid personId)
    {
        var person = personRepository.GetPerson(personId);
        var subscriptionPlan = subscriptionRepository.GetSubscriptionForPerson(person.Email);
        var billingSummary = billingRepository.GetSummary(subscriptionPlan.Id);
    
        return new PersonDetails() {...};
    }
    

As you see, there are no null checks on any of the values returned from external dependencies. The code expects all calls to be successful with no exceptions - '[happy path](https://en.wikipedia.org/wiki/Happy_path)' scenario. The problem is when an error happens; the exception stack trace will look like something below.

    Object reference not set to an instance of an object.
    at UserQuery.GetPersonDetails(Guid personId)
      at UserQuery.Main()
    

We will not be able to tell which of the values was null, making it hard to debug the error. We have to manually go through the code checking how each of the dependencies retrieves values and check which one possibly was null. Debugging takes a lot of time and might be difficult depending on the complexity of the dependencies. The advantage of the above code though is that it is readable and there is ***noise*** in the code.

## Extensive Defense

Let us now modify the above example to see how it would be to add defensive code and check for nulls.

    public PersonDetails GetPersonDetails(Guid personId)
    {
        if (personId == Guid.Empty)
            throw new ArgumentNullException(nameof(personId);
    
        var person = personRepository.GetPerson(personId);
        if (person == null)
            throw new Exception("Person is null");
    
        if (person.Email == null)
            throw new Exception("Email is null for person " + personId);
    
        var subscriptionPlan = subscriptionRepository.GetSubscriptionForPerson(person.Email);
        if (subscriptionPlan == null)
            throw new Exception("Subscription Plan is null");
    
        var billingSummary = billingRepository.GetSummary(subscriptionPlan.Id);
        if (billingSummary == null)
            throw new Exception("BillingSummary is null");
    
        return new PersonDetails() { };
    }
    

The defensive checks added for guarding against invalid values makes the code harder to read. Defensive checks are there for incoming parameters as well and validate if they are null/default value (for Guid). However when an error happens the stack trace will mention the name of the property which was null. Debugging is fast and easy and makes the exception message useful. But we don't want our code filled with defensive checks like this.

## Team Conventions and Practices

Let us dig a bit deeper into why we had to put in the defensive checks in the first place. We had to check for null on *person* since the repository decided to return a null when it could not find the person given an id. Does it even make sense or add any value in returning a null reference from the repository? Unless the business works in a way that there is a high possibility of something returning null this does not add any value. Even in cases like that, we should revert to other options which we will see in a while. When most of the time we expect a person to exists, it is better for the repository to throw an exception right away that the person does not exist. If the validations and the defensive checks are performed at the boundaries, then we do not need to do a null check anymore when getting a person or any similar functions.

    public Person GetPerson(Guid personId)
    {
        if (personId == Guid.Empty)
            throw new ArgumentNullException(nameof(personId));
    
        var person = DataContext.Get(personId);
        if (person == null)
            throw new UserDoesNotExistsException("Person does not exists with id ", personId);
    
        return person;
    }
    

For cases where there are possibilities of a value existing or not you can resort to [Stronger Code Contracts](__GHOST_URL__/blog/stronger-code-contracts/). Using the Maybe type to indicate a value might or might not be present is a good way to force defensive checks. Maybe type ensures that any consumer of the code handles the case where the object does not exist. Readability of the code also improves in this case.

If you have noticed in the above code when checking for null's, I checked the Email property for null as well. Setting up team conventions that properties cannot be null, help reduce defensive checks for it. You could use various techniques to ensure properties are not null like setting a default value for the property in the constructor, [Null object pattern](https://en.wikipedia.org/wiki/Null_Object_pattern), checking for null's when setting property values or modeling the object in a way that optional parameters are not direct properties on the object.

    public class Person
    {
        private Email email;
    
        public Person()
        {
           Email = Email.Empty;
        }
    
        public Email Email
        {
            get { return email; }
            set
            {
                if (value == null)
                    throw new ArgumentNullException("email cannot be null");
    
                email = value;
            }
        }
    }
    

With the updated repository code and the property changes, we can rewrite the original code much similar as it was before introducing the defensive checks. The guard clauses at the start of the function, checking for the parameters is still important. Validating for input parameters helps find the problems earlier in the code stack and follows the [fail fast](https://en.wikipedia.org/wiki/Fail-fast) pattern. It helps us find exactly where the null was introduced and address the issue faster. The defensive code is at the beginning of the function and can be easily skipped over while reading. If you are not that keen to write this on all functions, you can also write some helper classes which Validates a list of parameters ([params](https://msdn.microsoft.com/en-au/library/w5zay9db.aspx)). I prefer the explicit check and used to skipping over them when reading code.

    public PersonDetails GetPersonDetails(Guid personId)
    {
       if (personId == Guid.Empty)
            throw new ArgumentNullException(nameof(personId);
    
        var person = personRepository.GetPerson(personId);
        var subscriptionPlan = subscriptionRepository.GetSubscriptionForPerson(person.Email);
        var billingSummary = billingRepository.GetSummary(subscriptionPlan.Id);
    
        return new PersonDetails() {...};
    }
    

## Value Objects and Defensive Coding

Let us now look at other ways to improve defensive checks on properties. Modeling properties as [Value Objects](__GHOST_URL__/blog/thinking-beyond-primitive-values-value-objects/) helps contain the defensive code within the property. Like in the above case where email cannot be null, the checks to make sure that it is a valid email can be within the Email class. Containing this logic in the class removes the need for the rest of the code to check for it. If an email object exists, it will be valid. It is the same with names, date ranges, money, etc. The lesser we expose primitive type properties, the less defensive code we need to write. It also removes the problems of checking *string.IsNullOrEmpty* at some places and just for nulls at others.

Though this is not an extensive examination of all possible cases, we have still seen some common scenarios. Defensive coding is required. It is about striking a balance and making [code contracts stronger](__GHOST_URL__/blog/stronger-code-contracts/) to convey the intent. The defensive checks are within the classes responsible for the object and exist at a central place. It removes the need to check for it elsewhere in the code. This is a simple application of [Encapsulation](https://en.wikipedia.org/wiki/Encapsulation_(computer_programming). So the next time you check for null make sure it is where it should be!
