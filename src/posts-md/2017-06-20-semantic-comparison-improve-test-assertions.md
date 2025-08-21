---
title: "Semantic Comparison: Improve Test Assertions"
slug: semantic-comparison-improve-test-assertions
date_published: 2017-06-20T00:00:00.000Z
date_updated: 2024-11-28T02:15:50.000Z
tags: Testing
excerpt: SemanticComparison makes it easier to compare instances of various objects to each other and improve test assertions.
---

One of the traits of a good unit test is to have just [one Assert statement.](http://osherove.com/blog/2005/4/14/try-to-avoid-multiple-asserts-in-a-single-unit-test.html).

> *Consider Assert failures as symptoms of a disease and Asserts as indication points or blood checks for the body of the software. The more symptoms you can find, the easier the disease will be to figure out and remove. If you have multiple asserts in one test - only the first failing one reveals itself as failed and you lose sight of other possible symptoms.*

> -[Roy Osherove](http://osherove.com/)

When a test with multiple asserts fails, it is hard to tell the exact reason of test failure. To get more details on the actual failure we either have to debug the tests or look into the stack trace.

## Tests With Multiple Assertions

Many times we end up needing to assert on more than one properties or behavior. Let's look at a few such examples and see how we can refactor the tests. *I have excluded the actual code that is getting is tested here as it is easy to understand what that will look like from the tests. (Drop a comment otherwise)*

**Example 1:** In the below test we have a *Name* class that represents FirstName and LastName of a user. It exposes a *Parse* method to make it easy for us to create a Name object from a string. Below are some tests for the Parse method. The test has multiple assertions to confirm that the first and last name properties get set as expected.

    [Theory]
    [InlineData("Rahul", "Rahul", "")]
    [InlineData("Rahul Nath", "Rahul", "Nath")]
    [InlineData("Rahul P Nath", "Rahul", "P Nath")]
    public void FirstNameOnlyProvidedResultsInFirstNameSet(
       string name,
       string expFirstName,
       string expLastName)
    {
        var actual = Name.Parse(name);
    
        Assert.Equal(expFirstName, actual.FirstName);
        Assert.Equal(expLastName, actual.LastName);
    }
    

**Example 2:** The below test is for the *Controller* class to confirm that the *CustomerViewModel* passed to the *Post* method on the controller saves the *Customer* to the repository. The assert statement includes multiple properties of the customer object, which is just a shorthand version of writing multiple such assert statements on each of those properties.

    [Theory, AutoWebData]
    public void PostSavesToRepository(
        CustomerViewModel model,
        [Frozen]Mock<ICustomerRepository> customerRepository,
        CustomerController sut)
    {
      var expected = model.ToCustomer();
    
      sut.Post(model);
    
      customerRepository.Verify(a =>
        a.Upsert(It.IsAny<Customer>(customer =>
            customer.Name == expected.Name &&
            customer.Age == expected.Age &&
            customer.Phone == customer.Phone))
    }
    

**Example 3:** The below test ensures that all properties are set when transforming from DTO to domain entity (or any such object transformations at system boundaries). The test asserts on every property of the class.

    //  Comparing different object types
    [Theory]
    [AutoMoqData]
    public void AllowanceToDomainModelMapsAllProperties(
        Persistence.Allowance allowance,
        int random)
    {
        allowance.EndDate = allowance.StartDate.AddDays(random);
    
        var actual = allowance.ToDomainModel();
    
        Assert.Equal(allowance.ClientId, actual.ClientId);
        Assert.Equal(allowance.Credit, actual.Credit);
        Assert.Equal(allowance.Data, actual.Data);
        Assert.Equal(allowance.StartDate, actual.Period.StartDate);
        Assert.Equal(allowance.EndDate, actual.Period.EndDate);
    }
    

## Semantic Comparison Library

[Semantic Comparison](https://www.nuget.org/packages/SemanticComparison/) is a library that allows deep comparison of similar looking objects. Originally part of [AutoFixture](__GHOST_URL__/blog/autofixture-make-your-unit-tests-robust/) library, it is also available as a separate [Nuget package](https://www.nuget.org/packages/SemanticComparison/).

> *SemanticComparison makes it easier to compare instances of various objects to each other. Instead of performing a normal equality comparison, SemanticComparison compares objects that look semantically similar - even if they are of different types*

Using SemanticComparison, we can compare two objects and compare their properties for equality. It allows including/excluding properties when comparing objects.

### Refactoring Tests

**Example 1:** The *Name* is a perfect case for being a [Value Object](__GHOST_URL__/blog/thinking-beyond-primitive-values-value-objects/). In this case, the class will override Equals, and it will be easier for us to write the tests. Converting to a Value Object is one of the cases where we [use tests as a feedback to improve code](__GHOST_URL__/blog/tests-as-a-feedback-tool/). But in cases where you do not have the control over the class or do not want to make it a value object, we can use SemanticComparison to help check for equality as shown below.

    [Theory]
    [InlineData("Rahul", "Rahul", "")]
    [InlineData("Rahul Nath", "Rahul", "Nath")]
    [InlineData("Rahul P Nath", "Rahul", "P Nath")]
    public void FirstNameOnlyProvidedResultsInFirstNameSet(
       string name,
       string expFirstName,
       string expLastName)
    {
        var expected = new Name(expFirstName, expLastName);
    
        var actual = Name.Parse(name);
    
        expected
            .AsSource()
            .OfLikeness<Name>()
            .ShouldEqual(actual);
    }
    

**Example 2:** Using SemanticComparison we can remove the need of asserting on each of the properties. In the below case since the Customer Id is set to a new Guid in the ToCustomer method, I ignore the Id property from the comparison using *Without*. When the *expected* objects gets compared against the *actual* all properties except *Id* will be compared for equality. Any number of properties can be excluded by chaining multiple *Without* methods.

    [Theory, AutoWebData]
    public void PostSavesToRepository(
        CustomerViewModel model,
        [Frozen]Mock<ICustomerRepository> customerRepository,
        CustomerController sut)
    {
      var customer = model.ToCustomer();
      var expected = customer
          .AsSource()
          .OfLikeness<Customer>()
          .Without(a => a.Id);
    
      sut.Post(model);
    
      customerRepository.Verify(a =>
        a.Upsert(It.IsAny<Customer>(actual =>
            expected.ShoudEqual(actual)));
    }
    

**Example 3:** Using SemanticComparison we can remove the asserts on every property and also set custom comparisons. The StartDate and EndDate on the persistence entity are converted into a DateRange object (Period). By using the *With* method in combination with the *EqualsWhen* method we can set custom comparison behavior that needs to be performed when comparing objects. The same test will hold true even if we add new properties and will force mapping to be updated if any of the property mappings is missed. Here we also see how SemanticComparison can compare two different types.

    // Comparing different object types
    [Theory]
    [AutoMoqData]
    public void AllowanceToDomainModelMapsAllProperties(
        Persistence.Allowance allowance,
        int random)
    {
        allowance.EndDate = allowance.StartDate.AddDays(random);
    
        var actual = allowance.ToDomainModel();
    
        allowance
            .AsSource()
            .OfLikeness<Allowance>()
            .With(a => a.Period)
            .EqualsWhen((p, m) => { return m.Period.StartDate == p.StartDate && m.Period.EndDate == p.EndDate; })
            .ShouldEqual(actual);
    }
    

Using SemanticComparison library, we reduce the dependencies on the actual implementation and extract that into a more generic representation. Fewer dependencies on the actual implementation code/properties make the tests more robust and adaptable to change. Hope this helps you get started with Semantic Comparison and improve on your test assertions.

**References:**

- [The Resemblance Idiom](http://blog.ploeh.dk/2012/06/21/TheResemblanceidiom/)
- [Introducing AutoFixture Likeness](http://blog.ploeh.dk/2010/06/29/IntroducingAutoFixtureLikeness/)
- [Resemblance and Likeness](http://blog.ploeh.dk/2012/06/22/ResemblanceandLikeness/)
