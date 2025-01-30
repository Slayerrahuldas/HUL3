document.addEventListener("DOMContentLoaded", function() {
    const tableBody = document.getElementById('table-body');
    const searchBar = document.getElementById('search-bar');
    const filters = {
        meName: document.getElementById('filter-me-name'),
        beat: document.getElementById('filter-beat'),
        shikhar: document.getElementById('filter-shikhar'),
        launch: document.getElementById('filter-launch'),
        dbo: document.getElementById('filter-dbo'),
        tlsd: document.getElementById('filter-tlsd'),
    };
    const coverageButton = document.getElementById('filter-button-1');
    let isCoverageFiltered = false;
    let data = [];

    // Fetch JSON data
    fetch('data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch the JSON data');
            }
            return response.json();
        })
        .then(jsonData => {
            console.log('Data loaded:', jsonData);  // Debug: Check if data is loaded correctly
            data = jsonData;
            populateFilters();
            renderTable();
        })
        .catch(error => console.error('Error loading JSON data:', error));

    // Populate dropdowns
    function populateFilters() {
        const uniqueValues = {
            meName: new Set(),
            beat: new Set(),
            shikhar: new Set(),
            launch: new Set(),
            dbo: new Set(),
            tlsd: new Set(),
        };

        data.forEach(row => {
            uniqueValues.meName.add(row['ME Name']);
            uniqueValues.beat.add(row['Beat']);
            uniqueValues.shikhar.add(row['Shikhar Onboarding']);
            uniqueValues.launch.add(row['Launch']);
            uniqueValues.dbo.add(row['DBO']);
            uniqueValues.tlsd.add(row['TLSD']);
        });

        Object.keys(uniqueValues).forEach(key => {
            uniqueValues[key].forEach(value => {
                const option = document.createElement('option');
                option.value = value;
                option.textContent = value;
                filters[key].appendChild(option);
            });
        });
    }

    // Render table based on current filters
    function renderTable() {
        tableBody.innerHTML = '';
        const searchTerm = searchBar.value.toLowerCase();
        console.log('Search term:', searchTerm);  // Debug: Check the search term

        data.filter(row => {
            const hulCode = row['HUL Code'] ? row['HUL Code'].toLowerCase() : '';
            const outletName = row['HUL Outlet Name'] ? row['HUL Outlet Name'].toLowerCase() : '';

            // Debug: Check if the row is being filtered correctly
            console.log('Row:', hulCode, outletName);

            return (hulCode.includes(searchTerm) || outletName.includes(searchTerm)) &&
                (filters.meName.value === '' || row['ME Name'] === filters.meName.value) &&
                (filters.beat.value === '' || row['Beat'] === filters.beat.value) &&
                (filters.shikhar.value === '' || row['Shikhar Onboarding'] === filters.shikhar.value) &&
                (filters.launch.value === '' || row['Launch'] === filters.launch.value) &&
                (filters.dbo.value === '' || row['DBO'] === filters.dbo.value) &&
                (filters.tlsd.value === '' || row['TLSD'] === parseInt(filters.tlsd.value)) &&
                (!isCoverageFiltered || row['Covarage'] < 500);
        }).forEach(row => {
            const tr = document.createElement('tr');
            Object.values(row).forEach(cell => {
                const td = document.createElement('td');
                td.textContent = cell;
                tr.appendChild(td);
            });
            tableBody.appendChild(tr);
        });
    }

    // Toggle coverage filter
    coverageButton.addEventListener('click', () => {
        isCoverageFiltered = !isCoverageFiltered;
        coverageButton.style.backgroundColor = isCoverageFiltered ? 'green' : '';
        renderTable();
    });

    // Search bar listener
    searchBar.addEventListener('input', renderTable);

    // Dropdown filters listener
    Object.values(filters).forEach(filter => {
        filter.addEventListener('change', renderTable);
    });

    // Reset button functionality
    document.getElementById('reset-button').addEventListener('click', () => {
        searchBar.value = '';
        Object.values(filters).forEach(filter => filter.value = '');
        isCoverageFiltered = false;
        coverageButton.style.backgroundColor = '';
        renderTable();
    });
});