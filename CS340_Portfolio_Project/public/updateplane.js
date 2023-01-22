
//function that is called to update a plane entity, uses AJAX
function updatePlane(id)
{
    $.ajax({
        url: '/plane/' + id,
        type: 'PUT',
        data: $('#update-plane').serialize(),
        success: function(result)
		{
            window.location.replace("./");
        }
    })
};
