const token = localStorage.getItem('token')
const tokentosend = { headers: { 'Authorization': token } }
console.log('bdk')
let id;
window.addEventListener('DOMContentLoaded', () => {
    const url = window.location.href
     id = url.split('/').pop()
    // console.log(id)
    document.getElementById('resetPasswordId').value = id;
})

async function sendNewPassword(e) {
    e.preventDefault();
    // const id = e.target.id.value;
    const newPassword = e.target.newPassword.value;
    const confirmPassword = e.target.confirmPassword.value;
    const obj = {
         newPassword, confirmPassword
    };
    // console.log(obj);
    
    if (newPassword !== confirmPassword) {
        alert('confirm password is not same as new password');
        return;
    }

    try {
        const response = await axios.post(`https://spendsmart-nkgi.onrender.com/password/resetPassword/${id}`, obj);
        // console.log(response);
        alert('password updated successfully');
        window.location.href = 'https://spendsmart-nkgi.onrender.com';
    } catch (err) {
        console.log(err);
    }
}

