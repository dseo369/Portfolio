
//function that is called to update a flight entity, uses AJAX

function updateFlight(id){
	console.log(id);
    $.ajax({
        url: '/flight/' + id,
        type: 'PUT',
        data: $('#update-flight').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};
