/////////////////////////////////////////////// /* Imports */ //////////////////////////////////////////////////////////

const questions = { // Inquirer Questions

    whichUser : [{

      type : "list",
      name : "whichUser",
      message: "\n Please Select A User Type \n",
      choices: ["Customer", "Manager", "Supervisor", "Exit"]
      }
    ], // End of whichUser

    customer : [{

      type : "input",
      name : "ask",
      message : "\n Would you like to purchase an item? (yes/no)",
      validate : (value) => (value.toLowerCase().slice(0,1) == "y") || value.toLowerCase().slice(0,1) == "n" ? true : "Please input either yes or no",
      default : "yes"
    },
    {
      type : "input",
      name : "productID",
      message : "\n Please Enter the Product ID of the Item You are Trying to Purchase : ",
      validate : (value) => Number.isInteger(parseInt(value))? true : "Invalid Input! Please input a whole number!",
      default : "1"
    },
    {
      type : "input",
      name : "quantity",
      message : "\n How Many Items would you Like to Purchase?",
      validate : (value) => Number.isInteger(parseInt(value))? true : "Invalid Input! Please input a whole number!",
      default : "1"
    }
  ], // End of Customer

  manager : [{

    type : "list",
    name : "options",
    message : "\n Please Select an Option \n",
    choices : ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Exit"]
    }
  ], // End of Manager

  updateQuantity : [{

      type : "input",
      name : "updateID",
      message : "\n Please Input the ID of the Product you Would Like to Purchase More Stock off : ",
      validate : (value) => Number.isInteger(parseInt(value))? true : " Invalid Input! Please input a whole number!"

    },
    {
      type : "input",
      name : "updateQuantity",
      message : "\n Please Input the amount of products you would like to add : ",
      validate : (value) => Number.isInteger(parseInt(value))? true : " Invalid Input! Please input a whole number!"

    }
  ], // End of updateQuantity

  addNewProduct :[{
      type : "input",
      name : "addName",
      message : "\n Please Input the Name of the Product you would Like to Add : "
    },
    {
      type : "input",
      name : "addPrice",
      message : "\n Please Input the Price of the Product you would Like to Add : ",
      validate: (value) => Number.isInteger(parseInt(value))? true : "Invalid Input! Please input a whole number!"
    },
    {
      type : "input",
      name : "addQuantity",
      message : "\n Please Input the Quantity of the Product you would Like to Add : "
    },
    {
      type : "input",
      name : "addDepartment",
      message : "\n Please Input the Department of the Product you would Like to Add : "
    },
    {
      type : "input",
      name : "addSales",
      message : "\n Please Input the Current Total Sales of the Product you would Like to Add : "
    }
  ], // End of addNewProduct

  supervisor : [{

      type : "list",
      name : "supervisor",
      message : "\n Please Choose an Option \n",
      choices : ["View Product Sales by Department" , "Create New Department", "Exit"]

    }
  ],  // End of Supervisor

  newDepartment : [{

      type : "input",
      name : "newDepartmentName",
      message : "\n Please Input the Name of the Department you Want to Add : "
    },
    {
      type : "input",
      name : "newDepartmentOverhead",
      message : "\n Please Input the Over Head Costs of the Deparment you Want to Add : "
    }
  ], // End of newDepartment

  wantToContinue : [{

    type : "input",
    name : "wantToContinue",
    message : "\n Do you want to Continue? (Yes/ No)",
    validate : (value) => (value.toLowerCase().slice(0,1) == "y") || value.toLowerCase().slice(0,1) == "n" ? true : console.log(" Please input either yes or no"),
    default : "yes"

    }
  ],

} // End of Questions Object



/////////////////////////////////////////////// /* Exports */ //////////////////////////////////////////////////////////

module.exports = questions;
