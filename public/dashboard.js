const token = localStorage.getItem('token')
const tokentosend = { headers: { 'Authorization': token } }

document.addEventListener('DOMContentLoaded', async function () {
    try {
        const Response = await axios.get('https://spendsmart-nkgi.onrender.com/user/totalExpenses', tokentosend);
        const expensesData = Response.data[0];
        // Update the total expenses value in the card
        document.getElementById('totalExpensesAmount').textContent = `₹ ${expensesData.totalexpenses}`;
        document.getElementById('totalIncomeAmount').textContent = `₹ ${expensesData.totalincome}`;
        const net = expensesData.totalincome - expensesData.totalexpenses
        const netAmountElement = document.getElementById('netAmount');
        if (net < 0) {
            netAmountElement.style.color = 'red';
          } else if (net > 0) {
            netAmountElement.style.color = 'green';
          } else {
            netAmountElement.style.color = 'black';
          }
          
        document.getElementById('netAmount').textContent = `₹ ${net}`
        chart()
        transaction()
    } catch (error) {
        console.log(error.response.status)
        if(error.response.status === 401){
            console.log('----')
            window.location.href = "https://spendsmart-nkgi.onrender.com/user/expenses"
        }
        console.log('Error fetching total expenses:', error);
    }
});

    async function chart() {
        try {
            const expensePiechart = await axios.get('https://spendsmart-nkgi.onrender.com/user/expensesCategoryData', tokentosend);
            const incomesPiechart = await axios.get('https://spendsmart-nkgi.onrender.com/user/incomesCategoryData', tokentosend);
            const expensesChartOptions = {
                series: expensePiechart.data.map(item => Number(item.totalAmount)),
                chart: {
                    width: 400,
                    type: 'donut',
                },
                labels: expensePiechart.data.map(item => item.category)
            };
    
            const incomesChartOptions = {
                series: incomesPiechart.data.map(item => Number(item.totalAmount)),
                chart: {
                    width: 400,
                    type: 'donut',
                },
                labels: incomesPiechart.data.map(item => item.category)
                
            };
    
            var expensesChart = new ApexCharts(document.getElementById("expensesChart"), expensesChartOptions);
            var incomesChart = new ApexCharts(document.getElementById("incomesChart"), incomesChartOptions);
            expensesChart.render();
            incomesChart.render();
        } catch (err) {
            console.log(err);
        }
    }

    async function transaction(){
     try{
      const lastEntries = await axios.get('https://spendsmart-nkgi.onrender.com/user/lastEntries', tokentosend)
      console.log(lastEntries.data)
      for(let i=0; i<lastEntries.data.length; i++){
          showTransaction(lastEntries.data[i])
      }

    }catch(err){
        console.log(err)
    }
}


function showTransaction(obj) {
    const tableBody = document.getElementById('transactionTableBody');
    const tableRow = document.createElement('tr');
    
    const dateCell = document.createElement('td');
    dateCell.textContent = obj.date;
    tableRow.appendChild(dateCell);
    
    const descriptionCell = document.createElement('td');
    descriptionCell.textContent = obj.description;
    tableRow.appendChild(descriptionCell);
    
    const amountCell = document.createElement('td');
    amountCell.textContent = obj.amount;
    if (obj.type === 'expense') {
      amountCell.style.color = '#d9534f'; 
    } else {
      amountCell.style.color = '#5cb85c'; 
    }
    tableRow.appendChild(amountCell);
    
    tableBody.appendChild(tableRow);
  }
  