<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HUL3 Dashboard</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <h1>Colours Weekly Update Dashboard</h1>

        <!-- Search Bar -->
        <div class="search-bar-container">
            <input type="text" id="search-bar" placeholder="Search by HUL Code or Outlet Name">
        </div>

        <!-- Dynamic Filters -->
        <div class="filters-container">
            <select id="filter-me-name"><option value="">ME Name</option></select>
            <select id="filter-beat"><option value="">Beat</option></select>
            <select id="filter-simple"><option value="">Simple</option></select>
            <select id="filter-gluta"><option value="">GLUTA</option></select>
            <select id="filter-sun-range"><option value="">Sun Range</option></select>
            <select id="filter-elle18-lqd-lip"><option value="">Elle18 Lqd Lip</option></select>
            <select id="filter-lakme-fmatte-foundation"><option value="">Lakme FMatte Foundation</option></select>
            <select id="filter-elle18-nail"><option value="">Elle18 Nail</option></select>
            <select id="filter-liner-qdel"><option value="">Liner Qdel</option></select>
            <select id="filter-hair-serum"><option value="">Hair Serum</option></select>
        </div>

        <!-- Buttons for Filtering -->
        <div class="buttons-container">
            <button id="filter-button-1">Coverage < 500</button>
            <button id="reset-button">Reset Filters</button>
        </div>

        <!-- Table -->
        <table id="data-table">
            <thead>
                <tr>
                    <th>HUL Code</th>
                    <th>HUL Outlet Name</th>
                    <th>ME Name</th>
                    <th>Beat</th>
                    <th>Coverage</th>
                    <th>Simple</th>
                    <th>GLUTA</th>
                    <th>Sun Range</th>
                    <th>Elle18 Lqd Lip</th>
                    <th>Lakme FMatte Foundation</th>
                    <th>Elle18 Nail</th>
                    <th>Liner Qdel</th>
                    <th>Hair Serum</th>
                </tr>
            </thead>
            <tbody id="table-body">
                <!-- Data will be dynamically populated here -->
            </tbody>
        </table>
    </div>

    <!-- Link to JavaScript -->
    <script src="script.js"></script>
</body>
</html>
