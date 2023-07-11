
const token = localStorage.getItem('token')
const tokentosend = { headers: { 'Authorization': token } }
// console.log(tokentosend)
window.addEventListener('DOMContentLoaded',
    async () => {
        try {

            const response = await axios.get('http://localhost:8000/api/userData', tokentosend)
            const ispremium = await axios.get('http://localhost:8000/user/profile', tokentosend)

            const ispremiumStatus = ispremium.data.ispremium

            // console.log(ispremiumStatus)
            if (ispremiumStatus) {

                premiumFeatures()
            } else {
                notPremiumFeatures(ispremiumStatus)
            }
            for (let i = 0; i < response.data.length; i++) {
                showExpensesList(response.data[i])
            }
        }
        catch (error) {
            console.log(error)
            if (error.response.data.message == 'User not found') {

                window.location.href = 'http://localhost:8000/user'
            }

        }
    })

async function adding(event) {
    event.preventDefault()

    var date = event.target.date.value;
    var description = event.target.description.value;
    var category = event.target.category.value;
    var amount = event.target.amt.value;

    const updateId = document.getElementById('submitButton').dataset.updateId

    const obj = {
        date,
        description,
        category,
        amount,

    }
    if (updateId) {
        // console.log(obj)
        try {
            const response = await axios.put(`http://localhost:8000/api/userData/${updateId}`, obj, tokentosend)
            console.log(response.data)
            showExpensesList(response.data);
            delete document.getElementById('submitButon').dataset.updateId;
        }
        catch (err){
            console.log(err)
        }
        resetSubmitbuttonValue()
    }
    else {
        try {
            const response = await axios.post('http://localhost:8000/api/userData', obj, tokentosend)
            console.log(response.data)
            showExpensesList(response.data);
        } catch (err) {
            console.log(err)
        }
    }
}

function resetSubmitbuttonValue() {
    document.getElementById('submitButton').innerText = 'Add expense'
}


function showExpensesList(obj) {


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
    amountCell.textContent = obj.amount;
    tableRow.appendChild(amountCell);

    const actionsCell = document.createElement('td');
    const editBtn = document.createElement('button');
    editBtn.id = obj.id;
    editBtn.type = 'button';
    editBtn.textContent = 'Edit';
    editBtn.className = 'btn btn-primary ml-2 mx-2';
    editBtn.onclick = () => {
        const buttonId = editBtn.id;
        console.log(buttonId)
        tableBody.removeChild(tableRow);
        document.getElementById('datetag').value = obj.date;
        document.getElementById('descriptiontag').value = obj.description;
        document.getElementById('categorytag').value = obj.category;
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
        // console.log(obj.id)
        try {
            const deleteId = obj.id;
            const response = await axios.delete(`http://localhost:8000/api/userData/${deleteId}`, tokentosend);

            tableBody.removeChild(tableRow);
        } catch (err) {
            console.log(err);
        }
    };

    actionsCell.appendChild(editBtn);
    actionsCell.appendChild(delBtn);
    tableRow.appendChild(actionsCell);

    tableBody.appendChild(tableRow);

}


const premiumButton = document.getElementById('premiumButton')
premiumButton.onclick = async function (e) {
    e.preventDefault()

    const response = await axios.get('http://localhost:8000/purchase/premiumMembership', tokentosend)
    // console.log(response)
    var options = {
        "key": response.data.key_id,
        "order_id": response.data.order.id,

        "handler": async function (response) {
            const resp = await axios.post('http://localhost:8000/purchase/premiumMembership', {
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
        await axios.post('http://localhost:8000/purchase/cancelPremium', { orderid: data }, tokentosend)
        alert('something went wrong')
    })
}

function notPremiumFeatures(x) {
    const leaderboardLink = document.getElementById('leaderboardLink');
    if (!x) {
        leaderboardLink.classList.add('disabled');
        leaderboardLink.removeAttribute('href');
    }
}

 function premiumFeatures() {
    const premiumText = document.createElement('span');
    premiumText.innerText = 'Premium user';
    premiumText.className = premiumButton.className;
    premiumText.style.color = 'white';
    premiumButton.parentNode.replaceChild(premiumText, premiumButton);

}



