const form= document.getElementById('forgotPasswordForm')

form.addEventListener("submit",async(e)=>{
    e.preventDefault();
    const email=e.target.email.value;
    const response= await axios.post('http://13.233.110.83:3000/password/forgotpassword',{
        email
    })
    console.log(response);
})