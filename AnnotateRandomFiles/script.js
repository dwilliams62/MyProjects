// Array of plants
const plants = [
    {
        name: 'Plant 1',
        description: 'This is a description of Plant 1',
        price: '$10.99'
    },
    {
        name: 'Plant 2',
        description: 'This is a description of Plant 2',
        price: '$12.99'
    },
    {
        name: 'Plant 3',
        description: 'This is a description of Plant 3',
        price: '$9.99'
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
                <p>${plant.description}</p>
                <p class="price">${plant.price}</p>
            </div>
        `;
        cardsContainer.innerHTML += card;
    });
}

// Call the function to generate plant cards
generatePlantCards();