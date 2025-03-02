let filterButton1Active = false;
let jsonData = [];

async function fetchData() {
    try {
        const response = await fetch("data.json");
        if (!response.ok) throw new Error("Failed to fetch data.");
        jsonData = await response.json();
        initialize();
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

function populateTable(data) {
    const tableBody = document.getElementById("table-body");
    tableBody.innerHTML = "";
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

function applyFilters() {
    let filteredData = [...jsonData];
    const searchQuery = document.getElementById("search-bar").value.toLowerCase();

    if (searchQuery) {
        filteredData = filteredData.filter(row =>
            row["HUL Code"].toLowerCase().includes(searchQuery) ||
            row["HUL Outlet Name"].toLowerCase().includes(searchQuery)
        );
    }

    if (filterButton1Active) {
        filteredData = filteredData.filter(row => Number(row["Coverage"]) < 500);
    }

    populateTable(filteredData);
}

document.getElementById("reset-button").addEventListener("click", () => {
    filterButton1Active = false;
    document.getElementById("search-bar").value = "";
    applyFilters();
});

document.getElementById("filter-button-1").addEventListener("click", () => {
    filterButton1Active = !filterButton1Active;
    applyFilters();
});

function initialize() {
    populateTable(jsonData);
    applyFilters();
}

// Toggle Filter Sections
document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".filter-section").forEach(section => {
        section.addEventListener("click", function () {
            const content = this.nextElementSibling;
            content.style.display = content.style.display === "none" || content.style.display === "" ? "block" : "none";
        });
    });
});

fetchData();
