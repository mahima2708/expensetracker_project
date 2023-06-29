
const prevDateBtn = document.getElementById('prevDateBtn');
    const nextDateBtn = document.getElementById('nextDateBtn');
    const datedisplay = document.getElementById('date_Display');
    const h2Elements = document.querySelectorAll('h2');

    var test = "";
    var year = "";
    


    const prevMonth = document.getElementById('prevMonthBtn');
    const nextMonth = document.getElementById('nextMonthBtn');
    const monthDisplay = document.getElementById('monthDisplay');

    const prevyear = document.getElementById('prevyearBtn');
    const nextyear = document.getElementById('nextyearBtn');
    const yearDisplay = document.getElementById('yearDisplay');
   
    prevDateBtn.addEventListener('click', goToPreviousDate);
    nextDateBtn.addEventListener('click', goToNextDate);

    prevMonth.addEventListener('click', goToPreviousMonth);
    nextMonth.addEventListener('click', goToNextMonth);

    prevyear.addEventListener('click', goToPreviousyear);
    nextyear.addEventListener('click', goToNextyear);
    let currentDate = new Date();

    function printCurrentDate() {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        datedisplay.textContent = currentDate.toLocaleDateString(undefined, options);

      }
      printCurrentDate();

    // Function to update the date display
   async function updateDateDisplay() {
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      datedisplay.textContent = currentDate.toLocaleDateString(undefined, options);
      console.log("343533 the current display ", datedisplay.id)
      const token = localStorage.getItem('token')
      const rowsperpage = localStorage.getItem('rowsbydefault')
      await axios.get('http://localhost:3000/data', {headers: {"Authorisation": token}, params: {date: currentDate.toISOString(), listperPage: rowsperpage}}).then((response) => {
      
       for(var i=0;i<response.data.newentry.length;i++){
        showOnScreen(response.data.newentry[i])
       }
      
       const totalExpenditureLi = document.createElement('li');
       totalExpenditureLi.style.fontWeight = "bold"
       totalExpenditureLi.style.border = "1px solid black";
       totalExpenditureLi.style.marginTop = "10px";
       totalExpenditureLi.style.color = "white"
       totalExpenditureLi.textContent = `Total Expenditure: ${response.data.totalExpenditure}`;
 
      
       const ulElement = document.getElementById('list'); 
       ulElement.appendChild(totalExpenditureLi);
       displayPagination(response.data)
       
      }).catch((err)=>{
        throw new Error(err);
      }
      )

    }

     

    // Function to navigate to the previous date
    function goToPreviousDate() {
      currentDate.setDate(currentDate.getDate() - 1);
      const firstNode = document.getElementById('list');
      firstNode.innerHTML=''
      updateDateDisplay();
    }

    // Function to navigate to the next date
    function goToNextDate() {
      currentDate.setDate(currentDate.getDate() + 1);
      const firstNode = document.getElementById('list');
      firstNode.innerHTML=''
      updateDateDisplay();
    }


    function showForm(event) {
        try{
            event.preventDefault()
            var formContainer = document.getElementById('formContainer');
        formContainer.classList.toggle('hidden');
    }
    catch(error){
        throw new Error(error)
    }
    };

    function showMenu(event) {
        try{
        event.preventDefault()
      var menuContainer = document.getElementById('menuContainer');
      menuContainer.classList.toggle('hidden');
        }
        catch(error){
            throw new Error(error)
        }
    };

    async function addexpense(event){
            try{
                event.preventDefault()
                const token_1= localStorage.getItem('token');
                
                const details={
                    price:event.target.form.cost.value,
                    description: event.target.form.description.value,
                    category: event.target.form.category.value,
                }
                const data = await axios.post('http://localhost:3000/expense', details,{headers: {"Authorisation": token_1}})
                console.log("@#@#@#@##@#@###@#@",data.data.expense);
                    if(data.status===200){
                      showOnScreen(data.data.expense)
                    }
            }
            catch(err){
                console.log(err);
            }
        }

        function showOnScreen(data){
            console.log("###",data.id);
            user = {
                id:'',
                price:'',
                description:'',
                category:''
            }
            document.getElementById('cost').value="";
            document.getElementById('description').value="";
            document.getElementById('category').value="";

      const firstNode = document.getElementById('list');
      const inputData= `<li class = "mr-4 text-white font-semibold" id=${data.id}> ${data.price} - ${data.description} - ${data.category} ====>
                          <button class="bg-slate-500 border text-red-100 w-36 rounded-xl hover:bg-blue-600 mb-2" onclick="deleteUser('${data.id}', '${data.price}')">Delete user</button>
                             </li>`
       
  firstNode.innerHTML = firstNode.innerHTML + inputData; 
        }

        window.addEventListener('DOMContentLoaded', async()=>{
            const firstNode = document.getElementById('list');
            firstNode.innerHTML= " ";
            const page = 1;
             localStorage.setItem('rowsbydefault', 3)
            const listperpage = localStorage.getItem('rowsbydefault');
            const token= localStorage.getItem('token');
            console.log("!!!", currentDate);
           await axios.get(`http://localhost:3000/data?page=${page}`, {headers: {"Authorisation": token}, params:{date:currentDate, listperPage:listperpage}}).then(async(response)=>{
           
            console.log("##################",response.data);
            if(response.data.ispremiumuser=== true){
        
            premiumFeatures();
        }
           console.log("&777777", response);
           for(var i =0;i<response.data.newentry.length;i++){
           showOnScreen(response.data.newentry[i])
              }
              displayPagination(response.data)

    }).catch(err=>console.log("error is this",err))
  })

  function displayPagination({
    currentPage,
    hasNextPage,
    nextPage,
    hasPreviousPage,
    previousPage,
    lastPage,
  }) {
    //console.log("id is ", id)
    const paginationContainer = document.getElementById('pagination');
    paginationContainer.innerHTML = '';
  
    if (hasPreviousPage) {
      const btn2 = document.createElement('button');
      btn2.textContent = previousPage;
      btn2.classList.add('mr-2')
      btn2.style.border = "2px solid black"
      btn2.addEventListener('click', () => getlist(previousPage));
      paginationContainer.appendChild(btn2);
    }
  
    const btn1 = document.createElement('button');
    btn1.textContent = currentPage;
    btn1.classList.add('mr-2')
    btn1.style.border = "2px solid black"

    btn1.addEventListener('click', () => getlist(currentPage));
    paginationContainer.appendChild(btn1);
  
    if (hasNextPage) {
      const btn3 = document.createElement('button');
      btn3.textContent = nextPage;
      btn3.classList.add('mr-2')
      btn3.style.border = "2px solid black"
      btn3.addEventListener('click', () => getlist(nextPage));
      paginationContainer.appendChild(btn3);
    }
  }
  
  function getlist(page) {
    const listContainer = document.getElementById('list');
    listContainer.innerHTML = '';
    const paginationContainer = document.getElementById('pagination');
    paginationContainer.innerHTML = '';
    const dailyExpensesDiv = document.getElementById('dailyExpenses');
const monthlyExpensesDiv = document.getElementById('monthlyexpenses');
const yearlyExpensesDiv = document.getElementById('Yearly');

// Check the visibility of the div elements
const isDailyVisible = window.getComputedStyle(dailyExpensesDiv).display !== 'none';
const isMonthlyVisible = window.getComputedStyle(monthlyExpensesDiv).display !== 'none';
const isYearlyVisible = window.getComputedStyle(yearlyExpensesDiv).display !== 'none';

// Determine the display mode

  
    const token = localStorage.getItem('token');
    const listperPage = localStorage.getItem('rowsbydefault');
    let displayMode;
if (isDailyVisible) {
  displayMode = 'day-wise';
  axios
      .get(`http://localhost:3000/data?page=${page}`, {
        headers: { "Authorisation": token },
        params: { date: currentDate ,  listperPage:listperPage }
      })
      .then(async (response) => {
        console.log("##################", response.data);
  
        for (var i = 0; i < response.data.newentry.length; i++) {
          showOnScreen(response.data.newentry[i]);
        }
        displayPagination(response.data);
      });
  
} else if (isMonthlyVisible) {
  displayMode = 'month-wise';
  axios
      .get(`http://localhost:3000/monthlydata?page=${page}`, {
        headers: { "Authorisation": token },
        params: {month: test,  listperPage:listperPage }
      })
      .then(async (response) => {
        console.log("##################", response.data);
  
        for (var i = 0; i < response.data.newentry.length; i++) {
          showOnScreen(response.data.newentry[i]);
        }
        displayPagination(response.data);
      });
} else if (isYearlyVisible) {
  displayMode = 'year-wise';
  axios
  .get(`http://localhost:3000/yearlydata?page=${page}`, {
    headers: { "Authorisation": token },
    params: {year: year ,  listperPage:listperPage }
  })
  .then(async (response) => {
    console.log("##################", response.data);

    for (var i = 0; i < response.data.newentry.length; i++) {
      showOnScreen(response.data.newentry[i]);
    }
    displayPagination(response.data);
  });
}
    
  }

  async function deleteUser(id, price){
        console.log("******************", price);
        const token = localStorage.getItem('token');
       await axios.delete(`http://localhost:3000/delete/${id}?price=${price}`, {headers: {"Authorisation": token}})
          removeuserfromScreen(id);

    }

    function removeuserfromScreen(listid){
       // console.log(,listid);
        const list= document.getElementById('list');
        const deletelist = document.getElementById(listid);
        console.log("~~~~~~~~~~~~~~~~~~~~", deletelist);
            list.removeChild(deletelist)
    }


    document.getElementById('premium').onclick = async function(e){
    const token = localStorage.getItem('token')
    console.log("%^%%^", token)
    //const response = await axios.get('http://localhost:3000/purchasepremiumship');
                                                            

   const response = await axios.get('http://localhost:3000/purchase/purchasepremiumship', {headers: {"Authorisation": token}});
    console.log(response);
    var options= {
        "key": response.data.key_id,
        "order_id": response.data.order.id,
        "handler": async function(response){
            await axios.post('http://localhost:3000/purchase/updatetransactionstatus',{
                order_id: options.order_id,
                payment_id: response.razorpay_payment_id,
            },{headers: {"Authorisation": token} })
          
           // alert('You are a premium user now')
            premiumFeatures();
           

           
        }
    }
    const rzrpay1 = new Razorpay(options);
    rzrpay1.open();
    e.preventDefault()

    rzrpay1.on('payment.failed', async function(response){
        await axios.post('http://localhost:3000/purchase/updatefailedtransaction',{
                order_id: options.order_id,
                payment_id: response.razorpay_payment_id,
            },{headers: {"Authorisation": token} })
       alert('something went wrong')

    });

}
     

