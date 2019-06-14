var express= require("express")
var app=express();
var port=process.env.PORT || 3000;
var bodyParser=require("body-parser")
var methodOverride=require("method-override");
var mongoose=require("mongoose")

app.set("view engine","ejs")
app.use(methodOverride("_method"));


mongoose.connect("mongodb://localhost/Node_assignment");

app.use(bodyParser.urlencoded({extend:true}));
app.use(express.static("public"))


const User=require("./models/user")
const Comment=require("./models/comments")

/*+++++++front page+++++++++*/ 
app.get("/",(req,res)=>{
 
    res.render("welcome")


})
/*+++++++List of all the users or content creators+++++++++*/ 
app.get("/page",(req,res)=>{
    
    User.find({},(err,data)=>{
        if(err)
        {
            console.log(err)

        }

        res.render("List",{ data:data})

    })
})

/*+++++++api for selecting the people who likes coding+++++++++*/ 
app.get("/coding",(req,res)=>{

User.find({},(err,foundData)=>{
    res.render("Coding",{foundData:foundData})
})    
    

})
/*+++++++for verify the edit user has to enter the secret key generated by him/her initially at welcome page+++++++++*/ 
app.get("/edit_verify/:id",(req,res)=>{
User.findById(req.params.id,(err,data)=>{
    if(err)
    {
   
        console.log(err)
        res.redirect("/")

    }


    res.render("edit_verify",{data:data})
})

})
/*+++++++checking for the secret key to enable editing+++++++++*/ 
app.post("/edit_verify/:id",(req,res)=>{
    User.findById(req.params.id,(err,data)=>{
        console.log("**-****",data.secretKey)
console.log("++++",req.body.secretKey)
     if(data.secretKey==req.body.secretKey)
     {
         res.render("Edit",{data:data})
    return;
        }
        res.redirect("/")

    })
})

/*+++++++api for saving the data created by user+++++++++*/ 
app.post("/data_save",(req,res)=>{
    var name=req.body.name;
    var email=req.body.email;
    var address=req.body.address;
    var phone=req.body.phone;
    var designation=req.body.designation;
    var interests=req.body.interests;
    var secretKey=req.body.secretKey;
    const obj={name:name,email:email,address:address,phone:phone,interests:interests,secretKey:secretKey,designation:designation}
    console.log(req.body)
    console.log(obj)
    console.log(req.body==obj)

    User.create(obj,function(err,data){
        if(err)
        {
            console.log(err)
          
            return;
        }
        console.log(data)
        console.log("data saved");
        res.redirect("/page")
    })

})
/*+++++++api for EDITING THE DATA+++++++++*/ 
app.put("/edit/:id",(req,res)=>{
    console.log(req.body)
  
    var name=req.body.name;
    var email=req.body.email;
    var address=req.body.address;
    var phone=req.body.phone;
    var designation=req.body.designation;
    var interests=req.body.interests;
    var secretKey=req.body.secretKey;
    const obj={name:name,email:email,address:address,phone:phone,interests:interests,secretKey:secretKey,designation:designation}
User.findByIdAndUpdate(req.params.id,obj,(err,data)=>{
    if(err)
    {
        console.log(err)
        res.redirect("/")
return;
    }

    console.log("data is edited")
    res.redirect("/page");


})
  
    
})


/*+++++++api for DELETING VERIFICATION +++++++++*/ 
app.get("/delete_verify/:id",(req,res)=>{
    
    User.findById(req.params.id,(err,data)=>{
        if(err)
        {
       
            console.log(err)
            res.redirect("/")
    
        }
    
    
        res.render("delete_verify",{data:data})
    })
})
/*+++++++api for DELETING THE DATA+++++++++*/ 
app.delete("/delete/:id",(req,res)=>{
    User.findById(req.params.id,(err,foundData)=>{
        if(foundData.secretKey===req.body.secretKey)
        {
            User.findByIdAndRemove(req.params.id,function(err){
                if(err)
                {
                    console.log(err)
                }
                else{
                    res.redirect("/page")
                    return;
                }
            })

        }
        else{
            res.redirect("/")
            return;
        }
    })
})


/*+++++++API FOR ALL THE COMMENT BY A  USER+++++++++*/ 
app.get("/comment/:id",(req,res)=>{

    User.findById(req.params.id,(err,data)=>{
        if(err)
        {
       
            console.log(err)
            res.redirect("/")
    
        }
    
    
        res.render("comment",{data:data})
    })
})


/*+++++++API FOR GETTING ALL THE COMMENTS FROM THE USER++++++++*/ 
app.get("/comment_each_user/:id",(req,res)=>{

User.findById(req.params.id).populate("comments").exec(function(err,userData){
    console.log("USERRRR",userData)


    res.render("all_comment",{userData:userData})

})


})

/*++++++API FOR CREATING THE COMMENT BY A USER+++++++++*/ 
app.post("/comment/:id",(req,res)=>{
//     var comment=req.body.comment;
   



// var obj={email:email,comment:comment};

// console.log("OBJECT",obj)


// Comment.create(obj,(err,data)=>{
//     if(err)
//     {
//         console.log(err)
//         res.redirect("/")
// return;
//     }
// console.log("saved comment",data)
//     res.redirect("/")

// })
console.log("reached jere")
var comment=req.body.comment;
var obj={comment:comment};
console.log("OBJECT",obj)

Comment.create(obj,function(err,commentData){

    User.findById(req.params.id,(err,UserData)=>{
        if(err)
        {
            console.log(err)
            res.redirect("/")
            return;
        }
        else{
            UserData.comments.push(commentData)
            UserData.save();
            console.log("Userdata",UserData)
res.redirect("/page")

            }
        })
    })

})


app.listen(port,function(){
    console.log("started...")
})