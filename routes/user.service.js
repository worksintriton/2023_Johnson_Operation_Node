﻿const config = require('config.json');
const jwt = require('jsonwebtoken');
const userSchema = require('./user.model');
const loginHistorySchema = require('./login-history');

module.exports = {
    authenticate,
    createUserDetails,
    findUserDetails,
    getUserList,
    updateUserDetails,
    deleteUser,
    deleteUserDetails    
};

async function careateLoginHistory(personData,ipAddress) {
    console.log("ipAddress ",ipAddress);
    let response = {};
    const finduser =  await loginHistorySchema.find({ email: personData.email });
    // console.log("personData ",personData);
 
    var tempflag = false;
    finduser && finduser.forEach(element => {
        if(element.ipAddress == ipAddress){
            tempflag =  true;   
        }
        
    });

    if(tempflag){
        return true;  
    }else if(finduser.length > personData.number_of_lifts_perdisplay){
        throw "More User logged in!!!";
      }else{
                       var Details = new loginHistorySchema();
                       Details.customername = personData.customername,
                       Details.ipAddress = ipAddress,
                       Details.email = personData.email,
                       Details.userid = personData._id,
                    
                       await Details.save();
                       response = {"message":"Saved successfully"};
                   }
                   return response;   
}

async function authenticate(body) {
    console.log("userFindData ",body);
    var email =body.email;
    var password =body.password;
    const userFindData = await userSchema.findOne({email : email});
    const userData = await userSchema.findOne({email : email, password: password});
   
   
    if(userFindData){
        if(userData){
            console.log("ipAddress ",body);
            await careateLoginHistory(userData,body.ipAddress).then(ee=>{
                console.log("ee ",ee);
                if(ee =="More User logged in!!!"){
                    throw 'Invalid user';
                    
                }
                  
                    return userData;
                
               
            })
           
        }else{
            throw 'Username or password incorrect';
        }
      //  console.log("userData ",userData);
       
    }else{
        throw 'Invalid user';
    }

    return userData;
   
}



async function createUserDetails(personData) {
    let response = {};
    const finduser =  await userSchema.findOne({ customername: personData.customername });
                   if(!finduser){
                       let COUNT = await userSchema.countDocuments();
                       var Details = new userSchema();
                       Details.customername = personData.customername,
                       Details.location = personData.location,
                       Details.building_block_name = personData.building_block_name,
                       Details.lift_num_sec = personData.lift_num_sec,
                       Details.userId = COUNT,
                       
                       Details.email = personData.email,
                       Details.password = personData.password,

                       Details.total_num_of_lifts = personData.total_num_of_lifts,
                       Details.number_of_lifts_perdisplay = personData.number_of_lifts_perdisplay,
                       Details.liftArray = personData.marks,
                       Details.createdDate = new Date(),
                       
                       Details.remark = personData.remark,
                       Details.isActive = personData.isActive,
                       await Details.save();
                       response = {"message":"Saved successfully"};
                   }else{
                       throw "Create User details give error"
                   }
                   return response;   
}


async function updateUserDetails(personData) {
    console.log("personData",personData)
   
                let updateResult =  await userSchema.findOneAndUpdate( { _id: personData.id },
                       {
                           $set: {
                              
                               email : personData.email,
                               password : personData.password,
                               customername : personData.customername,
                               location : personData.location,
                               building_block_name : personData.building_block_name,
                               lift_num_sec : personData.lift_num_sec,
                               total_num_of_lifts : personData.total_num_of_lifts,
                               number_of_lifts_perdisplay : personData.number_of_lifts_perdisplay,
                               liftArray : personData.marks,
                               isActive : personData.isActive,
                               updatedDate: new Date(),
                           },
                       });
                       if(updateResult){
                        return {message: "Update successfully"};
                    }else{
                        throw "Update failure";
                    }     
              
}

async function getUserList() {
    const finduser =  await userSchema.find();
 
       if(finduser){
           return finduser;
       }else{
           throw "Get user list give error"
       }
}


async function findUserDetails(body) {
    const finduser =  await userSchema.findOne({"_id":body.id});
    console.log("finduser",finduser)
       if(finduser){
           return finduser;
       }else{
           throw "Get user list give error"
       }
}



async function deleteUser(body) {
    console.log("personData",body)
    const deleteRocord = await loginHistorySchema.deleteMany({"userid":body.id});
       if(deleteRocord){
           return  "File removed successfully"
       }else{
           throw "delete customer give error"
       }
}


async function deleteUserDetails(body) {
    console.log("personData",body)
    const deleteRocord = await userSchema.deleteMany({"_id":body.id});
       if(deleteRocord){
           return  "File removed successfully"
       }else{
           throw "delete customer give error"
       }
}


