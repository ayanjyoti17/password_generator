//first of all we fetch all the elements using querySelector
const inputSlider=document.querySelector("[data-lengthSlider]");
const lengthDisplay=document.querySelector("[data-lengthNumber]");
const passwordDisplay=document.querySelector("[data-passwordDisplay]");
const copyBtn=document.querySelector("[data-copy]");
const copyMsg=document.querySelector("[data-copyMsg]");
const uppercaseCheck=document.querySelector("#uppercase");
const lowercaseCheck=document.querySelector("#lowercase");
const numbersCheck=document.querySelector("#numbers");
const symbolsCheck=document.querySelector("#symbols");
const indicator=document.querySelector("[data-indicator]");
const generateBtn=document.querySelector(".generateButton");
const allCheckBox=document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

//initially
let password="";
let passwordLength=10;
let checkCount=0;
handleSlider();
//set strength circle color to grey
setIndicator("#ccc");

//set passwordLength
function handleSlider() {
    inputSlider.value=passwordLength;
    lengthDisplay.innerText=passwordLength;
    const min = inputSlider.min;
    const max = inputSlider.max;

    inputSlider.style.backgroundSize =
    ((passwordLength - min) * 100) / (max - min) + "%100%";
}

function setIndicator(color){
    indicator.style.backgroundColor=color;
    //shadow
    indicator.style.boxShadow = `0px 0px 12px 1px ${color} `;
}

function getRndInteger(min,max){
    return Math.floor(Math.random()*(max-min))+min;
}

function generateRandomNumber(){
    return getRndInteger(0,9);
}

function generateLowerCase(){
    return String.fromCharCode(getRndInteger(97,123));
}

function generateUpperCase(){
    return String.fromCharCode(getRndInteger(65,91));
}

function generateSymbol(){
    const randNum=getRndInteger(0,symbols.length);
    return symbols.charAt(randNum);
}

function calcStrength(){
    let hasUpper=false;
    let hasLower=false;
    let hasNum=false;
    let hasSym=false;
    if(uppercaseCheck.checked) hasUpper=true;
    if(lowercaseCheck.checked) hasLower=true;
    if(numbersCheck.checked) hasNum=true;
    if(symbolsCheck.checked) hasSym=true;
    if(hasUpper && hasLower && (hasNum || hasSym) && passwordLength>=8){
        setIndicator("#0f0");
    }
    else if (
        (hasLower || hasUpper) &&
        (hasNum || hasSym) &&
        passwordLength>=6
    ){
        setIndicator("#ff0");
    }
    else{
        setIndicator("#f00");
    }
}

async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText="Copied";
    }
    catch(error){
        copyMsg.innerText="Failed";
    }
    //to make copy wala span visible
    copyMsg.classList.add("active");

    setTimeout(()=>{
        copyMsg.classList.remove("active");
    },2000);
}
//to add event listener
//slider ko jb bhi aag picha kr raha hun to slider ki avlue change ho rhi yeh woh value lakar de rha hai
inputSlider.addEventListener("input", (e) => {
    //pasword length ko updat kr diya
    passwordLength = e.target.value;
  
    handleSlider();
});
  
//copy btn add event listener
//input value koi value hogi tb copy kr payoge
copyBtn.addEventListener("click", () => {
    if (passwordDisplay.value) {
      copyContent();
    }
});

allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change',handleCheckBoxChange);
})

inputSlider.addEventListener('input',(e)=>{
    passwordLength=e.target.value;
    handleSlider();
})

copyBtn.addEventListener('click',()=>{
    if(passwordDisplay.value){
        copyContent();
    }
});

function handleCheckBoxChange() {
    checkCount = 0;
    allCheckBox.forEach((checkbox) => {
      if (checkbox.checked) {
        checkCount++;
      }
    });
  
    //special condition of password length< no of checkbocx count
    if (passwordLength < checkCount) {
      passwordLength = checkCount;
      handleSlider();
    }
}
//saara checkbox pa even listener lga denga
//chahe tick ho ho rha ya untick usma check krkr aao kitna checkbox cheked hai
allCheckBox.forEach((checkbox) => {
checkbox.addEventListener("change", handleCheckBoxChange);
});
  
function shufflePassword(array) {
    //Fisher Yates Method
    for (let i = array.length - 1; i > 0; i--) {
      //random J, find out using random function
      const j = Math.floor(Math.random() * (i + 1));
      //swap number at i index and j index
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

//generate password
//jb mai sare boxes ko unchecked kr deta hu then click krta hu genertae password
//then generate password nhi hota

generateBtn.addEventListener('click', ()=>{
    //none of the checkbox are selected
    if(checkCount==0){
        return;
    }
    if(passwordLength<checkCount){
        passwordLength=checkCount;
        handleSlider();
    }
    //lets start the journey to find new password
    //first remove old password
    password="";
    let funArr=[];
    if(uppercaseCheck.checked){
        funArr.push(generateUpperCase);
    }
    if(lowercaseCheck.checked){
        funArr.push(generateLowerCase);
    }
    if(numbersCheck.checked){
        funArr.push(generateRandomNumber);
    }
    if(symbolsCheck.checked){
        funArr.push(generateSymbol);
    }

    //compulsary addition
    for(let i=0;i<funArr.length;i++){
        password+=funArr[i]();
    }

    //remaining addition
    for(let i=0;i<passwordLength-funArr.length;i++){
        let randIndex=getRndInteger(0,funArr.length);
        password+=funArr[randIndex]();
    }

    //suffle password
    password=shufflePassword(Array.from(password));

    //show in UI
    passwordDisplay.value=password;

    //calculate strength
    calcStrength();
})