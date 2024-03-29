---
author: [Rahul Nath]
title: 'Avoid State Mutation'
  
tags:
  - Programming
date: 2017-02-01
completedDate: 2017-01-10 04:56:54 +1100
keywords:
description: This post walks through the effects of mutation and shows how it can affect functionality in an undesirable way.
thumbnail: ../images/mutation.png
---

How many times have you had to navigate down a long chain of function calls to find out that some code deep down was changing the value of an object passed to it? The change could either be setting the value to null or modifying the value in itself. When passing around reference types, it's easy to run into this situation very often. This happens not just when debugging existing code, but also when looking at the code we have just finished writing. Maintaining state transitions and object state based on the order in which functions are invoked on them can soon become confusing and buggy. So the best way is to try and avoid them in the first place.

<img alt="Avoid State Mutation" src="../images/mutation.png" />

## What is state Mutation

The process of changing the value of a variable or an object over time after creation is called mutation. In simpler terms when you are changing the value of an object, you are mutating the state. I am sure that everyone would have had some time getting their head around the below statement when starting off with programming (I did)

```csharp
var x = 1;
x = x + 1;
```

By second nature (depending on the programming languages one is exposed to e.g. csharp, java, etc.) you would say the above statement is perfectly fine and not think twice about anything. But show it to someone who is new to programming. They will find it hard to understand those two statements, the same phase that we have all gone through. '=' has turned into an assignment operator while it is an equality operator in mathematics. There are languages where '=' still stands for equality (like FSharp). In the example above the value of x is mutated - it is changed from 1 to 2.

> _The process of actually changing a variable’s value over time, within a single context, is called mutation._

## Risks of Mutation

Mutable types can pose risks when passing a mutable value as function parameters or when returning mutable values from functions.

### **Passing Mutable Value**

