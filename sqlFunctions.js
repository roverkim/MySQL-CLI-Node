/////////////////////////////////////////////// /* Imports */ //////////////////////////////////////////////////////////
const mysql = require('mysql');
const inquirer = require('inquirer');
const async = require('async');
const questions = require('./questions.js');

/////////////////////////////////////////////// /* Establish Connections */ //////////////////////////////////////////////////////////
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Watlow4007",
  multipleStatements: true
});

/////////////////////////////////////////////// /* Query Functions */ //////////////////////////////////////////////////////////

// Create Database bamazon_db
  const createDb = function(callback){

    connection.query(`
      DROP DATABASE IF EXISTS bamazon_db;
      CREATE DATABASE bamazon_db;
      `, (error, result) => {

        if (error) throw error;

        console.log("Database has been Created!");
        callback(null);

      }) // End of Query

    }; // End of createDb

// Create Table products
  const createTable = (callback) => {

    connection.query(`
      USE bamazon_db;
      CREATE TABLE products(
        item_id INT NOT NULL AUTO_INCREMENT,
        product_name VARCHAR(300) NOT NULL,
        department_name VARCHAR(300),
        price INT NOT NULL,
        stock_quantity INT NOT NULL,
        PRIMARY KEY (item_id)
      );
    `, (error, result) => {

        if (error) throw error;

        console.log("Table Has Been Created!")
        callback(null);

    }) // End of Query
  }; // End of createTable


  const createMockData = (callback) => { // Create Mock Data

    connection.query(`
      USE bamazon_db;
      INSERT INTO products(item_id, product_name, department_name, price, stock_quantity)
      VALUES
      (NULL, "Roku", "Electronics", "20", 300),
      (NULL, "Bicycle", "Transportation", "1000","50"),
      (NULL, "TV", "Electronics", "600","200"),
      (NULL, "Headphones", "Electronics", "200","1000"),
      (NULL, "Wheels", "Transportation", "50","50000"),
      (NULL, "Fridge", "Appliances", "1200","20"),
      (NULL, "DishWasher", "Appliances", "800","20"),
      (NULL, "Skates", "Transportation", "150","80"),
      (NULL, "Laptop", "Electronics", "2000","500"),
      (NULL, "Motorcycle", "Transportation", "9999","5");
    `, (error, result) => {

      if (error) throw error;

      console.log("Data Inserted");
      callback(null);

    }) // End of Query
  };// End of Mock Data

// Display Current Products
  const showProducts = (callback) => {

    connection.query(`
      USE bamazon_db;
      SELECT item_id, product_name, price
      FROM products;
    `, (error, results) => {

        if (error) throw error;

        // Display Product ID, Name and Price
        console.log(`
          Items Available for Sale
        ------------------------------
        `);

        results[1].forEach((product) => {
          console.log(`
          Product Name : ${product.product_name}
          ------------------------------
          Id : ${product.item_id}
          Price : ${product.price}
          ------------------------------
            `)
        }) // End of forEach

        callback(null);

    }) // End of Query

  }; // End of showProducts

// Check Available Quantities
function checkQuantity (productID) {

  connection.query(`
    USE bamazon_db;
    SELECT item_id, stock_quantity
    FROM products
    WHERE ?
    `,
    {
      item_id : productID
    },
     (error, result) => {

      if (error) throw error;

      console.log("Items Queried");

      if (result[1][0].stock_quantity >= 1){ // Proceed to Update Quantity if quantity is more than 1
        updateQuantity(productID, result[1][0].stock_quantity);
      } else {
        console.log("Insufficient quantity!")
      }
  }) // End of Query
};  // End of pullProducts

// Function to Update Quantity
const updateQuantity = (productID, quantity) => {

  connection.query(`
    USE bamazon_db;
    UPDATE products
    SET ?
    WHERE?
    `,
    [{
      stock_quantity : 9
    },
    {
      item_id : productID
    }]
    ,(error, result) => {

      if (error) throw error;

      console.log("item sucesfully updated");

    }) // End of query
}; // End of updateQuantity

/////////////////////////////////////////////// /* Question FUnctions */ //////////////////////////////////////////////////////////

function purchaseQuestion (callback) {

    inquirer.prompt(questions.buyProduct).then((answer) => {

      if(answer.ask.toLowerCase().slice(0,1) == "y"){

        checkQuantity(answer.productID)

      } else {
        console.log("Thank you for your time!");
        process.exit();
      }

    }) // End of inquirer
    callback(null);
  }; // End of purchaseQuestion




/////////////////////////////////////////////// /* Export Module */ //////////////////////////////////////////////////////////
module.exports = {
  connection : connection,
  createDb : createDb ,
  createTable : createTable,
  createMockData : createMockData,
  checkQuantity : checkQuantity,
  showProducts : showProducts,
  purchaseQuestion : purchaseQuestion
}
