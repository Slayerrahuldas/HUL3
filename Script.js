let jsonData = []; // Global variable for JSON data

// Fetch the data and initialize the page
(async () => {
    try {
        const response = await fetch("data.json"); // Replace with the correct JSON file path
        if (!response.ok) throw new Error("Failed to fetch data.");
        jsonData = await response.json();
        populateTable(jsonData);
        updateMeNameDropdown(jsonData);
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

// Update the ME Name dropdown dynamically
function updateMeNameDropdown(data) {
    const meNameDropdown = document.getElementById("filter-me-name");
    const uniqueMeNames = [...new Set(data.map((row) => row["ME Name"]))]; // Get unique ME Names

    meNameDropdown.innerHTML = `<option value="">Select ME Name</option>`;
    uniqueMeNames.forEach((meName) => {
        const option = document.createElement("option");
        option.textContent = meName;
        option.value = meName;
        meNameDropdown.appendChild(option);
    });

    // Add event listener for cascading effect
    meNameDropdown.addEventListener("change", () => updateBeatDropdown(data, meNameDropdown.value));
}

// Update the Beat dropdown dynamically
function updateBeatDropdown(data, selectedMeName) {
    const beatDropdown = document.getElementById("filter-beat");
    let filteredData = data;

    if (selectedMeName) {
        filteredData = data.filter((row) => row["ME Name"] === selectedMeName);
    }

    const uniqueBeats = [...new Set(filteredData.map((row) => row["Beat"]))]; // Get unique Beats
    beatDropdown.innerHTML = `<option value="">Select Beat</option>`;
    uniqueBeats.forEach((beat) => {
        const option = document.createElement("option");
        option.textContent = beat;
        option.value = beat;
        beatDropdown.appendChild(option);
    });

    beatDropdown.addEventListener("change", () =>
        updateShikharDropdown(filteredData, beatDropdown.value)
    );
    applyFilters(filteredData);
}

// Update the Shikhar dropdown dynamically
function updateShikharDropdown(data, selectedBeat) {
    const shikharDropdown = document.getElementById("filter-shikhar");
    let filteredData = data;

    if (selectedBeat) {
        filteredData = data.filter((row) => row["Beat"] === selectedBeat);
    }

    const uniqueShikharValues = [...new Set(filteredData.map((row) => row["Shikhar"]))]; // Get unique Shikhar values
    shikharDropdown.innerHTML = `<option value="">Select Shikhar</option>`;
    uniqueShikharValues.forEach((shikhar) => {
        const option = document.createElement("option");
        option.textContent = shikhar;
        option.value = shikhar;
        shikharDropdown.appendChild(option);
    });

    shikharDropdown.addEventListener("change", () =>
        updateLaunchDropdown(filteredData, shikharDropdown.value)
    );
    applyFilters(filteredData);
}

// Update the Launch dropdown dynamically
function updateLaunchDropdown(data, selectedShikhar) {
    const launchDropdown = document.getElementById("filter-launch");
    let filteredData = data;

    if (selectedShikhar) {
        filteredData = data.filter((row) => row["Shikhar"] === selectedShikhar);
    }

    const uniqueLaunchValues = [...new Set(filteredData.map((row) => row["Launch"]))]; // Get unique Launch values
    launchDropdown.innerHTML = `<option value="">Select Launch</option>`;
    uniqueLaunchValues.forEach((launch) => {
        const option = document.createElement("option");
        option.textContent = launch;
        option.value = launch;
        launchDropdown.appendChild(option);
    });

    launchDropdown.addEventListener("change", () =>
        updateDboDropdown(filteredData, launchDropdown.value)
    );
    applyFilters(filteredData);
}

// Update the DBO dropdown dynamically
function updateDboDropdown(data, selectedLaunch) {
    const dboDropdown = document.getElementById("filter-dbo");
    let filteredData = data;

    if (selectedLaunch) {
        filteredData = data.filter((row) => row["Launch"] === selectedLaunch);
    }

    const uniqueDboValues = [...new Set(filteredData.map((row) => row["DBO"]))]; // Get unique DBO values
    dboDropdown.innerHTML = `<option value="">Select DBO</option>`;
    uniqueDboValues.forEach((dbo) => {
        const option = document.createElement("option");
        option.textContent = dbo;
        option.value = dbo;
        dboDropdown.appendChild(option);
    });

    dboDropdown.addEventListener("change", () => applyFilters(filteredData));
    applyFilters(filteredData);
}

// Apply all filters and update the table
function applyFilters(data) {
    const selectedMeName = document.getElementById("filter-me-name").value;
    const selectedBeat = document.getElementById("filter-beat").value;
    const selectedShikhar = document.getElementById("filter-shikhar").value;
    const selectedLaunch = document.getElementById("filter-launch").value;
    const selectedDbo = document.getElementById("filter-dbo").value;

    let filteredData = data;

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
