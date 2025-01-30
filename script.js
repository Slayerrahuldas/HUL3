/ Track the state of filter buttons
let filterButton1Active = false;
let jsonData = []; // Global variable to hold fetched JSON data

// Function to fetch data from JSON file
async function fetchData() {
    try {
        const response = await fetch("data.json"); // Replace 'data.json' with your JSON file's path
        if (!response.ok) throw new Error("Failed to fetch data.");
        jsonData = await response.json();
        initialize(); // Populate the table and filters after fetching data
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

// Function to populate the table
function populateTable(data) {
    const tableBody = document.getElementById("table-body");
    tableBody.innerHTML = ""; // Clear existing data
	
	data.forEach((item) => {
        const row = document.createElement("tr");
        for (const key in item) {
            const cell = document.createElement("td");
            cell.textContent = item[key];
            row.appendChild(cell);
        }
        tableBody.appendChild(row);
    });
}

// Function to apply all filters and update the table and dropdowns
function applyFilters() {
    let filteredData = [...jsonData]; // Start with the original data
	
	// Get dropdown filter values
    const filterMeName = document.getElementById("filter-me-name").value;
    const filterBeat = document.getElementById("filter-beat").value;
    const filterShikhar = document.getElementById("filter-shikhar").value;
    const filterLaunch = document.getElementById("filter-launch").value;
    const filterDBO = document.getElementById("filter-dbo").value;
    const filterTLSD = document.getElementById("filter-tlsd").value;
	
	// Apply dropdown filters
    if (filterMeName !== "") {
        filteredData = filteredData.filter((row) => row["ME Name"] === filterMeName);
    }
    if (filterBeat !== "") {
        filteredData = filteredData.filter((row) => row["Beat"] === filterBeat);
    }
    if (filterShikhar !== "") {
        filteredData = filteredData.filter((row) => row["Shikhar"] === filterShikhar);
    }
    if (filterLaunch !== "") {
        filteredData = filteredData.filter((row) => row["Launch"] === filterLaunch);
    }
	if (filterDBO !== "") {
        filteredData = filteredData.filter((row) => row["DBO"] === filterDBO);
    }
	if (filterTLSD !== "") {
        filteredData = filteredData.filter((row) => row["TLSD"] === filterTLSD);
    }
	
	// Search Bar Filter
    const searchQuery = document.getElementById("search-bar").value.toLowerCase();
    if (searchQuery) {
        filteredData = filteredData.filter((row) => {
            return (
                row["HUL Code"].toLowerCase().includes(searchQuery) ||
                row["HUL Outlet Name"].toLowerCase().includes(searchQuery)
            );
        });
    }
	
	// Filter Button Logic
    if (filterButton1Active) {
        filteredData = filteredData.filter((row) => row["Coverage"] < 500);
    }
	
	// Update the table with the filtered data
    populateTable(filteredData);

    // Dynamically update dropdown options based on filtered data
    updateDropdowns(filteredData);
}

// Function to dynamically update dropdown options
function updateDropdowns(filteredData) {
    const MeNames = new Set();
    const Beats = new Set();
    const Shikhar = new Set();
    const Launch = new Set();
    const DBO = new Set();
    const TLSD = new Set();

    // Collect unique options from filtered data
    filteredData.forEach((row) => {
        if (row["ME Name"]) detsMeNames.add(row["ME Name"]);
        if (row["Beat"]) detsBeats.add(row["Beat"]);
        if (row["Shikhar"]) fnrMeNames.add(row["Shikhar"]);
        if (row["Launch"]) fnrBeats.add(row["Launch"]);
	if (row["DBO"]) fnrBeats.add(row["DBO"]);
	if (row["TLSD"]) fnrBeats.add(row["TLSD"]);
    });

    // Repopulate dropdowns with updated options
    populateSelectDropdown("filter-me-name", detsMeNames, "ME Name");
    populateSelectDropdown("filter-beat", detsBeats, "Beat");
    populateSelectDropdown("filter-launch", fnrMeNames, "Launch");
    populateSelectDropdown("filter-shikhar", fnrBeats, "Shikhar");
    populateSelectDropdown("filter-dbo", fnrBeats, "DBO");
    populateSelectDropdown("filter-tlsd", fnrBeats, "TLSD");
}

// Function to populate dropdown filters
function populateSelectDropdown(id, optionsSet, columnName) {
    const dropdown = document.getElementById(id);
    const selectedValue = dropdown.value; // Keep the current selection
    dropdown.innerHTML = ""; // Clear existing options

    // Add the column name as the default option
    const defaultOption = document.createElement("option");
    defaultOption.textContent = columnName; // Use column name as the placeholder
    defaultOption.value = ""; // Set empty value to ignore this selection in filters
    defaultOption.selected = true; // Make it the default selected option
    dropdown.appendChild(defaultOption);

    // Populate other options
    optionsSet.forEach((option) => {
        const optionElement = document.createElement("option");
        optionElement.textContent = option;
        optionElement.value = option;
        if (option === selectedValue) optionElement.selected = true; // Retain previous selection
        dropdown.appendChild(optionElement);
    });
}

// Reset button functionality
document.getElementById("reset-button").addEventListener("click", () => {
    // Reset filter button states
    filterButton1Active = false;
    document.getElementById("filter-button-1").style.backgroundColor = "blue";
	
	// Reset search bar
    document.getElementById("search-bar").value = "";

    // Reset dropdown filters to default
    document.getElementById("filter-me-name").selectedIndex = 0;
    document.getElementById("filter-beat").selectedIndex = 0;
    document.getElementById("filter-shikhar").selectedIndex = 0;
    document.getElementById("filter-launch").selectedIndex = 0;
    document.getElementById("filter-dbo").selectedIndex = 0;
    document.getElementById("filter-tlsd").selectedIndex = 0;

    // Reapply filters to show the unfiltered data
    applyFilters();
});

// Event listeners for dropdowns and search bar
document.getElementById("search-bar").addEventListener("input", applyFilters);
document.getElementById("filter-me-name").addEventListener("change", applyFilters);
document.getElementById("filter-beat").addEventListener("change", applyFilters);
document.getElementById("filter-shikhar").addEventListener("change", applyFilters);
document.getElementById("filter-launch").addEventListener("change", applyFilters);
document.getElementById("filter-dbo").addEventListener("change", applyFilters);
document.getElementById("filter-tlsd").addEventListener("change", applyFilters);

// Filter button event listeners
document.getElementById("filter-button-1").addEventListener("click", () => {
    filterButton1Active = !filterButton1Active;
    document.getElementById("filter-button-1").style.backgroundColor = filterButton1Active ? "green" : "blue";
    applyFilters(); // Reapply all filters
});

// Initialize the table and filters
function initialize() {
    populateTable(jsonData);
    applyFilters(); // Ensure filters are populated based on the data
}

// Fetch data and initialize the page
fetchData();
