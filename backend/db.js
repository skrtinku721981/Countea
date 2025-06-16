const mongoose=require('mongoose');
const mongoURI="mongodb://localhost:27017"    //to create a new file in the database 
const connectToMongo=()=>{
    mongoose.connect(mongoURI,()=>{
        console.log("connected to mongo");
    })
}
module.exports=connectToMongo; 