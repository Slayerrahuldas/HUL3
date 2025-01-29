document.addEventListener("DOMContentLoaded", function () {
    let jsonData = []; // Store loaded data
    const tableBody = document.getElementById("table-body");
    const filterButton = document.getElementById("filter-button-1"); // Coverage < 500 button
    const resetButton = document.getElementById("reset-button"); // Reset button

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
                select.innerHTML = `<option value="">${filters[filterId]}</option>`; // Reset to header

                let uniqueValues = [...new Set(data.map(row => row[filters[filterId]]?.trim()).filter(v => v))];

                uniqueValues.forEach(value => {
                    let option = document.createElement("option");
                    option.value = value;
                    option.textContent = value;
                    select.appendChild(option);
                });

                select.addEventListener("change", function () {
                    applyFilters();
                    highlightFilterButton();
                });
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
        highlightFilterButton();
    }

    // Search Functionality
    document.getElementById("search-bar").addEventListener("input", function () {
        applyFilters();
        highlightFilterButton();
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
        highlightFilterButton();
    }

    // 🔹 Highlight Filter Button when Applied
    function highlightFilterButton() {
        let selectedFilters = document.querySelectorAll(".filters-container select");
        let isFiltered = Array.from(selectedFilters).some(select => select.value !== "");
        
        if (isFiltered) {
            filterButton.style.backgroundColor = "green";
            filterButton.style.color = "white";
        } else {
            filterButton.style.backgroundColor = "";
            filterButton.style.color = "";
        }
    }

    // 🔹 Filter Button for Coverage < 499
    filterButton.addEventListener("click", function () {
        let filteredData = jsonData.filter(row => parseInt(row["Coverage"]) < 499);
        populateTable(filteredData);
        filterButton.style.backgroundColor = "green"; // Change to green
        filterButton.style.color = "white";
        highlightFilterButton();
    });

    // 🔹 Reset Button - Restores Original Colors
    resetButton.addEventListener("click", function () {
        document.getElementById("search-bar").value = "";
        document.querySelectorAll(".filters-container select").forEach(select => select.value = "");
        populateTable(jsonData);
        populateFilters(jsonData);
        filterButton.style.backgroundColor = ""; // Reset color
        filterButton.style.color = "";
    });
});