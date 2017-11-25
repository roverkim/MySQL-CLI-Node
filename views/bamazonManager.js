/////////////////////////////////////////////// /* Imports */ //////////////////////////////////////////////////////////
const inquirer = require('inquirer');
const functions = require('../sqlFunctions.js');
const questions = require('../questions/questions.js');


/////////////////////////////////////////////// /* Manager */ //////////////////////////////////////////////////////////

function bamazonManager(){ // Function that Handles Manager View

  inquirer.prompt(questions.manager).then((answer) => { // Prompt User for Input from a List of Options

    switch (answer.options) { // Evaluates and Executes Various Functions Pertaining to User's Choice
      case "View Products for Sale":
        functions.clearTerminal(); // Function that Clears The Bash Terminal
        functions.sqlFunctions.showProducts();
        break;
      case "View Low Inventory":
        functions.clearTerminal(); // Function that Clears The Bash Terminal
        functions.sqlFunctions.showLowInventory();
        break;
      case "Add to Inventory":
        functions.clearTerminal(); // Function that Clears The Bash Terminal
        functions.sqlFunctions.addToInventory();
        break;
      case "Add New Product":
        functions.sqlFunctions.addNewProduct();
        break;
      default:
        functions.clearTerminal(); // Function that Clears The Bash Terminal
        process.exit();
    } // End of Switch

  }); // End of Inquirer

} // End of bamazonManager

/////////////////////////////////////////////// /* Export */ //////////////////////////////////////////////////////////
module.exports = bamazonManager ;
