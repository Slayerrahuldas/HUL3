document.addEventListener("DOMContentLoaded", function () {
    let jsonData = []; // Store loaded data
    const tableBody = document.getElementById("table-body");

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

    // Function to Populate Table
    function populateTable(data) {
        tableBody.innerHTML = ""; // Clear existing rows
        data.forEach(row => {
            let tr = document.createElement("tr");
            Object.values(row).forEach(value => {
                let td = document.createElement("td");
                td.textContent = value;
                tr.appendChild(td);
            });
            tableBody.appendChild(tr);
        });
    }

    // Function to Populate Filters Dynamically
    function populateFilters(data) {
        const columns = ["ME Name", "Beat", "Launch", "DBO", "TLSD"];
        columns.forEach((col, index) => {
            let select = document.getElementById(`filter-${col.toLowerCase().replace(/\s+/g, '-')}`);
            let uniqueValues = [...new Set(data.map(row => row[col]).filter(v => v))];

            uniqueValues.forEach(value => {
                let option = document.createElement("option");
                option.value = value;
                option.textContent = value;
                select.appendChild(option);
            });
        });
    }

    // Search Functionality
    document.getElementById("search-bar").addEventListener("input", function () {
        let searchTerm = this.value.toLowerCase();
        let filteredData = jsonData.filter(row =>
            row["HUL Code"].toLowerCase().includes(searchTerm) ||
            row["HUL Outlet Name"].toLowerCase().includes(searchTerm)
        );
        populateTable(filteredData);
    });

    // Dropdown Filters
    document.querySelectorAll(".filters-container select").forEach(select => {
        select.addEventListener("change", applyFilters);
    });

    // Filter Button for Coverage < 499
    document.getElementById("filter-button-1").addEventListener("click", function () {
        let filteredData = jsonData.filter(row => parseInt(row["Coverage"]) < 499);
        populateTable(filteredData);
    });

    // Reset Button
    document.getElementById("reset-button").addEventListener("click", function () {
        document.getElementById("search-bar").value = "";
        document.querySelectorAll(".filters-container select").forEach(select => select.value = "");
        populateTable(jsonData);
    });

    // Apply Filter Function
    function applyFilters() {
        let filteredData = jsonData.filter(row => {
            return (
                (document.getElementById("filter-me-name").value === "" || row["ME Name"] === document.getElementById("filter-me-name").value) &&
                (document.getElementById("filter-beat").value === "" || row["Beat"] === document.getElementById("filter-beat").value) &&
                (document.getElementById("filter-launch").value === "" || row["Launch"] === document.getElementById("filter-launch").value) &&
                (document.getElementById("filter-fnr-beat").value === "" || row["DBO"] === document.getElementById("filter-fnr-beat").value) &&
                (document.getElementById("filter-fnr-beat").value === "" || row["TLSD"] === document.getElementById("filter-fnr-beat").value)
            );
        });
        populateTable(filteredData);
    }
});