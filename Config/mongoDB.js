const mongoose = require("mongoose");

let connectDB = mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log("Success! Connected to Database 🔥");
}).catch((error) => {
    console.log("Error Connecting to Database ❌");
    console.error(error);
});

module.exports = connectDB;