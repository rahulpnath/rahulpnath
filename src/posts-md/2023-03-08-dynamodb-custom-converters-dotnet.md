---
title: Learn How to Map Complex .NET Types to DynamoDB using Custom Converters
slug: dynamodb-custom-converters-dotnet
date_published: 2023-03-08T08:00:30.000Z
date_updated: 2025-01-09T19:18:11.000Z
tags: AWS, DynamoDB
---

DynamoDB supports using custom types in your Documents.

Based on your programming language, If there is no direct mapping for these types to Amazon DynamoDB types, you need to specify additional information on how to map them.

Custom Converters allow specifying custom maps for these types in DynamoDB.

In this article, let’s learn how to use custom types and specify custom converters to save these types to your DynamoDB documents.

*This article is sponsored by AWS and is part of my [.NET on AWS Series](__GHOST_URL__/blog/tag/aws/).*

## .NET Complex Types and DynamoDB

The .NET DynamoDB SDK, by default, supports a set of primitive .NET data types, collections, and a few other data types. 

You can find the [full list of Supported data types here](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DotNetSDKHighLevel.html#DotNetDynamoDBContext.SupportedTypes) and also the associated mapping to the DynamoDB type.
[

AWS DynamoDB For The .NET Developer: How To Easily Get Started

Learn how to get started with AWS DynamoDB with .NET Core by updating the default ASP NET Web API template to use DynamoDB as it’s data store. We will learn to do basic Creat, Read, Update and Delete operations from the API.

![](__GHOST_URL__/content/images/size/w256h256/2022/10/logo-512x512.png)Rahul NathRahul Pulikkot Nath

![](__GHOST_URL__/content/images/aws_dynamodb.jpg)
](__GHOST_URL__/blog/aws-dynamodb-net-core/)
A complex type is a group of other primitive types or complex types in .NET.

When you use custom .NET classes as properties in a DynamoDB item automatically serializes it as a JSON object.

> *.NET Complex Types with a default constructor is automatically serialized to JSON object*.

This behavior is the same as when specifying complex types in API return data.

For example, the below `Wind` class, when used in a DynamoDB document object, gets serialized as a JSON object with the two properties.

    public class Wind
    {
        public decimal Speed { get; set; }
        public string Direction { get; set; }
    }
    

The .NET SDK automatically handles this, and we don’t need to do anything additional for it.

***The only thing to ensure is that the class has a default constructor. ***

If there is no default constructor on the type, you need to specify a custom converter. We will explore this further when looking at the Value Objects in .NET.

## .NET Enum Types and DynamoDB

When using Enumeration Types in .NET, they are automatically converted into their equivalent [underlying type value (by default *int*).](https://aws.amazon.com/blogs/developer/dynamodb-datamodel-enum-support/)

However, if you want the Enumeration values to be converted to their equivalent string values and saved to DynamoDB, you can do that using a Custom Converter.

### Enum To String Converter for DynamoDB

Storing Enumerations as string values makes it easier to understand the property values when looking at the raw data.

To add a custom converter, we need to implement the `IPropertyConverter` interface. The interface has two methods that we must implement - `FromEntry` and `ToEntry`.

As you would have guessed, these methods convert the .NET object to a DynamoDB item (`DynamoDBEntry`) and from DynamoDB back to the .NET object.

    public class DynamoEnumStringConverter < TEnum >: IPropertyConverter 
    {  
      public object FromEntry(DynamoDBEntry entry) 
      {
        return (TEnum) Enum.Parse(typeof (TEnum), entry.AsString());
      } 
    
      public DynamoDBEntry ToEntry(object value) 
      {
        return new Primitive(value.ToString());
      }
    }

All we need to do in the above converter is to return the Enum ToString to convert to DynamoDB type and use the `Enum.Parse` method to convert it back to Enum type.

## Configuring DynamoDB Converters

With the converter ready to go, we need to apply this to be used by the DynamoDB SDK.

There are two ways you can do this, and let's explore both of them.

### Configure Converter at Property Level

To apply the DynamoDB Custom Converter on a type, we use the `DynamoDBProperty` attribute and specify the Converter type, as shown below.

    public class WeatherForecast
    {
        ...
        [DynamoDBProperty(typeof(DynamoEnumStringConverter<WeatherType>))]
        public WeatherType WeatherType { get; set; }
        public Wind Wind { get; set; }
    }
    
    public enum WeatherType
    {
        None,
        Sunny,
        Cloudy,
        Windy,
        Rainy,
        Stormy
    }
    

When reading and writing the item from DynamoDB, the converter is applied to convert between .NET and DynamoDB representation.

The converter gets applied to all the properties that have the `DynamoDBProperty` attribute set with the custom converter type.

### Configure Converter on DynamoDBContext

In the above scenario, we explicitly applied the DynamoDB Custom Converter on the .NET Property that we wanted the converter applied on.

If we have additional properties of the same type in the same DynamoDB item or other table items, we must duplicate the attribute on all the properties.

To avoid duplicating the converter, specify the DynamoDB converter at the DynamoDB context level. This applies to all the properties matching the converter type saved/read using the DynamoDB context.

The below code sets up the DynamoDB Customer converter on the `ConverterCache` property on the `DynamoDBContext` class.

    var dynamoDBContext = new DynamoDBContext(dynamoDbClient);
    dynamoDBContext.ConverterCache
         .Add(typeof(WeatherType), new DynamoEnumStringConverter<WeatherType>());
    builder.Services.AddSingleton<IDynamoDBContext>(dynamoDBContext);
    

This is set up in the `Program.cs` class where we set up the Dependency Injection of the DynamoDBContext class for our application.

## .NET Value Objects and DynamoDB

Objects that are equal or the same because of the value of the properties are referred to as [ValueObject](https://martinfowler.com/bliki/ValueObject.html). 

In C#, by default, two objects are equal only if they are the same instance. However, you can change the default behavior by overriding the `Equals` and `GetHashCode` methods. 

You can find a sample implementation of a [ValueObject here.](https://learn.microsoft.com/en-us/dotnet/architecture/microservices/microservice-ddd-cqrs-patterns/implement-value-objects#value-object-implementation-in-c)

Using the `ValueObject` reference implementation as a base class below is a `Temperature` Value Object, which has two properties - `Degree` and `TemperatureType`.

    namespace dynamodb_querying
    {
        public class Temperature : ValueObject
        {
            public decimal Degree { get; private set; }
            public TemperatureType Type { get; private set; }
    
            public Temperature(
    decimal degree, TemperatureType type)
            {
                Degree = degree;
                Type = type;
            }
    
            protected override IEnumerable<object> GetEqualityComponents()
            {
                yield return Degree;
                yield return Type;
            }
        }
    
        public enum TemperatureType
        {
            Celsius,
            Farenheit
        }
    

Value Objects are very similar to .NET Complex Types when saving to DynamoDB.

They get serialized to JSON structure if they have a default constructor.

However, with Value Objects, you are less likely to have a default constructor.

### .NET Value Object DynamoDB Converter

The below custom converter is for the .NET Value Object Type.

For example, I want to save the `Temperature` as a custom string in DynamoDB - *20°C, 35*°F, etc.

    public class DynamoTemperatureConverter : IPropertyConverter
    {
        public object FromEntry(DynamoDBEntry entry)
        {
            if (entry != null)
            {
                var temperatureString = entry.AsString();
                if (temperatureString != null)
                {
                    var temps = temperatureString.Split("°", StringSplitOptions.None);
                    if (temps.Length == 2)
                    {
                        var unit = temps[1] switch
                        {
                            "C" => TemperatureType.Celsius,
                            "F" => TemperatureType.Farenheit,
                            _ => throw new NotImplementedException("Unknown Temperature Type")
                        }; ;
    
                        return new Temperature(Decimal.Parse(temps[0]), unit);
                    }
                }
            }
    
            return null;
        }
    
        public DynamoDBEntry ToEntry(object value)
        {
            if (value is Temperature temperature)
            {
                var unit = temperature.Type == TemperatureType.Celsius ? "C" : "F";
                return new Primitive($"{temperature.Degree}°{unit}");
            }
    
            return null;
        }
    }
    

Based on the `TemperatureType` value, the above code switches between °C and °F when saving the Temperature to DynamoDB.

When reading the value back, it splits the string into a known format and creates the `Temperature` object using its constructor.

I hope this helps you understand how to use custom converters in DYnamoDB and convert data as required when saving to DynamoDB.

🔗Full [Source Code](https://rahulpnath.visualstudio.com/YouTube%20Samples/_git/dynamodb-converters) for the examples.
