document.addEventListener("DOMContentLoaded", function () {
    fetchData();
});

let jsonData = [];
let filterButton1Active = false;

async function fetchData() {
    try {
        const response = await fetch("data.json");
        jsonData = await response.json();
        console.log("Fetched Data:", jsonData);
        populateFilters();
        populateTable(jsonData);
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

function populateTable(data) {
    const tableBody = document.getElementById("table-body");
    tableBody.innerHTML = "";
    data.forEach(row => {
        const tr = document.createElement("tr");
        Object.values(row).forEach(value => {
            const td = document.createElement("td");
            td.textContent = value;
            tr.appendChild(td);
        });
        tableBody.appendChild(tr);
    });
}

function populateFilters(filteredData = jsonData) {
    const filterKeys = {
        "ME Name": "filter-me-name",
        "Beat": "filter-beat",
        "Simple": "filter-simple",
        "GLUTA": "filter-gluta",
        "Sun Range": "filter-sun-range",
        "Elle18 Lqd Lip": "filter-elle18-lqd-lip",
        "Lakme FMatte Foundation": "filter-lakme-fmatte-foundation",
        "Elle18 Nail": "filter-elle18-nail",
        "Liner Qdel": "filter-liner-qdel"
    };

    Object.entries(filterKeys).forEach(([key, id]) => {
        const filterElement = document.getElementById(id);
        if (filterElement) {
            let uniqueValues = [...new Set(filteredData.map(item => item[key]).filter(Boolean))];
            filterElement.innerHTML = `<option value="">${key}</option>` + 
                uniqueValues.map(value => `<option value="${value}">${value}</option>`).join("");
        }
    });
}

function applyFilters() {
    let filteredData = [...jsonData];

    const filterValues = {
        "ME Name": document.getElementById("filter-me-name").value,
        "Beat": document.getElementById("filter-beat").value,
        "Simple": document.getElementById("filter-simple").value,
        "GLUTA": document.getElementById("filter-gluta").value,
        "Sun Range": document.getElementById("filter-sun-range").value,
        "Elle18 Lqd Lip": document.getElementById("filter-elle18-lqd-lip").value,
        "Lakme FMatte Foundation": document.getElementById("filter-lakme-fmatte-foundation").value,
        "Elle18 Nail": document.getElementById("filter-elle18-nail").value,
        "Liner Qdel": document.getElementById("filter-liner-qdel").value
    };

    Object.keys(filterValues).forEach(key => {
        if (filterValues[key]) {
            filteredData = filteredData.filter(row => row[key] === filterValues[key]);
        }
    });

    populateFilters(filteredData);
    populateTable(filteredData);
}

// Cascading Filters for all dropdowns
document.querySelectorAll("select").forEach(select => {
    select.addEventListener("change", applyFilters);
});

// Event Listeners
document.getElementById("reset-button").addEventListener("click", () => {
    filterButton1Active = false;
    document.getElementById("filter-button-1").style.backgroundColor = "blue";
    document.getElementById("search-bar").value = "";
    document.querySelectorAll("select").forEach(select => select.value = "");
    fetchData();
});

document.getElementById("search-bar").addEventListener("input", applyFilters);
document.getElementById("filter-button-1").addEventListener("click", () => {
    filterButton1Active = !filterButton1Active;
    document.getElementById("filter-button-1").style.backgroundColor = filterButton1Active ? "green" : "blue";
    applyFilters();
});
