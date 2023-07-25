const token = localStorage.getItem('token')
const tokentosend = { headers: { 'Authorization': token } }

window.addEventListener('DOMContentLoaded', async () => {
       try{
        const response  = await axios.get('https://spendsmart-nkgi.onrender.com/premium/leaderboardStatus', tokentosend)
        console.log(response)
        const result = response.data;
        // console.log(result)
        for(let i=0; i<result.length; i++){
            showLeaderboard(result[i], i+1)
        }
       }catch(err){
        if(err.response.status === 401){
            window.location.href = "https://spendsmart-nkgi.onrender.com/user/expenses"
        }
        else if(err.response.status === 404){
            window.location.href = window.location.href = 'https://spendsmart-nkgi.onrender.com/user/expenses'
        }
        console.log(err)
       }
    })
    function showLeaderboard(obj, i){

        const tableBody = document.getElementById('table-body')
        const tableRow = document.createElement('tr')

        const rankCell = document.createElement('td')
        rankCell.textContent = i

        const nameCell = document.createElement('td')
        nameCell.textContent = obj.name

        const expenseCell = document.createElement('td')
        const convertedPercent = Number(obj.savedInPercentage).toFixed(2);
        expenseCell.textContent = 100 - convertedPercent

        tableRow.appendChild(rankCell)
        tableRow.appendChild(nameCell)
        tableRow.appendChild(expenseCell)

        tableBody.appendChild(tableRow)

        }