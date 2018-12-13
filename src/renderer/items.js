export const toReadItems = JSON.parse(localStorage.getItem('toReadItems')) || [];

// Save items to localStorage
export const saveItems = () => {
    localStorage.setItem('toReadItems', JSON.stringify(toReadItems));
}

// Add new items
export const addItem = item => {
    // Hide "No Items" message
    $('#no-items').hide();

    // New item HTML
    let itemHTML = `
    <a class="panel-block read-item">
        <figure class="image has-shadow is-64x64 thumb">
            <img src="${item.screenshot}">
        </figure>
        <h2 class="title is-4 column">${item.title}</h2>
    </a>
    `;
    // Append to read-list
    $('#read-list').append(itemHTML);
}