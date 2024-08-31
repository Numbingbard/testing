  // Function to load the JSON file
  async function loadBosses() {
    try {
        const response = await fetch('bosses.json');
        const data = await response.json();
        displayBosses(data.bosses);
    } catch (error) {
        console.error('Error loading JSON file:', error);
    }
}

// Function to display the bosses in the HTML
function displayBosses(bosses) {
    const bossesList = document.getElementById('bosses-list');
    
    bosses.forEach(boss => {
        const listItem = document.createElement('th');
        listItem.textContent = boss.name;
        bossesList.appendChild(listItem);
    });
}

// Call the function to load the bosses when the page loads
loadBosses();