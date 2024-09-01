// Sample data
const pokemonList = [
    { name: "Charmander", type: "Fire" },
    { name: "Squirtle", type: "Water" },
    { name: "Bulbasaur", type: "Grass" },
    { name: "Pikachu", type: "Electric" },
    // Add more Pokemon with types
  ];
  
  const moveList = [
    "Thunderbolt",
    "Ember",
    "Water Gun",
    "Growl",
    // Add more Move names
  ];
  
  // Function to populate the dropdowns
  function populateDropdowns(selector, data) {
    const selectElement = document.getElementById(selector);
    data.forEach((option) => {
      const optionElement = document.createElement("option");
      optionElement.textContent = option.name || option;  // Add name for Pokemon options
      optionElement.value = option.name || option;
      selectElement.appendChild(optionElement);
    });
  }
  
  // Pokeman types to color mapping
  const pokemonTypeColors = {
    Fire: "#FFA500", // Updated to a brighter fire color
    Water: "#00BFFF", // Updated to a brighter water color
    Grass: "#80FF80",
    Electric: "#FFFF00",
    // Add more colors for other types as you add Pokemon
  };
  
  populateDropdowns("pokemonSelect", pokemonList);
  populateDropdowns("moveSelect", moveList);
  
  function displayResults() {
    const selectedPokemon = document.getElementById("pokemonSelect").value;
    const selectedMove = document.getElementById("moveSelect").value;
    const resultElement = document.getElementById("result");
    const container = document.querySelector(".container");
  
    // Validation: Check if both Pokemon and Move are selected
    if (!selectedPokemon || !selectedMove) {
      alert("Please select both a Pokemon and a Move.");
      return;
    }
  
    // Find the selected Pokemon object from the pokemonList
    const selectedPokemonObject = pokemonList.find((pokemon) => pokemon.name === selectedPokemon);
  
    // Set theme color based on Pokemon type
    const selectedType = selectedPokemonObject?.type;  // Use optional chaining for safety
    if (selectedType in pokemonTypeColors) {
      container.style.backgroundColor = pokemonTypeColors[selectedType];
      resultElement.style.color = pokemonTypeColors[selectedType];
    } else {
      container.style.backgroundColor = "#f2f2f2";  // Default background color
      resultElement.style.color = "black";  // Default result text color
    }
  
    const resultText = `<span style="color: white;">${selectedPokemon}</span> will learn <span style="color: white;">${selectedMove}</span> today!`; 
    // Wrap pokemon and move in spans to set white text color
    resultElement.innerHTML = resultText; // Use innerHTML for colored text
    
    // Add a little padding to make everything look neater
    container.style.padding = "20px";
    resultElement.style.padding = "10px";
    button.style.padding = "10px 20px";
  }  