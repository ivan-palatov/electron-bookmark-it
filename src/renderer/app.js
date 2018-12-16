// Main renderer js file

// Modules
const { ipcRenderer } = require('electron');
const items = require('./items');
const menu = require('./menu');

// Navigate selected item with up/down keys
$(document).keydown(e => {
    switch(e.key) {
        case 'ArrowUp':
            items.changeItem('up');
            break;
        case 'ArrowDown':
            items.changeItem('down');
            break;
    }
})

// Show add-modal
$('.open-add-modal').click(() => {
    $('#add-modal').addClass('is-active');
});

// Close add-modal
$('.close-add-modal').click(() => {
    $('.close-add-modal').attr('disabled') === 'disabled' ? null : $('#add-modal').removeClass('is-active');
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
    // Add item to items array
    items.toReadItems.push(item);
    // Save item
    items.saveItems();
    // Add item to the screen
    items.addItem(item);

    // Close and reset the modal
    $('#add-modal').removeClass('is-active');
    $('#item-input').prop('disabled', false).val('');
    $('#add-button').removeClass('is-loading');
    $('.close-add-modal').removeAttr('disabled');

    // If first item is being added - select it
    if (items.toReadItems.length === 1) {
        $('.read-item').addClass('is-active');
    }
});

// Add items when app loads
if (items.toReadItems.length > 0) {
    items.toReadItems.forEach(item => items.addItem(item));
    $('.read-item:first()').addClass('is-active');
}


// Simulate add click on Enter
$('#item-input').keyup((e) => {
    if (e.key === 'Enter') $('#add-button').click();
});

// FIlter items by title
$('#search').keyup(e => {
    // Get current input search value
    let filter = $(e.currentTarget).val();
    // Filter
    $('.read-item').each((i, el) => {
        $(el).text().toLowerCase().includes(filter.toLowerCase()) ? $(el).show() : $(el).hide();
    });
});