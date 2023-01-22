

//function to get the website input and send it to the js file to perform the query, double checks if the input was empty or not, if it was, dont do anything

function searchFromTo() 
{
	
    var searchfromto_string  = document.getElementById('searchfromto_string').value

	if(searchfromto_string != "")
	{
		window.location = '/flight/search/' + encodeURI(searchfromto_string);		
	}
	else
	{
		window.location = '/flight';
	}	
	
}
