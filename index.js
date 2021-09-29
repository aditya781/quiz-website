const express=require("express");
const ejs=require("ejs")
const mysql=require("mysql");
const bcrypt=require("bcrypt")
const bodyParser=require("body-parser");
const { response } = require("express");
require('dotenv').config();

const app=express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
const saltRounds=10;

var regi_error=" ";
var error=" ";

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
    res.render("login.ejs", {error:" "});
});

app.get("/login",function(req,res){  
    res.render("login.ejs", {error:""});
});
app.get("/register",function(req,res){  
    res.render("register.ejs", {regi_error:""});
});

app.post("/login", function(req,err){
    res.render("login", {error:"welcome aditya"})
})

app.post("/register",function(req,res){ 
    console.log(req.body)
    bcrypt.hash(req.body.fpassword, saltRounds, function(err, hash){
        console.log(hash.length)
        db.query("select admin_email from admin_table where admin_email= ? ", [req.body.femail], (error, result)=>{
            if(error){
                console.log(error);
                return;
            }
            if(result.length>0){
                console.log("User already exists");
                res.render("register.ejs", {regi_error:"User already exists!"});
            }else{
                db.query("insert into admin_table  set ? ", {
                    admin_name:req.body.fname, 
                    admin_pass:hash, 
                    admin_phone:req.body.fphone,
                    admin_email:req.body.femail, 
                    admin_profession:req.body.fprofession}, (error, result)=>{
                    if(error){
                        console.log(error);
                    }
                })

                res.render("home.ejs");
            }
        })
            
    });
   
});

app.listen(process.env.PORT || 3000, function(){
    console.log("server started on port 3000");
})