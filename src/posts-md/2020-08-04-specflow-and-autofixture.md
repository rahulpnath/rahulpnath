---
title: How To Easily Generate Data For SpecFlow Tests
slug: specflow-and-autofixture
date_published: 2020-08-04T00:00:00.000Z
date_updated: 2024-11-28T02:15:32.000Z
tags: Testing
excerpt: Automatically generate data using AutoFixture when writing SpecFlow tests.
---

I have been playing around with SpecFlow for writing tests at one of my recent clients.

> [SpecFlow](https://specflow.org/) is a .NET open-source framework for [Behavior Driven Development](https://specflow.org/bdd/) (BDD). BDD aims to create a shared understanding of how an application must behave.

The [Getting Started section](https://specflow.org/getting-started/) in the official documentation helped me set up the SpecFlow test project and get started with my first tests.

Populating data is an integral part of writing tests. Most of the time, we are forced to set up much more data than we care about for a test. This might be because of validation on an API endpoint, a [constructor forcing you to give valid values for all the properties](__GHOST_URL__/blog/constructor-and-constraints/). Setting up these unnecessary data pollutes the tests, makes writing tests less enjoyable. It also makes the tests tightly coupled and [hard to refactor](__GHOST_URL__/tag/refactoring/).

In this post, let's look at a simple test written in SpecFlow and how we can progressively improve it by removing explicit test data set up.

## Writing the First Test

Let's look at an API with a Customer endpoint, which takes in a Customer object and adds it to a data source. In the example code, I use an InMemorySource, which can easily be replaced to use an external store like a database.

> *The full source code for the sample is [available here](https://github.com/rahulpnath/Blog/tree/master/SpecFlow.AutoFixture). Check out each commit, if you want to go through each refactoring step as shown in this post.*

To set up the SpecFlow test project, I created a .Net Core project and added the below NuGet packages.

    Install-Package SpecFlow
    Install-Package  SpecFlow.Tools.MsBuild.Generation
    Install-Package SpecFlow.xunit
    Install-Package  xunit.runner.visualstudio
    Install-Package  Microsoft.AspNetCore.Mvc.Testing
    Install-Package Microsoft.NET.Test.Sdk
    Install-Package Shouldly -Prerelease
    

It installs [SpecFlow](https://www.nuget.org/packages/SpecFlow), [xunit](https://www.nuget.org/packages/xunit/) and [Shouldly](https://www.nuget.org/packages/Shouldly/) (for test assertions) and other related packages to get it all working together and allow tests to be run from the Visual Studio Test Explorer.

With the project all set up, let's get to our first test.

Below is a sample test for my API. As expected with BDD tests, it does not need much explanation on what it is going on.

    @subcutaneous
    Scenario: Add a Customer
        Given I POST a valid customer to the API
        When I GET the customer using  the API
        Then the result should be the customer
    

The test does use the same API twice (POST and a GET), which is not the best. One issue is when the test fails, you cannot tell whether it is the POST or the GET that is broken (unless we go digging in). But this is good enough for this example.

Below are the step definitions for the test.

    class CustomerSteps {
        private readonly TestContextFixture testContextFixture;
        private readonly ScenarioContext context;
        private readonly Customer customer;
    
        public CustomerSteps(
        TestContextFixture testContextFixture, ScenarioContext context) {
            this.testContextFixture = testContextFixture;
            this.context = context;
            this.customer = new Customer() {
                Id = Guid.NewGuid(),
                Age = 27,
                FirstName = "John",
                LastName = "Doe",
                Address = "101 Street, Unknown, 4444"
            };
        }
    
        [Given(@"I POST a valid customer to the API")]
        public async Task GivenIPOSTAValidCustomerToTheAPI() {
            using(var client = testContextFixture.CreateClient()) {
                await client.SendJsonContent("/customer", HttpMethod.Post, customer);
            }
        }
    
        [When(@"I GET the customer using  the API")]
        public async Task WhenIGETTheCustomerUsingTheAPI() {
            using(var client = testContextFixture.CreateClient()) {
                var actual = await client.GetJsonResult < Customer > ($ "/customer/{customer.Id}");
                context.AddActual(actual.Result);
            }
        }
    
        [Then(@"the result should be the customer")]
        public void ThenTheResultShouldBeTheCustomer() {
            var actual = context.GetActual < Customer > ();
            actual.ShouldBeEquivalentTo(customer);
        }
    }
    

The steps class uses the `TestContextFixture`, which provides us with a [in-memory test server for the Web API application](https://docs.microsoft.com/en-us/aspnet/core/test/integration-tests?view=aspnetcore-3.1) and a `ScenarioContext`. These are dependency injected and is supported out of the box with SpecFlow. SpecFlow, by default, comes with a simple dependency framework, [BoDi](https://github.com/gasparnagy/BoDi), created specifically for it.

I have defined a [few extension methods](https://github.com/rahulpnath/Blog/blob/master/SpecFlow.AutoFixture/SpecFlow.AutoFixture.Tests/HttpClientExtensions.cs) like `SendJsonContent`, `GetJsonResult`, `AddActual`, etc., to abstract away some of the code. Make sure to check out the full source code for more details.

The Customer class is a Data Transfer Object (DTO) class with a few properties for Name, Address, Age, etc. For this test, I don't care about the values of these properties. All I care about is that I have a fully populated customer object to make a post to the API.

I create the Customer class instance in the constructor of this Steps class explicitly and giving in all the dummy data. But if I need the same Customer class elsewhere (in a different Step definition class), I will have to duplicate it there. Now, this could be extracted into a helper class and reused, But still, I have to [update this class every time a new property is added](__GHOST_URL__/blog/refactoring-test-code-removing-constructor-dependency/) to the Customer class.

## Injecting Test Data Through Constructor

It would be nice if the fully populated Customer class can be injected into the Steps class just like the `TestContextFixture` and `ScenarionContext` is in the code above. It is possible with SpecFlow using the [BeforeScenario hook](https://docs.specflow.org/projects/specflow/en/latest/Bindings/Hooks.html). The BeforeScenario hook runs before executing each scenario. [See here](https://docs.specflow.org/projects/specflow/en/latest/Bindings/Context-Injection.html#advanced-options) for more details.

    [Binding]
    public class SpecFlowDomainDataHook {
        private readonly IObjectContainer objectContainer;
    
        public SpecFlowDomainDataHook(IObjectContainer objectContainer) {
            this.objectContainer = objectContainer;
        }
    
        [BeforeScenario]
        public void SetupDomainData() {
            this.objectContainer.RegisterFactoryAs(a => SetupCustomer());
        }
    
        private Customer SetupCustomer() {
            return new Customer() {
                Id = Guid.NewGuid(),
                Age = 27,
                FirstName = "John",
                LastName = "Doe",
                Address = "101 Street, Unknown, 4444"
            };
        }
    }
    

The IObjectContainer is the default BoDi container that SpecFlow uses to create the Steps instances when running the test. Since the container now has a registered instance of the Customer class that is fully populated, the Steps class can simply ask for a Customer object.

    public CustomerSteps(
        TestContextFixture testContextFixture,
        ScenarioContext context,
        Customer customer)
    {
        this.testContextFixture = testContextFixture;
        this.context = context;
        this.customer = customer;
    }
    

We don't have to create a Customer class explicitly again!

### Auto-Generate Test Data

In the BeforeScenario hook, we are still manually creating the Customer object and forced to specify all the dummy values. If a new property is added, we still need to update it here. We have only been able to move the problem to a different place; the problem still exists.

> [AutoFixture](https://github.com/AutoFixture/AutoFixture) is an Open Source Library that helps automate test data generation. It offers a generic implementation of the Test Data Builder Pattern.

[

Populating Data for Tests

Different scenarios of test data generation.

![](__GHOST_URL__/favicon.ico)Rahul NathRahul Pulikkot Nath

![](__GHOST_URL__/content/images/test_data.jpg)
](__GHOST_URL__/blog/populating-data-for-tests)
To setup AutoFixture, let's add the AutoFixture NuGet package to our test library. We can now start using it to generate dummy data for us.

    private Customer SetupCustomer() {
      var fixture = new Fixture(); // AutoFixture object
        return fixture.Create <Customer>();
    }
    

The `SetupCustomer` method can be rewritten like above to use AutoFixture. We no longer need to set up the data explicitly; AutoFixture will generate it automatically for us. Below is a sample data that AutoFixture generated for one of the test runs.

    {
      "Id": "32b024d9-ffc9-4ff7-b0bb-1b8b108ef1cf",
      "FirstName": "FirstName16db62fe-430f-4821-80ad-49fc19eb0d33",
      "LastName": "LastName6a6a4778-43a8-40a7-bafb-dbb8f2a473a2",
      "Address": "Address106a627a-491b-43b7-b99e-c3bd38896843",
      "Age": 207
    }
    

This is what we want - dummy data! We don't care about the actual values for the properties for these tests.

Now you might ask, at times, I do care of some of these property values.

*What do I do in that case?* - Don't worry; I will show you exactly how later below.

## Automating Data Generation for All Models & Entities

Are we not done yet?

Now I can automatically generate test data (in this example Customer) and inject it into out Steps classes. But let's say we have a new controller - Order.

I need to add a `SetupOrder` method to register the Order instance in the `SpecFlowDomainDataHook` explicitly. It is a painful and redundant.

    [BeforeScenario]
    public void SetupDomainData() {
      this.objectContainer.RegisterFactoryAs(a => SetupCustomer());
      this.objectContainer.RegisterFactoryAs(a => SetupOrder());
    }
    

Let's see how we can fix this so that I don't have to register each type explicitly.

Before we make any changes, let's understand what is going on here. We are telling the objectContainer (the default BoDi DI container) the object to use when anyone asks for a Customer or Order object. So to remove this, what we need is a generic way to specify instances (generated from AutoFixture) whenever it's asked for a DTO, Model or an Entity class. The default DI container shipped with SpecFlow has limited functionality, and I did not find an integration point for this.

### Setting up AutoFac As SpecFlow DI Container

[Autofac](https://autofac.org/) is a popular Inversion of Control container for .NET and provides a lot of features. SpecFlow does have official support for Autofac using [SpecFlow.Autofac](https://github.com/gasparnagy/SpecFlow.Autofac) NuGet package. Once installed, [setting up is straight forward](https://github.com/gasparnagy/SpecFlow.Autofac#usage). We need to add a public static method anywhere in the SpecFlow test project that returns an Autofac `ContainerBuilder` and tag the method with `[ScenarioDependencies]`

The `SpecFlowContainerBuilder` container class below registers Autofac as the container for SpecFlow. It registers all the step definitions into the container.

    public class SpecFlowContainerBuilder
    {
        [ScenarioDependencies]
        public static ContainerBuilder CreateContainerBuilder() {
            var builder = new ContainerBuilder();
            var stepDefinitions = typeof(SpecFlowContainerBuilder).Assembly.GetTypes()
          .Where(t = >Attribute.IsDefined(t, typeof(BindingAttribute))).ToArray();
            builder.RegisterTypes(stepDefinitions).SingleInstance();
    
            builder.RegisterSource(
          new AnyConcreteTypeNotAlreadyRegisteredSource(type = >!type.IsModelOrEntity()));
            // For Models and Entities let AutoFixture generate the object
            builder.RegisterSource(new DomainDataAutoPopulatedSource());
    
            return builder;
        }
    }
    

It also registers two [registration sources](https://autofaccn.readthedocs.io/en/latest/advanced/registration-sources.html).

> A registration source is a way to feed registrations into an Autofac component context dynamically (e.g., container or lifetime scope).

- `AnyConcreteTypeNotAlreadyRegisteredSource` - This is a registration source that Autofac ships with that allow us to resolve any concrete type from the container. Types need not be explicitly registered. (This just makes it easy to resolve any normal types that the tests need, like the TestContextFixture, etc.). You can also explicitly register if that's what you prefer.
- `DomainDataAutoPopulatedSource` - This Source helps resolve any domain/model types from AutoFixture.

    public class DomainDataAutoPopulatedSource : IRegistrationSource
    {
        public bool IsAdapterForIndividualComponents => false;
    
        public IEnumerable<IComponentRegistration> RegistrationsFor(
            Service service, Func<Service, IEnumerable<IComponentRegistration>> registrationAccessor)
        {
            var swt = service as IServiceWithType;
            if (swt == null || !swt.ServiceType.IsModelOrEntity())
                return Enumerable.Empty<IComponentRegistration>();
    
            object instance = null;
            try
            {
                var fixture = new Fixture();
                instance = new SpecimenContext(fixture).Resolve(swt.ServiceType);
            }
            catch (Exception)
            {
                return Enumerable.Empty<IComponentRegistration>();
            }
    
            return new[] { RegistrationBuilder.ForDelegate(swt.ServiceType, (c, p) => instance).CreateRegistration() };
        }
    
        public static bool IsModelOrEntity(Type type)
        {
            return type.IsModelOrEntity() || type.IsGenericModelOrEntity();
        }
    }
    

Whenever a request comes to Autofac to resolve a type that fits the `IsModelOrEntity` condition, it resolves the object instance from AutoFixture. AutoFixture will make sure to populate the object with dummy data and return that instance.

The `IsModelOrEntity` and `IsGenericModelOrEntity` are custom extension methods on type. All it does is check if the type is in the Model namespace in this example. You can extend this to match Assemblies or whatever type conditions you have based on where you have your DTO/Model/Entities defined.

    public static class TypeExtensions
    {
        public static bool IsModelOrEntity(this Type type)
        {
            if (type == null) return false;
    
            return type.Namespace == typeof(Customer).Namespace;
        }
    
        public static bool IsGenericModelOrEntity(this Type type)
        {
            if (type == null) return false;
    
            return type.IsGenericType &&
                type.GenericTypeArguments.Any(a => a.IsModelOrEntity());
        }
    }
    

With this setup, any time you add a DTO/Model dependency in your SpecFlow steps class as part of the constructor, it will automatically resolve it from AutoFixture and inject it with dummy data populated.

So if you want an Order for your test, all you need to do now is ask for it in the step contructor, and you will have it!

## Overriding Auto Populated Data

For some tests, you might be interested in a subset of the object's properties. Let's say for example the below test

    @unit
    Scenario: Full Name is First Name plus Last Name
        Given I have a valid customer
        When I set First name as 'Rahul' and Last name as 'Nath'
        Then the FullName must be 'Rahul Nath'
    

For the above test, I need a customer object, but I am interested in explicitly setting the `FirstName` and `LastName` to test the `FullName` property.

    [When(@"I set First name as '(.*)' and Last name as '(.*)'")]
    public void WhenISetFirstNameAsAndLastNameAs(string firstName, string lastName)
    {
        customer.FirstName = firstName;
        customer.LastName = lastName;
    }
    
    [Then(@"the FullName must be '(.*)'")]
    public void ThenTheFullNameMustBe(string expected)
    {
        customer.FullName.ShouldBe(expected);
    }
    

I can still have the Customer instance injected via the constructor and override just the FirstName and LastName properties, as shown above. AutoFixture [allows a lot of customization and extensions](__GHOST_URL__/blog/populating-data-for-tests/) to configure how objects get created. You can take advantage of it with SpecFlow, by overriding the fixture used in the `DomainDataAutoPopulatedSource` class.

Setting up test data is no more cumbersome when writing SpecFlow tests. I hope this helps you easily set up test data for your tests as well.

*You can find the [example source code used in this post here](https://github.com/rahulpnath/Blog/tree/master/SpecFlow.AutoFixture)*
