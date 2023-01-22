
//function that is called to update a city entity, uses AJAX

function updateCity(name,location){
	console.log(name + " " + location);
    $.ajax({
        url: '/city/' + name + '/' + location,
        type: 'PUT',
        data: $('#update-city').serialize(),
        success: function(result){
            window.location = '/city';
        }
    })
};
