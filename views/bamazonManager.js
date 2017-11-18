/////////////////////////////////////////////// /* Imports */ //////////////////////////////////////////////////////////
const inquirer = require('inquirer');
const functions = require('../sqlFunctions.js');
const questions = require('../questions/questions.js');


/////////////////////////////////////////////// /* Manager */ //////////////////////////////////////////////////////////

function bamazonManager(){

  inquirer.prompt(questions.manager).then((answer) => {

    switch (answer.options) {
      case "View Products for Sale":
        functions.clearTerminal();
        functions.sqlFunctions.showProducts();
        break;
      case "View Low Inventory":
        functions.clearTerminal();
        functions.sqlFunctions.showLowInventory();
        break;
      case "Add to Inventory":
        functions.clearTerminal();
        functions.sqlFunctions.addToInventory();
        break;
      case "Add New Product":
        functions.sqlFunctions.addNewProduct();
        break;
      default:
        functions.clearTerminal();
        process.exit();
    } // End of Switch

  }); // End of Inquirer

} // End of bamazonManager

/////////////////////////////////////////////// /* Export */ //////////////////////////////////////////////////////////
module.exports = bamazonManager ;
