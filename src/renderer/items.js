export const toReadItems = JSON.parse(localStorage.getItem('toReadItems')) || [];

// Save items to localStorage
export const saveItems = () => {
    localStorage.setItem('toReadItems', JSON.stringify(toReadItems));
}

// Toggle item as selected
export const selectItem = e => {
    $('.read-item').removeClass('is-active');
    $(e.currentTarget).addClass('is-active');
}

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

export const openItem = () => {
    // Only if items have been added
    if (!toReadItems.length) return;
    // Get selected item
    let targetItem = $('.read-item.is-active');
    // Get item's content URL
    let contentUrl = targetItem.data('url');
    console.log('Opening item', contentUrl);
}

// Add new items
export const addItem = item => {
    // Hide "No Items" message
    $('#no-items').hide();

    // New item HTML
    let itemHTML = `
    <a class="panel-block read-item" data-url="${item.url}">
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