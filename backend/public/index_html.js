$(document).ready(function () {
    // Function to handle form submission for creating intellectual property
    $('#createIPForm').on('submit', function (e) {
        e.preventDefault(); // Prevent the default form submission behavior

        // Extract data from the form
        var ipId = $('#ipId').val();
        var ipTitle = $('#ipTitle').val();
        var creationDate = $('#creationDate').val();
        var ipCreator = $('#ipCreator').val();
        var ipOwner = $('#ipOwner').val();

        // Create data object to send to the server
        var data = {
            id: ipId,
            title: ipTitle,
            creator: ipCreator,
            owner: ipOwner,
            creationDate: creationDate
        };

        // Make an AJAX POST request to create intellectual property
        $.ajax({
            url: '/ipassets/', // Replace with the appropriate URL for your backend
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (result) {
                // Show success message modal
                var myModal = new bootstrap.Modal($('#successModal'), {});
                myModal.show();

                // Reset the form
                $('form')[0].reset();
            },
            error: function (xhr, status, error) {
                // Handle error (e.g., display an error message)
                console.log(xhr.responseText);
                $('#ipMessage').text("Error: " + xhr.responseText);
            }
        });
    });

    // Function to handle form submission for retrieving intellectual property information
    $('#getIPForm').on('submit', function (e) {
        e.preventDefault(); // Prevent the default form submission behavior

        // Extract the IP ID entered by the user
        var searchId = $('#searchId').val();

        // Make an AJAX GET request to retrieve intellectual property information
        $.ajax({
            url: '/ipassets/' + searchId, // Replace with the appropriate URL for your backend
            type: 'GET',
            success: function (data) {
                data = JSON.parse(data);
                // Update the edit form fields with the retrieved intellectual property information
                $('#editIPId').val(data.id);
                $('#editIPTitle').val(data.title);
                $('#editIPCreator').val(data.creator);
                $('#editIPOwner').val(data.owner);
                $('#editCreationDate').val(data.creation_date);
                $('#licenseHolder').val(data.license_holder);
                $('#licenseStartDate').val(data.license_start_date);
                $('#licenseEndDate').val(data.license_end_date);

                // Show the edit form
                $('#editIPForm').removeClass('d-none');
            },
            error: function (xhr, status, error) {
                // Handle error (e.g., display an error message)
                console.log(xhr.responseText);
                $('#ipMessage').text("Error: " + xhr.responseText);
            }
        });
    });


    // Function to handle the update of intellectual property
    $('#updateIPButton').click(function () {
        // Extract data from the edit form
        var ipId = $('#editIPId').val();
        var newOwner = $('#editIPOwner').val();

        // Log extracted values for debugging
        console.log("Updating IP with ID:", ipId);
        console.log("New Owner:", newOwner);

        // Create data object to send to the server
        var data = {
            newOwner: newOwner
        };

        // Make an AJAX PUT request to update intellectual property
        $.ajax({
            url: '/ipassets/' + ipId, // Append the IP ID to your API endpoint
            type: 'PUT',
            data: JSON.stringify(data),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (result) {
                console.log("Update successful:", result);
                // Show success message modal
                var myModal = new bootstrap.Modal($('#successModal'), {});
                myModal.show();

                // Clear the edit form
                clearCard();
            },
            error: function (xhr, status, error) {
                // Handle error (e.g., display an error message)
                console.log("Error status:", status);
                console.log("Error response:", xhr.responseText);
                $('#ipMessage').text("Error: " + xhr.responseText);
            }
        });
    });

    $('#licenseIPButton').click(function () {
        // Extract data from the edit form
        var licenseHolder = $('#licenseHolder').val();
        var licenseStartDate = $('#licenseStartDate').val();
        var licenseEndDate = $('#licenseEndDate').val();

        // Create data object to send to the server
        var data = {
            licenseHolder: licenseHolder,
            licenseStartDate: licenseStartDate,
            licenseEndDate: licenseEndDate
        };

        // Get the IP ID
        var ipId = $('#editIPId').val();

        // Make an AJAX POST request to license intellectual property
        $.ajax({
            url: '/ipassets/' + ipId + '/license', // Append the IP ID to your API endpoint
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (result) {
                // Show success message modal
                var myModal = new bootstrap.Modal($('#successModal'), {});
                myModal.show();

                // Clear the edit form
                clearCard();
            },
            error: function (xhr, status, error) {
                // Handle error (e.g., display an error message)
                console.log(xhr.responseText);
                $('#ipMessage').text("Error: " + xhr.responseText);
            }
        });
    });


});
