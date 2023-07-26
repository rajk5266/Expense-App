const token = localStorage.getItem('token')
const tokentosend = { headers: { 'Authorization': token } }
// console.log(tokentosend)
window.addEventListener('DOMContentLoaded',
    async () => {
        try {
            const limitSelect = document.getElementById('pgLimit');
            const selectedLimit = localStorage.getItem('selectedLimit');
            if (selectedLimit) {
                limitSelect.value = selectedLimit;
            } else {
                limitSelect.value = document.getElementById('defaultOption').value;
            }
            const limit = limitSelect.value;
            const response = await axios.get(`https://spendsmart-nkgi.onrender.com/api/userData/1/${limit}`, tokentosend)
            const pageButton = response.data.totalPages
            const ispremium = await axios.get('https://spendsmart-nkgi.onrender.com/profile', tokentosend)
            const ispremiumStatus = ispremium.data.ispremium

            if (ispremiumStatus) {

                premiumFeatures()
            } else {
                notPremiumFeatures(ispremiumStatus)
            }
            for (let i = response.data.expenses.length-1; i >=0 ; i--) {
                showExpensesList(response.data.expenses[i])
            }

            generateButton(pageButton)
        }
        catch (error) {
            console.log(error)
            if (error.response.status == 401) {

                window.location.href = 'https://spendsmart-nkgi.onrender.com'
            }
        }
    })


async function adding(event) {
    event.preventDefault()

    var date = event.target.date.value;
    var description = event.target.description.value;
    var amount = event.target.amt.value;
    var type = event.target.type.value
    var category;
    if (type === 'expense') {
        category = event.target.expenseCategory.value;
    } else if (type === 'income') {
        category = event.target.incomeCategory.value;
    }

    const updateId = document.getElementById('submitButton').dataset.updateId

    const obj = {
        date,
        description,
        category,
        amount,
        type
    }
    if(updateId){
        try{
            const response = await axios.put(`https://spendsmart-nkgi.onrender.com/api/userData/${updateId}`, obj, tokentosend)
            showExpensesList(response.data);
            delete document.getElementById('submitButon').dataset.updateId;
        }
        catch(err){
            console.log(err)
        }
        resetSubmitbuttonValue()
    }
    else{
        try{
            console.log(obj)
            const response = await axios.post('https://spendsmart-nkgi.onrender.com/api/userData', obj, tokentosend)
            console.log(response)
            showExpensesList(response.data);

        }catch(err){
            console.log(err)
        }
    }
}

function resetSubmitbuttonValue(){
    document.getElementById('submitButton').innerText = 'Add expense'
}

function showExpensesList(obj) {
    const type = obj.type
    const tableBody = document.getElementById('expensesTableBody');
    const tableRow = document.createElement('tr');

    const dateCell = document.createElement('td');
    dateCell.textContent = obj.date;
    tableRow.appendChild(dateCell);

    const descriptionCell = document.createElement('td');
    descriptionCell.textContent = obj.description;
    tableRow.appendChild(descriptionCell);

    const categoryCell = document.createElement('td');
    categoryCell.textContent = obj.category;
    tableRow.appendChild(categoryCell);

    const amountCell = document.createElement('td');
    if (type === 'expense') {
        amountCell.textContent = `-${obj.amount}`;
        amountCell.style.color = 'red';
    } else if (type === 'income') {
        amountCell.textContent = `+${obj.amount}`;
        amountCell.style.color = 'green';
    }
    tableRow.appendChild(amountCell);

    const actionsCell = document.createElement('td');
    const editBtn = document.createElement('button');
    editBtn.id = obj.id;
    editBtn.type = 'button';
    editBtn.textContent = 'Edit';
    editBtn.className = 'btn btn-primary ml-2';
    editBtn.onclick = () => {
      const buttonId = editBtn.id;
      tableBody.removeChild(tableRow);
      document.getElementById('datetag').value = obj.date;
      document.getElementById('descriptiontag').value = obj.description;
      document.getElementById('typetag').value = obj.type;
      if (type === 'expense') {
          document.getElementById('expenseCategory').style.display = 'block';
          document.getElementById('incomeCategory').style.display = 'none';
          document.getElementById('expenseCategory').value = obj.category;
      } else if (type === 'income') {
          document.getElementById('incomeCategory').value = obj.category;
      }
      document.getElementById('amttag').value = obj.amount;
      document.getElementById('submitButton').innerText = 'Update';
      document.getElementById('submitButton').dataset.updateId = buttonId;
    };

    const delBtn = document.createElement('button');
    delBtn.id = 'del';
    delBtn.type = 'button';
    delBtn.textContent = 'Delete';
    delBtn.className = 'btn btn-danger ml-2';
    delBtn.onclick = async () => {
      try {
        const deleteId = obj.id;
            const response = await axios.delete(`https://spendsmart-nkgi.onrender.com/api/userData/${deleteId}`, tokentosend);
            if (response.status === 200) {
                alert('item will be deleted')
            }

            tableBody.removeChild(tableRow);
            window.location.reload()
      } catch (err) {
        console.log(err);
      }
    };

    actionsCell.appendChild(editBtn);
    actionsCell.appendChild(delBtn);
    tableRow.appendChild(actionsCell);

    tableBody.prepend(tableRow);
    
    const tableLength = tableBody.rows.length;
    const limit = document.getElementById('pgLimit').value
    if (tableLength > limit) {
        window.location.reload()
    }
  }

  async function handlePagination(page, limit) {
    try {
        const response = await axios.get(`https://spendsmart-nkgi.onrender.com/api/userData/${page}/${limit}`, tokentosend);
        const totalPages = response.data.totalPages
        const expenses = response.data.expenses;
        console.log(expenses)
        document.getElementById('expensesTableBody').innerHTML = ''
        for (let i = expenses.length-1; i >=0 ; i--) {
            showExpensesList(expenses[i]);
        }
        // generateButton(totalPages)
    } catch (error) {
        console.log(error);
    }
}

