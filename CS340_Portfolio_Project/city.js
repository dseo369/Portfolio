module.exports = function(){
    var express = require('express');
    var router = express.Router();


	//function to get all city entites from the table and store them in an array
    function getCity(res, mysql, context, complete){
			mysql.pool.query("SELECT name, location FROM City", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.City  = results;
            complete();
        });

    }

	//searches out cities based on the name or location
    function searchCityNameLocation(req, res, mysql, context, complete) {
      var query = "SELECT name, location FROM City WHERE City.name LIKE " + mysql.pool.escape("%" + req.params.text + "%") + " OR City.location LIKE " + mysql.pool.escape("%" + req.params.text + "%");

      mysql.pool.query(query, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
			console.log(results);
            context.City = results;
            complete();
        });
    }


	//gets a specific city entity to update later 
    function getCityName(res, mysql, context, id, location, complete){
        var sql = "SELECT name, location FROM City WHERE name = ? AND location = ?";
        var inserts = [id,location];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){

                res.write(JSON.stringify(error));
                res.end();
            }
            context.City = results[0];
			
			console.log(context.City);
            complete();
        });
    }


	//base web page look, getCity populates list with all cities currently in database 
    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deletecity.js","searchcity.js"];
        var mysql = req.app.get('mysql');
		
        getCity(res, mysql, context, complete);
		
        function complete()
		{
			res.render('city', context);
        }
		
    });

	//is called when searching out a specific city based on name or location 
    router.get('/search/:text', function(req, res){
        var context = {};
		
		console.log("STUFF " + req.params.text);
		context.jsscripts = ["deletecity.js","searchcity.js"];
		var mysql = req.app.get('mysql');

		//getCity(res, mysql, context, complete);		
		searchCityNameLocation(req, res, mysql, context, complete);

		function complete()
		{
			res.render('city', context);
		}			



    });

    /* Display one city for the specific purpose of updating passenger */

    router.get('/:name/:location', function(req, res){
        callbackCount = 0;
        var context = {};
		console.log("pressed update button");
        context.jsscripts = ["selectcity.js", "updatecity.js"];
        var mysql = req.app.get('mysql');
        
		getCityName(res, mysql, context, req.params.name, req.params.location, complete);
		getCityName(res, mysql, context, req.params.name, req.params.location, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('update-city', context);
            }

        }
    });


    router.post('/', function(req, res){
        var mysql = req.app.get('mysql');
		
        var sql = "INSERT INTO City (name, location) VALUES (?,?)";
        var inserts = [req.body.name,req.body.location];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/city');
            }
        });
    });

    /* The URI that update data is sent to in order to update a city */

    router.put('/:name/:location', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "UPDATE City SET name=?, location=? WHERE name=?";
        var inserts = [req.body.name, req.body.location, req.params.name];
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

    /* Route to delete a city, simply returns a 202 upon success. Ajax will handle this.  */

    router.delete('/:name/:location', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM City WHERE name = ? AND location = ?";
        var inserts = [req.params.name,req.params.location];
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