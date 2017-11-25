/////////////////////////////////////////////// /* Import Packages */ //////////////////////////////////////////////////////////
const async = require('async'); // External Package that Forces Synchronus Function Executions
const functions = require('./sqlFunctions.js'); // File that contains Common Resuable Functions

/////////////////////////////////////////////// /* Code Executions */ //////////////////////////////////////////////////////////

functions.connection.connect((error) => { // Establish Connection with the Database

    if (error) throw error; // Throws an Error if Connection Fails

    async.waterfall([ // External async Package that Forces Each Function to Fully Execute Before Proceding to the Next Execution
      functions.sqlFunctions.createDb, // Creates a Database
      functions.sqlFunctions.createTable, // Creates a Table
      functions.sqlFunctions.createMockData, // Fills the Table with Mock Data
      functions.getUserType, // Ask User for User Input Type
    ], error => {if (error) throw error});

});
