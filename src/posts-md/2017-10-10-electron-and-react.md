---
title: Setting up an Electron Application using create-react-app Template
slug: electron-and-react
date_published: 2017-10-10T00:00:00.000Z
date_updated: 2024-11-28T03:03:48.000Z
tags: Programming
excerpt: Electron application using React.
---

[Electron](https://electron.atom.io/) is a great way to build cross-platform desktop applications using HTML, CSS and JavaScript. I was surprised when I first came across Electron to see many of the applications that I use daily was developed in electron and I never knew about it. Since then I was interested in learning more about developing an application using Electron. Recently I was playing around with an idea for a side project and decided to use Electron as I wanted a desktop application. TDK react

## Setting up the React Application

With the [create-react-app](https://github.com/facebookincubator/create-react-app) template generator, it is easy to setup and get up and running a react application. All you need to run are the below commands, and you have everything set up for a react application.

    npm install -g create-react-app
    
    create_react_app electron_react
    cd electron_react
    npm start
    

The above commands will create an 'electron-react' folder with all the code and set up the app at *http://localhost:3000* in development mode.

## Setting up Electron

Now that we have a react application setup, let us integrate electron with it. The below command installs electron package.

    npm install electron
    

A [basic Electron application](https://github.com/electron/electron-quick-start) needs just these files:

- *package.json* - Points to the app's main file and lists its details and dependencies. We already have this as part of the react application.
- *main.js* - Starts the app and creates a browser window to render HTML. This is the app's main process. We will add this file.
- *index.html* - A web page to render. This is the app's renderer process. We already have this as part of the react application.

Let's start by adding a main.js file. We will keep the code to the bare minimum. All we are doing here is adding a function *createWindow* which uses *[BrowserWindow](https://electron.atom.io/docs/api/browser-window/)* from the electron package, to create a new window instance. The window loads the development server URL. We will modify this URL later to run independently without a hosted server so that it can be packaged and deployed easily. The [app's](https://electron.atom.io/docs/api/app/)[ready](https://electron.atom.io/docs/api/app/#event-ready) event is wired to create the new window.

    const { app, BrowserWindow } = require('electron');
    
    let mainWindow;
    
    function createWindow() {
      mainWindow = new BrowserWindow({ width: 800, height: 600 });
      const startUrl = process.env.DEV_URL;
    
      mainWindow.loadURL(startUrl);
    
      mainWindow.on('closed', () => (mainWindow = null));
    }
    
    app.on('ready', createWindow);
    

After updating the package.json with the electron application main entry point, we are all set to run the application.

    "main": "src/main.js",
    

Fire up two consoles and launch the react application in one using *npm start* and the electron application in the other using *'set DEV_URL=http://localhost:3000 && electron .'*
![Electron React](__GHOST_URL__/content/images/electron_react.png)
### Setting up for Deployment

Opening up two consoles and starting up the react server first will start becoming a pain soon. To avoid this, we can use two npm packages to start both the tasks one after the other.

- [concurrently](https://www.npmjs.com/package/concurrently): Run multiple commands concurrently.
- [wait-on](https://www.npmjs.com/package/wait-on): Wait for files, ports, sockets, http(s) resources to become available

Install both the packages and modify the *package.json* as shown below.

    "react-start": "react-scripts start",
    "electron-dev": "set DEV_URL=http://localhost:3000 && electron .",
    "start": "concurrently \"npm run react-start\" \"wait-on http://localhost:3000/ && npm run electron-dev\""
    

Running *npm start* now launches the react application, waits for the server to be up and running and then launches the electron application.

The electron app depends on the react application being hosted locally to run. Let's update *main.js* so that it can run from the generated output of the react application. Running *npm build* generates the website contents into the build folder.

    ...
    const path = require('path');
    const url = require('url');
    ...
     const startUrl = process.env.DEV_URL ||
        url.format({
          pathname: path.join(__dirname, '/../build/index.html'),
          protocol: 'file:',
          slashes: true
        });
    mainWindow.loadURL(startUrl);
    ...
    

Set the *[homepage](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md#building-for-relative-paths)* property in package.json (*"homepage": "./"*) to enable relative paths on the generated *index.html* file. Once this is done, we can generate the site using *npm run build* and run the electron application using *'electron .'*. This will launch the application from the *build* folder.

Hope this helps you to jump start with your Electron app development using React.

**References**

- [How to build an Electron app using create-react-app. No webpack configuration or “ejecting” necessary.](https://medium.freecodecamp.org/building-an-electron-application-with-create-react-app-97945861647c)
- [create-react-app](https://github.com/facebookincubator/create-react-app)
- [Electron: Quick Start Guide](https://github.com/electron/electron-quick-start)
