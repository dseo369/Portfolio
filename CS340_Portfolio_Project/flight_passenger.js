module.exports = function(){
    var express = require('express');
    var router = express.Router();

    /* get passengers to populate a drop down selection option*/
    function getPassenger(res, mysql, context, complete){
        mysql.pool.query("SELECT accountID, first_name, last_name FROM Passenger", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.Passenger = results;
            complete();
        });
    }

    /* get get flights in a drop down  */
    function getFlights(res, mysql, context, complete){
        sql = "SELECT Flight.flightID , Flight.`'from'`, Flight.`'to'`  FROM Flight";
        mysql.pool.query(sql, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end()
            }
            context.Flight = results
            complete();
        });
    }

    /* get passengers with flights attached to them */
    function getFlightsPassengers(res, mysql, context, complete){
        sql = "SELECT Passenger.accountID , Flight.flightID,Flight_Passenger.flightID as fID, CONCAT(first_name,' ',last_name) AS name FROM Passenger INNER JOIN Flight_Passenger on Passenger.accountID = Flight_Passenger.accountID INNER JOIN Flight on Flight.flightID = Flight_Passenger.flightID ORDER BY name"
         mysql.pool.query(sql, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end()
            }
            context.flight_passenger = results
            complete();
        });
    }
  

    // List passenger IDs with what flights they have associated with them  
    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deletepassenger.js"];
        var mysql = req.app.get('mysql');
        var handlebars_file = 'flight_passenger'

        getPassenger(res, mysql, context, complete);
        getFlights(res, mysql, context, complete);
        getFlightsPassengers(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 3){
                res.render(handlebars_file, context);
            }
        }
    });

    /* creates an association between a flight and a passenger
     */
    router.post('/', function(req, res)
	{
        var mysql = req.app.get('mysql');
        var listFlights = req.body.flightID;
        var person = req.body.accountID;
          var sql = "INSERT INTO Flight_Passenger (accountID, flightID) VALUES (?,?)";
          var inserts = [person, listFlights];
          sql = mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error)
			{
                console.log(error)
            }
          });
        res.redirect('/flight_passenger');
    });

    // Delete an association between flight and passenger, does not delete either party
    router.delete('/accountID/:accountID/flight/:flightID', function(req, res)
	{

        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM Flight_Passenger WHERE accountID = ? AND flightID = ?";
        var inserts = [req.params.accountID, req.params.flightID];

        sql = mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error)
			{
                res.write(JSON.stringify(error));
                res.status(400); 
                res.end(); 
            }else
			{
                res.status(202).end();
            }
        });
		console.log(inserts);
    });

    return router;
}();
