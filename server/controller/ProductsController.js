var ProductModel = require("../model/ProductModel");
//var request = require('request'); Use this to call other services-- External Rest services

// This defines my Rest Service
var productsController = function (app) {

    app.post("/freewillrv/sales", saveSale);    
    app.get("/freewillrv/sales",fetchCallback);    
    app.get("/freewillrv/sales/:saleid",fetchOneCallback); 
    
    //Save Sale Callback
    function saveSale(req, res) {
        console.log("User Valid Checking-- Save sale");
        ProductModel.save(req.body, function (error, result, jsonData) {
            if (error) {
                res.set("freewillrv-msg", "Unable to save data");
                res.set("freewillrv-msg", "Sale added sucessfully");
                res.status(400).send();                
            }
            console.log(JSON.stringify(jsonData));
            res.set("freewillrv-msg", "Sale added sucessfully");
            res.status(201).send(jsonData);
        });
    }
    
    // Fetch All Callback
    function fetchCallback(req,res){
        ProductModel.fetchAll(function(error,result,jsonData){
            if (error) {
                res.set("freewillrv-msg", "Unable to fetch data");
                res.status(400).send(); 
            }
            res.status(201).send(jsonData);
        })
    }
    
    // Fetch by ID Callback
    function fetchOneCallback(req,res){
        ProductModel.fetchOne(req.params.saleid,function(error,result){
            if (error) {
                res.set("freewillrv-msg",error.message)
                res.status(400).send();
                return;
            }
            res.status(201).send(result);
        })
    }
}

module.exports = productsController;