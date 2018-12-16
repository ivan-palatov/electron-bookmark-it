// Modules
const { ipcRenderer, shell } = require('electron');

// Massive that contains all items
module.exports.toReadItems = JSON.parse(localStorage.getItem('toReadItems')) || [];

// Save items to localStorage
module.exports.saveItems = () => {
    localStorage.setItem('toReadItems', JSON.stringify(this.toReadItems));
}

// Toggle item as selected
module.exports.selectItem = e => {
    $('.read-item').removeClass('is-active');
    $(e.currentTarget).addClass('is-active');
}

// Change current active item
module.exports.changeItem = direction => {
    // Get current active item
    let activeItem = $('.read-item.is-active');
    // Get direction and get item accordingly
    let newItem = (direction === 'down') ? activeItem.next('.read-item') : activeItem.prev('.read-item');
    // If newItem exists - set the new active item
    if (newItem.length) {
        activeItem.removeClass('is-active');
        newItem.addClass('is-active');
    }
}

// Open items for reading
module.exports.openItem = () => {
    // Only if items have been added
    if (!this.toReadItems.length) return;
    // Get selected item
    let targetItem = $('.read-item.is-active');
    // Get item's content URL (encoded)
    let contentUrl = encodeURIComponent(targetItem.data('url'));
    // Get item index to pass to reader window
    let itemIndex = targetItem.index() - 1;
    // Reader window URL
    let readerWinUrl = `file://${__dirname}/reader.html?url=${contentUrl}&itemIndex=${itemIndex}`;
    // Open item in a new BrowserWindow
    ipcRenderer.send('open-reader', { url: readerWinUrl, title: targetItem.data('title') });
}

// Add new items
module.exports.addItem = item => {
    // Hide "No Items" message
    $('#no-items').hide();
    // New item HTML
    let itemHTML = `
    <a class="panel-block read-item" data-url="${item.url}" data-title="${item.title}">
        <figure class="image has-shadow is-64x64 thumb">
            <img src="${item.screenshot}">
        </figure>
        <h2 class="title is-4 column">${item.title}</h2>
    </a>
    `;
    // Append to read-list
    $('#read-list').append(itemHTML);

    // Attach select event handler
    $('.read-item')
        .off('click, dblclick')
        .on('click', this.selectItem)
        .on('dblclick', this.openItem);
}

// Delete item function
module.exports.deleteItem = (item = false) => {
    // If item isnt passed, set it to index of currently selected item
    if (item === false) {
        item = $('.read-item.is-active').index() - 1;
    }

    // Remove item from DOM
    $('.read-item').eq(item).remove();
    // Remove from toReadItems array
    this.toReadItems = this.toReadItems.filter((el, i) => i !== Number(item));
    // Update local storage
    this.saveItems();

    // Select prev item or none if list is empty
    if (this.toReadItems.length) {
        // if first item was deleted, select new first item in the list
        let newItemIndex = (Number(item) === 0) ? 0 : item - 1;
        // Assign active class to a new item
        $('.read-item').eq(newItemIndex).addClass('is-active');
    } else {
        // Show no items message
        $('#no-items').show();
    }
}

// Delete item once it is read
ipcRenderer.on('mark-read', (e, item) => {
    this.deleteItem(item);
    // deleteItem(item);
});

// Open item in default browser
module.exports.openInBrowser = () => {
    // Only if there are items
    if (!this.toReadItems.length) return;

    // Get selected item
    let targetItem = $('.read-item.is-active');
    shell.openExternal(targetItem.data('url'));
}