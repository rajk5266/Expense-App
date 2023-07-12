const token = localStorage.getItem('token')
const tokentosend = { headers: { 'Authorization': token } }

const reportTypeSelect = document.getElementById('reportType');
const selectedMonthSelect = document.getElementById('selectedMonth');
const customRangeDiv = document.getElementById('customRange');
const startDateInput = document.getElementById('startDate');
const endDateInput = document.getElementById('endDate');

reportTypeSelect.addEventListener('change', () => {
    const dateInput = document.getElementById('selectedDate');

    if (reportTypeSelect.value === 'date') {
        selectedMonthSelect.style.display = 'none';
        customRangeDiv.style.display = 'none';
        dateInput.style.display = 'block';
    } else if (reportTypeSelect.value === 'month') {
        selectedMonthSelect.style.display = 'block';
        customRangeDiv.style.display = 'none';
        dateInput.style.display = 'none';
    } else if (reportTypeSelect.value === 'custom') {
        selectedMonthSelect.style.display = 'none';
        customRangeDiv.style.display = 'block';
        dateInput.style.display = 'none';
    }
});

document.getElementById('generateReport').addEventListener('click', () => {
    const reportType = reportTypeSelect.value;
    let selectedValue = '';

    if (reportType === 'date') {
        selectedValue = document.getElementById('selectedDate').value;
        if (!selectedValue) {
            alert('Please select a date.');
            return;
        }
    } else if (reportType === 'custom') {
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;

        selectedValue = (startDate + ',' + endDate)
        //  console.log(selectedValue)
        if (!startDate || !endDate) {
            alert('Please select a start date and an end date.');
            return;
        }
    } else if (reportType === 'month') {
        selectedValue = document.getElementById('selectedMonth').value
    }

    generateReport(reportType, selectedValue);
});

async function generateReport(reportType, selectedValue) {
    if (reportType === 'date') {

        const dailyReport = await axios.post('http://localhost:8000/premium/report/dailyReport', { Date: selectedValue }, tokentosend)
        // console.log(dailyReport)
        showReport(dailyReport.data)

    }
    else if (reportType === 'month') {
        const monthlyReport = await axios.post('http://localhost:8000/premium/report/monthlyReport', { month: selectedValue }, tokentosend)
        
        showReport(monthlyReport.data)

    }
    else if (reportType === 'custom') {

        const customDate = selectedValue.split(',')
        const startDate = customDate[0]
        const endDate = customDate[1]
        if (startDate > endDate) {
            alert('starting date should atleast one day before end date')
          }
        const obj = {
            startDate,
            endDate
        }
        const customDateReport = await axios.post('http://localhost:8000/premium/report/customDate', obj, tokentosend)
        console.log(customDateReport)
        showReport(customDateReport.data)
    }
}

function showReport(report) {
    const reportTableBody = document.getElementById('reportTableBody');
    const total = document.getElementById('totalExpenses')
    const username = document.getElementById('userName')
    let totalAmount = 0;
    reportTableBody.innerHTML = '';

    report.forEach(data => {
        const { date, category, description, amount, name } = data
        const newRow = document.createElement('tr');

        newRow.innerHTML = `
    <td>${date}</td>
    <td>${category}</td>
    <td>${description}</td>
    <td>${amount}</td>
  `;
        totalAmount += amount
        reportTableBody.appendChild(newRow);
        // name = userName
        username.textContent = name
    })
    total.innerText = totalAmount;
}

