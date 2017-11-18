/////////////////////////////////////////////// /* Import Packages */ //////////////////////////////////////////////////////////
const async = require('async');
const functions = require('./sqlFunctions.js');



/////////////////////////////////////////////// /* Code Executions */ //////////////////////////////////////////////////////////

// Main Executing Starting Point of the Application
functions.connection.connect((error) => { // Establish Connection with the Database
  functions.clearTerminal();
  if (error) throw error; // Throws an Error if Connection Fails

  async.waterfall([
    functions.sqlFunctions.createDb,
    functions.sqlFunctions.createTable,
    functions.sqlFunctions.createMockData,
    functions.getUserType,
  ], error => {if (error) throw error});


}); // End of Database Creation
