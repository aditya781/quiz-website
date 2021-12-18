var data1;
let questions;
function randomIpsum( data){
  data1=data;
  questions=data;
 // console.log(data)
}
$("#start_btn").on("click", function(){
  $.get("/hi", function(data){
      randomIpsum( data)
  })
})



