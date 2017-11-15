/////////////////////////////////////////////// /* Imports */ //////////////////////////////////////////////////////////
const functions = require('./sqlFunctions.js'); 
const async = require('async');


function bamazonCustomer(callback){

    async.waterfall(
        [functions.showProducts,
        functions.purchaseQuestion
    ], error => {
        if (error) throw error;
    });

    callback(null);

};


/////////////////////////////////////////////// /* Import */ //////////////////////////////////////////////////////////
module.exports = bamazonCustomer;
