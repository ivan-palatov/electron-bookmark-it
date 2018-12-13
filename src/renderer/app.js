// Main renderer js file

// Modules
const { ipcRenderer } = require('electron');

// Show add-modal
$('.open-add-modal').click(() => {
    $('#add-modal').addClass('is-active');
});

// Close add-modal
$('.close-add-modal').click(() => {
    $('#add-modal').removeClass('is-active');
});

// Handle add-modal submission
$('#add-button').click(() => {
    // Get URL
    const newItemUrl = $('#item-input').val();
    if (newItemUrl) {
        // Disable the input
        $('#item-input').prop('disabled', true);
        $('#add-button').addClass('is-loading');
        $('.close-add-modal').attr('disabled', 'disabled');
        // Send URL to the main.js
        ipcRenderer.send('new-item', newItemUrl);
    }
});

// Listen for new item from main
ipcRenderer.on('new-item-success', (e, item) => {
    // Close and reset the modal
    $('#add-modal').removeClass('is-active');
    $('#item-input').prop('disabled', false).val('');
    $('#add-button').removeClass('is-loading');
    $('.close-add-modal').removeAttr('disabled');
    console.log(item);
});

// Simulate add click on Enter
$('#item-input').keyup((e) => {
    if (e.key === 'Enter') $('#add-button').click();
});