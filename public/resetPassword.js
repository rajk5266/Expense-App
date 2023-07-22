const token = localStorage.getItem('token')
const tokentosend = { headers: { 'Authorization': token } }

window.addEventListener('DOMContentLoaded', () => {
    const url = window.location.href
    // console.log("url",url)
    const id = url.split('/').pop()
    console.log(id)
    document.getElementById('resetPasswordId').value = id;
})

async function sendNewPassword(e) {
    e.preventDefault();

    const id = e.target.id.value;
    const newPassword = e.target.newPassword.value;
    const confirmPassword = e.target.confirmPassword.value;
    const obj = {
        id, newPassword, confirmPassword
    };
    console.log(obj);
    
    if (newPassword !== confirmPassword) {
        alert('confirm password is not same as new password');
        return;
    }

    try {
        const response = await axios.post('http://16.171.1.107:9000/password/resetPassword', obj, tokentosend);
        console.log(response);
        alert('password updated successfully');
        window.location.href = 'http://16.171.1.107:9000/user';
    } catch (err) {
        console.log(err);
    }
}
