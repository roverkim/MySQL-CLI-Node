/////////////////////////////////////////////// /* Imports */ ////////////////////////////////////////////////////////
require('console.table');
const mysql = require('mysql');
const inquirer = require('inquirer');
const async = require('async');
const questions = require('./questions/questions.js');

/////////////////////////////////////////////// /* Establish Connections */ ////////////////////////////////////////////////////////
const connection = mysql.createConnection({host: "localhost", user: "root", password: "Watlow4007", multipleStatements: true});

const clearTerminal = () => {
  process.stdout.write('\033c');
}

/////////////////////////////////////////////// /* Query Functions */ ////////////////////////////////////////////////////////

sqlFunctions = {

  // Create Database bamazon_db
  createDb: function(callback) {

    connection.query(`
        DROP DATABASE IF EXISTS bamazon_db;
        CREATE DATABASE bamazon_db;
        `, (error, result) => {

      if (error) throw error;

      console.log("\n Database bamazon_db has been Created!");
      callback(null);

    }) // End of Query
  }, // End of createDb

  // Create Table products
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

      console.log("\n Products and Deparments Table Has Been Created!")
      callback(null);
    }); // End of Query

  }, // End of createTable

  createMockData: (callback) => { // Create Mock Data

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
      callback(null);

    }) // End of Query
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

      console.table(results[1]);

      // results[1].forEach((product) => {
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


      if (callback) {
        callback(null);
      } else {
        wantToContinue();
      }
    }); // End of Query
  }, // End of showProducts

  // Check Available Quantities
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

      console.log(" \n Items Purchased ");

      if (result[1][0].stock_quantity >= 1) { // Proceed to Update Quantity if quantity is more than 1
        let quantity = result[1][0].stock_quantity - quanitiy;
        let totalRevenue = (result[1][0].price * quanitiy) + result[1][0].product_sales
        sqlFunctions.updateQuantity(productID, quantity, totalRevenue);
      } else {
        console.log("\n Insufficient quantity!")

        wantToContinue();
      }
    }) // End of Query
  }, // End of pullProducts

  // Function to Update Quantity
  updateQuantity: (productID, quantity, totalRevenue) => {

    connection.query(`
        USE bamazon_db;
        UPDATE products
        SET ?, ?
        WHERE ?
        `, [
      {
        stock_quantity: quantity
      }, {
        product_sales: totalRevenue
      }, {
        item_id: productID
      }
    ], (error, result) => {

      if (error) throw error;

      console.log("\n Item Sucesfully Updated \n");
      wantToContinue();

    }) // End of query
  }, // End of updateQuantity

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
      // results[1].forEach((product) => {
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

  addToInventory: () => {

    const updateQuestion = (callback) => {

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

        callback(null);
      }) // End of inquirer

    }; // End of updateQuestion

    async.waterfall([
      sqlFunctions.showProducts, updateQuestion
    ], error => {
      if (error) throw error
    });

  }, // End of addToInventory

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


      }) // End of Query
    }); // End of Prompt
  }, // End of addNewProduct

  productSalesDepartment: () => {

    connection.query(`
      USE bamazon_db;
      SELECT departments.department_name, departments.department_name, departments.over_head_costs, products.product_sales,
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

/////////////////////////////////////////////// /* Question Functions */ ////////////////////////////////////////////////////////

const getUserType = function() {

  inquirer.prompt(questions.whichUser).then((answer) => {

    switch (answer.whichUser) {
      case "Customer":
        clearTerminal()
        const customer = require('./views/bamazonCustomer.js');
        customer();
        break;
      case "Manager":
        clearTerminal()
        const manager = require('./views/bamazonManager.js');
        manager();
        break;
      case "Supervisor":
        clearTerminal()
        const supervisor = require('./views/bamazonSupervisor.js');
        supervisor();
        break;
      default:
        clearTerminal();
        process.exit();
    } // End Switch

  }) // End of Prompt
}; // End of getUserType

/////////////////////////////////////////////// /* Customer Questions*/ ////////////////////////////////////////////////////////

const purchaseQuestion = (callback) => {

  inquirer.prompt(questions.customer).then((answer) => {

    if (answer.ask.toLowerCase().slice(0, 1) == "y") {
      sqlFunctions.checkQuantity(answer.productID, answer.quantity);

    } else {
      console.log("Thank you for your time!");
      process.exit();
    }
  }) // End of inquirer

}; // End of purchaseQuestion

const wantToContinue = () => {

  inquirer.prompt(questions.wantToContinue).then((answer) => {
    if (answer.wantToContinue.toLowerCase().slice(0, 1) == "y") {
      clearTerminal();
      getUserType();
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
