const InternModel= require("../models/intern")
const CollegeModel= require("../models/college")
const emailValidation=require("email-validator")

let nameRegex=/^[a-z A-Z]{3,}$/
let mobileRegex=/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/
//=================================CREATE INTERNS================================
const createIntern= async function(req,res){
  try{  
    let data= req.body
const {name,email,mobile,collegeName}=data

if(Object.keys(data).length==0) return res.status(404).send({status:false, ERROR: "Data required"})


//name validation----------------------------------------
if(!name) return res.status(400).send({status:false,message:"Name is Required"})
if(!name.match(nameRegex)) return res.status(400).send({status:false,message:"Name is not valid"})


//email validation---------------------------------------
if(!email)  return res.status(400).send({status:false,message:"email is Required"})
if(!emailValidation.validate(email)) return res.status(400).send({status:false,message:"email is invalid"})
let emailAlreadyPresent=await InternModel.findOne({email:email})
if(emailAlreadyPresent) return res.status(400).send({status:false,message:"email already present"})


//mobile number validation-------------------------------
if(!mobile) return res.status(400).send({status:false,message:"mobile is Required"})
if(!mobile.match(mobileRegex)) return res.status(400).send({status:false,message:"mobile number is invalid"})
let mobileAlreadyPresent=await InternModel.findOne({mobile:mobile})
if(mobileAlreadyPresent) return res.status(400).send({status:false,message:"mobile number already present"}) 


//Finding College data with college name
    let collegeId= await CollegeModel.findOne({name:collegeName,isDeleted:false})
      if(!collegeId){
       return res.status(400).send({status: false, ERROR: "College not Found"})
     }
        data.collegeId=collegeId._id
        let created= await InternModel.create(data)
      //,,,,,ask line 42,,,,,
        if(!created) {
         return res.send(400).send({status: false, ERROR: "Enter valid details"})
        }else{
    
        res.status(201).send({ status: true, data:{isDeleted:created.isDeleted,
       name:created.name,
       email:created.email,
       mobile:created.mobile,
       collegeId:created.collegeId}})
    }
  }catch(error){
    res.status(500).send({ status: false, ERROR: error.message })
  }
}




module.exports.createIntern=createIntern