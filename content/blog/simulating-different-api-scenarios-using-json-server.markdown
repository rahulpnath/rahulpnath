---
author: [Rahul Nath]
title: "Simulating Different Scenarios Using Fake JSON Server API"
  
date: 2020-04-21
tags:
  - Testing
  - TypeScript
  - Cypress
---

_How many times have you had to update the API code to return an empty list or throw an error to test edge case scenarios?_

_How do you demo these different API scenarios to someone?_

The pages and components of our application have different states. Most of these states depend on the data returned from the server via the API. Often it's hard to simulate the different scenarios for the API, and we stick with the 'happy path scenario' - the one that happens most of the time. Writing code or testing for the happy path scenario is easy, as the API endpoint is most likely to behave that way. It is tricky to develop or test the edge case scenarios and are often ignored or left untested.

Let's take an example of a simple list page of Quotes. Some of the scenarios for this endpoint are - no quotes available, some quotes available, request to server errors, and more. The 'happy path scenario' here is some quotes existing, and most of our development and testing will be against that. It will be good if we can simulate different application scenarios using a [FAKE JSON Server API](/blog/setting_up_a_fake_rest_api_using_json_server/). It will allow us to simulate any use case or scenario that we want, allowing us to write code for it. Not to mention that testing, demoing, and writing automated tests all becomes easier.

`youtube:https://www.youtube.com/embed/eUDi-DjU2Ko`
<br />

In this post, we will look at how to [set up a fake JSON Server API](/blog/setting_up_a_fake_rest_api_using_json_server/) to return data based on scenarios we specify. This post describes an approach that you can adapt to your application and the scenarios you have. If you are new to setting up a fake API, check out how to [Set up Up A Fake REST API Using JSON Server](/blog/setting_up_a_fake_rest_api_using_json_server/)

## Specifying Scenarios to JSON Server

To start with, we need to specify which scenario we are interested in when calling the API. A scenario could be specific to one API endpoint or multiple. On an API endpoint, the best place to pass extra data is request headers, as it is least intrusive. We need to send the scenarios only in our development environment and it does not hurt to add an extra header to every HTTP request.

> To request for a particular scenario to the FAKE API, we pass it as part of the 'scenarios' header.

Let's modify the _router.render_ in JSON Server to return the data based on the scenarios specified in the request header. Based on the values in the request header, we can filter the data and update the response.

```typescript
router.render = (req, res) => {
  const scenariosHeaderString = req.headers["scenarios"];
  const scenariosFromHeader = scenariosHeaderString
    ? scenariosHeaderString.split(" ")
    : [];

  ...
}
```

Below are some sample values that the header can have for our quote list scenario

```shell
// Different options that the scenarios header can have

scenarios: "open" // Only Quotes in open status
scenarios: "draft phone" // All quotes in draft and has a phone
scenarios: "error-quotes" // Server error getting the quotes
scenarios: "no-quotes" // Empty list of quotes
sceanrios: "" // All quotes
```

### Organizing Scenarios and Mock Data in JSON Server

For the mock data, let's add an extra attribute to indicate the scenarios that apply to that particular quote. Eg. The mock quotes defined in _quotes.ts_ is updated as below with an additional _sceanrios_ array property that takes in a list of scenarios applicable to the quote. Based on the state of the quote object the scenarios will differ. We filter the response data based on the scenarios attribute and return only the ones that match all attributes in the header.

For, e.g., when the scenario header is _'draft phone'_ only the quotes that have both values in the scenarios property are returned. To return an empty list send a scenario value that does not exists on any of the mock quotes; _'no-quotes'_ for example. When the scenarios header is empty, it returns all quotes. Handling error responses is a bit different and will look at it in detail a bit later.

```typescript
const quotes: (QuoteDto & Scenarios<QuoteScenario>)[] = [
  {
    scenarios: ["draft", "no-phone"],
    statusCode: QuoteStatusCode.Draft,
    customer: { ... },
    mobilePhone: null,
    ...
  },
  {
    scenarios: ["draft", "phone"],
    statusCode: QuoteStatusCode.Draft,
    customer: { ... },
    mobilePhone: { ... }
    ...
  },
  {
    scenarios: ["open", "phone"],
    statusCode: QuoteStatusCode.Open,
    customer: { ... }
    mobilePhone: { ... }
    ...
  },
];
```

> Mock quote data is still type safe using Intersection types feature of TypeScript.

