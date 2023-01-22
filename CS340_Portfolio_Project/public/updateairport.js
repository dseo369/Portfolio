
//function that is called to update a aiport entity, uses AJAX

function updateAirport(id)
{
    $.ajax({
        url: '/airport/' + id,
        type: 'PUT',
        data: $('#update-airport').serialize(),
        success: function(result)
		{
            window.location.replace("./");
        }
    })
};
