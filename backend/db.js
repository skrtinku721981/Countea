const mongoose = require('mongoose');
const mongoURI = "mongodb+srv://users:test123@cluster0.mxkrmkm.mongodb.net/countea?retryWrites=true&w=majority&appName=Cluster0";

const connectToMongo = async () => {
    try {
        await mongoose.connect(mongoURI);
        console.log("connected to mongo");
    } catch (error) {
        console.error("MongoDB connection error:", error);
    }
}
module.exports = connectToMongo;