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
var adminTempEmail=" "

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

app.post("/login", function(req,res){
    //res.render("login", {error:"welcome aditya"})
    db.query("select admin_email, admin_pass from admin_table where admin_email= ?", [req.body.femail], (error,result)=>{
        if(error){
            console.log(error);
            return;
        }
        if(result.length==0){
            console.log("Please register to login")
            res.render("login.ejs", {error:"Please register to login."});

        }else{
            
            bcrypt.compare(req.body.fpassword, result[0].admin_pass, function(erro, respo){
                if(respo==true){
                    adminTempEmail=result[0].admin_email;
                    res.render("home.ejs")
                
                }
                else{
                    res.render("login.ejs",{error:"Please enter correct password"});
                }
            });
        }
    })
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
                    admin_profession:req.body.fprofession}, (error, resul)=>{
                    if(error){
                        console.log(error);
                        return;
                    }
                });
                adminTempEmail=result[0].admin_email;
                res.render("home.ejs");
            }
        })
            
    });
   
});


app.post("/insert_question", (req,res)=>{
    console.log(req.body)
    if(adminTempEmail===" "){
        console.log("plese login to insert");
        return;
    }
    db.query("insert into questions_table set ? ",{
        question :req.body.fquestion,
        a  :req.body.fa,
        b  :req.body.fb,
        c  :req.body.fc,
        d  :req.body.fd,
        answer :req.body.fanswer,
        admin_email:adminTempEmail
    },(error,result)=>{
        if(error){
            console.log(error)
            return;
        }
        console.log("Inserted successfully")
    })
})

app.listen(process.env.PORT || 3000, function(){
    console.log("server started on port 3000");
})