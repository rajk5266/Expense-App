window.addEventListener('DOMContentLoaded',
    async () => {
        try {
            const response = await axios.get('http://localhost:8000/userData')
            // console.log(response)
            for (let i = 0; i < response.data.length; i++) {

                showExpensesList(response.data[i])
            }
        }
        catch (error) {
            console.log(error)
        }
    })
    
async function adding(event) {
    event.preventDefault()

    var description = event.target.description.value;
    var category = event.target.category.value;
    var amount = event.target.amt.value;
    
    const obj = {
        description,
        category,
        amount
    }

    const updateId = document.getElementById('submitButton').dataset.updateId
    // console.log(updateId)
    if(updateId){
        try{
            const response = await axios.put(`http://localhost:8000/userData/${updateId}`, obj)
            console.log(response.data)
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
            const response = await axios.post('http://localhost:8000/userData', obj)
            showExpensesList(response.data);

        }catch(err){
            console.log(err)
        }
    }
}

function resetSubmitbuttonValue(){
    document.getElementById('submitButton').innerText = 'Add expense'
}

  
// function showExpensesList(obj) {
//     var parentElem = document.getElementById('listOfitems');
//     var childElem = document.createElement('li');
//     childElem.className = 'list-group-item';
  
//     var contentElem = document.createElement('div');
//     contentElem.className = 'd-flex justify-content-between align-items-center';
    
//     var descriptionElem = document.createElement('span');
//     descriptionElem.className = 'expense-description';
//     descriptionElem.textContent = obj.description;
//     descriptionElem.style.fontWeight = 'bold';
//     descriptionElem.style.fontFamily = 'Arial, sans-serif';
  
//     var categoryElem = document.createElement('span');
//     categoryElem.className = 'expense-category';
//     categoryElem.textContent = obj.category;
//     descriptionElem.style.fontWeight = 'bold';
//     descriptionElem.style.fontFamily = 'Arial, sans-serif';
  
//     var amountElem = document.createElement('span');
//     amountElem.className = 'expense-amount';
//     amountElem.textContent = obj.amount;
//     descriptionElem.style.fontWeight = 'bold';
//     descriptionElem.style.fontFamily = 'Arial, sans-serif';
  
//     contentElem.appendChild(descriptionElem);
//     contentElem.appendChild(categoryElem);
//     contentElem.appendChild(amountElem);
  
//     var buttonGroupElem = document.createElement('div');
//     buttonGroupElem.className = 'btn-group';
  
//     var editBtn = document.createElement('button');
//     editBtn.id = obj.id;
//     editBtn.type = 'button';
//     editBtn.textContent = 'Edit';
//     editBtn.className = 'btn btn-primary ml-2';
//     editBtn.onclick = () => {
//       const buttonId = editBtn.id;
//       parentElem.removeChild(childElem);
//       document.getElementById('descriptiontag').value = obj.description;
//       document.getElementById('categorytag').value = obj.category;
//       document.getElementById('amttag').value = obj.amount;
//       document.getElementById('submitButton').innerText = 'Update';
//       document.getElementById('submitButton').dataset.updateId = buttonId;
//     };
  
//     var delBtn = document.createElement('button');
//     delBtn.id = 'del';
//     delBtn.type = 'button';
//     delBtn.textContent = 'Delete';
//     delBtn.className = 'btn btn-danger ml-2';
//     delBtn.onclick = async () => {
//       try {
//         const deleteId = obj.id;
//         const response = axios.delete(`http://localhost:8000/userData/${deleteId}`);
//         parentElem.removeChild(childElem);
//       } catch (err) {
//         console.log(err);
//       }
//     };
  
//     buttonGroupElem.appendChild(editBtn);
//     buttonGroupElem.appendChild(delBtn);
  
//     contentElem.appendChild(buttonGroupElem);
//     childElem.appendChild(contentElem);
//     parentElem.appendChild(childElem);
//   }
  

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
    editBtn.className = 'btn btn-primary ml-2';
    editBtn.onclick = () => {
      const buttonId = editBtn.id;
      tableBody.removeChild(tableRow);
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
      try {
        const deleteId = obj.id;
        const response = await axios.delete(`http://localhost:8000/userData/${deleteId}`);
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