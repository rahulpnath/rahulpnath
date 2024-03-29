---
author: [Rahul Nath]
title: 'Testing Multiple Implementations of same Interface'
date: 2015-01-10 10:24:15

tags:
  - Dotnet
  - Testing
---

Often there are times when we need to test multiple implementations of the same interface. We would want to use the same test case against all the implementations so that we [don't repeat ourselves](http://en.wikipedia.org/wiki/Don%27t_repeat_yourself). In this post we will see how we can reuse the same test cases to test both the implementation, by running them against both the implementations.

> If you are just interested in the approach - The same test project dll is run twice using vstest.console, by setting an environment variable. Inside the test, (either in the assembly initialize or test initialize) register the appropriate implementations into a IoC container, based on the environment variable value.

Interested in the full implementation, then read on!

Since we are not much bothered about the actual interface and its implementation, I have a very simple interface as below, which calculates the length of the given string.There are two implementations for this that might have two different ways of calculating the length of the string given an input.

```csharp
public interface IFoo
{
    int GetLength(string input);
}
```

```csharp
public class Foo : IFoo
{
    public int GetLength(string input)
    {
        return input.Count();
    }
}

```

```csharp
public class Foo : IFoo
{
    public int GetLength(string input)
    {
        return input.Length;
    }
}
```

Though the sample has a simple interface, this might not be the case in a real life project. So the sample mimics a real time implementation structure - we have one interface project and two other projects that have the corresponding implementation. The implementations could also be in the same assembly and this would be applicable for those scenarios too, and can be made to work with some few tweaks in one of the steps (which I will mention when we are there). The test case project that will have the appropriate test cases.

```csharp
[TestMethod]
public void TestThreeLetterLength()
{
    var foo = this.container.Resolve<IFoo>();
    var returnValue = foo.GetLength("Foo");
    Assert.IsTrue(returnValue == 3);
}
```

The test case uses the IoC container to get the corresponding implementation of the interface, so it is not all about switching the registered implementation in the container. If this is only for the tests in this particular class then we could do this in the [TestInitialize](http://msdn.microsoft.com/en-us/library/microsoft.visualstudio.testtools.unittesting.testinitializeattribute.aspx) method. But most likely you would have multiple tests and also multiple interfaces that we are using. So we can do this in the [AssemblyInitialze](http://msdn.microsoft.com/en-us/library/microsoft.visualstudio.testtools.unittesting.assemblyinitializeattribute.aspx) for the assembly.

```csharp
var test = Environment.GetEnvironmentVariable(TestEnviromentVariable);

if (test == "1")
{
    container.RegisterType<IFoo, FooImplementation1.Foo>();
}
else if (test == "2")
{
    container.RegisterType<IFoo, FooImplementation2.Foo>();
}
```

The above implementation might work in cases where the number of interfaces are less and also in cases where we have fewer possibilities of implementations, but as soon as the number goes up we will again have to keep repeating the registrations and the if/else code. This is an IoC registration issue and is best handled using [IoC Registration by Convention](/blog/ioc-registration-by-convention/). We can have a configuration file matching the environment variable and have the assemblies that are to be loaded mentioned in that and pass only those assemblies to be explicitly registered into the convention registration logic. Even in cases where you have the implementations in the same assembly you can write your convention registration logics accordingly and decide what to register.

We can now run these test dll's using batch files by setting different environment variables as below. The bat files can be integrated into your build

```bash
set Foo.tests=2
echo "Testing for configuration 2"
msbuild TestingMultipleImplementations.sln
vstest.console FooTestImpl1\bin\Debug\FooTestImpl1.dll /logger:trx
```

Hope this helps some one trying to reuse test cases for multiple implementations of the same interface. One another way to solve this issue would be to create multiple csproj files and have the same test case classes referred to both the project files, but have the reference assemblies specific to implementations. So in this case we would have multiple test dll's created, which can be run individually. The advantage of going via this approach is that we could have test cases specific to implementations too and also reuse test cases that are same across implementations by referring them as linked files. But currently we did not want this flexibility and did not want to add multiple project files and make it difficult for the team. You can find the sample implementation [here](https://github.com/rahulpnath/Blog/tree/master/TestingMultipleImplementations). Do you reuse test cases like this? Do drop in with a comment on your thoughts.
