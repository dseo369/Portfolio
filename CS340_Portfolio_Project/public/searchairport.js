


//function to get the website input and send it to the js file to perform the query, double checks if the input was empty or not, if it was, dont do anything
function searchAirportNameLocation() 
{
    var name_location_search_string  = document.getElementById('name_location_search_string').value

	if(name_location_search_string != "")
	{
		window.location = '/airport/search/' + encodeURI(name_location_search_string);		
	}
	else
	{
		window.location = '/airport';
	}
	
}
