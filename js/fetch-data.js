// static/js/fetch-data.js
async function fetchData() {
    try {
        const response = await fetch('https://tcgbusfs.blob.core.windows.net/dotapp/youbike/v2/youbike_immediate.json');
        if (!response.ok) {
            console.error('Network response was not ok', response.statusText);
            return;
        }
        const data = await response.json();
        if (!Array.isArray(data) || data.length === 0) {
            console.error('Invalid data:', data);
            return;
        }
        displayData(data);
    } catch (error) {
        console.error('Fetch error:', error);
    }
}

function displayData(data) {
    const tableContainer = document.getElementById('table-container');
    const table = document.createElement('table');
    const headerRow = document.createElement('tr');
    const headers = Object.keys(data[0]);
    headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
    });
    table.appendChild(headerRow);
	
    const mdayValue = data[0].mday;
    const mdayContainer = document.getElementById('mday-container');
    mdayContainer.textContent = `Last Updated: ${mdayValue}`;

	const selectedHeaders = ['sna', 'tot', 'sbi', 'sarea', 'sareaen', 'bemp'];
	data.forEach(item => {
		const row = document.createElement('tr');
		selectedHeaders.forEach(header => {
			const td = document.createElement('td');
			td.textContent = item[header];
			row.appendChild(td);
		});
		table.appendChild(row);
	});

    tableContainer.appendChild(table);
}

document.addEventListener('DOMContentLoaded', fetchData);
