// Track the state of filter buttons
let filterButton1Active = false;
let jsonData = []; // Global variable to hold fetched JSON data

// Function to fetch data from JSON file
async function fetchData() {
    try {
        const response = await fetch("data.json"); // Replace with your JSON file's path
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

    data.forEach(item => {
        const row = document.createElement("tr");
        Object.values(item).forEach(value => {
            const cell = document.createElement("td");
            cell.textContent = value;
            row.appendChild(cell);
        });
        tableBody.appendChild(row);
    });
}

// Function to apply all filters and update the table
function applyFilters() {
    let filteredData = [...jsonData]; // Start with the original data

    // Get dropdown filter values
    const filterValues = {
        "ME Name": document.getElementById("filter-me-name").value,
        "Beat": document.getElementById("filter-beat").value,
        "Shikhar": document.getElementById("filter-shikhar").value,
        "Launch": document.getElementById("filter-launch").value,
        "DBO": document.getElementById("filter-dbo").value,
        "TLSD": document.getElementById("filter-tlsd").value
    };

    // Apply dropdown filters
    Object.keys(filterValues).forEach(key => {
        if (filterValues[key]) {
            filteredData = filteredData.filter(row => row[key] === filterValues[key]);
        }
    });

    // Search Bar Filter
    const searchQuery = document.getElementById("search-bar").value.toLowerCase();
    if (searchQuery) {
        filteredData = filteredData.filter(row => {
            const hulCode = row["HUL Code"] ? row["HUL Code"].toString().toLowerCase() : "";
            const outletName = row["HUL Outlet Name"] ? row["HUL Outlet Name"].toString().toLowerCase() : "";
            return hulCode.includes(searchQuery) || outletName.includes(searchQuery);
        });
    }

    // Filter Button Logic
    if (filterButton1Active) {
        filteredData = filteredData.filter(row => Number(row["Coverage"]) < 500);
    }

    // Update the table with the filtered data
    populateTable(filteredData);
    updateDropdowns(filteredData);
}

// Function to dynamically update dropdown options
function updateDropdowns(filteredData) {
    const uniqueValues = {
        "ME Name": new Set(),
        "Beat": new Set(),
        "Shikhar": new Set(),
        "Launch": new Set(),
        "DBO": new Set(),
        "TLSD": new Set()
    };

    // Collect unique options from filtered data
    filteredData.forEach(row => {
        Object.keys(uniqueValues).forEach(key => {
            if (row[key]) uniqueValues[key].add(row[key]);
        });
    });

    // Repopulate dropdowns with updated options
    Object.keys(uniqueValues).forEach(key => {
        populateSelectDropdown(`filter-${key.toLowerCase().replace(" ", "-")}`, uniqueValues[key], key);
    });
}

// Function to populate dropdown filters
function populateSelectDropdown(id, optionsSet, columnName) {
    const dropdown = document.getElementById(id);
    const selectedValue = dropdown.value; // Keep the current selection
    dropdown.innerHTML = ""; // Clear existing options

    // Add default option
    const defaultOption = document.createElement("option");
    defaultOption.textContent = columnName;
    defaultOption.value = "";
    defaultOption.selected = true;
    dropdown.appendChild(defaultOption);

    // Populate other options
    optionsSet.forEach(option => {
        const optionElement = document.createElement("option");
        optionElement.textContent = option;
        optionElement.value = option;
        if (option === selectedValue) optionElement.selected = true; // Retain previous selection
        dropdown.appendChild(optionElement);
    });
}

// Reset button functionality
document.getElementById("reset-button").addEventListener("click", () => {
    filterButton1Active = false;
    document.getElementById("filter-button-1").style.backgroundColor = "blue";

    // Reset search bar
    document.getElementById("search-bar").value = "";

    // Reset dropdown filters
    document.querySelectorAll("select").forEach(select => select.value = "");

    // Reapply filters to show the unfiltered data
    applyFilters();
});

// Event listeners for dropdowns and search bar
document.getElementById("search-bar").addEventListener("input", applyFilters);
document.querySelectorAll("select").forEach(select => select.addEventListener("change", applyFilters));

// Filter button event listeners
document.getElementById("filter-button-1").addEventListener("click", () => {
    filterButton1Active = !filterButton1Active;
    document.getElementById("filter-button-1").style.backgroundColor = filterButton1Active ? "green" : "blue";
    applyFilters();
});

// Initialize the table and filters
function initialize() {
    populateTable(jsonData);
    applyFilters(); // Ensure filters are populated based on the data
}

// Fetch data and initialize the page
fetchData();