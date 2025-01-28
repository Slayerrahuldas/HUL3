let filterButton1Active = false;
let jsonData = []; // Global variable for JSON data

// Fetch data and initialize the page
(async () => {
    try {
        const response = await fetch("data.json"); // Replace with the correct JSON file path
        if (!response.ok) throw new Error("Failed to fetch data.");
        jsonData = await response.json();
        populateTable(jsonData);
        updateFilters(jsonData);
    } catch (error) {
        console.error("Error fetching data:", error);
    }
})();

// Populate the table with data
function populateTable(data) {
    const tableBody = document.getElementById("table-body");
    tableBody.innerHTML = ""; // Clear existing data

    data.forEach((item) => {
        const row = document.createElement("tr");
        Object.values(item).forEach((value) => {
            const cell = document.createElement("td");
            cell.textContent = value;
            row.appendChild(cell);
        });
        tableBody.appendChild(row);
    });
}

// Update dropdown filters dynamically
function updateFilters(filteredData) {
    const dropdownMapping = {
        "filter-me-name": "ME Name",
        "filter-beat": "Beat",
        "filter-launch": "Launch",
        "filter-dbo": "DBO",
    };

    Object.entries(dropdownMapping).forEach(([dropdownId, columnName]) => {
        const dropdown = document.getElementById(dropdownId);
        const uniqueOptions = [...new Set(filteredData.map((row) => row[columnName]))];

        dropdown.innerHTML = `<option value="">${columnName}</option>`;
        uniqueOptions.forEach((option) => {
            const opt = document.createElement("option");
            opt.textContent = option;
            opt.value = option;
            dropdown.appendChild(opt);
        });
    });
}

// Apply filters and update the table
function applyFilters() {
    let filteredData = [...jsonData];

    // Get dropdown filter values
    const filterValues = {
        "ME Name": document.getElementById("filter-me-name").value,
        "Beat": document.getElementById("filter-beat").value,
        "Launch": document.getElementById("filter-launch").value,
        "DBO": document.getElementById("filter-dbo").value,
    };

    // Apply dropdown filters
    Object.entries(filterValues).forEach(([column, value]) => {
        if (value) filteredData = filteredData.filter((row) => row[column] === value);
    });

    // Search Bar Filter
    const searchQuery = document.getElementById("search-bar").value.toLowerCase();
    if (searchQuery) {
        filteredData = filteredData.filter((row) =>
            ["HUL Code", "HUL Outlet Name"].some((key) =>
                row[key]?.toLowerCase().includes(searchQuery)
            )
        );
    }

    // Filter button logic
    if (filterButton1Active) {
        filteredData = filteredData.filter((row) => row["ECO"] < 500);
    }

    populateTable(filteredData);
    updateFilters(filteredData); // Update dropdowns based on current filtered data
}

// Reset all filters and table
document.getElementById("reset-button").addEventListener("click", () => {
    document.getElementById("search-bar").value = "";
    document.querySelectorAll("select").forEach((dropdown) => (dropdown.selectedIndex = 0));
    filterButton1Active = false;
    document.getElementById("filter-button-1").style.backgroundColor = "blue";
    populateTable(jsonData); // Reset to original data
    updateFilters(jsonData); // Reset dropdowns
});

// Toggle the first filter button
document.getElementById("filter-button-1").addEventListener("click", () => {
    filterButton1Active = !filterButton1Active;
    document.getElementById("filter-button-1").style.backgroundColor = filterButton1Active ? "green" : "blue";
    applyFilters();
});

// Event listeners for dropdowns and search bar
["filter-me-name", "filter-beat", "filter-launch", "filter-dbo"].forEach((id) =>
    document.getElementById(id).addEventListener("change", applyFilters)
);
document.getElementById("search-bar").addEventListener("input", applyFilters);
