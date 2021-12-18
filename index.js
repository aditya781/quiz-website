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
var tempemail

//getting password from .env file
let mysqlPass=process.env.MYSQL_PASSWORD;

//create database connection
const db=mysql.createConnection({
    host     : "localhost",
    user     : "root",
    password : mysqlPass,
    database :"copy_quiz_app"
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
    db.query("select questions_table.question, questions_table.que_id , questions_table.a, questions_table.b, questions_table.c, questions_table.d, questions_table.answer, subject_table.subject_name from questions_table inner join subject_table on subject_table.que_id=questions_table.que_id",(er,re)=>{
        if(er){
            console.log(er);
            return;
        }
        else{
            //console.log(re)
            res.render("viewQues.ejs",{item:re})
        }
    })
   
});

app.get("/subject",function(req,res){  
  
    res.render("subject.ejs")
   
});
var ress="";

let ques=[]
app.post("/subject",function(req,res){
    console.log("subject= "+req.body.fsubject)  
    db.query("select questions_table.question, questions_table.a, questions_table.b, questions_table.c, questions_table.d, questions_table.answer, subject_table.subject_name from questions_table inner join subject_table on subject_table.que_id=questions_table.que_id and subject_table.subject_name= ? order by rand()",
    [req.body.fsubject],(er,re)=>{
        if(er){
            console.log(er);
            return;
        }else{
            
            console.log("re= "+ re)
            ress=re
            
        }
    })
    //res.render("index.ejs", {questionsss:ress});
    setTimeout(function(){ 
    console.log(ress.length)
    ques=[]
    for (var i=0; i<10; i++){
       if(ress.length>i){
        var temp={
            numb:i+1,
            question: ress[i].question,
            answer: ress[i].answer,
            options:[
                ress[i].a,
                ress[i].b,
                ress[i].c,
                ress[i].d
            ]
            }
            ques.push(temp);
       }else{
           break;
       }
    }
    console.log(ques)
    res.render("index.ejs")
    }, 3000);
    
});

app.get("/hi",function(req,res){  
   
    res.send(ques)
});
ress=[]
app.get("/addques",function(req,res){ 
    tempemail=adminTempEmail 
    //adminTempEmail=" "
    if(adminTempEmail!=" "){
        db.query("select * from questions_table where admin_email= ?",[adminTempEmail],(er,re)=>{
            if(er){
                console.log(er);
                return;
            }else{
                console.log(adminTempEmail)
                ress=re
                //res.json(ress)
            }
        })
    }
    res.render("addques.ejs",{errors:"", invItems:ress});
});

app.get("/addq",function(req,res){  
    
    if(adminTempEmail!=" "){
        setTimeout(function(){
        db.query("select * from questions_table where admin_email= ?",[adminTempEmail],(er,re)=>{
            if(er){
                console.log(er);
                return;
            }else{
                console.log("wating= "+adminTempEmail)
                ress=re
                //res.json(ress)
            }
            res.render("addques.ejs",{errors:"", invItems:ress});
        })},3000)
        
    }
    else{
        res.render("addques.ejs",{errors:"", invItems:ress});
    }
});

app.get("/test",(req,res)=>{
    db.query("select * from questions_table",(er,re)=>{
        if(er){
            console.log(er);
            return;
        }else{
            //console.log(re[0].question)
            ress={re}
            res.json(ress)
        }
    })
})
app.get("/tt",(req,res)=>{
    res.render("index.ejs")
})

app.get("/viewQues",(req,res)=>{
    
    db.query("select questions_table.question, questions_table.que_id , questions_table.a, questions_table.b, questions_table.c, questions_table.d, questions_table.answer, subject_table.subject_name from questions_table inner join subject_table on subject_table.que_id=questions_table.que_id",(er,re)=>{
        if(er){
            console.log(er);
            return;
        }
        else{
            //console.log(re)
            res.render("viewQues.ejs",{item:re})
        }
    })
})

app.get("/database",(req,res)=>{
    
    db.query("select questions_table.question, questions_table.que_id , questions_table.a, questions_table.b, questions_table.c, questions_table.d, questions_table.answer, subject_table.subject_name from questions_table inner join subject_table on subject_table.que_id=questions_table.que_id and subject_table.subject_name= ? ",
    ["Database"],(er,re)=>{
        if(er){
            console.log(er);
            return;
        }
        else{
            //console.log(re)
            res.render("viewQues.ejs",{item:re})
        }
    })
})



app.get("/CNSL",(req,res)=>{
    
    db.query("select questions_table.question, questions_table.que_id , questions_table.a, questions_table.b, questions_table.c, questions_table.d, questions_table.answer, subject_table.subject_name from questions_table inner join subject_table on subject_table.que_id=questions_table.que_id and subject_table.subject_name= ? ",
    ["CNSL"],(er,re)=>{
        if(er){
            console.log(er);
            return;
        }
        else{
            //console.log(re)
            res.render("viewQues.ejs",{item:re})
        }
    })
})

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
                    if(adminTempEmail!=" "){
                        
                        db.query("select * from questions_table where admin_email= ?",[adminTempEmail],(er,re)=>{
                            if(er){
                                console.log(er);
                                return;
                            }else{
                                console.log(re)
                                ress=re
                                //res.json(ress)
                            }
                        })
                    }
                    setTimeout(function(){
                    res.render("addques.ejs",{errors:"",invItems:ress})},2000);
                
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
                adminTempEmail=req.body.femail;
                res.render("addques.ejs",{errors:"User ragister successfull!",invItems:" "});
            }
        })
            
    });
   
});

var temperrors=""
app.post("/addques", (req,res)=>{
    console.log(req.body)
    if(adminTempEmail===" "){
        console.log("plese login to insert");
         temperrors="Plese login to insert!!"
         res.render("addques.ejs",{errors:temperrors, invItems:" "})
        
    }else{
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

    db.query("insert into subject_table set ? ",{
        subject_name:req.body.fcourse

    },(er,re)=>{
        if(er){
            console.log(er);
            return;
        }
        console.log("Inserted successfully 2;")
        temperrors="Inserted Successfully"

        if(adminTempEmail!=" "){
                        
            db.query("select * from questions_table where admin_email= ?",[adminTempEmail],(er,re)=>{
                if(er){
                    console.log(er);
                    return;
                }else{
                    console.log(re)
                    ress=re
                    //res.json(ress)
                }
            })
        }
        setTimeout(function(){
        res.render("addques.ejs",{errors:"Inserted Successfully", invItems:ress})},2000);
        
    })
    }
    
})






app.get("/deleteItem/:id",function(req,res){  
    
    db.query("delete from questions_table where que_id= ? ",
    [req.params.id],(er,re)=>{
        if(er){
            console.log(er);
            return;
        }
        else{
            //console.log(re)
            setTimeout(function(){ 
            res.redirect("/addq")},1000)
        }
    })
});




app.get("/logout",function(req,res){  
    
   adminTempEmail=" ";
   res.redirect("/")
    
});



app.listen(process.env.PORT || 3000, function(){
    console.log("server started on port 3000");
})