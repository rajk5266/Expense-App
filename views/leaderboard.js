const token = localStorage.getItem('token')
const tokentosend = { headers: { 'Authorization': token } }

window.addEventListener('DOMContentLoaded', async () => {
       try{
        const response  = await axios.get('http://localhost:8000/premium/leaderboardStatus', tokentosend)
        console.log(response.data)
        const result = response.data;
        for(let i=0; i<result.length; i++){
            showLeaderboard(result[i], i+1)
        }
       }catch(err){
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
        expenseCell.textContent = obj.totalExpenses
    
        tableRow.appendChild(rankCell)
        tableRow.appendChild(nameCell)
        tableRow.appendChild(expenseCell)
    
        tableBody.appendChild(tableRow)
      
        }