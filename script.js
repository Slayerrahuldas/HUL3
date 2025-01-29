document.addEventListener("DOMContentLoaded", function () {
    let jsonData = []; // Store loaded data
    const tableBody = document.getElementById("table-body");

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

        Object.keys(filters).forEach(filterId => {
            let select = document.getElementById(filterId);
            if (select) {
                let uniqueValues = [...new Set(data.map(row => row[filters[filterId]]).filter(v => v))];

                uniqueValues.forEach(value => {
                    let option = document.createElement("option");
                    option.value = value;
                    option.textContent = value;
                    select.appendChild(option);
                });

                select.addEventListener("change", applyFilters);
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
            "ME Name": document.getElementById("filter-me-name").value,
            "Beat": document.getElementById("filter-beat").value,
            "Shikhar Onboarding": document.getElementById("filter-shikhar").value,
            "Launch": document.getElementById("filter-launch").value,
            "DBO": document.getElementById("filter-dbo").value,
            "TLSD": document.getElementById("filter-tlsd").value
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
    }

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
});