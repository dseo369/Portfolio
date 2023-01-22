



//function that gets the webpage inputs for deleting a specific passenger and sends them to the passenger.js file
function deletePassenger(id){
	console.log("DELETING" + id);
    $.ajax({
        url: '/passenger/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
}
