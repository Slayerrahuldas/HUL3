document.addEventListener("DOMContentLoaded", function () {
    fetchData();
});

let jsonData = [];
let filterButton1Active = false;

async function fetchData() {
    try {
        const response = await fetch("data.json"); // Ensure your JSON file is accessible
        jsonData = await response.json();
        console.log("Fetched Data:", jsonData); // Debugging Log
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
            console.log(`Values for ${key}:`, uniqueValues); // Debugging Log
            filterElement.innerHTML = `<option value="">${key}</option>` + 
                uniqueValues.map(value => `<option value="${value}">${value}</option>`).join("");
        } else {
            console.error(`Element not found: ${id}`);
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

    console.log("Filtered Data:", filteredData); // Debugging Log
    populateFilters(filteredData); // Update filters dynamically based on filtered data
    populateTable(filteredData);

    // Dynamically update "Beat" filter based on selected "ME Name"
    const selectedME = document.getElementById("filter-me-name").value;
    if (selectedME) {
        const relevantBeats = [...new Set(filteredData.filter(item => item["ME Name"] === selectedME).map(item => item["Beat"]).filter(Boolean))];
        const beatFilter = document.getElementById("filter-beat");
        beatFilter.innerHTML = `<option value="">Beat</option>` + relevantBeats.map(value => `<option value="${value}">${value}</option>`).join("");
    }
}

// Event Listeners
document.getElementById("reset-button").addEventListener("click", () => {
    filterButton1Active = false;
    document.getElementById("filter-button-1").style.backgroundColor = "blue";
    document.getElementById("search-bar").value = "";
    document.querySelectorAll("select").forEach(select => select.value = "");
    populateFilters(jsonData); // Ensure filters repopulate correctly
    setTimeout(applyFilters, 0); // Delay to ensure filters reset before applying
});

document.getElementById("search-bar").addEventListener("input", applyFilters);
document.querySelectorAll("select").forEach(select => select.addEventListener("change", applyFilters));

document.getElementById("filter-button-1").addEventListener("click", () => {
    filterButton1Active = !filterButton1Active;
    document.getElementById("filter-button-1").style.backgroundColor = filterButton1Active ? "green" : "blue";
    applyFilters();
});
