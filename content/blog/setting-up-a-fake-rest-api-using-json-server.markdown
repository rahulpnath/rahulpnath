---
author: [Rahul Nath]
title: "Setting Up A Fake REST API Using JSON Server"
  
tags:
  - JavaScript
  - Cypress
  - Testing
date: 2020-04-06
thumbnail: ../images/json_server.jpg
---

[JSON Server](https://github.com/typicode/json-server) is a great way to set up a full fake REST API for front-end development. JSON server can be set up literally in '30 seconds' and with no coding as the website claims. Capture some of the real API's data if it already exists or create a mock data based on the API Schema in _db.json_ file. That's all to do, and we have an API with full CRUD capabilities

However, it's not always that you can use something straight out of the box to fit all conditions and constraints of your API. In this post, let's look at customizing and configuring JSON Server for some commonly occurring scenarios.

`youtube:https://www.youtube.com/embed/yq0S2f3k9zY`

## Setting up JSON Server

JSON Server can be [used as a module](https://github.com/typicode/json-server#module) in combination with the other Express middlewares when it needs to be customized. JSON server is built over [Express, a web framework for Node.js](https://expressjs.com/). To set it up as a module add a _server.js_ file to your repository with the below setup code as from the docs.

```js
// server.js
const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

server.use(middlewares);

// Have all URLS prefixed with a /api
server.use(
  jsonServer.rewriter({
    "/api/*": "/$1",
  })
);

server.use(router);
server.listen(5000, () => {
  console.log("JSON Server is running");
});
```

Start up the server using '**_node server.js_**'.

Mostly I have my API's behind the '/api' route. Add a rewriter rule to redirect all calls with '/api/\*' to the root '/$1'. The '$1' represents all that is captures by the '\_'. E.g., A call to 'localhost:5000/api/quotes' will now be redirected as 'localhost:5000/quotes' where the JSON server has all the data available through the db.json file.

### Setting up and Organizing Mock Data

When using a JSON file (db.json) as the mock data source, any changes made using POST, PATCH, PUT, DELETE etc updates the JSON file. Most likely, you will be using source control (if not you should), and this means reverting the changes to the db.json file every time. I don't like doing this, so I decided to move my mock data as an in-memory JSON object.

The router function takes in a source that is _either a path to a JSON file (e.g. `'db.json'`) or an object in memory_. Using an in-memory object also allows organizing our mock data into separate files. I have all my mock data [under one folder](https://github.com/rahulpnath/quotes/tree/master/ui/mockApi/mockData) with an _index.js_ file that serves the in-memory object, as below.

```js
// index.js file under mockDate folder
// quotes, users, products, branches etc are in other
// files under the same folder

const quotes = require("./quotes");
const users = require("./users");
const products = require("./products");
const branches = require("./branches");

module.exports = {
  quotes,
  users,
  products,
  branches,
};
```

Pass the in-memory object to the router as below

```js
const data = require("./mockData");
const router = jsonServer.router(data);
```

Since this is an in-memory object, any changes made to it are not persistent. Every time the server starts, it uses the same data served from the 'index.js' file above.

## Summary and Detail View Endpoints

Another common scenario is to have a list view and a detailed view of the resources. E.g., We have a list of quotes, and clicking any will open the detailed view. The data representation for the detail and list view are often different.

```text
'/api/quotes'  -> Returns list of Quote Summary
'/api/quotes/:id' -> Returns Quote Details
```

By overriding the render method of the router, we can format the data separately for the list view and the detail view. Below I intercept the response if the route matches the list API endpoint and transform the data into the summary format.

```js
router.render = (req, res) => {
  let data = res.locals.data;

  if (url === "/api/quotes" && req.method === "GET") {
    data = data.map(toQuoteSummary);
  }
  res.jsonp(data);
};

const toQuoteSummary = (quote) => ({
  id: quote.id,
  scenarios: quote.scenarios,
  quoteNumber: quote.quoteNumber,
  statusCode: quote.statusCode,
  lastModifiedAt: quote.lastModifiedAt,
  customerName: quote.customer && quote.customer.name,
  mobilePhoneDescription: quote.mobilePhone && quote.mobilePhone.serialNo,
});
```

JSON Server delivers what it promises and is easy to set up and customize. If you have the original API running, capture the API request to generate mock data. Strip out any sensitive or PII information [before checking it into source control](https://www.rahulpnath.com/blog/keeping-sensitive-configuration-data-out-of-source-control/).

Here is an [example repository](https://github.com/rahulpnath/quotes), where I have been setting up a Fake API to drive a front-end application, cypress tests, and more.

Hope this helps you get started with JSON Server and mock your APIs.

_Photo by Taylor Vick on Unsplash https://unsplash.com/photos/M5tzZtFCOfs_