Let us take a simple example below. I have a list of integers, and I want to check if the first item of the incoming list and the sorted one are same. I have a simple sort method which implements [Bubble sort](https://en.wikipedia.org/wiki/Bubble_sort). What do you think will be the output?

```csharp
{
    var list = new List<int>() { 2, 1, 3 };
    var sortedList = Sort(list);
    if (sortedList.First() == list.First())
        Console.WriteLine("First item is in place");
}

public IEnumerable<int> Sort(IEnumerable<int> list)
{
    var listEvaluated = list as IList<int> ?? list.ToList();
    int size = listEvaluated.Count();
    for (int i = 1; i < size; i++)
    {
        for (int j = 0; j < (size - i); j++)
        {
            if (listEvaluated[j] > listEvaluated[j + 1])
            {
                int temp = listEvaluated[j];
                listEvaluated[j] = listEvaluated[j + 1];
                listEvaluated[j + 1] = temp;
            }
        }
    }

    return listEvaluated;
}
```

Yes, it prints out the message that the _First item is in place_. Before getting into the details of the issue, let us set our expectations correct. When calling the Sort method, we do not expect it to change the contents of the original list. Given that the function's signature is that of a Query (returns a value), we expect it not to create any [side effects](<https://en.wikipedia.org/wiki/Side_effect_(computer_science)>). According to [Command Query Separation](https://en.wikipedia.org/wiki/Command%E2%80%93query_separation) (CQS) by Bertrand Meyer in [Object Oriented Software Construction](http://amzn.to/2hZ4P9C)

> _Every method should either be a command that performs an action, or a query that returns data to the caller, but not both. In other words, Asking a question should not change the answer. More formally, methods should return a value only if they are referentially transparent and hence possess no side effects._

Applying CQS means that any method can either be a Query or a Command. A command changes the state of the system but does not return a value (void). A query does not change the state of the system and returns a value and should be idempotent. Such functions are also referred to as [pure functions](https://en.wikipedia.org/wiki/Pure_function). The above Sort function only partially confirms to being a query. It does return the same output given the same input, the sorted list. But it changes the state of the system and has side effects - it mutates the list passed. The issue in the implementation of the Sort is that it casts the list passed in as `IList<int>`, if it is already one. So when the parameter list is of type IList, listEvaluated points to the same list. If you force copy the list irrespective of it being a list or not will fix the issue. I will discuss more on how this kind of a conditional evaluation got in here in a separate post.

```csharp
var listEvaluated = list.ToList();
```

This kind of change is only possible if the development team owns the Sort function. If this is a third-party library that you are consuming then the only way to avoid the problem will be to send in a copy of the list. Even trying to pass the list [AsReadOnly](https://msdn.microsoft.com/en-us/library/e78dcd75(v=vs.110\).aspx) will not work here. Check it out if you are not sure why.

```csharp
var sortedList = Sort(list.ToList());
```

The above solution does not imply that every time we need to pass in a list to a function we should defensively copy it (using ToList). _It depends_. Within a development team, there can be a convention that it sticks to CQS principle. In case of exceptions, make sure that it is communicated to everyone. Communication to developers is done best by naming the function to reflect that or adding a comment that shows up in the IDE intellisense (if any). For code that you consume from third parties or open sources make sure you understand well how the library behaves and check the documentation before using it. Ensure you have [unit tests](/blog/category/tdd/) asserting the assumptions and behavior in all cases.

### **Returning Mutable Values**

Let us take an example to see the possible effects of returning mutable values from a function. Below is a configuration helper class which returns a configuration object. The helper method is used in three different places of the application shown as _config1, config2, config3_. In one of the cases, the business logic requires the Duration value to be twice that in configuration. Since the real configuration helper reaches out to the database for its values, it was decided to cache the values after the first call. The ConfigurationHelper uses '_[Singleton Pattern](https://en.wikipedia.org/wiki/Singleton_pattern)_ to achieve the caching Below is the implementation. Do you see any problems?

```csharp
{
    var config1 = ConfigurationHelper.Get();
    Console.WriteLine(config1);
    ...
    var config2 = ConfigurationHelper.Get();
    config2.Duration = config2.Duration * 2;
    Console.WriteLine(config2);
    ...
    var config3 = ConfigurationHelper.Get();
    Console.WriteLine(config3);
}

public class ConfigurationHelper
{
    private static Configuration configuration;
    public static Configuration Get()
    {
        if (configuration == null)
            configuration = new Configuration { Duration = 1 };

        return configuration;
    }
}

public class Configuration
{
    public int Duration { get; set; }
}
```

The first caller will get the configuration value 1, as expected. The second caller also gets the configuration value 1, but it goes on to set the value as two times, so it becomes 2. The third caller, which does not have any idea of the second caller or its specific business requirements also gets the configuration value as 2. They get a wrong configuration because the second caller updated the same object that the ConfigurationHelper holds. Again this is a side effect of how the ConfigurationHelper returns the configuration. There are two or more ways to solve this problem. The ConfigurationHelper class can return a new instance of the Configuration class every time someone requests for it. To return a new instance requires removing the private variable and the conditional check associated with it. Removing the check is similar to the defensive copying that we discussed in the previous example and also every call to get the configuration, now needs to hit the database. One could argue that only one caller mutates the object and it is unnecessary to create a new instance for the rest. We can remove the public setter's on the Configuration class properties. Without a setter, the second caller cannot change the Duration property of the Configuration class. Removing the setter means that we add a constructor as well to take in the parameters that it requires as below.

```csharp
public class Configuration
{
    public int Duration { get; private set; }

    public Configuration(int duration)
    {
            Duration = duration;
    }
}
```

The above ensures that nobody can change the value of the configuration object once created. So the second caller can longer assign the new duration value to the same object. If it wants to continue using a configuration object it needs to create a new Configuration object with the new duration. If there are more properties on the configuration object you can create extension methods like WithDuration to create a new Configuration class copying all the values as is from the old object and replace just the Duration.

```csharp
public static class ConfigurationExtension
{
    public static Configuration WithDuration(this Configuration configuration, int duration)
    {
        return new Configuration(duration, configuration.OtherValue);
    }
}
```

As we have seen the above two cases, mutation can cause undesired effects unless those are intended for. It does not mean that mutating is bad and you should stop it immediately. But if you start writing your code using immutable types, [Value Objects](/blog/thinking-beyond-primitive-values-value-objects/), etc. you will slowly move to a point where you no longer need to mutate values. When you do not mutate state, it is easier to reason about code. You no longer need to wade through those method calls to find who is changing the value of a property. Immutability is one of the key features of functional languages and changes how programs are written. You take away most of the problems involved in multi-threading when a function can no longer mutate the state of the object. So the next time you make change check if you are changing the state of the object, think twice and see if you can find a way around!

**References:**

- [Mutation](http://web.cs.wpi.edu/~cs2102/common/kathi-notes/mutation-part2.html)
- [Mutability & Immutability](http://web.mit.edu/6.005/www/fa15/classes/09-immutability/)
- [Mutable State](https://www.cs.utexas.edu/~wcook/anatomy/anatomy.htm#Mutable)
