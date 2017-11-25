/////////////////////////////////////////////// /* Imports */ //////////////////////////////////////////////////////////
const async = require('async');
const inquirer = require('inquirer'); // Package for Displaying and Getting User Input
const functions = require('../sqlFunctions.js'); // File that contains Common Resuable Functions
const questions = require('../questions/questions.js'); // Internal File that Contains all Questions

/////////////////////////////////////////////// /* Customer */ //////////////////////////////////////////////////////////

function bamazonCustomer(){ // Function that Handles Customer View

    async.waterfall([ // Forces the Full Execution of Each Function Before Proceding
      functions.sqlFunctions.showProducts, // Displays Products to Terminal
      functions.purchaseQuestion // Ask The User Questions Relating to Purchasing an Item
    ], error => {if (error) throw error;});

}; // End of bamazonCustomer Function




/////////////////////////////////////////////// /* Import */ //////////////////////////////////////////////////////////
module.exports = bamazonCustomer;
