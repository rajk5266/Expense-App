async function login(event){
    try{
    event.preventDefault()
    const obj = {

        email: event.target.email.value,
         password :event.target.password.value
    }

    const logindetails = await axios.post('http://localhost:8000/api/login', obj)
    // console.log(email,password)
    const message = logindetails.data.message
    // console.log(logindetails.data.message)
    alert(message)
    }catch(err){
        console.log(err)
    }

}