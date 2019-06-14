var mongoose =require("mongoose")

const uniqueValidator=require("mongoose-unique-validator")


var userSchema=new mongoose.Schema({
    comments:[
        {    type:mongoose.Schema.Types.ObjectId,
              ref:"Comment"     
         }],

    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    phone:{type:String,required:true,unique:true},
    designation:{type:String,required:true},
    address:{type:String,required:true},
    secretKey:{type:String,required:true,unique:true},
    interests:{ type : Array , "default" : []},
})


userSchema.plugin(uniqueValidator);

module.exports=mongoose.model("User",userSchema)