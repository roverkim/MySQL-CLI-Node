/////////////////////////////////////////////// /* Imports */ //////////////////////////////////////////////////////////
const async = require('async');
const functions = require('../sqlFunctions.js');


/////////////////////////////////////////////// /* Customer */ //////////////////////////////////////////////////////////

function bamazonCustomer(){

    async.waterfall([
      functions.sqlFunctions.showProducts,
      functions.purchaseQuestion
    ], error => {if (error) throw error;});

};


/////////////////////////////////////////////// /* Import */ //////////////////////////////////////////////////////////
module.exports = bamazonCustomer;