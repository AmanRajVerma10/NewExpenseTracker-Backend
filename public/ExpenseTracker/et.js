const form = document.getElementById("myform");
const token = localStorage.getItem("token");

function parseJwt(token) {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
}

function showPremiumUserMessage() {
  document.getElementById("rzp-button1").style.visibility = "hidden";
  document.getElementById("message").innerHTML = `You are a premium user!`;
}

function showLeaderboard() {
  const inputElement = document.createElement("input");
  inputElement.type = "button";
  inputElement.value = "Show Leaderboard";
  inputElement.onclick = async () => {
    const userLeaderBoardArray = await axios.get(
      "http://13.233.110.83:3000/premium/getleaderboard",
      { headers: { Authorization: token } }
    );
    console.log(userLeaderBoardArray);
    const leaderboardElements = document.getElementById("leaders");
    leaderboardElements.innerHTML = `<h2>Leaderboard</h2>`;
    userLeaderBoardArray.data.arr.forEach((element) => {
      leaderboardElements.innerHTML += `<li>name: ${element.name} expense: ${element.totalexpense}</li>`;
    });
  };
  document.getElementById("message").appendChild(inputElement);
}

document.getElementById('rowsForm').addEventListener('submit',(e)=>{
  e.preventDefault();
  localStorage.setItem('rows',e.target.rows.value);
  document.getElementById('items').innerHTML="";
  refreshPage();
})

window.addEventListener("DOMContentLoaded", refreshPage=() => {
  const page = 1;
  const decodedToken = parseJwt(token);
  if (!decodedToken.totalexpense) {
    document.getElementById("downloadexpense").style.visibility = "hidden";
  }
  if (decodedToken.ispremiumuser) {
    showPremiumUserMessage();
    showLeaderboard();
  }
  console.log(decodedToken);

  getExpenses(page);

  // axios
  //   .get("http://13.233.110.83:3000/expense/get-expense", {
  //     headers: { Authorization: token },
  //   })
  //   .then((exp) => {
  //     exp.data.expenses.map((expense) => {
  //       display(expense);
  //     });
  //   })
  //   .catch((e) => {
  //     console.log(e);
  //   });

  axios
    .get("http://13.233.110.83:3000/user/filesdownloaded", {
      headers: { Authorization: token },
    })
    .then((response) => {
      if (response.data.files.length > 0) {
        document.getElementById("files").innerHTML = `<h2>Old Files</h2>`;
        console.log(response.data.files);
        response.data.files.forEach((file) => {
          displayFiles(file);
        });
      }
    })
    .catch((e) => {
      console.log(e);
    });
});

function getExpenses(page) {
  let rows=localStorage.getItem('rows');
  if(!rows){
    rows=2;
  }
  axios
    .get(`http://13.233.110.83:3000/expense/get-expense/${page}?rows=${rows}`, {
      headers: { Authorization: token },
    })
    .then((response) => {
      response.data.expenses.map((expense) => {
        display(expense);
      })
      showPagination(response.data);
    })
    .catch((e) => {
      console.log(e);
    });
}

function showPagination({
  currentPage,
  hasNextPage,
  nextPage,
  hasPreviousPage,
  previousPage,
  lastPage,
}) {
  const pagination=document.getElementById('footer')
  pagination.innerHTML="";
  if(hasPreviousPage){
    const btn2=document.createElement('button');
    btn2.innerHTML=previousPage;
    btn2.addEventListener('click',()=>{
      document.getElementById('items').innerHTML=""
      getExpenses(previousPage)});
    pagination.appendChild(btn2);
  }
  const btn1=document.createElement('button');
    btn1.innerHTML=currentPage;
    btn1.addEventListener('click',()=>{
      document.getElementById('items').innerHTML=""
      getExpenses(currentPage)});
    pagination.appendChild(btn1);
  

  if(hasNextPage){
  const btn3= document.createElement('button');
  btn3.innerHTML=nextPage;
  btn3.addEventListener('click',()=>{
    document.getElementById('items').innerHTML=""
    getExpenses(nextPage)});
  pagination.appendChild(btn3)
}

}

function displayFiles(file) {
  const parentElement = document.getElementById("files");
  let childHtml = `<li id=${file.id}><a href="${file.fileurl}">${file.createdAt}</a></li>`;
  parentElement.innerHTML += childHtml;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const expense = event.target.exp.value;
  const description = event.target.des.value;
  const category = event.target.cat.value;
  const obj = {
    expense,
    description,
    category,
  };
  axios
    .post("http://13.233.110.83:3000/expense/add-expense", obj, {
      headers: { Authorization: token },
    })
    .then((response) => display(response.data.newExpense))
    .catch((e) => console.log(e));
});

document.getElementById("rzp-button1").onclick = async function (e) {
  const response = await axios.get(
    "http://13.233.110.83:3000/purchase/premiummembership",
    { headers: { Authorization: token } }
  );
  console.log(response);
  var options = {
    key: response.data.key_id,
    order_id: response.data.order.id,
    handler: async function (response) {
      const res = await axios.post(
        "http://13.233.110.83:3000/purchase/updatetransactionstatus",
        {
          order_id: options.order_id,
          payment_id: response.razorpay_payment_id,
        },
        { headers: { Authorization: token } }
      );

      alert("You are a premium user now!");
      showPremiumUserMessage();
      localStorage.setItem("token", res.data.token);
      showLeaderboard();
    },
  };
  const rzp1 = new Razorpay(options);
  rzp1.open();
  e.preventDefault();

  rzp1.on("payment.failed", function (response) {
    console.log(response);
    alert("Something went wrong!");
  });
};

function display(exp) {
  const parentElement = document.getElementById("items");
  let childHtml = `<li id=${exp.id}>${exp.amount} ${exp.description} ${exp.category}
    <button onclick=deleteUser(${exp.id},${exp.amount})>Delete</button></li>`;
  parentElement.innerHTML += childHtml;
}

function deleteUser(expenseId, amount) {
  const pe = document.getElementById("items");
  const ce = document.getElementById(expenseId);
  pe.removeChild(ce);
  axios
    .delete(`http://13.233.110.83:3000/expense/delete-expense/${expenseId}`, {
      headers: { Authorization: token, price: amount },
    })
    .then(() => console.log("expense deleted"))
    .catch((e) => console.log(e));
}

function download() {
  axios
    .get("http://13.233.110.83:3000/user/download", {
      headers: { Authorization: token },
    })
    .then((response) => {
      if (response.status === 201) {
        var a = document.createElement("a");
        a.href = response.data.fileURL;
        a.download = "myexpense.csv";
        a.click();
      } else {
        throw new Error(response.data.error);
      }
    })
    .catch((e) => console.log(e));
}
