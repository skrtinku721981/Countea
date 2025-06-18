const mongoose = require('mongoose');
const mongoURI = "mongodb+srv://gaurav:<kzU6RK1Q19IT8dGA>@cluster0.mxkrmkm.mongodb.net/";

const connectToMongo = async () => {
    try {
        await mongoose.connect(mongoURI);
        console.log("connected to mongo");
    } catch (error) {
        console.error("MongoDB connection error:", error);
    }
}
module.exports = connectToMongo;