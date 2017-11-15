/////////////////////////////////////////////// /* Imports */ //////////////////////////////////////////////////////////

const questions = {

  buyProduct : [
    {
      type : "input",
      name : "ask",
      message : "Would you like to purchase an item? (yes/no)",
      validate : (value) => (value.toLowerCase().slice(0,1) == "y") || value.toLowerCase().slice(0,1) == "n" ? true : console.log("Please input either yes or no"),
      default : "yes"
    },
    {
    type : "input",
    name : "productID",
    message : "Please Input the ID of the Product You Would Like to Purchase.",
    validate : (value) => Number.isInteger(parseInt(value))? true : "Invalid Input! Please input a whole number!"
  },
  {

    type : "input",
    name : "quantity",
    message : "How many items would you like to purchase?",
    validate : (value) => Number.isInteger(parseInt(value))? true : "Invalid Input! Please input a whole number!",
    default : "1"
  }
]


} // End of Questions Object



/////////////////////////////////////////////// /* Exports */ //////////////////////////////////////////////////////////

module.exports = questions;
