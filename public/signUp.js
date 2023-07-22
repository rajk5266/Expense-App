async function signup(event){
    try{
        event.preventDefault();

        const signupdetails = {
             name: event.target.name.value,
             email: event.target.email.value,
            password: event.target.password.value
        }
        const response = await axios.post('http://16.171.1.107:9000/user/signup', signupdetails)
       
        if(response.data){
            alert('user created successfully')
           window.location.href = "http://16.171.1.107:9000/user"
        }
    }catch(err){
        // document.body.innerHTML += err;
        const error = err.response.data.message;
         alert(error)
    }
}
