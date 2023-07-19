const token = localStorage.getItem('token')
const tokentosend = { headers: { 'Authorization': token } }

async function sendLink(e) {
    try {
        e.preventDefault()
        const email = e.target.email.value
        const response = await axios.post('http://localhost:9000/user/forgotPassword', { email }, tokentosend)
            .then((res) => {
                if (res.status === 200) {
                    alert('reset password link has been shared to your email')
                }
            })
            .catch((error) => {
                if (error.response.status === 404) {
                    alert('email does not exist')
                }
            })
    } catch (error) {
        // console.log(error)
    }
}