module.exports = function(){
    var express = require('express');
    var router = express.Router();



	//function to get all passengers in the Passenger Table and store them in an array to list on the web page
    function getPassenger(res, mysql, context, complete){

		mysql.pool.query("SELECT Passenger.accountID, first_name, last_name FROM Passenger", function(error, results, fields){
            if(error){
				console.log("passenger error");

                res.write(JSON.stringify(error));
                res.end();
            }
            context.Passenger = results;
            complete();
        });
    }


//searches for a person based on their first name
    function searchpassengerByFirstName(req, res, mysql, context, complete) {
      var query = "SELECT accountID, first_name, last_name FROM Passenger WHERE Passenger.first_name LIKE " + mysql.pool.escape(req.params.accountID + '%');

	console.log(req.params.accountID);
      mysql.pool.query(query, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.Passenger = results;
            complete();
        });
    }

//gets a single person based on the primary key to store for later when you update the entity
    function getPassengerID(res, mysql, context, id, complete){
        var sql = "SELECT accountID, first_name, last_name FROM Passenger WHERE accountID = ?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){

                res.write(JSON.stringify(error));
                res.end();
            }
            context.Passenger = results[0];
            complete();
        });
    }


//this is what the base page looks like, the list gets populated by all the passegner entities found by the getpassenger function
    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deletepassenger.js","filterpassenger.js","searchpassenger.js"];
        var mysql = req.app.get('mysql');
		
        getPassenger(res, mysql, context, complete);

        function complete()
		{
			res.render('Passenger', context);
        }		
    });



    /*Display all passengers whose name starts with a given string. Requires web based javascript to delete users with AJAX */
    router.get('/search/:accountID', function(req, res){
        var callbackCount = 0;
        var context = {};

        context.jsscripts = ["deletepassenger.js","filterpassenger.js","searchpassenger.js"];
        var mysql = req.app.get('mysql');
        searchpassengerByFirstName(req, res, mysql, context, complete);
		
        function complete()
		{
			res.render('passenger', context);
        }
    });

    /* Display one passenger for the specific purpose of updating passenger */

    router.get('/:accountID', function(req, res){
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["selectedflight.js", "updatepassenger.js"];
        var mysql = req.app.get('mysql');
        getPassengerID(res, mysql, context, req.params.accountID, complete);
        function complete()
		{
			res.render('update-passenger', context);
        }
    });

    /* Adds a passenger, redirects to the passenger page after adding */

    router.post('/', function(req, res){
        var mysql = req.app.get('mysql');
		console.log("test");
        var sql = "INSERT INTO Passenger (first_name, last_name) VALUES (?,?)";
        var inserts = [req.body.first_name, req.body.last_name];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/passenger');
            }
        });
    });

    /* The URI that update data is sent to in order to update a passenger */

    router.put('/:accountID', function(req, res){
        var mysql = req.app.get('mysql');
        console.log("THIS IS UPDATTING :" + req.body.first_name);
        console.log(req.params.accountID);
        var sql = "UPDATE Passenger SET first_name=?, last_name=? WHERE accountID=?";
        var inserts = [req.body.first_name, req.body.last_name, req.params.accountID];
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

    router.delete('/:accountID', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM Passenger WHERE accountID = ?";
		console.log(req.body)
        console.log(req.params.accountID)
        var inserts = [req.params.accountID];
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