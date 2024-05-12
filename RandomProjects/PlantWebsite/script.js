// Array of plants
const plants = [
    {
        name: 'Plant 1',
        description: 'This is a description of Plant 1',
        price: '$10.99',
        category: 'Flowers'
    },
    {
        name: 'Plant 2',
        description: 'This is a description of Plant 2',
        price: '$12.99',
        category: 'Trees'
    },
    {
        name: 'Plant 3',
        description: 'This is a description of Plant 3',
        price: '$9.99',
        category: 'Vegetables'
    },
    {
        name: 'A Really Long Plant Name That Is At Least Thirty Words So We Can See How The Card Handles It',
        description: 'This plant has a really long name and we want to see how it looks on the card.',
        price: '$14.99',
        category: 'Fruits'
    },
    {
        name: 'Plant 5',
        description: 'This plant has a really long description that is at least thirty words so we can see how the card handles it. This plant has a really long description that is at least thirty words so we can see how the card handles it.',
        price: '$16.99',
        category: 'Herbs'
    },
    {
        name: 'Plant 6',
        description: 'This is a description of Plant 6',
        price: '$19.99',
        category: 'Flowers'
    }
];

// Function to generate plant cards
function generatePlantCards() {
    const cardsContainer = document.querySelector('.cards');
    plants.forEach((plant) => {
        const card = `
            <div class="card">
                <div class="image-placeholder">Image of ${plant.name}</div>
                <h2>${plant.name}</h2>
                <p>${plant.category}</p>
                <p>${plant.description}</p>
                <p class="price">${plant.price}</p>
            </div>
        `;
        cardsContainer.innerHTML += card;
    });
}

// Call the function to generate plant cards
generatePlantCards();

const form = document.getElementById('add-plant-form');

// Add an event listener to the form's submit event
form.addEventListener('submit', (event) => {
    // Prevent the default form submission behavior
    event.preventDefault();

    // Get the values from the form inputs
    const name = document.getElementById('name').value;
    const description = document.getElementById('description').value;
    const price = document.getElementById('price').value;
    const category = document.getElementById('category').value;

    // Create a new plant object
    const newPlant = {
        name,
        description,
        price,
        category
    };

    // Add the new plant to the plants array
    plants.push(newPlant);

    // Clear the form inputs
    document.getElementById('name').value = '';
    document.getElementById('description').value = '';
    document.getElementById('price').value = '';

    // Generate the new plant card
    const cardsContainer = document.querySelector('.cards');
    const card = `
        <div class="card">
            <div class="image-placeholder">Image of ${newPlant.name}</div>
            <h2>${newPlant.name}</h2>
            <p>${newPlant.category}</p>
            <p>${newPlant.description}</p>
            <p class="price">${newPlant.price}</p>
        </div>
    `;
    cardsContainer.innerHTML += card;
});

const categoryLinks = document.querySelectorAll('aside ul li a');

// Add an event listener to each link
categoryLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
        // Prevent the default link behavior
        event.preventDefault();

        // Get the category from the link text
        const category = link.textContent;

        // Filter the plants by category
        const filteredPlants = plants.filter((plant) => plant.category === category);

        // Clear the cards container
        const cardsContainer = document.querySelector('.cards');
        cardsContainer.innerHTML = '';

        // Generate new cards for the filtered plants
        filteredPlants.forEach((plant) => {
            const card = `
                <div class="card">
                    <div class="image-placeholder">Image of ${plant.name}</div>
                    <h2>${plant.name}</h2>
                    <p>${plant.category}</p>
                    <p>${plant.description}</p>
                    <p class="price">${plant.price}</p>
                </div>
            `;
            cardsContainer.innerHTML += card;
        });
    });
});

const allLink = document.getElementById('all');

// Add an event listener to the all link
allLink.addEventListener('click', (event) => {
    // Prevent the default link behavior
    event.preventDefault();

    // Clear the cards container
    const cardsContainer = document.querySelector('.cards');
    cardsContainer.innerHTML = '';

    // Generate new cards for all plants
    plants.forEach((plant) => {
        const card = `
            <div class="card">
                <div class="image-placeholder">Image of ${plant.name}</div>
                <h2>${plant.name}</h2>
                <p>${plant.category}</p>
                <p>${plant.description}</p>
                <p class="price">${plant.price}</p>
            </div>
        `;
        cardsContainer.innerHTML += card;
    });
});