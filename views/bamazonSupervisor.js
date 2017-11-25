/////////////////////////////////////////////// /* Imports */ //////////////////////////////////////////////////////////
const inquirer = require('inquirer');
const functions = require('../sqlFunctions.js');
const questions = require('../questions/questions.js');


/////////////////////////////////////////////// /* Execution */ //////////////////////////////////////////////////////////

function bamazonSupervisor(){ // Function that Handles Supervisor View

  inquirer.prompt(questions.supervisor).then((answer) => { // Prompt User for Input from a List of Options

    switch (answer.supervisor) { // Evaluates Reponse and Executes Functions Pertaining to Selection
      case "View Product Sales by Department":
        functions.sqlFunctions.productSalesDepartment(); // Shows Total Sales of Each Department
        break;
      case "Create New Department":
        functions.sqlFunctions.newDepartment(); // Create New Department
        break;
      default:
        clearTerminal(); // Function that Clears The Bash Terminal
        process.exit(); // Exit the Program
    } // End of Switch

  }); // End of Inquirer

} // End of bamazonManager



/////////////////////////////////////////////// /* Export */ //////////////////////////////////////////////////////////
module.exports = bamazonSupervisor ;
