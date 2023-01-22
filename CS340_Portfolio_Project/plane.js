module.exports = function()
{
    var express = require('express');
    var router = express.Router();


//function that uses the select query to select all the plane attributes and puts them into an array for the website to list out 
    function getPlane(res, mysql, context, complete)
	{
			mysql.pool.query("SELECT modelID, type, Plane.airports AS airport FROM Plane", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.Plane  = results;
            complete();
        });

    }
	
//function that uses the select query to select all the airport attributes to put into an array for the drop down selection input to choose from
    function getAirports(res, mysql, context, complete)
	{

        //mysql.pool.query("SELECT Passenger.accountID as id, first_name, last_name, Flight.flightID AS flightID FROM Passenger INNER JOIN Flight ON flightID = Flight.flightID", function(error, results, fields)
		mysql.pool.query("SELECT Airport.name, Airport.location FROM Airport", function(error, results, fields){
            if(error){
				console.log("airport error");

                res.write(JSON.stringify(error));
                res.end();
            }
            context.Airport = results;
            complete();
        });
    }

//function that allows the user to find a plane based on which airport it is located in or the type of plane

    function searchPlaneTypeLocation(req, res, mysql, context, complete) 
	{
		var query = "SELECT modelID, type, Plane.airports AS airport FROM Plane WHERE Plane.type LIKE " + mysql.pool.escape("%" + req.params.text + "%") + " OR Plane.airports LIKE " + mysql.pool.escape("%" + req.params.text + "%");
		console.log(req.params.text);
		mysql.pool.query(query, function(error, results, fields)
		{
            if(error)
			{
                res.write(JSON.stringify(error));
                res.end();
            }
            context.Plane = results;
            complete();
        });
    }

//function that uses the select query to get a single plane for use in the update function
    function getPlaneID(res, mysql, context, id, complete)
	{
        var sql = "SELECT modelID, type, airports FROM Plane WHERE modelID = ?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields)
		{
            if(error)
			{
                res.write(JSON.stringify(error));
                res.end();
            }
            context.Plane = results[0];
            complete();
        });
    }

//this will get all the planes and airports for the listing/dropdown respectively for the website when you are in the /plane section
    router.get('/', function(req, res)
	{
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deleteplane.js","searchplane.js"];
        var mysql = req.app.get('mysql');
		
        getPlane(res, mysql, context, complete);
        getAirports(res, mysql, context, complete);

        function complete()
		{
            callbackCount++;
			//makes sure that the functions are called at least twice
            if(callbackCount >= 2) res.render('plane', context);
        }
		
    });

    // searches for all planes that have a specific string in their name or location
    router.get('/search/:text', function(req, res)
	{
        var callbackCount = 0;
        var context = {};

        context.jsscripts = ["deleteplane.js","searchplane.js"];
        var mysql = req.app.get('mysql');
		searchPlaneTypeLocation(req, res, mysql, context, complete);
        
		function complete()
		{
			res.render('plane', context);
        }
    });

    /* Display one plane for the specific purpose of updating the plane */

    router.get('/:modelID', function(req, res){
        callbackCount = 0;
        var context = {};
		console.log("pressed update  button");
        context.jsscripts = ["selectplane.js", "updateplane.js"];
        var mysql = req.app.get('mysql');
        getPlaneID(res, mysql, context, req.params.modelID, complete);
        getAirports(res, mysql, context, complete);


        function complete(){
            callbackCount++;
			//needs to run twice because the update page needs the drop down list of airports to select from
            if(callbackCount >= 2){
                res.render('update-plane', context);
            }

        }
    });

    /* Adds a plane, redirects to the plane page after adding */
    router.post('/', function(req, res){
        var mysql = req.app.get('mysql');
		
		//insert query
        var sql = "INSERT INTO Plane (type, airports) VALUES (?,(SELECT Airport.name FROM Airport WHERE Airport.name =" + mysql.pool.escape(req.body.locationName) + " ))";
        var inserts = [req.body.type, req.body.locationName];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/plane');
            }
        });
    });


    /* The URI that updates data is sent to in order to update a plane */
    router.put('/:modelID', function(req, res){
        var mysql = req.app.get('mysql');
        console.log("THIS IS UPDATTING :" + req.body.type);
        var sql = "UPDATE Plane SET type=?, airports=? WHERE modelID=?";
        var inserts = [req.body.type, req.body.locationName, req.params.modelID];
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

    /* Route to delete a plane, simply returns a 202 upon success. Ajax will handle this.  */

    router.delete('/:modelID', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM Plane WHERE modelID = ?";
        console.log(req.params.modelID)
        var inserts = [req.params.modelID];
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