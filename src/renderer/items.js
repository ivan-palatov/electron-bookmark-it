// Modules
const { ipcRenderer } = require('electron');

// Massive that contains all items
export let toReadItems = JSON.parse(localStorage.getItem('toReadItems')) || [];

// Save items to localStorage
export const saveItems = () => {
    localStorage.setItem('toReadItems', JSON.stringify(toReadItems));
}

// Toggle item as selected
export const selectItem = e => {
    $('.read-item').removeClass('is-active');
    $(e.currentTarget).addClass('is-active');
}

// Change current active item
export const changeItem = direction => {
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
export const openItem = () => {
    // Only if items have been added
    if (!toReadItems.length) return;
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
export const addItem = item => {
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
        .on('click', selectItem)
        .on('dblclick', openItem);
}

// Delete item once it is read
ipcRenderer.on('mark-read', (e, item) => {
    // Remove item from DOM
    $('.read-item').eq(item).remove();
    // Remove from toReadItems array
    toReadItems = toReadItems.filter((el, i) => i !== Number(item));
    // Update local storage
    saveItems();

    // Select prev item or none if list is empty
    if (toReadItems.length) {
        // if first item was deleted, select new first item in the list
        let newItemIndex = (Number(item) === 0) ? 0 : item - 1;
        // Assign active class to a new item
        $('.read-item').eq(newItemIndex).addClass('is-active');
    } else {
        // Show no items message
        $('#no-items').show();
    }
});