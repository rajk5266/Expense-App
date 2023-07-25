const token = localStorage.getItem('token')
const tokentosend = { headers: { 'Authorization': token } }
async function sendLink(e) {
    try {
        e.preventDefault();
        const email = e.target.email.value;
        const response = await axios.post('https://spendsmart-nkgi.onrender.com//user/forgotPassword', { email }, tokentosend);
        if (response.status === 200) {
            alert('reset password link has been shared to your email');
        }
    } catch (error) {
        if (error.response && error.response.status === 404) {
            alert('email does not exist');
        } else {
            console.error(error);
        }
    }
}

