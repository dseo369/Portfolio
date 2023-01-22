

//function to get the website input and send it to the js file to perform the query, double checks if the input was empty or not, if it was, dont do anything
function searchpassengerByFirstName() 
{

    var first_name_search_string  = document.getElementById('first_name_search_string').value;

	if(first_name_search_string != "")
	{
		window.location = '/passenger/search/' + encodeURI(first_name_search_string);		
	}
	else
	{
		window.location = '/passenger';
	}
	
}
