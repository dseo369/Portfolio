


//function to get the website input and send it to the js file to perform the query, double checks if the input was empty or not, if it was, dont do anything
function searchPlaneTypeLocation() 
{
    var type_location_search_string  = document.getElementById('type_location_search_string').value

	
	if(type_location_search_string != "")
	{
		window.location = '/plane/search/' + encodeURI(type_location_search_string);		
	}
	else
	{
		window.location = '/plane';
	}
	
}