const paginationContainer = document.getElementById('paginationContainer')
const pgLimit = document.getElementById('pgLimit')

paginationContainer.addEventListener('click', async (event) => {

    if (event.target.nodeName === 'BUTTON') {
        const page = event.target.dataset.page;
        const limit = pgLimit.value
        handlePagination(page, limit);
    }
});

pgLimit.addEventListener('change', async function () {
    const page = 1;
    const limit = pgLimit.value;
    localStorage.setItem('selectedLimit', limit);
    const btn = document.getElementById('paginationBtn')
    btn.innerHTML = '';

    document.getElementById('expensesTableBody').innerHTML = ''
    const response = await axios.get(`https://spendsmart-nkgi.onrender.com/api/userData/${page}/${limit}`, tokentosend)
    const totalPages = response.data.totalPages

    for (let i = 0; i < response.data.expenses.length; i++) {
        showExpensesList(response.data.expenses[i])
    }
    generateButton(totalPages)
    //    handlePagination(page, totalPages)
});

const premiumButton = document.getElementById('premiumButton')
premiumButton.onclick = async function (e) {
    e.preventDefault()

    const response = await axios.get('https://spendsmart-nkgi.onrender.com/purchase/premiumMembership', tokentosend)
    // console.log(response)
    var options = {
        "key": response.data.key_id,
        "order_id": response.data.order.id,

        "handler": async function (response) {
            const resp = await axios.post('https://spendsmart-nkgi.onrender.com/purchase/premiumMembership', {
                order_id: options.order_id,
                payment_id: response.razorpay_payment_id,
            }, { headers: { "Authorization": token } })
            // console.log(resp)
            setTimeout(() => {
                location.reload()
            }, 2000)
            alert('you are a apremium meber now')
            disablePremiumButton();
        }
    }
    const rzp1 = new Razorpay(options);
    rzp1.open();
    e.preventDefault();

    rzp1.on('payment.failed', async function (response) {
        // console.log(response)
        const data = await options.order_id
        console.log(data)
        await axios.post('https://spendsmart-nkgi.onrender.com/purchase/premiumTransactionFailed', { orderid: data }, tokentosend)
        alert('something went wrong')
    })
}

function notPremiumFeatures(x) {
    const leaderboardLink = document.getElementById('leaderboardLink');
    const reportLink = document.getElementById('reportLink')
    const dashboardLink = document.getElementById('dashboardLink')
    if (!x) {
        leaderboardLink.classList.add('disabled');
        leaderboardLink.removeAttribute('href');
        reportLink.classList.add('disabled')
        reportLink.removeAttribute('href')
        dashboardLink.classList.add('disabled')
        dashboardLink.removeAttribute('href')
    }
}

function premiumFeatures() {
    const premiumText = document.createElement('span');
    premiumText.innerText = 'Premium user';
    premiumText.className = premiumButton.className;
    premiumText.style.color = 'white';
    premiumButton.parentNode.replaceChild(premiumText, premiumButton);

}

const logOutButton = document.getElementById('logOutButton')
logOutButton.onclick = async () => {
    localStorage.removeItem('token')
    window.location.href = 'https://spendsmart-nkgi.onrender.com'
}

function generateButton(pageButton) {
    const btn = document.getElementById('paginationBtn')
    for (let i = 1; i <= pageButton; i++) {
        const btnroadd = document.createElement('button')
        btnroadd.dataset.page = i
        btnroadd.classList = 'pgBtn'
        btnroadd.textContent = `${i}`
        btn.appendChild(btnroadd)
    }
}
