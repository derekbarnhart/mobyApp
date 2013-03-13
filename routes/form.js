
/*
 * GET form page.
 */
var request = require('request');
var ent = require('ent');

exports.post = function(req, res){
    request.post(
        {
        url:"http://dbarnhart.iriscouch.com/form",
        json:req.body
    }
    ,function(e, r, body){
            console.dir(body);             
            res.send(JSON.stringify(body));   
        });       
} 

exports.view = function(req, res){
    
    request.get(
        {
        url:"http://dbarnhart.iriscouch.com/form/"+req.params.id,
        json:req.body
    }
    ,function(e, r, body){
            console.dir(body);             
            res.send(body.html);   
        });       
}


