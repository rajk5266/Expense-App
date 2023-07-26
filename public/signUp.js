async function signup(event){
    try{
        event.preventDefault();

        const signupdetails = {
             name: event.target.name.value,
             email: event.target.email.value,
            password: event.target.password.value
        }
        const response = await axios.post('https://spendsmart-nkgi.onrender.com/signup', signupdetails)
       
        if(response.data){
            alert('user created successfully')
           window.location.href = "https://spendsmart-nkgi.onrender.com"
        }
    }catch(err){
        // document.body.innerHTML += err;
        const error = err.response.data.message;
         alert(error)
    }
}
