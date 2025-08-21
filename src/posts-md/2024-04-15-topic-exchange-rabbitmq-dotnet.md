---
title: "RabbitMQ Topic Exchange Explained"
slug: topic-exchange-rabbitmq-dotnet
date_published: 2024-04-15T05:53:17.000Z
date_updated: 2024-04-15T05:54:08.000Z
tags:
  - RabbitMQ
  - AWS
excerpt: >
  Topic Exchanges in RabbitMQ route messages based on wildcard matches on the message routing key specified on the queue binding.
  With Topic Exchanges, consumers can subscribe to topics they are interested in, like subscribing to a feed or individual tags.
---

An Exchange in RabbitMQ is a routing mechanism to send messages to queues.

RabbitMQ supports four Exchange Types: Topic Exchange, [**Direct Exchange**](__GHOST_URL__/blog/direct-exchange-rabbitmq-dotnet/)**, **[Fanout Exchange](__GHOST_URL__/blog/fanout-exchange-rabbitmq-dotnet/), [Headers Exchange](__GHOST_URL__/blog/headers-exchange-rabbitmq-dotnet/).

In this blog post, let's understand

- RabbitMQ Topic Exchange
- Routing messages in Topic Exchange
- RabbitMQ Topic Exchange From a .NET application.

I use [Amazon MQ](https://aws.amazon.com/amazon-mq/?ref=rahulpnath.com), a managed message broker service that supports ActiveMQ and RabbitMQ engine types, to host my RabbitMQ instance. However, you can use [one of the various options that RabbitMQ provides](https://www.rabbitmq.com/download.html?ref=rahulpnath.com) to host your instance,

*This article is sponsored by AWS and is part of my *[*RabbitMQ Series*](__GHOST_URL__/blog/tag/rabbitmq/)*.*

## What is a RabbitMQ Topic Exchange?

Topic Exchanges in RabbitMQ route messages based on wildcard matches on the message routing key specified on the queue binding.

With Topic Exchanges, consumers can subscribe to topics they are interested in, like subscribing to a feed or individual tags. 

Messages matching the criteria are sent to the appropriate queue.

> *If no bindings use wildcards, a Topic Exchange behaves like a Direct Exchange and you are better off using that.*

## Message Routing in RabbitMQ Topic Exchange

Topic exchanges route messages to one or many queues based on matching between a message routing key and the pattern on the Exchange binding key.

You can use wildcards when specifying a Binding key, and all messages with a routing key matching the wildcard are considered matches.
![](__GHOST_URL__/content/images/2024/04/image-4.png)
The message routing key in a Topic Exchange is usually a list of words delimited by dots. This makes it easy to use wildcards to filter messages. e.g. *color.orange, aus.nsw.syd, stock.usd.nyse *etc

### Binding Wildcards in Topic Exchange

When specifying the binding key, you can use two wildcard formats.

- # (Hash) → Matches zero or more words
- * (Star) → Match one word

For example let's say we have messages sent to the queue for a Weather API application. The routing key takes the format of *country.state.city* codes (*aus.nsw.syd*).

If a consumer is interested in all messages for the NSW state in Australia, it can specify the binding with key *aus.nsw.*. *This sends all messages with 'aus.nsw' to that.

Similarly, if a consumer is interested in all messages on Australia, it can specify '*aus.#*', which matches any message that starts with the aus. prefix.

## RabbitMQ Topic Exchange From .NET

We will use a NuGet package, [RabbitMQ.Client](https://www.nuget.org/packages/RabbitMQ.Client?ref=rahulpnath.com), to connect and send/receive messages from RabbitMQ.

If you are new to building RabbitMQ from .NET applications, check out the Getting Started article below.
[

Amazon MQ RabbitMQ: A Reliable Messaging Solution for Your .NET Projects

RabbitMQ is a powerful open-source message broker facilitating communication between systems or applications. Let’s learn how to get started using RabbitMQ on Amazon MQ from .NET application.

![](__GHOST_URL__/content/images/size/w256h256/2022/10/logo-512x512.png)Rahul NathRahul Pulikkot Nath

![](__GHOST_URL__/content/images/2024/01/rabbit-mq-dotnet.png)
](__GHOST_URL__/blog/amazon-mq-rabbitmq-dotnet/)
### Create and Send Messages to RabbitMQ Topic Exchange From .NET

Exchanges are created using the Channel.

The `ExchangeDeclare` the method takes in an exchange name and its type. Below is an example of creating a RabbitMQ Topic Exchange in .NET.

    var factory = new ConnectionFactory()
    {
        Uri = new Uri("YOUR RABBIT INSTANCE URI"),
        Port = 5671,
        UserName = "<USERNAME FROM CONFIGURATION FILE>",
        Password = "<PASSWORD FROM CONFIGURATION FILE>"
    };
    
    using var connection = factory.CreateConnection();
    using var channel = connection.CreateModel();
    
    var exchangeName = "weather_topic";
    channel.ExchangeDeclare(exchangeName, ExchangeType.Topic);

When sending a message, the sender specifies the Exchange and the routing key.

    var body = Encoding.UTF8.GetBytes(message);
    channel.BasicPublish(exchangeName, routingKey, null, body);

### Set up Binding on RabbitMQ Topic Exchange From .NET

Messages are routed to Queues from Exchanges using the Binding information.

To create a Queue, use the `QueueDeclare` method. It will create a new Queue only if one doesn't exist with the same name.

    var factory = new ConnectionFactory()
    {
        Uri = new Uri("YOUR RABBIT INSTANCE URI"),
        Port = 5671,
        UserName = "<USERNAME FROM CONFIGURATION FILE>",
        Password = "<PASSWORD FROM CONFIGURATION FILE>"
    };
    
    using var connection = factory.CreateConnection();
    using var channel = connection.CreateModel();
    
    var queueName = "nsw";
    channel.QueueDeclare(queueName, false, false, false, null);
    channel.QueueBind(queueName, "weather_topic", "aus.nsw.*");

The above code sets up a queue `nsw` with a binding on the `weather_topic` exchange with a binding key `aus.nws.*` that filters all messages for NSW state in Australia.
![](__GHOST_URL__/content/images/2024/04/image-5.png)AWS MQ RabbitMQ Management Console shows a Topic Exchange with the two bindings using wildcards.
To set up a Queue to capture all messages to Australia, let's create a new queue `aus` with the binding using the # (hash) wildcard, as shown below.

    var queueName = "aus";
    channel.QueueDeclare(queueName, false, false, false, null);
    channel.QueueBind(queueName, "weather_topic", "aus.#");

Whenever a message comes to the exchange for any state in Australia, a copy gets routed to the `aus` queue. Similarly, when a message arrives for any city in `nsw`, a copy gets sent to both `aus` and `nsw` queue.
![](__GHOST_URL__/content/images/2024/04/rabbitmq-topic-exchange-demo.gif)RabbitMQ Topic Exchange demo using different wildcard options.
