document.addEventListener("DOMContentLoaded", function(){

   const storedData = localStorage.getItem('userData');
   const user={};

   const ageInput = document.getElementById("ageInput");
   const heightInput = document.getElementById("height");
   const weightInput = document.getElementById("weight");
   const genderRadioButtons = document.getElementsByName("genderUnit");
   const heightRadioButtons = document.getElementsByName("heightUnit");
   const weightRadioButtons = document.getElementsByName("weightUnit");
   const ageWarn = document.getElementById("ageWarning");
   const genderWarn = document.getElementById("genderWarning");
   const heightWarn = document.getElementById("heightWarning");
   const weightWarn = document.getElementById("weightWarning");
   const goalElements = document.getElementsByClassName("container-goal");
   const targetWeightInput = document.getElementById("target-weight-input");
   const clearStorBTN = document.getElementById("clearStorBTN");
   const calcBmiBTN = document.getElementById("calculate-bmi-button");
   const confirmInfoBTN = document.getElementById("confirm-info-button");

   targetWeightInput.addEventListener("input", updateBMR);
   clearStorBTN.addEventListener("click", clearLocalStor);
   
   // IF THERE IS A LOCAL STORED DATA !!!
   if(storedData!=null){
      disableFirstBoxFunctions();
      console.log("local storage existing!");
      const dataUser = JSON.parse(storedData);
      user.age=dataUser.age;
      user.sex=dataUser.sex;
      user.weight=dataUser.weight;
      user.height=dataUser.height;
      user.bmi=dataUser.bmi;
      user.goal=dataUser.goal;
      user.targetWeight=dataUser.targetWeight;
      user.bmr=dataUser.bmr;

      disableFirstBoxFunctions();
      disableSecondBoxFunctions();

      console.log("USER GOAL WEIGHT IS: "+user.goal);
      
      makeVisible('infoContainer');
      console.log(dataUser);
      ageInput.defaultValue=user.age;
      weightInput.defaultValue=user.weight;
      heightInput.defaultValue=user.height;

      //for the radio button 
      if(user.sex=='male'){
         document.getElementById("male").checked = true;
         document.getElementById("female").checked = false;
      }
      else if(user.sex=='female'){
         document.getElementById("male").checked = false;
         document.getElementById("female").checked = true;
      }
      else{
         document.getElementById("male").checked = false;
         document.getElementById("female").checked = false;
      }

      makeVisible('goalContainer');

      temp = "";
      console.log(user.goal);
      temp = getId(user.goal);

      //click the goal based on the user data
      console.log(temp);
      for (const element of goalElements) {
         element.addEventListener("click", goalClicked);
         console.log(element.id);
         if (temp==element.id){
            element.classList.add("active");
         }
      }
      
      updateBMR();
      computeSuggestedGoalWeight;
      targetWeightInput.value = user.targetWeight;
      addProfileInfo();
   }//end if block (has local storage)
   else{
      console.log("local storage NOT existing!");
      console.log("USER GOAL WEIGHT IS: "+user.goal);
      for (const element of goalElements) {
         element.addEventListener("click", goalClicked);
         console.log(element.value);
      } 
   }
   

   // CALCULATE BMI BUTTON
   calcBmiBTN.addEventListener("click", function() {
      validateForm();
   });

   // CONFIRM BUTTON
   confirmInfoBTN.addEventListener("click", function() {
      const userJSON = JSON.stringify(user);

      localStorage.setItem('userData', JSON.stringify(user));
      
      const storedData = localStorage.getItem('userData');
      const userData = JSON.parse(storedData);
      console.log("USER DATA SHOULD BE UPDATED!!!!");
      console.log(userData);
      console.log("aaaaaaaaa");
      // go to next page if this is tru, pang double check lang
      if(storedData){
         console.log(userData);
         window.location.href = "aw.html";
      }
      else{
         alert('user obj is empty, what the shit?');
      }
      
   });

   // GO BACK BUTTON
   document.getElementById("go-back-button").addEventListener("click", function() {
      reenableSecondBoxFunctions();
      makeInvisible("infoContainer");
   });
   
   
   function goalClicked(event) {

      console.log("GOAL CLICKED!!");

      //unclick all goals
      for (const element of goalElements) {
         element.classList.remove("active");
      } 
      
      //click the clicked goal
      const clickedId = event.target.id;
      const clicked = document.getElementById(clickedId);
      clicked.classList.add("active");

      console.log(clickedId);
      console.log(clicked);
      console.log("USER GOAL IS: "+getId(clickedId));

      if (clickedId != "goBack"){
      
      computeSuggestedGoalWeight(clickedId);
      addProfileInfo();
      updateBMR();
      
      console.log(`Your weight is ${weightInput.value}kg. Your suggested weight is: ${computeSuggestedGoalWeight(clickedId)} kg.`);
      disableSecondBoxFunctions();
      makeVisible("infoContainer");
      jumpTo("infoContainer");
      } else {
         reenableFirstBoxFunctions();
         makeInvisible("goalContainer");
         makeInvisible("infoContainer");
         jumpTo("bmiContainer");
      }

      }
      
   function updateBMR() {
      const bmrValue = document.getElementById("bmrV");
      console.log(targetWeightInput.value);
      user.targetWeight=targetWeightInput.value;
      if(targetWeightInput.value==0){
         targetWeightInput.value=user.targetWeight;
      }
      
      let bmr;
      console.log("UPDATE BMR");
      console.log("TARGET WEIGHT IS: "+user.targetWeight);

      if (user.sex === 'male') {
         bmr = Math.round((10*user.targetWeight) + (6.25*user.height) - (5*user.age) + 5);
      } else if (user.sex === 'female') {
            bmr = Math.round(10 *user.targetWeight + 6.25*user.height - 5 * user.age - 161);
      }
      console.log(" BMR SHOULD BE:"+bmr);
      // Update the BMR value in the HTML
      user.bmr=bmr;
      bmrValue.innerHTML = user.bmr;
      computeSuggestedGoalWeight;
   }

   function computeSuggestedGoalWeight(a){
      //suggested weight weights (pun not intended)
      const loseWeightFactor = 0.9;
      const maintainWeightFactor = 1.0;
      const gainWeightFactor = 1.1;
      const weight = weightInput.value

      let suggestedWeight = weight;

      console.log(a);
      switch (a) {
         case "loseWeightGoal":
            user.goal="Lose weight   &#129382;"
            console.log(user.goal);
            suggestedWeight *= loseWeightFactor;
           break;
         case "maintainWeightGoal":
            user.goal="Maintain weight   &#127831;"
            console.log(user.goal);
            suggestedWeight *= maintainWeightFactor;
           break;
         case "gainWeightGoal":
            user.goal="Gain weight   &#128137;"
            console.log(user.goal);
            suggestedWeight *= gainWeightFactor;
           break;
         case "dontKnowGoal":
            user.goal="Not Sure?   &#127849;"
            console.log(user.goal);
            return weight;
           break;
         case "goBack":
            console.log("go fuckin bacc");
            reenableFirstBoxFunctions();
            jumpTo("bmiContainer");
         default:
           console.log("WHAT????")
       }
       user.targetWeight=suggestedWeight;
       return user.targetWeight;
   }

   function validateForm() {
      
       console.log(getRadioBVal(heightRadioButtons));
       console.log(getRadioBVal(weightRadioButtons));
       console.log(getRadioBVal(genderRadioButtons))
      gender = getRadioBVal(genderRadioButtons);
      heightUnit = getRadioBVal(heightRadioButtons);
      weightUnit = getRadioBVal(weightRadioButtons);

      if (ageInput.value == '') {
         calcBmiBTN.removeEventListener("click", calculateBMI)
         makeInvisible('goalContainer');
         ageWarn.classList.remove("hiddenAF");
         jumpTo('bmiContainer');
      } else {
         ageWarn.classList.add("hiddenAF");
      }

      if(gender == undefined) {
         calcBmiBTN.removeEventListener("click", calculateBMI)
         makeInvisible('goalContainer');
         console.log("blank");
         genderWarn.classList.remove("hiddenAF");
         jumpTo('bmiContainer');
      } else {
         genderWarn.classList.add("hiddenAF");
         console.log("meron");
      }
      
      if (heightInput.value == '') {

         calcBmiBTN.removeEventListener("click", calculateBMI)
         makeInvisible('goalContainer')
         heightWarn.classList.remove("hiddenAF");
         jumpTo('bmiContainer');
      }
      else{
         heightWarn.classList.add("hiddenAF")
      }

      if (weightInput.value == '') {
         calcBmiBTN.removeEventListener("click", calculateBMI)
         makeInvisible('goalContainer')
         weightWarn.classList.remove("hiddenAF");
         jumpTo('bmiContainer');
      }
      else{
         weightWarn.classList.add("hiddenAF");
      }

      if (weightInput.value != ''&&heightInput.value !=''){
         
         user.weight=weightInput.value;
         user.height=heightInput.value;
         user.age=ageInput.value;
         console.log(calculateBMI(heightInput.value, weightInput.value, heightUnit, weightUnit));
         makeVisible('goalContainer');
         jumpTo('goalContainer');

         disableFirstBoxFunctions();
      }
   }

   function disableFirstBoxFunctions() {
      document.getElementById("ageInput").disabled = true;
      document.getElementById("height").disabled = true;
      document.getElementById("weight").disabled = true;
      document.getElementById("calculate-bmi-button").disabled = true;

      for(var i = 0; i < genderRadioButtons.length; i++) {
         genderRadioButtons[i].disabled = true;
         heightRadioButtons[i].disabled = true;
         weightRadioButtons[i].disabled = true;
      }
      
      calcBmiBTN.classList.add("nuhUh");

      var bmicont = document.getElementById("bmiContainer");
      bmicont.classList.add("faded");
   }

   function disableSecondBoxFunctions() {
      var lwg = document.getElementById("loseWeightGoal");
      var mwg = document.getElementById("maintainWeightGoal");
      var gwg = document.getElementById("gainWeightGoal");
      var gb = document.getElementById("goBack");

      lwg.classList.add("nuhUh");
      mwg.classList.add("nuhUh");
      gwg.classList.add("nuhUh");
      gb.classList.add("nuhUh");

      var goalcont = document.getElementById("goalContainer");
      goalcont.classList.add("faded");
   }


   function reenableFirstBoxFunctions() {
      document.getElementById("ageInput").disabled = false;
      document.getElementById("height").disabled = false;
      document.getElementById("weight").disabled = false;
      document.getElementById("calculate-bmi-button").disabled = false;

      for(var i = 0; i < genderRadioButtons.length; i++) {
         genderRadioButtons[i].disabled = false;
         heightRadioButtons[i].disabled = false;
         weightRadioButtons[i].disabled = false;
      }

      calcBmiBTN.classList.remove("nuhUh");

      var bmicont = document.getElementById("bmiContainer");
      bmicont.classList.remove("faded");
   }

   function reenableSecondBoxFunctions() {
      var lwg = document.getElementById("loseWeightGoal");
      var mwg = document.getElementById("maintainWeightGoal");
      var gwg = document.getElementById("gainWeightGoal");
      var gb = document.getElementById("goBack");

      lwg.classList.remove("nuhUh");
      mwg.classList.remove("nuhUh");
      gwg.classList.remove("nuhUh");
      gb.classList.remove("nuhUh");

      var goalcont = document.getElementById("goalContainer");
      goalcont.classList.remove("faded");
   }
   
   function calculateBMI() {
      const ageVal = parseInt(ageInput.value);
      const weightVal = parseFloat(weightInput.value);
      const heightVal = parseFloat(heightInput.value);
      const genderVal = getRadioBVal(genderRadioButtons);
      let weightKg, heightM;
    
      //WHAT THE FUCK IS A KILOMETEEEEEEEERR
      //convert to metric then compute bmi
      if (document.getElementById("kg").checked) {
        weightKg = weightVal;
      } else if (document.getElementById("lbs").checked) {
        weightKg = weightVal * 0.453592;
      }
    
      if (document.getElementById("cm").checked) {
        heightM = heightVal;
      } else if (document.getElementById("ft").checked) {
        heightM = (heightVal * 0.0254);
      }

      console.log(weightKg);
      console.log(heightM);
    
      const bmi = weightKg / ((heightM / 100) * (heightM / 100));
      user.bmi=bmi;
      bmr = 0;

      // mifflin-st.jeor equation is used for calculation
      if (genderVal == 'male') {
         user.sex='male';
         // todo
         bmr = Math.round((10*weightKg) + (6.25*heightM) - (5*ageVal) + 5);
         console.log("BMR is:" + bmr);
      } else if (genderVal == 'female') {
         user.sex='female';
         bmr = Math.round((10*weightKg) + (6.25*heightM) - (5*ageVal) - 161);
         console.log("BMR is:" + bmr);
      }
      user.bmr=bmr+" calories";

      console.log("AAA"+user.weight);
      return bmi.toFixed(1)
   
    }
    
   // get radio button value
   function getRadioBVal(radioButtons) {
      for (const radioButton of radioButtons) {
         if (radioButton.checked) {
            return radioButton.value;
         }
      }
   }

function jumpTo(anchor_id){
   var url = location.href;
   location.href = "#"+anchor_id;
   history.replaceState(null,null,url);
 }


function makeVisible(divId){
   const goalDiv = document.getElementById(divId);
   goalDiv.classList.remove("hiddenAF");
   goalDiv.classList.remove("hidden");
   goalDiv.classList.add("visible");
}
function makeInvisible(divId){
   const goalDiv = document.getElementById(divId);
   goalDiv.classList.remove("visible");
   goalDiv.classList.add("hidden");
}
function makeInvisibleAF(divId){
   const goalDiv = document.getElementById(divId);
   goalDiv.classList.remove("visible");
   goalDiv.classList.add("hiddenAF");
}
function clearObject(obj) {
   for (const key in obj) {
       if (obj.hasOwnProperty(key)) {
           delete obj[key];
       }
   }
}

function addProfileInfo(){
   console.log("BYEBYE"+user.goal);
   user.targetWeight=computeSuggestedGoalWeight(getId(user.goal));
   
   const bmiV = document.getElementById("bmiV");
   const goalV = document.getElementById("goalWeightV");
   const bmrV = document.getElementById("bmrV");

   console.log("HELLO : "+user.targetWeight);

   bmiV.innerHTML = user.bmi.toFixed(2);
   goalV.innerHTML = user.goal;
   targetWeightInput.value = user.targetWeight.toFixed(2);
   bmrV.innerHTML=user.bmr;
   
   console.log(goalV.innerHTML);
}

function getId(goal){
   switch(goal){
      case("Lose weight   &#129382;"):
         return "loseWeightGoal"
         break;
      case("Maintain weight   &#127831;"):
         return "maintainWeightGoal"
         break;
      case("Gain weight   &#128137;"):
         return "gainWeightGoal"
         break;
      case("Not Sure?   &#127849;"):
         return "dontKnowGoal"
         break;
      default:
         console.log("you should not be seeing this lmao");
         break;
   }
}

function clearLocalStor(){
   localStorage.clear();
   // todo
   // fix this, dapat hindi buong localStorage yung cineclear, dapat yung ('userData') item lang, does not work idk whytf?
   // localStorage.removeItem('userData');
   alert("LOCAL STORAGE HAS BEEN CLEARED!");
   location.reload();
}
});