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
    const filterValues = {
        "ME Name": document.getElementById("filter-me-name").value,
        "Beat": document.getElementById("filter-beat").value,
        "Simple": document.getElementById("filter-simple").value,
        "GLUTA": document.getElementById("filter-gluta").value,
        "Sun Range": document.getElementById("filter-sun-range").value,
        "Elle18 Lqd Lip": document.getElementById("filter-elle18-lqd-lip").value,
        "Lakme FMatte Foundation": document.getElementById("filter-lakme-fmatte-foundation").value,
        "Elle18 Nail": document.getElementById("filter-elle18-nail").value,
        "Liner Qdel": document.getElementById("filter-liner-qdel").value,
        "Hair Serum": document.getElementById("filter-hair-serum").value
    };

    Object.keys(filterValues).forEach(key => {
        if (filterValues[key]) {
            filteredData = filteredData.filter(row => row[key] === filterValues[key]);
        }
    });

    const searchQuery = document.getElementById("search-bar").value.toLowerCase();
    if (searchQuery) {
        filteredData = filteredData.filter(row => {
            return row["HUL Code"].toLowerCase().includes(searchQuery) ||
                   row["HUL Outlet Name"].toLowerCase().includes(searchQuery);
        });
    }

    if (filterButton1Active) {
        filteredData = filteredData.filter(row => Number(row["Coverage"]) < 500);
    }
    
    populateTable(filteredData);
}

document.getElementById("reset-button").addEventListener("click", () => {
    filterButton1Active = false;
    document.getElementById("filter-button-1").style.backgroundColor = "blue";
    document.getElementById("search-bar").value = "";
    document.querySelectorAll("select").forEach(select => select.value = "");
    applyFilters();
});

document.getElementById("search-bar").addEventListener("input", applyFilters);
document.querySelectorAll("select").forEach(select => select.addEventListener("change", applyFilters));
document.getElementById("filter-button-1").addEventListener("click", () => {
    filterButton1Active = !filterButton1Active;
    document.getElementById("filter-button-1").style.backgroundColor = filterButton1Active ? "green" : "blue";
    applyFilters();
});

function initialize() {
    populateTable(jsonData);
    applyFilters();
}

fetchData();