function monthlyexpenses(event){
    event.preventDefault()

    const firstNode = document.getElementById('list');
    firstNode.innerHTML = '';
    const divElement = document.getElementById('monthlyexpenses')
    divElement.style.display = 'flex';
    var dailyexpenses = document.getElementById('dailyExpenses');
    dailyexpenses .classList.add('hidden');
    dailyexpenses.style.display = 'none';
    var menuContainer = document.getElementById('menuContainer');
    menuContainer.classList.add('hidden');
    var yearlyexpenses = document.getElementById('Yearly');
    yearlyexpenses .classList.add('hidden');
    yearlyexpenses.style.display = 'none';

   

    const options = { year: 'numeric', month: 'long' };
    monthDisplay.textContent = currentDate.toLocaleDateString(undefined, options);
 updateMonth()


}



function goToPreviousMonth(){
    const currentMonth = currentDate.getMonth();

    currentDate.setMonth(currentDate.getMonth() - 1);
    const firstNode = document.getElementById('list');
    firstNode.innerHTML=''
    updateMonth()


}

function goToNextMonth(){
    const currentMonth = currentDate.getMonth();

    currentDate.setMonth(currentDate.getMonth() + 1);
    const firstNode = document.getElementById('list');
    firstNode.innerHTML=''
    updateMonth()


}
async function updateMonth(){
  const firstNode = document.getElementById('list');
            firstNode.innerHTML= " ";

            const page = 1;
    const options = { year: 'numeric', month: 'long' };
    monthDisplay.textContent = currentDate.toLocaleDateString(undefined, options);

    const options1 = { year: 'numeric', month: 'numeric' };
     test = monthDisplay.textContent
    test = currentDate.toLocaleDateString(undefined, options1);
    console.log("month val",test);
    const token = localStorage.getItem('token');
    const rowsperpage = localStorage.getItem('rowsbydefault');
    console.log("localstoragetaken", rowsperpage);

    await axios.get(`http://localhost:3000/monthlydata?page=${page}`, {headers: {"Authorisation": token}, params: {month: test, listperPage: rowsperpage}}).then((response) => {
        

    console.log("response of request", response);
       for(var i=0;i<response.data.newentry.length;i++){
        showOnScreen(response.data.newentry[i])

       }
       const totalExpenditureLi = document.createElement('li');
       totalExpenditureLi.style.fontWeight = "bold"
       totalExpenditureLi.style.border = "1px solid black";
       totalExpenditureLi.style.marginTop = "10px";
       totalExpenditureLi.style.color = "white"
       totalExpenditureLi.textContent = `Total Expenditure: ${response.data.total_expense}`;
 
      
       const ulElement = document.getElementById('list'); 
       ulElement.appendChild(totalExpenditureLi);

       displayPagination(response.data)
       
      }).catch((err)=>{
        throw new Error(err);
      }
      )

}
function dayTodayExpenses(event){
    event.preventDefault()
    const firstNode = document.getElementById('list');
    firstNode.innerHTML = '';
    const divElement = document.getElementById('dailyExpenses')
    divElement.style.display = 'flex';
    var yearlyexpenses = document.getElementById('Yearly');
    yearlyexpenses .classList.add('hidden');
    yearlyexpenses.style.display = 'none';
    var menuContainer = document.getElementById('menuContainer');
    menuContainer.classList.add('hidden');
    var monthlyexpenses = document.getElementById('monthlyexpenses');
    monthlyexpenses.classList.add('hidden');
    monthlyexpenses.style.display = 'none';

    updateDateDisplay();



}

