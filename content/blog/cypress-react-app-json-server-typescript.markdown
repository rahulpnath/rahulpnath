---
author: [Rahul Nath]
title: "Setting Up Cypress + React App + JSON Server + TypeScript"
  
tags:
  - Cypress
  - TypeScript
  - Testing
date: 2020-04-09
thumbnail: ../images/cypress_react_json_server_typescript.jpg
---

For the past couple of weeks, I have been playing around with Cypress and been enjoying the experience. [Cypress](https://docs.cypress.io/guides/overview/why-cypress.html#In-a-nutshell) is a next-generation front end testing tool built for the modern web. It is the next generation Selenium and enables to write tests faster, easier, and reliable.

![](../images/cypress_react_json_server_typescript.jpg)

In this post, let's look at how we can set up Cypress for a React application that runs over a FAKE JSON Server all using TypeScript. By using a Fake Server for the tests, we can guarantee the application state and the data to expect.

## Create React App

Setting up a Create React App with TypeScript is straightforward and supported out of the box. All you need to specify is the typescript template when you create a new application (as shown below). The documentation also has [steps on how to add Typescript to an existing project](https://create-react-app.dev/docs/adding-typescript/).

``` bash
npx create-react-app my-app --template typescript
```

## Setting Up JSON Server

In the previous post we looked at [how to set up a Fake REST API using JSON Server](/blog/setting_up_a_fake_rest_api_using_json_server/). Let's move JSON Server and the mock data to TypeScript. It forces us to update the mock data any time the models are updated. I have JSON Server under the _mockApi_ folder.

``` bash
npm install json-server @types/json-server typescript
```

Add a tsconfig.json for the TypeScript compiler and update the server.js file to server.ts.

```json
{
  "compilerOptions": {
    "module": "commonjs",
    "target": "es6",
    "moduleResolution": "node",
    "esModuleInterop": true,
    "lib": ["es6"],
    "forceConsistentCasingInFileNames": true
  },
  "include": ["**.ts"]
}
```

```js
// server.ts
import jsonServer from 'json-server';
import data from './mockData';

const server = jsonServer.create();
const router = jsonServer.router(data);
...
server.use(router);
server.listen(5000, () => {
  console.log('JSON Server is running');
});
```

For the mock data, use the API Model DTO type definitions if you have a swagger definition for the API's, use [NSwag](https://github.com/RicoSuter/NSwag) to generate TypeScript definitions. Generating the definitions can be scripted or be done using the [NSwag Studio](https://github.com/RicoSuter/NSwag/wiki/NSwagStudio).

```js
const quotes: QuoteDto[] = [
  {
    id: "1",
    statusCode: QuoteStatusCode.Draft,
    lastModifiedAt: new Date("2-Mar-2020"),
    customer: {...},
    mobilePhone: null,
    accessories: [],
  },
];
```

'_npx ts-node server.ts_' Start Mock API

Depending on how you have the React app calling the API, you can set it up to use the Mock API Server that we are running. If the Web App and API are served from the same host and port usually, you can proxy the requests to JSON Server by [setting the proxy field in package.json](https://create-react-app.dev/docs/proxying-api-requests-in-development/).

## Setting Up Cypress

The Cypress docs are well explained and have a [step by step walkthrough to set up Cypress tests](https://docs.cypress.io/guides/getting-started/installing-cypress.html). I have Cypress installed under the web application folder.

- Set up [Cypress](https://docs.cypress.io/guides/getting-started/installing-cypress.html)
- Enable [Typescript support for Cypress](https://docs.cypress.io/guides/tooling/typescript-support.html). Add tsconfig.json under Cypress folder.
- Install and Set up [Cypress Testing Library](https://testing-library.com/docs/cypress-testing-library/intro). Types are available at [DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/testing-library__cypress)

``` bash
npm install --save-dev cypress @testing-library/cypress @types/testing-library__cypress
```

Cypress comes with default test examples. If the example tests are not showing up for you, try running 'cypress open' (or run), which should generate them. You can ignore the tests from running in the cypress.json file.

```json
{
  "ignoreTestFiles": "**/examples/*.js",
  "baseUrl": "http://localhost:3000"
}
```

Below is the folder structure that I have - mockApi (JSON Server), cypress, and ui (create-react-app).

![](../images/cypress_cra_jsonServer_folder_structure.jpg)

Start writing Cypress tests now!
