# MySQL-CLI-Node

MySQL-CLI-Node is an Amazon-like storefront CLI that was created using Node, Inquirer, Async and MySQL. Users can choose from 1 of 3 views to interact with the database.

`Async` Npm Package: Due to Asynchronus Nature of Javascript, I added this package to ensure the sequential execution of each function.


## Usage

This Program automatically creates a MySQL database, inputs two tables (products & department) and mock data into it.

Users can select from 3 views:
1. `Customer`
2. `Manager`
3. `Supervisor`

In `Customer View`, the app will take in orders from customers and deplete stock from the store's inventory.

In `Manager View`, the app will list all available stock, show stock that have a quantity below 5, allow stock to be purchased and allows new products to be added.

In `Supervisor View`, the app will list totals sales by department and allow the user to add a new department.


Basic error handling was done to prevent invalid input.

## Requirements
- Node.js
- MySQL Server

## Installation

MySQL-CLI-Node can be downloaded by cloning this repository `https://github.com/roverkim/MySQL-CLI-Node.git`

After installation, open node, navigate to the file and run `npm install`.

**Note** You do not need to manually create a database using SQL Workbench. The program does that for you. However, you need to have an existing MySQL Connection.

In `sqlFunctions.js`, under the *connection* function, Please Change:

user: "root", // Change Your to your Connection Username
password: " ", // Change to Your Connection Password

To run MySQL-CLI-Node, type `node index.js`


## Files

Instead of grouping all the code in one file, MySQL-CLI-Node has been split into multiple files.

1. `index.js` Starting Script that establishes a connection to your MySQL connection and creates a database, table and fills it with mock data.
2. `views/bamazon "Customer, Manager, Supervisor" .js` Stores the logic flow of the various app views.
3. `sqlFunctions.js` Stores the main logic of the entire application. Contains MySQL query functions, inquirer functions and other miscellaneous functions.
4. `question/questions.js` Stores inquirer questions.
