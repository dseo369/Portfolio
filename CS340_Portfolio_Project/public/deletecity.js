

//deletes a city based on the user inputs given by the webpage, this one asks for 2 specifically because the city entity has a unique pair of attributes rather than one
function deleteCity(name,location){
	console.log("DELETING" + name);
    $.ajax({
        url: '/city/' + name + '/' + location,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
}
