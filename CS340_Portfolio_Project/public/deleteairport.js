//deletes a single airport from the database based on what input its been given
function deleteAirport(id){
	console.log("DELETING" + id);
    $.ajax({
        url: '/airport/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
}