The quote type is now an [Intersection Type](https://www.typescriptlang.org/docs/handbook/advanced-types.html#intersection-types)- (QuoteDto & `Scenarios<QuoteScenario>`)[] - that combines multiple types into one. This allows us to maintain type safety for the mock data, while also adding the new scenario property. To avoid typos on the scenarios, we have type safe scenarios list as shown below.

```typescript
export type QuoteScenario = "phone" | "no-phone" | "draft" | "open";
export type UserScenario = "admin" | "salesrep";

export interface Scenarios<T> {
  scenarios: T[];
}
```

Based on the [generic type T](https://www.typescriptlang.org/docs/handbook/generics.html), the scenarios property can have only the associated values. Based on your application and the scenarios applicable, add different types and values to represent them.

## Handling Scenarios and Modifying Response

A 'no-user' in the scenarios header must not filter out all qoutes from the quotes endpoint. For each endpoint there is a set of associated scenario values applicable. This is a super set (includes all and more) of the scenario type (QuoteScenario, UserScenario etc).

For an API request, we first filter out the scenarios in the header that apply to the current request endpoint using the _getScenariosApplicableToEndpoint_ method. The headers are filtered so that we do not use a filter that does not apply to the current endpoint and filter out all the data.

```typescript
router.render = (req, res) => {
    let data = res.locals.data;

    if (scenariosHeaderString && Array.isArray(data) && data.length > 0) {
      const scenariosApplicableToEndPoint = getScenariosApplicableToEndpoint(
        url,
        scenariosFromHeader
      );

      const filteredByScenario = data.filter((d) =>
        scenariosApplicableToEndPoint.every(
          (scenario) => d.scenarios && d.scenarios.includes(scenario)
        )
      );
      res.jsonp(filteredByScenario);
    } else res.jsonp(data);
  }
};

// filter scenarios header based no the endpoint url
export const scenariosForEndpoint = {
  "/api/quotes": ["phone", "no-phone", "draft", "open", "no-quotes"],
  "/api/users": ["admin", "salesrep", "no-user"],
};

export const getScenariosApplicableToEndpoint = (
  endpoint: string,
  scenarios: string[]
) => {
  const endpointScenarios = (scenariosForEndpoint[endpoint] as string[]) || [];
  return scenarios.filter((a) => endpointScenarios.includes(a));
};
```

The scenarios applicable to the current requested endpoint is used to filter the response data. Filtering the header scenarios can be expanded to include HTTP verbs (GET, PUT, POST, etc.) or any other criteria as required.

### Handling Error Scenarios

Error responses do not depend on the mock data and have a separate flow. A list of custom responses are in the '_customResponses.ts_' file. If the headers match any of the code and URL's for the custom response, then the 'response' property is returned for that request.

For e.g., If a request is for the '/api/quotes/' endpoint with 'error-quotes' in the scenarios header, the response is overridden to match the associated response property from the JSON object below. Expand the filtering to include other conditions (like HTTP verbs) if required.

```typescript
const responses = [
  {
    urls: ["/api/quotes"],
    code: "error-quotes",
    httpStatus: 500,
    respone: {
      errorMessage: "Unable to get Quotes data. ",
    },
  },
  {
    urls: ["/api/users/me"],
    code: "error-user",
    httpStatus: 500,
    respone: {
      errorMessage: "Unable to get user data. ",
    },
  },
];
```

The router.render method now handles this additional case to match the error responses as the first step.

```typescript
export const getCustomReponse = (url, scenarios) => {
  if (!scenarios || scenarios.length === 0) return null;

  return responses.find(
    (response) =>
      scenarios.includes(response.code) && response.urls.includes(url)
  );
};

router.render = (req, res) => {
  ...
  const customResponse = getCustomReponse(url, scenariosFromHeader);

  if (customResponse) {
    res.status(customResponse.httpStatus).jsonp(customResponse.respone);
  } else {
    ...
  }};
```

## Invoking Scenarios

When requesting the API, pass the scenarios header to activate the different scenarios. Based on the values in the scenarios header, JSON Server will filter out the response data. Below is a sample request made with 'draft' in scenarios header, and it returns only quotes that have the 'draft' scenarios applied to it.

```http
GET http://localhost:5000/api/quotes HTTP/1.1
Host: localhost:5000
scenarios: draft

HTTP/1.1 200 OK
[
  {
    "id": "1",
    "scenarios": [
      "draft",
      "no-phone"
    ],
    "statusCode": "Draft",
    "lastModifiedAt": "2020-03-01T14:00:00.000Z",
    "customerName": "Rahul",
    "mobilePhoneDescription": null
  },
  {
    "id": "2",
    "scenarios": [
      "draft",
      "phone"
    ],
    "statusCode": "Draft",
    "lastModifiedAt": "2020-03-01T14:00:00.000Z",
    "customerName": "Rahul",
    "mobilePhoneDescription": "iPhone X"
  }
]
```

To test edge case scenarios, it's now about adding the appropriate scenario header to the API request and adding the proper data to the mock JSON server. Passing the proper header when making the API request allows us to develop/test against these scenarios quickly. [In a follow-up post](/blog/simulating_different_ui_scenarios_during_fronend_development/), we will see how we can use this in our front end app development and automated tests.

Hope this helps you set up the different scenarios for your API.
