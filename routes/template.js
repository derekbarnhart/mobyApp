
/*
 * GET form page.
 */
var handlebars = require('handlebars');
var fs = require('fs')

exports.get = function(req, res){
    
    fs.readFile('./app/data/apptemplates/mobileSimulator.html', 'utf8', function (err,data) {
        if (err) {
            return console.log(err);
        res.send("could not find template");
        }
        
    var source = data;
    var template = handlebars.compile(source);
    var result = template({});
        res.send(result);       
    });     
}


