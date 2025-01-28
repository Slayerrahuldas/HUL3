let jsonData = []; // Global variable for JSON data

// Fetch the data and initialize the dropdowns and table
(async () => {
    try {
        const response = await fetch("data.json"); // Replace with your JSON file path
        if (!response.ok) throw new Error("Failed to fetch data.");
        jsonData = await response.json();
        populateTable(jsonData);
        updateDropdown("filter-me-name", "ME Name", jsonData);
    } catch (error) {
        console.error("Error fetching data:", error);
    }
})();

// Populate the table with data
function populateTable(data) {
    const tableBody = document.getElementById("table-body");
    tableBody.innerHTML = ""; // Clear existing rows

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

// Function to update a dropdown dynamically
function updateDropdown(dropdownId, columnName, data, dependentValue) {
    const dropdown = document.getElementById(dropdownId);

    // Filter data if dependent value is provided
    const filteredData = dependentValue
        ? data.filter((row) => row[columnName] === dependentValue)
        : data;

    // Get unique values for the dropdown
    const uniqueValues = [...new Set(filteredData.map((row) => row[columnName]))];
    dropdown.innerHTML = `<option value="">Select ${columnName}</option>`; // Default option

    uniqueValues.forEach((value) => {
        const option = document.createElement("option");
        option.textContent = value;
        option.value = value;
        dropdown.appendChild(option);
    });

    // Add event listener to trigger the next dropdown and update the table
    dropdown.onchange = () => {
        const selectedValue = dropdown.value;
        switch (dropdownId) {
            case "filter-me-name":
                updateDropdown("filter-beat", "Beat", jsonData, selectedValue);
                break;
            case "filter-beat":
                updateDropdown("filter-shikhar", "Shikhar", jsonData.filter((row) => row["ME Name"] === document.getElementById("filter-me-name").value), selectedValue);
                break;
            case "filter-shikhar":
                updateDropdown("filter-launch", "Launch", jsonData.filter((row) =>
                    row["ME Name"] === document.getElementById("filter-me-name").value &&
                    row["Beat"] === document.getElementById("filter-beat").value
                ), selectedValue);
                break;
            case "filter-launch":
                updateDropdown("filter-dbo", "DBO", jsonData.filter((row) =>
                    row["ME Name"] === document.getElementById("filter-me-name").value &&
                    row["Beat"] === document.getElementById("filter-beat").value &&
                    row["Shikhar"] === document.getElementById("filter-shikhar").value
                ), selectedValue);
                break;
        }

        // Update the table based on all selected filters
        applyFilters();
    };
}

// Apply all filters and update the table
function applyFilters() {
    let filteredData = [...jsonData];

    const selectedMeName = document.getElementById("filter-me-name").value;
    const selectedBeat = document.getElementById("filter-beat").value;
    const selectedShikhar = document.getElementById("filter-shikhar").value;
    const selectedLaunch = document.getElementById("filter-launch").value;
    const selectedDbo = document.getElementById("filter-dbo").value;

    if (selectedMeName) {
        filteredData = filteredData.filter((row) => row["ME Name"] === selectedMeName);
    }
    if (selectedBeat) {
        filteredData = filteredData.filter((row) => row["Beat"] === selectedBeat);
    }
    if (selectedShikhar) {
        filteredData = filteredData.filter((row) => row["Shikhar"] === selectedShikhar);
    }
    if (selectedLaunch) {
        filteredData = filteredData.filter((row) => row["Launch"] === selectedLaunch);
    }
    if (selectedDbo) {
        filteredData = filteredData.filter((row) => row["DBO"] === selectedDbo);
    }

    populateTable(filteredData);
}
