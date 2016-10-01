var uuid = require("uuid");// For Unique ID Genration
var bucket = require("../../index").bucket;
var config = require("../config/config");
var N1qlQuery = require('couchbase').N1qlQuery;
const bucketName = "spark_user"

function ProductModel() {

};

// Add Method
ProductModel.save = function (data, callback) {
    console.log(" In Model Save Post------Initializing the JSON Data-----");
    var jsonObject = {
        id: data.id ? data.id : uuid.v4(),
        productName: data.productName,
        prodDesc: data.prodDesc,
        basePrice: data.basePrice,
        imageLink: data.imageLink ? data.imageLink : "http://listing99.com/images/deals/img_not_found.gif",        
        endDate: data.endDate,
        startDate: data.startDate,
        userEmail: data.userEmail
    }
    var documentId = "sale_" + jsonObject.id;
    console.log(" Doc Id " + documentId);
    console.log("data---" + jsonObject.id + "  " + jsonObject.prodDesc)
    bucket.upsert(documentId, jsonObject, function (error, result) {
        console.log("---" + jsonObject)
        if (error) {
            callback(error, null, jsonObject);
            return;
        }
        callback(null, {
            message: "success",
            data: result
        }, jsonObject);
    });
}

//Fetch One
ProductModel.fetchOne = function (saleId, callback) {
    var statement = "SELECT * " +
        "FROM `" + config.couchbase.bucket + "` AS sale " +
        "WHERE META(sale).id = $1";
    var query = N1qlQuery.fromString(statement);
    bucket.query(query, ["sale_" + saleId], function (error, result) {
        if (error) {
            callback(error, null);
            return;
        }
        callback(null, result);
    });
}

// Fetch Method
ProductModel.fetchAll = function (callback) {
    var couchbase = require("couchbase");
    var ViewQuery = couchbase.ViewQuery;
    console.log("Document Name : " + config.couchbase.doc_name +" View Name :: "+ config.couchbase.view_name);
    var query = ViewQuery.from(config.couchbase.doc_name, config.couchbase.view_name);
    bucket.query(query, function (error, results) {
        if (error) {
            callback(error, null, {});
            return;
        }
        var resultArray = [];
        console.log("---++++" + results);
        for (i in results) {
            console.log("---" + JSON.stringify(results[i]));
            if (results[i]) {
                resultArray.push(results[i].key);
            }
        }
        callback(null, {
            message: "success",
            data: resultArray
        }, resultArray);
    });
}

module.exports = ProductModel;