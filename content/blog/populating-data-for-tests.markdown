---
author: [Rahul Nath]
title: 'Populating Data for Tests'

tags:
  - TDD
  - Testing
  - AutoFixture
date: 2017-03-07
completedDate: 2017-02-15 15:59:53 +1100
keywords:
description: Different scenarios of test data generation.
thumbnail: ../images/test_data.jpg
---

Populating data for tests is the section of the test that usually ends up making tests more coupled with the code that it is testing. Coupling makes tests more fragile and refactoring code harder because of breaking tests. We should try to avoid coupling with the implementation details when writing tests. Let us see a few options that we have to populate test data and constructing object graphs (chain of objects branched off from the root object). I use [xUnit.net](https://xunit.github.io/) as my test framework, but you can use these techniques in your choice of framework.

[![Populating Test Data](../images/test_data.jpg)](http://xunitpatterns.com/Data-Driven%20Test.html)

Let's start with some simple tests on a Customer class shown below.

```csharp
public class Customer
{
    public Guid Id { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string FullName
    {
        get { return FirstName + " " + LastName; }
    }

    public Address Address { get; set; }
}
```

Let's say we need to test that the FullName property returns as expected. We will use a _Theory_ type tests for testing different combinations of first and last name. xUnit.net includes support for two different major types of unit tests: facts and theories

> _Facts are tests which are always true. They test invariant conditions._

> _Theories are tests which are only true for a particular set of data._

Theories allow us to create parameterized tests with which we can run a given test with different parameter options. Like in this example we need to test the Customer class with different set of First and Last Name combinations. As you can see below the test is attributed with Theory Attribute, and we use the InlineData attribute to pass static values to the test. Using these parameters we are now able to test for different combinations of first and last names. The test populates only the required properties on Customer object for testing FullName.

```csharp
[Theory]
[InlineData("Adobe", "Photoshop", "Adobe Photoshop")]
[InlineData("Visual", "Studio", "Visual Studio")]
[InlineData("Rode", "Podcaster", "Rode Podcaster")]
public void CustomerFullNameReturnsExpected(string firstName, string lastName, string expected)
{
    // Fixture setup
    var customer = new Customer() { FirstName = firstName, LastName = lastName };
    // Exercise system
    var actual = customer.FullName;
    // Verify outcome
    Assert.Equal(expected, actual);
    // Teardown
}
```

> _Tests help refine the public API as they are the first consumers_

The tests above acts as a clue indicating that the three properties - FirstName, LastName, FullName are related and go hand-in-hand. These tests are a strong indication that these properties can be grouped together into a class and possibly tested separately. We can extract these properties into a [Value Object](/blog/thinking-beyond-primitive-values-value-objects/) for e.g. Name. I will not go into the implementation details of that, and I hope you can do that you own.

The above tests still have a high dependency on the code that it is testing - **_the constructor_**. Imagine if we had a lot of such tests that constructs the Consumer class inline in the setup phase. All tests will break if the class constructor changes. We saw in the [refactoring to remove constructor dependency](/blog/refactoring-test-code-removing-constructor-dependency/) how to remove such dependencies and make the tests independent of the constructor dependencies. We can introduce Object Mother or Test Data Builder pattern as mentioned in the article. Optimizing further we can also use [AutoFixture](https://github.com/AutoFixture/AutoFixture) to generate test data. Moving into these patterns or AutoFixture brings in an added benefit as well; the rest of properties on the Customer class also gets populated by default.

### Explicitly Setting Properties

By introducing AutoFixture, we no longer need to create the Customer object explicitly. We can use the Fixture class generate a Customer class for us. Using AutoFixture, this can be achieved in at least two ways (I am not sure if there are more ways of doing this).

```csharp
// Using Fixture class
[Theory]
[InlineData("Adobe", "Photoshop", "Adobe Photoshop")]
[InlineData("Visual", "Studio", "Visual Studio")]
[InlineData("Rode", "Podcaster", "Rode Podcaster")]
public void CustomerFullNameReturnsExpected(string firstName, string lastName, string expected)
{
    // Fixture setup
    var fixture = new Fixture();
    var customer = fixture.Build<Customer>()
        .With(a => a.FirstName, firstName)
        .With(a => a.LastName, lastName)
        .Create();
    // Exercise system
    var actual = customer.FullName;
    // Verify outcome
    Assert.Equal(expected, actual);
    // Teardown
}
```

```csharp
// Using Injected Object
[Theory]
[InlineAutoData("Adobe", "Photoshop", "Adobe Photoshop")]
[InlineAutoData("Visual", "Studio", "Visual Studio")]
[InlineAutoData("Rode", "Podcaster", "Rode Podcaster")]
public void CustomerFullNameReturnsExpected(string firstName, string lastName, string expected, Customer customer)
{
    // Fixture setup
    customer.FirstName = firstName;
    customer.LastName = lastName;
    // Exercise system
    var actual = customer.FullName;
    // Verify outcome
    Assert.Equal(expected, actual);
    // Teardown
}
```

In both cases, we explicitly set the required properties. The above test is similar to the previous test that we wrote without AutoFixture. But no longer are we dependent on the constructor. In the second way of using AutoFixture I used _InlineAutoData_ attribute, that is part of _Ploeh.AutoFixture.Xunit2_. This attribute automatically does the fixture initialization and injects the Customer object for us. For all the values that it can match from the inline parameter list, it uses the provided values. It starts generating random values once all the parameters passed inline are used. In this case, only Customer object is created by AutoFixture.

### AutoFixture and Immutable types

When using immutable types or properties with private setters, we cannot set the property value after it is created.

> _AutoFixture was originally build as a tool for Test-Driven Development (TDD), and TDD is all about feedback. In the spirit of GOOS, you should listen to your tests. If the tests are hard to write, you should consider your API design. AutoFixture tends to amplify that sort of feedback._

> -_[Mark Seemann](http://stackoverflow.com/a/20816487/1948745) (creator of AutoFixture)_

In these cases, the suggested approach is something closer to the manual [Test Data Builder](http://www.natpryce.com/articles/000714.html) we saw in the [refactoring example](/blog/refactoring-test-code-removing-constructor-dependency/). We can either have an explicit test data builder class or define extension methods on the immutable type such that it changes just the specified property and returns all other values same, as shown below.

```csharp
public class Name
{
    public readonly string FirstName;
    public readonly string LastName;
    public string FullName
    {
        get
        {
            return FirstName + " " + LastName;
        }
    }

    public Name(string firstName, string lastName)
    {
        // Enforce parameter constraints
        FirstName = firstName;
        LastName = lastName;
    }

    public Name WithFirstName(string firstName)
    {
        return new Name(firstName, this.LastName);
    }
}
```

As shown the _WithFirstName_ method returns a new Name class with just the first name changed. Again we do not need these _WithXXX_ methods for all the properties. Only when there is a need to change any of the property values as part of the requirement do we need to introduce such methods and even test it. This again drives to the above point of using tests to guide the API design, from the feedback.

### Customization

In cases where we have validations in constructor to hold the class constraints, we cannot rely on the random values generated by AutoFixture. For example.

- The string should be at least ten characters in length for a Name class
- Start date should be less than the End date for a date range class

Without any custom code if we are to rely on AutoFixture to generate us, such classes, the tests will not be predictable. Depending on the random value that AutoFixture generates it might create a valid instance or throw an exception. To make this consistent, we can add Customization to ensure predictability.

For the DateRange class below we can add the following Customization.

```csharp
public class DateRange
{
    public readonly DateTime EndDate;
    public readonly DateTime StartDate;

    public DateRange(DateTime startDate, DateTime endDate)
    {
        if (endDate < startDate)
            throw new Exception("End date cannot be less than the start date");

        StartDate = startDate;
        EndDate = endDate;
    }
}
```

```csharp
public class DateRangeCustomization : ICustomization
{
    public void Customize(IFixture fixture)
    {
        fixture.Customizations.Add(new DateRangeSpecimenBuilder());
    }
}

public class DateRangeSpecimenBuilder : ISpecimenBuilder
{
    public object Create(object request, ISpecimenContext context)
    {
        var requestAsType = request as Type;
        if (typeof(DateRange).Equals(requestAsType))
        {
            var times = context.CreateMany<DateTime>();
            return new DateRange(times.Min(), times.Max());
        }

        return new NoSpecimen();
    }
}
```

The customization gets invoked every time a DateRange object is requested using the fixture. It then invokes this custom code that we have added in and creates a valid DateRange object. For the tests use the customization as part of the fixture either using a custom data attribute or explicitly adding the customization into the Fixture class.

### Mocking behavior

[Mock Objects](http://xunitpatterns.com/Mock%20Object.html) is a popular way to unit test classes in isolation. For the external dependencies that a [System Under Test](http://xunitpatterns.com/SUT.html) (SUT) has, the dependencies are mocked using a mocking framework. In these cases, we can setup the external dependencies to return different values as we expect for different tests and test the logic of the SUT and how it responds. Such tests are usually more coupled with the implementation as we have to setup the mocks prior. So we need to have an understanding of the return values expected from dependencies and the parameters expected by the dependencies. I use Moq framework for mocking, and AutoFixture has a library that helps integrate well with it.

```csharp
public HttpResponseMessage Get(Guid id)
{
    var customer = CustomerRepository.Get(id);

    if (customer == null)
        return Request.CreateResponse(HttpStatusCode.NotFound, "Customer not Found with id " + id);

    return Request.CreateResponse(HttpStatusCode.OK, customer);
}
```

```csharp
[Theory]
[InlineAutoMoqData]
public void CustomerControllerGetWithNoCustomerReturnsNotFound(
    Guid customerId,
    [Frozen]Mock<ICustomerRepository> customerRepository,
    CustomerController sut)
{
    // Fixture setup
    customerRepository.Setup(a => a.Get(customerId)).Returns(null);
    var expected = HttpStatusCode.NotFound;

    // Exercise system
    var actual = sut.Get(customerId).StatusCode;

    // Verify outcome
    Assert.Equal(expected, actual);
}
```

The tests above uses [InlineAutoMoqData attribute](http://blog.nikosbaxevanis.com/2012/07/31/autofixture-xunit-net-and-auto-mocking/) which is a customized xUnit data attribute that uses Moq framework to inject dependencies. The `Mock<ICustomerRepository>` represents a mocked interface implementation. Behavior is setup on the mock using the Setup method. By using [Frozen](http://blog.ploeh.dk/2010/03/17/AutoFixtureFreeze/) attribute for the Mock parameter, we tell AutoFixture to create only one instance of the mocked object and then use the same instance for any future requests of that type. This forces the same instance of the repository to be injected into the CustomerController class as well when it asks for a ICustomerRepository to AutoFixture.

Creating test data is an important aspect of any test. Making sure that you minimize the dependencies on the implementation detail is important to make your tests more robust. This allows the code to be refactored as long as some of the core contracts that we are testing remain the same. AutoFixture helps minimize the code in [Fixture Setup phase](http://xunitpatterns.com/Four%20Phase%20Test.html), which otherwise tends to grow bigger. Hope this helps you with your tests!
