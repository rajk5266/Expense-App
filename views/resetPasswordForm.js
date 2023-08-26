
window.addEventListener('DOMContentLoaded', () => {
    const url = window.location.href
    const id = url.split('/').pop()
    document.getElementById('resetPasswordId').value = id;
})

function sendNewPassword(e) {
    e.preventDefault()

    const id = e.target.id.value;
    const newPassword = e.target.newPassword.value;
    const confirmPassword = e.target.confirmPassword.value
    const obj = {
        id, newPassword, confirmPassword
    }
    if (newPassword != confirmPassword) {
        alert('confirm password is not same as new password')
        return
    }
    console.log(obj)
    const updatedPassword = axios.post('http://localhost:5000/password/resetPassword', obj)
    .then(response =>{
         console.log(response)
         alert('password updated successfully');
         window.location.href = 'http://localhost:5000/user'
    }
    )
    .catch(err => console.log(err))

}