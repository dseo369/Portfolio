
//function that is called to update a passenger entity, uses AJAX

function updatePassenger(id){
	console.log(id);
    $.ajax({
        url: '/passenger/' + id,
        type: 'PUT',
        data: $('#update-passenger').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};
