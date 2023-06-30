async function signup(event){
    try{
        event.preventDefault();

        const signupdetails = {
             name: event.target.name.value,
             email: event.target.email.value,
            paasword: event.target.password.value
        }
        console.log(signupdetails)
        console.log('k')
        const response = axios.post('http://localhost:8000/user/signup', signupdetails)
        
    }catch(err){
        document.body.innerHTML += err;
    }
}