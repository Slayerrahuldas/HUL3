document.addEventListener("DOMContentLoaded", function () {
    let jsonData = []; // Store loaded data
    const tableBody = document.getElementById("table-body");
    const coverageButton = document.getElementById("filter-button-1");
    const resetButton = document.getElementById("reset-button");

    // Load JSON Data
    fetch("data.json")
        .then(response => response.json())
        .then(data => {
            jsonData = data;
            populateTable(jsonData);
            populateFilters(jsonData);
        })
        .catch(error => console.error("Error loading JSON:", error));

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
        const filters = {
            "filter-me-name": "ME Name",
            "filter-beat": "Beat",
            "filter-shikhar": "Shikhar Onboarding",
            "filter-launch": "Launch",
            "filter-dbo": "DBO",
            "filter-tlsd": "TLSD"
        };

        // Populate each dropdown with unique values
        Object.keys(filters).forEach(filterId => {
            let select = document.getElementById(filterId);
            if (select) {
                // Reset dropdown with 'ALL' option as default
                select.innerHTML = `<option value="">ALL</option>`;

                let uniqueValues = [...new Set(data.map(row => row[filters[filterId]]?.trim()).filter(v => v))];

                uniqueValues.forEach(value => {
                    let option = document.createElement("option");
                    option.value = value;
                    option.textContent = value;
                    select.appendChild(option);
                });

                // Add event listener to update other filters when one is selected
                select.addEventListener("change", updateFilters);
            }
        });
    }

    // Function to Update Filters Based on Selected Values
    function updateFilters() {
        let selectedFilters = {
            "ME Name": document.getElementById("filter-me-name").value,
            "Beat": document.getElementById("filter-beat").value,
            "Shikhar Onboarding": document.getElementById("filter-shikhar").value,
            "Launch": document.getElementById("filter-launch").value,
            "DBO": document.getElementById("filter-dbo").value,
            "TLSD": document.getElementById("filter-tlsd").value
        };

        let filteredData = jsonData.filter(row => {
            return (
                (selectedFilters["ME Name"] === "" || row["ME Name"] === selectedFilters["ME Name"]) &&
                (selectedFilters["Beat"] === "" || row["Beat"] === selectedFilters["Beat"]) &&
                (selectedFilters["Shikhar Onboarding"] === "" || row["Shikhar Onboarding"] === selectedFilters["Shikhar Onboarding"]) &&
                (selectedFilters["Launch"] === "" || row["Launch"] === selectedFilters["Launch"]) &&
                (selectedFilters["DBO"] === "" || row["DBO"] === selectedFilters["DBO"]) &&
                (selectedFilters["TLSD"] === "" || row["TLSD"] === selectedFilters["TLSD"])
            );
        });

        populateTable(filteredData);

        // Update dropdowns dynamically based on remaining filtered data
        Object.keys(selectedFilters).forEach(filterKey => {
            let select = document.getElementById(`filter-${filterKey.toLowerCase().replace(/\s+/g, '-')}`);
            if (select) {
                let uniqueValues = [...new Set(filteredData.map(row => row[filterKey]).filter(v => v))];

                // Keep the original 'ALL' option
                select.innerHTML = `<option value="">ALL</option>`;
                
                uniqueValues.forEach(value => {
                    let option = document.createElement("option");
                    option.value = value;
                    option.textContent = value;
                    select.appendChild(option);
                });

                // Restore previously selected value if still available
                if (selectedFilters[filterKey] && uniqueValues.includes(selectedFilters[filterKey])) {
                    select.value = selectedFilters[filterKey];
                }
            }
        });
    }

    // Search Functionality
    document.getElementById("search-bar").addEventListener("input", function () {
        applyFilters();
    });

    // Apply Filter Function
    function applyFilters() {
        let searchTerm = document.getElementById("search-bar").value.trim().toLowerCase();
        let selectedFilters = {
            "ME Name": document.getElementById("filter-me-name").value.trim(),
            "Beat": document.getElementById("filter-beat").value.trim(),
            "Shikhar Onboarding": document.getElementById("filter-shikhar").value.trim(),
            "Launch": document.getElementById("filter-launch").value.trim(),
            "DBO": document.getElementById("filter-dbo").value.trim(),
            "TLSD": document.getElementById("filter-tlsd").value.trim()
        };

        let filteredData = jsonData.filter(row => {
            return (
                (searchTerm === "" || row["HUL Code"].toString().toLowerCase().includes(searchTerm) ||
                    row["HUL Outlet Name"].toString().toLowerCase().includes(searchTerm)) &&
                (selectedFilters["ME Name"] === "" || row["ME Name"] === selectedFilters["ME Name"]) &&
                (selectedFilters["Beat"] === "" || row["Beat"] === selectedFilters["Beat"]) &&
                (selectedFilters["Shikhar Onboarding"] === "" || row["Shikhar Onboarding"] === selectedFilters["Shikhar Onboarding"]) &&
                (selectedFilters["Launch"] === "" || row["Launch"] === selectedFilters["Launch"]) &&
                (selectedFilters["DBO"] === "" || row["DBO"] === selectedFilters["DBO"]) &&
                (selectedFilters["TLSD"] === "" || row["TLSD"] === selectedFilters["TLSD"])
            );
        });

        populateTable(filteredData);
        updateFilters();
    }

    // Filter Button for Coverage < 500
    coverageButton.addEventListener("click", function () {
        let filteredData = jsonData.filter(row => parseInt(row["Coverage"]) < 500);
        populateTable(filteredData);
        updateFilters();
        coverageButton.style.backgroundColor = "green"; // Change color to green
    });

    // Reset Button
    resetButton.addEventListener("click", function () {
        document.getElementById("search-bar").value = "";
        document.querySelectorAll(".filters-container select").forEach(select => select.value = "");
        populateTable(jsonData);
        populateFilters(jsonData);
        resetButton.style.backgroundColor = ""; // Reset color
        coverageButton.style.backgroundColor = ""; // Reset color for Coverage button
    });
});