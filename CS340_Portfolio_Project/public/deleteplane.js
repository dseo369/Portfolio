

//function that gets the webpage inputs for deleting a specific plane and sends them to the plane.js file
function deletePlane(id){
	console.log("DELETING" + id);
    $.ajax({
        url: '/plane/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
}

