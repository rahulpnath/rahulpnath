---
author: [Rahul Nath]
title: 'IsRegistered on Unity Container for Generic Type'
date: 2015-01-14 22:31:51
  
tags:
  - Dependency Injection
keywords: 'ioc, unity, dependency injection, microsoft ioc'
description: 'This post just describes a bug that is there in the Unity (3.5.1404) IoC container, when using the IsRegistered extension method, to check for generic types and a possible fix for it.'
---

_This post just describes a bug that is there in the Unity (3.5.1404) IoC container, when using the IsRegistered extension method, to check for generic types and a possible fix for it._

[Unity](http://msdn.microsoft.com/en-us/library/ff647202.aspx) IoC container provides [IsRegistered](http://msdn.microsoft.com/en-us/library/microsoft.practices.unity.unitycontainerextensions.isregistered(v=pandp.51\).aspx) extension method, that can be used to check whether a registration exists for a given type and name (can be null too) combination. When a generic type is registered in the container and trying to check IsRegistered using a concrete typed version of the generic interface it returns false.

As shown in the below code snippet, calling IsRegistered on a non-generic interface(_IFooBar_) returns true, indicating that a registration exists. But for the generic interface(`IFooGeneric<>`), trying to check if a registration exists for a concrete type (`IFooGeneric<string>` - as only concrete types can be resolved from the container and an open generic type cannot be resolved) it returns false.

```csharp
IUnityContainer unityContainer = new UnityContainer();
unityContainer.RegisterType(typeof(IFooBar), typeof(FooBarImplementation));
unityContainer.RegisterType(typeof(IFooGeneric<>), typeof(FooGenericImplementation<>));

var hasFooBarRegistration = unityContainer.IsRegistered<IFooBar>(); // Returns true

var hasFooGenericStringRegistration = unityContainer.IsRegistered<IFooGeneric<string>>(); // Returns False
var fooGenericString = unityContainer.Resolve<IFooGeneric<string>>(); // Resolution Succeeds

```

The [IsRegistered method ](https://unity.codeplex.com/SourceControl/latest#source/Unity/Src/UnityContainerExtensions.cs) as shown below, loops through the list of available registrations looking for a match on the registered type and name. The '_typeToCheck_' is the type of the object that we are trying to resolve in IsRegistered - `typeof(IFooGeneric<string>)`, but the registered type is `typeof(IFooGeneric<>)`. Because of this the comparison fails and the registration does not pass the where clause of the query, causing the function to return _false_.

```csharp
var registration = from r in container.Registrations
                   where r.RegisteredType == typeToCheck && r.Name == nameToCheck
                   select r;
return registration.FirstOrDefault() != null;
```

To fix this, we would need to modify the where condition so that in cases where the RegisteredType is a generic type definition, it would compare with the generic type definition of '_typeToCheck_', as shown below.

```csharp
var genericTypeToCheck = typeToCheck.GetTypeInfo().IsGenericType
                         ? typeToCheck.GetGenericTypeDefinition()
                         : null;

var registration = from r in container.Registrations
                   where (r.RegisteredType.GetTypeInfo().IsGenericTypeDefinition
                   ? r.RegisteredType == genericTypeToCheck
                   : r.RegisteredType == typeToCheck)
                   && r.Name == nameToCheck
                   select r;
return registration.FirstOrDefault() != null;
```

A similar [issue](https://unity.codeplex.com/discussions/568979) was already raised in the unity discussions, which I feel was closed inappropriately.

> If a container can Resolve a particular type then it should also be able to return that it IsRegistered.

Please do be aware that using IsRegistered extensively has a [negative impact on performance](http://unity.codeplex.com/discussions/268223) as looping through the Registration looking for the name and type has [O(n) complexity](http://en.wikipedia.org/wiki/Big_O_notation). But that still does not justify the bug!.

_I have submitted a [pull request](https://unity.codeplex.com/SourceControl/network/forks/rahulpnath/isRegisteredForGenericTypes/contribution/7903) for the fix and it would be worth checking the latest comments on that to see if there are any better approaches or problems that I might have missed out with my fix!_
