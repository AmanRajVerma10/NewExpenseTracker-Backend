document
  .getElementById("signInForm")
  .addEventListener("submit", async (event) => {
    try {
      event.preventDefault();
      const obj = {
        email: event.target.mail.value,
        password: event.target.password.value,
      };
      const response = await axios.post(
        "http://13.233.110.83:3000/user/login",
        obj
      );
      if (response.status === 200) {
        alert(response.data.message);
        localStorage.setItem('token',response.data.token);
        window.location.replace("../ExpenseTracker/expenseTracker.html");
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      document.body.innerHTML += `<div style="color:red">${error}</div>`;
    }
  });

  document.getElementById('forgotPassword').onclick= async function(){
    window.location.replace('../ForgotPassword/forgotPassword.html');
  }

