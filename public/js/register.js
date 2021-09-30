const indicator= document.querySelector(".indicator")
const input= document.querySelector(".fpass")
const weak= document.querySelector(".weak")
const medium= document.querySelector(".medium")
const strong= document.querySelector(".strong")

let regExpWeak = /[a-z]/;
let regExpMedium = /\d+/;
let regExpStrong = /.[!,@,#,$,%,^,&,*,?,_,~,-,(,)]/;

function trigger(){
    if(input.value != ""){
      indicator.style.display = "block";
      indicator.style.display = "flex";
      if(input.value.length <= 3 && (input.value.match(regExpWeak) || input.value.match(regExpMedium) || input.value.match(regExpStrong)))no=1;
      if(input.value.length >= 6 && ((input.value.match(regExpWeak) && input.value.match(regExpMedium)) || (input.value.match(regExpMedium) && input.value.match(regExpStrong)) || (input.value.match(regExpWeak) && input.value.match(regExpStrong))))no=2;
      if(input.value.length >= 6 && input.value.match(regExpWeak) && input.value.match(regExpMedium) && input.value.match(regExpStrong))no=3;
      if(no==1){
        weak.classList.add("active");
        
      }
      if(no==2){
        medium.classList.add("active");
        
      }else{
        medium.classList.remove("active");
        
      }
      if(no==3){
        weak.classList.add("active");
        medium.classList.add("active");
        strong.classList.add("active");
       
      }else{
        strong.classList.remove("active");
        
      }
     
      
    }else{
      indicator.style.display = "none";
      
    }
  }