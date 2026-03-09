import * as jsonParse from './jsonHandler.js';

let totalCals=0;
document.addEventListener("DOMContentLoaded", function(){
console.log("DIETSCRIPT");

const storedData = localStorage.getItem('userData');
const stats = document.getElementById("txtCalorieStat");
const statsPercent = document.getElementById("percentCalorieStat");
const searchBar = document.getElementById("myInput");
const clearBTN = document.getElementById("clearOrdersBTN");
const submitBTN = document.getElementById("printChoicesBTN");
const foodLogo = document.getElementById("restoLogo");
const foodCont = document.getElementById("foodsContainer");
const dropDownBTN = document.getElementById("dropDownButton");
const dietDiv = document.getElementById("dietDiv");
const startMessage = document.getElementById("startMessage");

let userData = JSON.parse(storedData);
let relativeProg;

if (storedData) {
  startMessage.innerHTML = "&#8598;  to get started.. choose a restaurant :D";
    dietDiv.classList.remove("faded");
   foodCont.classList.remove("faded");
    dropDownBTN.ariaDisabled = false;
    const userData = JSON.parse(storedData);
    console.log(userData);
    setUserData(userData);
    console.log(userData.age);
    stats.innerHTML="Calories: 0 / "+userData.bmr;

    console.log(jsonParse.getAllRestaurants());
    populateDropDownResto(jsonParse.getAllRestaurants());

    // calories, total calories
    
    
    setProg(totalCals, userData.bmr);

    document.getElementById("dropDownButton").addEventListener("click", myFunction)
    function setUserData(userData){
      const age = userData.age;
      const bmi = userData.bmi;
      const bmr = userData.bmr;
      const goal = userData.goal;
      const height = userData.height;
      const sex = userData.sex;
      const suggestedWeight = userData.suggestedWeight;
      const weight = userData.weight;
    }
  } else {
    startMessage.innerHTML = "Please go back to page 1 to calculate your daily caloric intake (BMR)";
    console.log("ELSE");
    dietDiv.classList.add("faded");
    foodCont.classList.add("faded");
    dropDownBTN.ariaDisabled = true;
    dropDownBTN.classList.add("nuhUh");
    
}



  //CALORIES vs TOTAL REQUIRED CALORIES
  function setProg(progressBMR, totalBMR) {
    const bmrProgressBar = document.getElementById("bmrProgressBar");
    
    console.log("TOTAL CAL: "+totalCals);
    const numb = parseInt(totalBMR, 10);

    relativeProg = progressBMR/numb*100;
    if(!relativeProg){
      relativeProg=0
      console.log("FAFAF");
      statsPercent.innerHTML="0%"
    }
    console.log("RELATIVE PROG: "+ relativeProg);
    console.log(progressBMR+"/"+userData.bmr);

    // MORE THAN 100
    if (relativeProg > 100) {
      bmrProgressBar.style.backgroundColor = "red";
      bmrProgressBar.style.width = "100%";

    // 91 - 102
    } else if (relativeProg >= 91 && relativeProg <= 102) {
      bmrProgressBar.style.backgroundColor = "orange";
      bmrProgressBar.style.width = relativeProg + "%";
    } 
    
    // LESS THAN 93
    else {
      bmrProgressBar.style.backgroundColor = '#52b265';
      bmrProgressBar.style.width = relativeProg + "%";
    }
    stats.innerHTML="Calories: "+progressBMR+" / "+userData.bmr
    statsPercent.innerHTML=relativeProg.toFixed(0)+"%"
}

function showFatAssWarning(){
  const notif = document.getElementById("notif");
  notif.className = "show";
  setTimeout(function(){ notif.className = notif.className.replace("show", ""); }, 3000);
}
function myFunction() {
  document.getElementById("myDropdown").classList.toggle("show");
  // const arrow = document.getElementById("arrowDpd");
  //   arrow.classList.remove("down");
  //   arrow.classList.add("up");
}

async function populateDropDownResto(elements){
  const dropdown = document.getElementById('myDropdown');
  try {
    const restaurantNames = await jsonParse.getAllRestaurants();
    
    restaurantNames.forEach((restaurantName) => {
      const option = document.createElement('a');
      option.href = '#restoFoods';
      option.textContent = restaurantName;
      dropdown.appendChild(option);
    });
  } catch (error) {
    console.error('Error populating dropdown:', error);
  }
}

// ONCLICK OF RESTAURANT FUNCTION 
async function populateTableRestoFoods(restaurant){
  document.getElementById("showMeAtStart").classList.add("hiddenAF");
  document.getElementById("myInput").classList.remove("hiddenAF");
  document.getElementById("myDropdown").classList.remove("show");
  const restoLabel = document.getElementById("menuLabel");
  const table = document.getElementById('restoFoods');
  const headerRow = document.getElementById('restoFoodsHeader');
  headerRow.classList.remove('hiddenAF');
  try {
    restoLabel.innerHTML=restaurant+" menu"
    changeIcon(restaurant);
    restoLabel.classList.remove("HiddenAF");
    const foods = await jsonParse.getRestaurantFoods(restaurant);
    
    // CLEAR TABLE, OR ELSE MAG AAPPEND LANG YUNG ELEMENTS
    while (table.rows.length > 2) {
      table.deleteRow(2);
    }
    
    // POPULATE TABLE
    foods.forEach((food) => {
      const row = table.insertRow(-1);
      //FOOD NAME
      const cell1 = row.insertCell(0);
      //CAL
      const cell2 = row.insertCell(1);
      
      cell1.textContent = food.foodName;
      cell2.textContent = `${food.calories} cal`;
    });
    if (table.rows.length <= 2) {
      headerRow.classList.add('hiddenAF');
      
    } else {
      table.classList.add('hasBorder');
      headerRow.classList.remove('hiddenAF');
    }
  } catch (error) 
  {
    console.error('Error populating table:', error);
  }
}

function addHeaderRow(table) {
  const headerRow = table.insertRow(0);
  const headerCell1 = headerRow.insertCell(0);
  const headerCell2 = headerRow.insertCell(1);
  headerCell1.textContent = 'FOOD';
  headerCell2.textContent = 'CALORIES';
  headerCell1.style.width = '60%';
  headerCell2.style.width = '40%';
  headerRow.classList.add('header');
}

const dropdown = document.getElementById('myDropdown');
dropdown.addEventListener('click', async (event) => {
  if (event.target.tagName === 'A') {
    const restaurantName = event.target.textContent;
    const arrow = document.getElementById("arrowDpd");
    arrow.classList.remove("up");
    arrow.classList.add("down");
    populateTableRestoFoods(restaurantName);
  }
});

const restoFoodsTable = document.getElementById('restoFoods');
const whatToOrderTable = document.getElementById('whatToOrder');

function addToOrder(foodName, calories) {
  const row = whatToOrderTable.insertRow(-1);
  const cell1 = row.insertCell(0);
  const cell2 = row.insertCell(1);

  cell1.textContent = foodName;
  cell2.textContent = calories;
}

restoFoodsTable.addEventListener('click', (event) => {
  let label = document.getElementById("ordersLabel");
  if(event.target.tagName == 'TH'){
    console.log("TH IS CLICKED");
    return
}
  clearBTN.classList.remove("hiddenAF");
  submitBTN.classList.remove("hiddenAF");
  const table = document.getElementById('whatToOrder');
  table.classList.add("hasBorder");
   const headerRow = document.getElementById('whatToOrderHeader');
   headerRow.classList.remove('hiddenAF');
  console.log("CLICKED: "+event.target.tagName);
  
  if (event.target.tagName === 'TD') {
    label.classList.remove("hiddenAF");
    const foodName = event.target.parentElement.cells[0].textContent;
    const calories = event.target.parentElement.cells[1].textContent;
    addToOrder(foodName, calories);
    console.log("I ADDED: "+calories);
    totalCals+=parseInt(calories, 10);
    setProg(totalCals, userData.bmr);
  }
});

whatToOrderTable.addEventListener('click', (event) => {
  let label = document.getElementById("ordersLabel");
  const table = document.getElementById('whatToOrder');
  const headerRow = document.getElementById('whatToOrderHeader');
  if (event.target.tagName === 'TD' && event.target.parentElement !== whatToOrderTable.rows[0]) {
    const calories = parseInt(event.target.parentElement.cells[1].textContent, 10);
    whatToOrderTable.deleteRow(event.target.parentElement.rowIndex);
    console.log("I SUBTRACTED: "+calories);
    totalCals -= parseInt(calories, 10);
    setProg(totalCals, userData.bmr);
    // lmao band aid fix
    
    console.log(totalCals);
      if (totalCals == 0) {
        label.classList.add("hiddenAF");
        console.log("SHOULD HAVE NOOOOO BORDER");
        console.log(totalCals);
        headerRow.classList.add('hiddenAF');
        table.classList.remove("hasBorder");
        clearBTN.classList.add("hiddenAF");
        submitBTN.classList.add("hiddenAF");
    }
    else{
      label.classList.remove("hiddenAF");
      console.log("SHOULD HAVE BORDER");
      table.classList.add("hasBorder");
      clearBTN.classList.remove("hiddenAF");
      submitBTN.classList.remove("hiddenAF");
    }
  }
});

searchBar.addEventListener("input", searchFor);

function searchFor() {
  const notF=document.getElementById("notFoundLabel");
  var input, filter, table, tr, td, i, j, txtValue;
  input = document.getElementById("myInput");
  filter = input.value.toUpperCase();
  table = document.getElementById("restoFoods");
  tr = table.getElementsByTagName("tr");
  let anyRowsVisible = false;
  
  for (i = 1; i < tr.length; i++) {
    let rowVisible = false;
    td = tr[i].getElementsByTagName("td");
    
    for (j = 0; j < td.length; j++) {
      let cell = td[j];
      if (cell) {
        txtValue = cell.textContent || cell.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
          rowVisible = true;
          anyRowsVisible = true;
        }
      }
    }
    tr[i].style.display = rowVisible ? "" : "none";
  }
  if (!anyRowsVisible) {
    console.log("NOTHIGN FOUND");
    restoFoodsTable.classList.add("hiddenAF");
    notF.classList.remove("hiddenAF");
    notF.innerHTML="no results for "+input.value+".."
  }
  else{
    restoFoodsTable.classList.remove("hiddenAF");
    notF.classList.add("hiddenAF");
  }
}

function changeIcon(restaurant){
  let logo;
  switch (restaurant) {
    case "McDonalds":
      logo = "../assets/LOGOS/MCDO-ICON.png";
      break;
    case "Burger King":
      logo = "../assets/LOGOS/BURGERKINGLOGO.png";
      break;
    case "Subway":
      logo = "../assets/LOGOS/SUBWAYLOGO.png";
      break;
    case "Wendys":
      logo = "../assets/LOGOS/WENDYSLOGO.png";
      break;
    case "Taco Bell":
      logo = "../assets/LOGOS/TACOBELLLOGO.png";
      break;
    case "Arbys":
      logo = "../assets/LOGOS/ARBYSLOGO.png";
      break;
    case "Hardees":
      logo = "../assets/LOGOS/HARDEESLOGO.png";
      break;
    case "Five Guys":
      logo = "../assets/LOGOS/FIVEGUYSLOGO.png";
      break;
    case "In-N-Out":
      logo = "../assets/LOGOS/INNOUTLOGO.png";
      break;
    case "Sonic":
      logo = "../assets/LOGOS/SONICLOGO.png";
      break;
    case "Panda Express":
      logo = "../assets/LOGOS/PANDAEXPRESSLOGO.png";
      break;
    case "Panera":
      logo = "../assets/LOGOS/PANERALOGO.png";
      break;
    case "Chipotle":
      logo = "../assets/LOGOS/CHIPOTLELOGO.png";
      break;
    case "Chick-fil-A":
      logo = "../assets/LOGOS/CHICKFILLOGO.png";
      break;
    case "Cookout":
      logo = "../assets/LOGOS/COOKOUTLOGO.png";
      break;
    default:
      logo = "../assets/images/LOGO.png";
      break;
  }
  foodLogo.src=logo;
}
clearBTN.addEventListener("click", clearOrdersTable);

  function clearOrdersTable(){
    console.log("CLEAR BTN");
    const rowCount = whatToOrderTable.rows.length;
    for (let i = rowCount - 1; i >= 1; i--) {
        const row = whatToOrderTable.rows[i];
        const calories = parseInt(row.cells[1].textContent, 10);
        whatToOrderTable.deleteRow(i);
        totalCals -= calories;
        
    }
  // Hide the table header and clear orders label
  const headerRow = document.getElementById('whatToOrderHeader');
  headerRow.classList.add('hiddenAF');
  whatToOrderTable.classList.remove('hasBorder');
  clearBTN.classList.add('hiddenAF');
  submitBTN.classList.add('hiddenAF');

  const label = document.getElementById('ordersLabel');
  label.classList.add('hiddenAF');

  // Update the progress bar
  setProg(totalCals, userData.bmr);
    
  }

  submitBTN.addEventListener("click", submitButton);
  var span = document.getElementsByClassName("close")[0];
  span.onclick = function() {
    modal.style.display = "none";
  }
function submitButton() {
    console.log("SUBMIT BTN");
    const orderedFoods = {};
    const rows = whatToOrderTable.rows;

    for (let i = 1; i < rows.length; i++) {
        const foodName = rows[i].cells[0].textContent;
        const calories = parseInt(rows[i].cells[1].textContent, 10);
        
        //check if food already exists para add quantity nalang and calories
        if (orderedFoods[foodName]) {
            orderedFoods[foodName].quantity += 1;
            orderedFoods[foodName].totalCalories += calories;
        } else {
            orderedFoods[foodName] = { foodName, calories, quantity: 1, totalCalories: calories };
        }
    }
    console.log(orderedFoods);
    var modal = document.getElementById("myModal");
    var modalContent = modal.querySelector(".modal-content");
    
    window.onclick = function(event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    }
    modal.style.display = "block";
    modalContent.innerHTML = "";
    var heading = document.createElement("h1");
    heading.textContent = "ORDER:";
    modalContent.appendChild(heading);
    for (const foodName in orderedFoods) {
      if (orderedFoods.hasOwnProperty(foodName)) {
          const foodItem = orderedFoods[foodName];
          const text = `${foodItem.quantity}x ${foodItem.foodName} - ${foodItem.totalCalories} cal`;
          
          var foodItemElement = document.createElement("p");
          foodItemElement.textContent = text;
          foodItemElement.classList.add("contentOnModal");
          modalContent.appendChild(foodItemElement);
      }
  }
  modal.style.display = "block";
}

function gauge(){
  var dom = document.getElementById("chart");
var myChart = echarts.init(dom);
var app = {};
option = null;

option = {
  title: {
        text: 'EChart Guage',
        left: 'center'
    },
    series: [{
        type: 'gauge',
        startAngle: 180,
        endAngle: 0,
        progress: {
            show: false,
            width: 10
        },
        axisLine: {
          roundCap: true,
            lineStyle: {
                width: 10,
                color: [
                    [0.25, '#ca583f'],
                    [0.50, '#FDDD60'],
                    [0.75, '#58D9F9'],
                    [1, '#ca583f'],
                ]
            }
        },
        axisTick: {
            show: false
        },
        splitLine: {
            length: 15,
            lineStyle: {
                width: 0,
                color: '#999'
            }
        },
        axisLabel: {
            show: false,
            distance: 5,
            color: '#999',
            fontSize: 14
        },
      pointer: {
            icon: 'path://M2090.36389,615.30999 L2090.36389,615.30999 C2091.48372,615.30999 2092.40383,616.194028 2092.44859,617.312956 L2096.90698,728.755929 C2097.05155,732.369577 2094.2393,735.416212 2090.62566,735.56078 C2090.53845,735.564269 2090.45117,735.566014 2090.36389,735.566014 L2090.36389,735.566014 C2086.74736,735.566014 2083.81557,732.63423 2083.81557,729.017692 C2083.81557,728.930412 2083.81732,728.84314 2083.82081,728.755929 L2088.2792,617.312956 C2088.32396,616.194028 2089.24407,615.30999 2090.36389,615.30999 Z',
            length: '85%',
            width: 6,
            offsetCenter: [0, '0']
        },
        anchor: {
            show: true,
            showAbove: true,
            size: 10,
            itemStyle: {
                borderWidth: 3
            }
        },
        detail: {
          show: false,
            valueAnimation: true,
            fontSize: 30,
            offsetCenter: [0, '20%']
        },
        data: [{
            value: 60
        }]
    }]
};

if (option && typeof option === "object") {
    myChart.setOption(option, true);
}
}
});