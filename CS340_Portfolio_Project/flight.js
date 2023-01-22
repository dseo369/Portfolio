module.exports = function(){
    var express = require('express');
    var router = express.Router();


//basic function to get all flight entities in the Flight table
    function getFlight(res, mysql, context, complete){
			mysql.pool.query("SELECT Flight.flightID, `'from'`, `'to'`, eta FROM Flight", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.flight = results;
            complete();
        });

    }

//this searches a flight out based on its starting or ending location 
    function searchFromToFlight(req, res, mysql, context, complete) {
      var query = "SELECT flightID, `'from'`, `'to'` , eta FROM Flight WHERE Flight.`'from'` = " + mysql.pool.escape(req.params.destination) + " OR Flight.`'to'` = " + mysql.pool.escape(req.params.destination);
	  

      mysql.pool.query(query, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.flight = results;
            complete();
	  console.log(results);
        });

    }

//this function gets a specific flight from the current list for use in updating it
    function getFlightID(res, mysql, context, id, complete){
        var sql = "SELECT flightID, `'from'`, `'to'` FROM Flight WHERE flightID = ?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){

                res.write(JSON.stringify(error));
                res.end();
            }
            context.Flight = results[0];
            complete();
        });
    }


//this is the basic view of the flights page, it will call the get flight function to list all the flights currently in the database.
    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deleteflight.js","searchflight.js"];
        var mysql = req.app.get('mysql');
		
        getFlight(res, mysql, context, complete);

        function complete()
		{ 
		res.render('flight', context);
        }
		
    });



//looks for all flights that begin or end in a specified location
    router.get('/search/:destination', function(req, res){

        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deleteflight.js","searchflight.js"];
        var mysql = req.app.get('mysql');
        searchFromToFlight(req, res, mysql, context, complete);	
		
        function complete()
		{
			res.render('flight', context);
        }
    });

//makes a special URL to showcase a single flight for the purpose of updating its attributes
    router.get('/:flightID', function(req, res){
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["selectedflight.js", "updateflight.js"];
        var mysql = req.app.get('mysql');
        getFlightID(res, mysql, context, req.params.flightID, complete);
        getFlight(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('update-flight', context);
            }

        }
    });


//adds a flight to the database
    router.post('/', function(req, res){
        var mysql = req.app.get('mysql');
		console.log("test");
        var sql = "INSERT INTO Flight (`'from'`, `'to'`, eta) VALUES (?,?,?)";
        var inserts = [req.body.from, req.body.to, req.body.eta];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/flight');
            }
        });
    });

//gets the information from the website to update a flight based on input.
    router.put('/:flightID', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "UPDATE Flight SET `'from'`=?, `'to'`=? , eta = ? WHERE flightID=?";
        var inserts = [req.body.from, req.body.to, req.body.eta, req.params.flightID];
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

    /* Deletes a flight, which also in turn deletes the association between this flight and its passengers */

    router.delete('/:flightID', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM Flight_Passenger WHERE Flight_Passenger.flightID = ?";
		console.log(req.body)
        console.log(req.params.flightID)
        var inserts = [req.params.flightID];
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
        sql = "DELETE FROM Flight WHERE flightID = ?";
		console.log(req.body)
        console.log(req.params.flightID)
        inserts = [req.params.flightID];
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