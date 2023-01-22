module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getAirport(res, mysql, context, complete){
			mysql.pool.query("SELECT name, location FROM Airport", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.Airport  = results;
            complete();
        });

    }

    function getCity(res, mysql, context, complete){

		mysql.pool.query("SELECT City.name, City.location FROM City", function(error, results, fields){
            if(error){
				console.log("city error");

                res.write(JSON.stringify(error));
                res.end();
            }
            context.City = results;
            complete();
        });
    }

    function searchAirportNameLocation(req, res, mysql, context, complete) {
      var query = "SELECT name, location FROM Airport WHERE Airport.name LIKE " + mysql.pool.escape("%" + req.params.text + "%") + " OR Airport.location LIKE " + mysql.pool.escape("%" + req.params.text + "%");

      mysql.pool.query(query, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.Airport = results;
			//console.log(results);
            complete();
        });
    }


    function getAirportName(res, mysql, context, id, complete){
        var sql = "SELECT name, location FROM Airport WHERE name = ?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){

                res.write(JSON.stringify(error));
                res.end();
            }
            context.Airport = results[0];
            complete();
        });
    }


    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deleteairport.js","searchairport.js"];
        var mysql = req.app.get('mysql');
		
        getAirport(res, mysql, context, complete);
        getCity(res, mysql, context, complete);

        function complete(){
            callbackCount++;
            if(callbackCount >= 2) res.render('airport', context);
        }
		
    });

    /*Display all airports whose name starts with a given string. Requires web based javascript to delete users with AJAX */
    router.get('/search/:text', function(req, res){
        var callbackCount = 0;
        var context = {};

        context.jsscripts = ["deleteairport.js","searchairport.js"];
        var mysql = req.app.get('mysql');
	
		searchAirportNameLocation(req, res, mysql, context, complete);
		getCity(res, mysql, context, complete);   
		
		function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('airport', context);

            }
        }
    });

    /* Display one passenger for the specific purpose of updating passenger */

    router.get('/:name', function(req, res){
        callbackCount = 0;
        var context = {};
		console.log("pressed update  button");
        context.jsscripts = ["updateairport.js"];
        var mysql = req.app.get('mysql');
        
		getAirportName(res, mysql, context, req.params.name, complete);
        getCity(res, mysql, context, complete);

        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('update-airport', context);
            }

        }
    });


    router.post('/', function(req, res){
        var mysql = req.app.get('mysql');
		
        var sql = "INSERT INTO Airport (name, location) VALUES (?,(SELECT City.name FROM City WHERE City.name =" + mysql.pool.escape(req.body.cityName) + " ))";
        var inserts = [req.body.name];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/airport');
            }
        });
    });

    /* The URI that update data is sent to in order to update a passenger */

    router.put('/:name', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "UPDATE Airport SET name=?, location=? WHERE name=?";
        var inserts = [req.body.name, req.body.cityName, req.params.name];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(error)
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.status(200);
                res.end();
            }
        });
    });

    /* Route to delete a passenger, simply returns a 202 upon success. Ajax will handle this.  */

    router.delete('/:name', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM Airport WHERE name = ?";
        var inserts = [req.params.name];
        sql = mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                console.log(error)
                res.write(JSON.stringify(error));
                res.status(400);
                res.end();
            }else{
                res.status(202).end();
            }
        })
    });

    return router;
}();