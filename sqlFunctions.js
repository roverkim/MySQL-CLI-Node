/////////////////////////////////////////////// /* Imports */ ////////////////////////////////////////////////////////
require('console.table'); // Package that Turns an Object into A Table
const mysql = require('mysql'); // Package that Allows for mysql Connections
const inquirer = require('inquirer'); // Package for Displaying and Getting User Input
const async = require('async'); // Package that Forces Asynchronus Functions to Execute Synchronously
const index = require('./index.js'); // Internal File that Contains getUserType Function
const questions = require('./questions/questions.js'); // Internal File that Contains all Questions

/////////////////////////////////////////////// /* Establish Connection Function */ ////////////////////////////////////////////////////////
const connection = mysql.createConnection(
  {
    host: "localhost",
    user: "root", // Change Your to your Connection Username
    password: "Watlow4007", // Change to Your Connection Password
    multipleStatements: true   // Without this setting, multiline queries will not work
  }
); // End of connection

/////////////////////////////////////////////// /* Query Functions */ ////////////////////////////////////////////////////////
const sqlFunctions = { // sqlFunctions Object that Contains All the SQL Function Logic

  // Create Database bamazon_db
  createDb: function(callback) {

    // Sends a mySQL query to the Database
    connection.query(`
        DROP DATABASE IF EXISTS bamazon_db;
        CREATE DATABASE bamazon_db;
        `, (error, result) => {

      if (error) throw error;

      console.log("\n Database bamazon_db has been Created!");
      callback(null); // This is Needed For Aysnc Package to Work. The Next Function in the waterFall is passed as a callback, ensuring that the function is executed sequentially ;

    }); // End of Query
  }, // End of createDb

  // Create products and departments Table
  createTable: (callback) => {

    connection.query(`
          USE bamazon_db;
          CREATE TABLE products(
            item_id INT NOT NULL AUTO_INCREMENT,
            product_name VARCHAR(300) NOT NULL,
            department_name VARCHAR(300),
            price INT NOT NULL,
            stock_quantity INT NOT NULL,
            product_sales INT NOT NULL,
            PRIMARY KEY (item_id)
          );
          CREATE TABLE departments(
            department_id INT NOT NULL AUTO_INCREMENT,
            department_name VARCHAR(300) NOT NULL,
            over_head_costs INT NOT NULL,
            PRIMARY KEY (department_id)
          );
        `, (error, result) => {

      if (error) throw error;

      console.log("\n Products and Deparments Table Has Been Created!");
      callback(null); // This is Needed For Aysnc Package to Work. The Next Function in the waterFall is passed as a callback, ensuring that the function is executed sequentially ;

    }); // End of Query

  }, // End of createTable

  // Create Mock Data and Input the Data into products and departments Table
  createMockData: (callback) => {

    connection.query(`
          USE bamazon_db;
          INSERT INTO products(item_id, product_name, department_name, price, stock_quantity, product_sales)
          VALUES
          (NULL, "Roku", "Electronics", "20", "200", "5000"),
          (NULL, "Bicycle", "Transportation", "1000","50", "60000"),
          (NULL, "TV", "Electronics", "600","200", "45100"),
          (NULL, "Headphones", "Electronics", "200","1000", "30000"),
          (NULL, "Wheels", "Transportation", "50","50000", "213664"),
          (NULL, "Fridge", "Appliances", "1200","20", "544321"),
          (NULL, "DishWasher", "Appliances", "800","20", "80000"),
          (NULL, "Skates", "Transportation", "150","80", "23000"),
          (NULL, "Laptop", "Electronics", "2000","500", "550000"),
          (NULL, "Motorcycle", "Transportation", "9999","5", "200000");

          INSERT INTO departments(department_id, department_name, over_head_costs)
          VALUES
          (NULL, "Electronics", "25000" ),
          (NULL, "Appliances", "50000" ),
          (NULL, "Transportation", "30000" );

        `, (error, result) => {

      if (error) throw error;

      console.log("\n Data Sucessfully Inserted \n");
      callback(null); // This is Needed For Aysnc Package to Work. The Next Function in the waterFall is passed as a callback, ensuring that the function is executed sequentially ;

    }); // End of Query
  }, // End of Mock Data

  // Display Current Products
  showProducts: (callback) => {

    connection.query(`
        USE bamazon_db;
        SELECT item_id, product_name, department_name, price, stock_quantity, product_sales
        FROM products;
      `, (error, results) => {

      if (error) throw error;

      // Display Product ID, Name and Price
      console.log(`
            Items Available for Sale
          ------------------------------
          `);

      console.table(results[1]); // Display Results in a Table Format

      // results[1].forEach((product) => {   // Use This Code if you do not want to Display as A Table Format
      //
      //   console.log(`
      //       Product Name : ${product.product_name}
      //       ------------------------------
      //       Id : ${product.item_id}
      //       Price : ${product.price}
      //       Quantity ${product.stock_quantity} left
      //       ------------------------------
      //         `)
      // }) // End of forEach

      if (callback) { // If callback Is Passed, Execute callback
        callback(null); // This is Needed For Aysnc Package to Work. The Next Function in the waterFall is passed as a callback, ensuring that the function is executed sequentially ;
      } else {
        wantToContinue(); // Ask User if they Want to Continue
      }

    }); // End of Query
  }, // End of showProducts

  // Check Available Product Quantities
  checkQuantity: (productID, quanitiy) => {

    connection.query(`
        USE bamazon_db;
        SELECT item_id, stock_quantity, price, product_sales
        FROM products
        WHERE ?
        `, {
      item_id: productID
    }, (error, result) => {

      if (error) throw error;

      let quantity = result[1][0].stock_quantity - quanitiy; // Subtract Quantity Purchased from Actual Quanity in Inventory

      if (quantity >= 0) { // Proceed to Update Quantity if Quantity of Product is more or equal to 0
        console.log(" \n Item Purchased! ");
        let totalRevenue = (result[1][0].price * quanitiy) + result[1][0].product_sales // Take Price of Product Multiplied by Quantity and Add to Existing Product Revenue
        sqlFunctions.updateQuantity(productID, quantity, totalRevenue); // Updates the Database by passing ID, New quantity and revenue as arguments
      } else {
        console.log("\n Insufficient quantity!");
        wantToContinue(); // Ask if the User Would Like to Continue
      }

    }); // End of Query
  }, // End of pullProducts

  // Function to Update Quantity and Revenue Based On Product ID
  updateQuantity: (productID, quantity, totalRevenue) => {

    connection.query(`
        USE bamazon_db;
        UPDATE products
        SET ?, ?
        WHERE ?
        `,
        [{
            stock_quantity: quantity
          },
          {
            product_sales: totalRevenue
          },
          {
            item_id: productID
        }],
     (error, result) => {

      if (error) throw error;

      console.log("\n Item Sucesfully Updated \n");
      wantToContinue();

    }) // End of query
  }, // End of updateQuantity

  // Shows Products that Have an Inventory Lower than 5
  showLowInventory: () => {

    connection.query(`
        USE bamazon_db;
        SELECT *
        FROM products
        WHERE stock_quantity < 5 ;
        `, (error, results) => {

      if (error) throw error;

      // Display Product ID, Name and Price
      console.log(`
                      Items
          ------------------------------
          `);

      console.table(results[1]);

      // results[1].forEach((product) => { // Use This if you do not Want to Display the Results as a Table
      //
      //   console.log(`
      //         Product Name : ${product.product_name}
      //         ------------------------------
      //         Id : ${product.item_id}
      //         Price : ${product.price}
      //         Quantity : ${product.stock_quantity}
      //         Department : ${product.department_name}
      //         ------------------------------
      //         `)
      //
      // }) // End of forEach

      wantToContinue();

    }); // End of Query
  }, // End of showLowInventory

  // Add More Quanity to a Product's Inventory
  addToInventory: () => {

    const updateQuestion = (callback) => { // Ask User Which Product they would Like to Add Inventory to

      inquirer.prompt(questions.updateQuantity).then((answer) => {
        connection.query(`
              USE bamazon_db;
              SELECT item_id, stock_quantity , product_sales
              FROM products
              WHERE ?
              `, {
          item_id: answer.updateID
        }, (error, result) => {

          if (error) throw error;

          let quantity = parseInt(answer.updateQuantity) + parseInt(result[1][0].stock_quantity);
          sqlFunctions.updateQuantity(answer.updateID, quantity, result[1][0].product_sales);
        }) // End of Query

        callback(null); // This is Needed For Aysnc Package to Work. The Next Function in the waterFall is passed as a callback, ensuring that the function is executed sequentially ;
      }) // End of inquirer

    }; // End of updateQuestion

    async.waterfall([ // Force showProducts to Execute Fully Before Asking The User Questions Pertaining to Adding More Inventory to a Product
      sqlFunctions.showProducts, updateQuestion
    ], error => {
      if (error) throw error
    });

  }, // End of addToInventory

  // Add A New Product to Inventory
  addNewProduct: () => {

    inquirer.prompt(questions.addNewProduct).then((answer) => {
      connection.query(`
          USE bamazon_db;
          INSERT INTO products(item_id, product_name, department_name, price, stock_quantity, product_sales)
          VALUES
          (NULL, "${answer.addName}", "${answer.addDepartment}", "${answer.addPrice}", "${answer.addQuantity}", "${answer.addSales}");
        `, (error, result) => {

        if (error) throw error;

        console.log("\n Data Sucessfully Inserted \n");

        wantToContinue();

      }) // End of Query
    }); // End of Prompt
  }, // End of addNewProduct

  // List Total Sales By Department
  productSalesDepartment: () => {

    connection.query(`
      USE bamazon_db;
      SELECT departments.department_name, departments.over_head_costs, sum(products.product_sales),
      products.product_sales - departments.over_head_costs as total_profit
      FROM departments
      LEFT JOIN products
      ON departments.department_name = products.department_name
      GROUP BY departments.department_name;
      `, (error, results) => {

      if (error) throw error;

      console.table(results[1]);

      wantToContinue();

    }); // End of Query

  }, // End of productSalesDepartment

  // Create A New Department
  newDepartment: () => {

    inquirer.prompt(questions.newDepartment).then((answer) => {
      connection.query(`
        INSERT INTO departments(department_id, department_name, over_head_costs)
        VALUES (NULL, "${answer.newDepartmentName}", "${answer.newDepartmentOverhead}");

      `, (error, result) => {

        if (error) throw error;

        console.log("\n New Department Added! \n");

        wantToContinue();
      }) // End of query
    }); // End of Prompt
  }, // End of newDepartment
}; // End of sqlFunctions Object

