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
window.addEventListener('DOMContentLoaded', async () => {
    try{
        const reportHistory = await axios.get('http://localhost:8000/premium/report/history', tokentosend)
       
        for(let i=0; i<reportHistory.data.length; i++){
            showHistory(reportHistory.data[i])
        }
    }catch(err){
        console.log(err)
        if(err.response.status === 401){
            window.location.href = 'http://localhost:8000/user'
        } 
    }
})

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
const downloadReportButton = document.getElementById('downloadReport')
downloadReportButton.disabled = true

async function generateReport(reportType, selectedValue) {
    
    if (reportType === 'date') {

        const dailyReport = await axios.post('http://localhost:8000/premium/report/dailyReport', { Date: selectedValue }, tokentosend)
        showReport(dailyReport.data)
        if(dailyReport.data.length !=0){
            downloadReportButton.disabled = false;
        }
        downloadReportButton.onclick = async () => {
            try{
                const downloadReport = await axios.post('http://localhost:8000/premium/report/dailyReport/download', { Date: selectedValue }, tokentosend)
                if(downloadReport.status === 200){
                    var a = document.createElement('a');
                    a.href = downloadReport.data.fileURL;
                    console.log(downloadReport.data)
                    a.download = 'myReport.csv';
                    a.click();
                    showHistory(downloadReport.data)
                }else{
                    console.log(downloadReport.data.message)
                }
                // console.log(downloadReport)
               
            }catch(err){
                console.log(err)
            }
            }

    }
    else if (reportType === 'month') {
        const monthlyReport = await axios.post('http://localhost:8000/premium/report/monthlyReport', { month: selectedValue }, tokentosend)
        
        showReport(monthlyReport.data)
        if(monthlyReport.data.length !=0){
            downloadReportButton.disabled = false;
        }
        downloadReportButton.onclick = async () => {
            try{
                const downloadReport = await axios.post('http://localhost:8000/premium/report/monthlyReport/download', { month: selectedValue }, tokentosend)
                if(downloadReport.status === 200){
                    var a = document.createElement('a');
                    a.href = downloadReport.data.fileURL;
                    console.log(downloadReport.data)
                    a.download = 'myReport.csv';
                    a.click();
                    showHistory(downloadReport.data)
                }else{
                    console.log(downloadReport.data.message)
                }
            }catch(err){
                console.log(err)
            }
        }
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
        console.log(customDateReport.data)
        showReport(customDateReport.data)
        if(customDateReport.data.length !=0){
            downloadReportButton.disabled = false;
        }
        downloadReportButton.onclick = async () => {
                try{
                    const downloadReport = await axios.post('http://localhost:8000/premium/report/customDate/download', obj, tokentosend)
                    if(downloadReport.status === 200){
                        var a = document.createElement('a');
                        a.href = downloadReport.data.fileURL;
                        console.log(downloadReport.data)
                        a.download = 'myReport.csv';
                        a.click();
                        showHistory(downloadReport.data)
                    }else{
                        console.log(downloadReport.data.message)
                    }
                }catch(err){
                    console.log(err)
                }
        }
    }
}

function showReport(report) {
    const reportTableBody = document.getElementById('reportTableBody');
    const totalExpenses = document.getElementById('totalExpenses')
    const totalIncome = document.getElementById('totalIncome')
    const username = document.getElementById('userName')
    let totalInc = 0;
    let totalExp = 0;
    reportTableBody.innerHTML = '';

    report.forEach(data => {
        const { date, category, description,type, amount, name } = data
        const newRow = document.createElement('tr');
     
     if(type === 'expense'){
        totalExp+= amount;
         newRow.innerHTML = `
     <td>${date}</td>
     <td>${category}</td>
     <td>${description}</td>
     <td>${'Expenditures'}</td>
     <td>${amount}</td>
   `;
     }else{
        totalInc+= amount
        newRow.innerHTML = `
        <td>${date}</td>
        <td>${category}</td>
        <td>${description}</td>
        <td>${'Earnings'}</td>
        <td>${amount}</td>
        `;
    }
    
    reportTableBody.appendChild(newRow);
    // name = userName
    username.textContent = name
})
totalIncome.innerText = totalInc;
totalIncome.style.color = 'green'
totalExpenses.innerText = totalExp;
totalExpenses.style.color = 'red'
}

function showHistory(obj){
     const historyTableBody = document.getElementById('reportHistoryTableBody')

     const tableRow = document.createElement('tr');

     const dateCell = document.createElement('td');
     dateCell.textContent = obj.date;
     tableRow.appendChild(dateCell);

     const urlCell = document.createElement('td');
    const link = document.createElement('a');
    link.href = obj.fileURL;
    link.textContent = obj.fileURL;
    urlCell.appendChild(link);
    tableRow.appendChild(urlCell);

     historyTableBody.prepend(tableRow)
}



