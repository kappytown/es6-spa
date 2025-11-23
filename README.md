# SimpleApp SPA Template
This is a single page application starter template with example pages to get you started.

## Prerequisites
- [**npm**](https://www.npmjs.com/) to install all the necessary packages
- [**Grunt**](https://gruntjs.com) to build the application

## Installing
First clone the project and install dependencies:
```bash
mkdir es6-spa
cd es6-spa
git clone https://github.com/kappytown/es6-spa.git
npm install
```

## Server
Clone the php-server repository.
**Note:** you may have to update the `API_PATH` inside the GruntFile.cjs file.

## Building
```bash
grunt dev
```

## Features
- **Token-based authorization**
When the user logs in, credentials are verified in MySQL users table. Upon successfull login, a token is generated, saved into MySQL, and sent back in the response as an HTTP-only cookie to keep the user logged in.
- **Router based page navigation**
- **Service manager**
Handles all of your RESTful API calls.
- **Caching system**
Cache anything that you may need cached such as API responses.
- **Event observer**
Subscribe to and publish events such as when a user log into the app.
- **Javascript templating system**
Renders dynamic content in your templates.
- **Lazy loading**
Dynamically loads pages and associated assets to reduce the initial load of the app.
- **ES13 based syntax**
Upgraded from ES6 for spread operator and private class fields and methods. Depending on your requirements, you may need a transpiler such as Babel.
- **Cache busting**
The application version number `v=v1.00.00` is automatically appended to each asset file name upon build.

## Dependencies
Although lightweight, SimpleApp is not completely Vanilla and has the following dependencies:

- **Router**
Navigo 8.11.1 - Simple dependency-free minimalistic Javascript router used to navigate between pages
- **DOM**
jQuery 3.7.1 - For all DOM manipulation
- **Templates**
Underscore.js 1.8.3 - Lightweight library we use for it's Javascript templating system
- **Layout**
Bootstrap 5.3.3 - Used for responsive page layout and modal functionality
- **Build**
Grunt 1.6.1 (Optional) - Used to create build directory, minify, concatinate, replace, copy, and compile Sass to CSS.


## Main layout structure:
```pug
// Wrapper
div.wrapper
  // Header
  header.header
    ...

  // Main
  main
    // Section (Page Content)
    section#content
      ...

  // Footer
  footer.footer
    ...
```

## Layout Design
<kbd><img width="200" alt="Login Page" title="Login Page" src="https://github.com/user-attachments/assets/db43bbd3-6642-4587-877e-f5bb59a3b3df" /></kbd>
<kbd><img width="200" alt="Home Page" title="Home Page" src="https://github.com/user-attachments/assets/f188acd1-f9a7-4d96-960c-c0346211ad03" /></kbd>
<kbd><img width="200" alt="Navigation Menu"  title="Navigation Menu" src="https://github.com/user-attachments/assets/48667349-804c-49f3-8a92-2fe93e321302" /></kbd>
<kbd><img width="200" alt="Cookie Preferences" title="Cookie Preferences" src="https://github.com/user-attachments/assets/6acfc90f-b633-4be1-9f2b-7073e72402ea" /></kbd>
<kbd><img width="200" alt="Contact Us Page" title="Contact Us Page" src="https://github.com/user-attachments/assets/397bc58d-17ca-4045-99d2-063557cb579c" /></kbd>
<kbd><img width="200" alt="Contact Us FAQs Modal" title="Contact Us FAQs Modal" src="https://github.com/user-attachments/assets/77f22305-0233-4344-a308-1db4a53c4d90" /></kbd>
<kbd><img width="200" alt="My Account Page" title="My Account Page" src="https://github.com/user-attachments/assets/41794d86-7f97-49d4-a93c-c39aba19739f" /></kbd>
<kbd><img width="200" alt="Products Page" title="Products Page" src="https://github.com/user-attachments/assets/e72be8b6-37dd-468e-afd2-2194a06b22a0" /></kbd>
<kbd><img width="200" alt="Product Details Page" title="Product Details Page" src="https://github.com/user-attachments/assets/1ddafe37-1a26-4754-b8a0-8b0ac83caa50" /></kbd>
<kbd><img width="200" alt="Orders Page" title="Orders Page" src="https://github.com/user-attachments/assets/bdf2ea57-37c9-400e-9c62-9c1b2c499002" /></kbd>
<kbd><img width="200"  alt="Order Detail Page" title="Order Detail Page" src="https://github.com/user-attachments/assets/e5e6d67a-4769-42c9-9611-4b2f22439fa2" /></kbd>

## Authors
- [**@kappytown**](https://github.com/kappytown)

## License
**es6-spa** is licensed under the [GNU General Public License v3.0](LICENSE).
