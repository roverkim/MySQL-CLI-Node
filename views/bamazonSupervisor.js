/////////////////////////////////////////////// /* Imports */ //////////////////////////////////////////////////////////
const inquirer = require('inquirer');
const functions = require('../sqlFunctions.js');
const questions = require('../questions/questions.js');





function bamazonSupervisor(){

  inquirer.prompt(questions.supervisor).then((answer) => {

    switch (answer.supervisor) {
      case "View Product Sales by Department":
        functions.sqlFunctions.productSalesDepartment();
        break;
      case "Create New Department":
        functions.sqlFunctions.newDepartment();
        break;
      default:
        clearTerminal();
        process.exit();
    } // End of Switch

  }); // End of Inquirer

} // End of bamazonManager



/////////////////////////////////////////////// /* Export */ //////////////////////////////////////////////////////////
module.exports = bamazonSupervisor ;
