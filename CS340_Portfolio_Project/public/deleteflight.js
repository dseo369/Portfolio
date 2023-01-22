


//function that deletes a flight based on whatever user inputs it recieveds
function deleteFlight(id){
	console.log("DELETING" + id);
    $.ajax({
        url: '/flight/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
}
