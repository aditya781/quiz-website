const express=require("express");
const mysql=require("mysql");
const bodyParser=require("body-parser");
const { response } = require("express");
require('dotenv').config();

const app=express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");

//getting password from .env file
let mysqlPass=process.env.MYSQL_PASSWORD;

//create database connection
const db=mysql.createConnection({
    host     : "localhost",
    user     : "root",
    password : mysqlPass,
    database :"quiz_app"
})

//connection
db.connect((err)=>{
    if(err){
        console.log(error);
        throw err;
    }
    console.log("connected");
})


app.get("/",function(req,res){  
    res.render("login.ejs");
});

app.get("/login",function(req,res){  
    res.render("login.ejs");
});
app.get("/register",function(req,res){  
    res.render("register.ejs");
});

app.post("/register",function(req,res){ 
    console.log(req.body)
   
});

app.listen(process.env.PORT || 3000, function(){
    console.log("server started on port 3000");
})