function yearlyExpenses(event){
    event.preventDefault()

    const firstNode = document.getElementById('list');
    firstNode.innerHTML = '';
    const divElement = document.getElementById('Yearly')
    divElement.style.display = 'flex';
    var dailyexpenses = document.getElementById('dailyExpenses');
    dailyexpenses .classList.add('hidden');
    dailyexpenses.style.display = 'none';
    var menuContainer = document.getElementById('menuContainer');
    menuContainer.classList.add('hidden');
    var monthlyexpenses = document.getElementById('monthlyexpenses');
    monthlyexpenses.classList.add('hidden');
    monthlyexpenses.style.display = 'none';

    const options = { year: 'numeric' }
    yearDisplay.textContent = currentDate.toLocaleDateString(undefined, options);

    updateYear();
}

function  goToPreviousyear() {
    const currentYear = currentDate.getFullYear();
  
    currentDate.setFullYear(currentYear - 1);
    const firstNode = document.getElementById('list');
    firstNode.innerHTML = '';
    updateYear();
  }
  
  function goToNextyear() {
    const currentYear = currentDate.getFullYear();
  
    currentDate.setFullYear(currentYear + 1);
    const firstNode = document.getElementById('list');
    firstNode.innerHTML = '';
    updateYear();
  }

  async function updateYear() {
    const firstNode = document.getElementById('list');
    firstNode.innerHTML = '';
    const page =1;
    const options = { year: 'numeric' };
    yearDisplay.textContent = currentDate.toLocaleDateString(undefined, options);
    const rowsPerPage = localStorage.getItem('rowsbydefault')
     year = currentDate.getFullYear();
    const token = localStorage.getItem('token');
  console.log("year", year);
    await axios.get(`http://localhost:3000/yearlydata?page=${page}`,{ headers: {"Authorisation": token }, params: { year: year ,  listperPage:rowsPerPage }})
      .then((response) => {
        console.log('Response:', response);
        for (var i = 0; i < response.data.newentry.length; i++) {
          showOnScreen(response.data.newentry[i]);
        }
        const totalExpenditureLi = document.createElement('li');
        totalExpenditureLi.style.fontWeight = "bold"
       totalExpenditureLi.style.border = "1px solid black";
       totalExpenditureLi.style.marginTop = "10px";
       totalExpenditureLi.style.color = "white"
        totalExpenditureLi.textContent = `Total Expenditure: ${response.data.yearlyExpenditure}`;
  
        const ulElement = document.getElementById('list'); 
        ulElement.appendChild(totalExpenditureLi);

        displayPagination(response.data)
      })
      .catch((err) => {
        throw new Error(err);
      });
  }

   function premiumFeatures(){
   // e.preventDefault()
    const token = localStorage.getItem('token');
        const userbar = document.getElementById('premium');
        const premButton = document.getElementById('SubmitButton');
            const span = document.createElement('span');
            span.style.color = 'black';
            const premium = document.createTextNode('You are a premium User');
            span.append(premium);
            userbar.parentNode.replaceChild(span,userbar)

            const btn = document.createElement('button');
            btn.className = ' text-white font-semibold w-36 h-8 rounded-lg bg-fuchsia-800  hover:bg-fuchsia-950 px-3 py-2 ';
            btn.id = 'leaderboard';

            const text = document.createTextNode('ShowLeaderboard');
            btn.appendChild(text);

            //premButton.innerHTML= '';
            premButton.appendChild(btn);
            // //userbar.appendChild(btn);

            const downloadButton = document.getElementById('download-button');
            downloadButton.removeAttribute('disabled');

            document.getElementById('leaderboard').onclick = async function(e){
                e.preventDefault()

                const response = await axios.get('http://localhost:3000/premiumfeatures/premiumuserdata', {headers: {"Authorisation": token}});
                console.log("hello daarlingssss", response);
                const firstNode = document.getElementById('leaders');
                
               const heading = document.createElement('div');
               heading.textContent= "Expenses Leaderboard";
               heading.style.fontWeight= "bold"
              
                

                for(var i=0;i<response.data.entry.length;i++){
                    if(i==0){
                        
                        firstNode.append(heading)
                    }
                   
      const inputData= `<li id=${response.data.entry[i].id}> ${response.data.entry[i].name} - ${response.data.entry[i].total_price}  </li>`
    
  firstNode.innerHTML = firstNode.innerHTML + inputData; 

  
                }
                console.log("helloooo ");
            }

   }

  async function download(event){
    event.preventDefault()
    const token = localStorage.getItem('token')
    //console.log("@#@#@#@#",token)
    await axios.get('http://localhost:3000/premiumfeatures/download', { headers: {"Authorisation" : token}})
    .then(async (response)=>{
        if(response.status===200){
            var a= document.createElement("a");
            a.href = response.data.fileUrl;
            a.download = 'myexpenses.csv';
            a.click();
            await axios.get('http://localhost:3000/premiumfeatures/getData', {headers : {"Authorisation": token}})
            .then((response)=>{
                console.log("&*&*&*&*", response.data.newentry[0]);
                //showOnScreen(response.data.newentry[0].fileUrl)

            })
            
        }else{
            throw new Error(response.data.message)
        }
    
    })
    .catch((err)=>{
        throw new Error(err);
    })
   }

   const RowsPerPage = document.getElementById('rowPerPage').addEventListener('change', storeTheValue)

   function storeTheValue(event){
   // event.preventDefault()
    console.log("selected rows per page",event.target.value)
    localStorage.setItem('rowsbydefault', event.target.value);
    const firstNode = document.getElementById('list');
    firstNode.innerHTML = '';
    
const dailyExpensesDiv = document.getElementById('dailyExpenses');
const monthlyExpensesDiv = document.getElementById('monthlyexpenses');
const yearlyExpensesDiv = document.getElementById('Yearly');

// Check the visibility of the div elements
const isDailyVisible = window.getComputedStyle(dailyExpensesDiv).display !== 'none';
const isMonthlyVisible = window.getComputedStyle(monthlyExpensesDiv).display !== 'none';
const isYearlyVisible = window.getComputedStyle(yearlyExpensesDiv).display !== 'none';

// Determine the display mode
let displayMode;
if (isDailyVisible) {
  displayMode = 'day-wise';
  updateDateDisplay()
} else if (isMonthlyVisible) {
  displayMode = 'month-wise';
  updateMonth()
} else if (isYearlyVisible) {
  displayMode = 'year-wise';
  updateYear()
}
   
// Use the displayMode variable as needed
console.log("display in the screen", displayMode);
    

   }

    function logout(event){
      event.preventDefault()

      window.location.href= "loginpage.html";
    }
 

