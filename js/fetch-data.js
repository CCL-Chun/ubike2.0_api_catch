// static/js/fetch-data.js

// Make the first API response save into globalData and then used for searchTable()
// Avoid fetching data everytime while using searchTable()
let globalData = [];

// Let users to search the specific station to get info
function searchTable() {
    const input = document.getElementById('search-input');
    const filter = input.value.toLowerCase();

    // Filter the globalData based on the search input
    const filteredData = globalData.filter(item => {
        const stationName = item.sna.toLowerCase();
        return stationName.includes(filter);
    });

    // Clear the existing table
    const tableContainer = document.getElementById('table-container');
    tableContainer.innerHTML = '';

    // Re-render the table with the filtered data
    displayData(filteredData);
}

async function fetchData() {
    try {
	// Wait until the API response
        const response = await fetch('https://tcgbusfs.blob.core.windows.net/dotapp/youbike/v2/youbike_immediate.json');
	// If error (no response or others)
        if (!response.ok) {
            console.error('Network response was not ok', response.statusText);
            return;
        }
	// Wait until getting JSON
        const data = await response.json();
	// If error
        if (!Array.isArray(data) || data.length === 0) {
            console.error('Invalid data:', data);
            return;
        }
	// Save JSON response to globalData
	globalData = data;
        displayData(data);
    } catch (error) {
        console.error('Fetch error:', error);
    }
}

// Convert JSON to a readable table with selected columns and orders
function displayData(data) {
    // Create a table-container to put the table in
    const tableContainer = document.getElementById('table-container');
    const table = document.createElement('table');
    // keep the table width (especially after searching) 
    table.style.width = '100%';
    // Create <thead> element and add a sticky header (setup in style.css)
    const thead = document.createElement('thead');
    thead.classList.add('sticky-table-header');
    const headerRow = document.createElement('tr');
    const customHeaders = ['Station', 'Available', 'District', 'District_en', 'Vacant', 'Overall Capacity'];
    // Put custom header order into each <th> element
    customHeaders.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);
    // Append each element to table in order

    // Get the response time and create mday-container
    const mdayValue = data[0].mday;
    const mdayContainer = document.getElementById('mday-container');
    mdayContainer.textContent = `Last Updated: ${mdayValue}`;
    //Get table contents row by row
    const selectedHeaders = ['sna', 'sbi', 'sarea', 'sareaen', 'bemp', 'tot'];
    data.forEach(item => {
	const row = document.createElement('tr');
	selectedHeaders.forEach(header => {
		const td = document.createElement('td');
		td.textContent = item[header];
		row.appendChild(td);
	});
	table.appendChild(row);
    });
    // Append the following table contents
    tableContainer.appendChild(table);
}

document.addEventListener('DOMContentLoaded', fetchData);