/////////////////////////////////////////////// /* miscellaneous Functions */ //////////////////////////////////////////////////////////

// Function for Getting User Type //
const getUserType = function() {

  inquirer.prompt(questions.whichUser).then((answer) => {  // Prompt User for User Type

    switch (answer.whichUser) { // Evaluates Response and Executes Functions Relating to the User Type
      case "Customer":
        clearTerminal(); // Function that Clears The Bash Terminal
        const customer = require('./views/bamazonCustomer.js');
        customer();
        break;
      case "Manager":
        clearTerminal();
        const manager = require('./views/bamazonManager.js');
        manager();
        break;
      case "Supervisor":
        clearTerminal();
        const supervisor = require('./views/bamazonSupervisor.js');
        supervisor();
        break;
      default:
        clearTerminal();
        process.exit(); // Exit the Program
    } // End Switch

  }) // End of Prompt
}; // End of getUserType

// Funtion for Getting Customer Purchase //
const purchaseQuestion = () => { // Function that Asks and Gets User Input for the Item they Want to Purchase

  inquirer.prompt(questions.customer).then((answer) => { // Get User Input

    if (answer.ask.toLowerCase().slice(0, 1) == "y") { // If User Wants To Purchase an Item
      sqlFunctions.checkQuantity(answer.productID, answer.quantity); // Execute checkQuantity, sending Product ID and Quanity As Arguments
    } else { // Exit From Program
      console.log("Thank you for your time!");
      process.exit();
    }

  }) // End of inquirer

}; // End of purchaseQuestion

// Function That Clears the Bash Terminal //
const clearTerminal = () => {process.stdout.write('\033c')};

// Function that Prompts The User Asking if They Want to Continue
const wantToContinue = () => {

  inquirer.prompt(questions.wantToContinue).then((answer) => {
    if (answer.wantToContinue.toLowerCase().slice(0, 1) == "y") {
      clearTerminal(); // Function that Clears The Bash Terminal
      getUserType(); // Ask For User Type
    } else {
      console.log("Thank you for your time!");
      process.exit();
    }
  }) // End of inquirer
}; // End of wantToContinue

/////////////////////////////////////////////// /* Export Module */ ////////////////////////////////////////////////////////
module.exports = {
  connection: connection,
  sqlFunctions: sqlFunctions,
  getUserType: getUserType,
  purchaseQuestion: purchaseQuestion,
  wantToContinue : wantToContinue,
  clearTerminal: clearTerminal
}
