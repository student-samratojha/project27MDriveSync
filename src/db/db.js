const mongoose = require("mongoose");
const mongoUrl = process.env.MONGO_URI;
async function connect() {
    try {
        await mongoose.connect(mongoUrl);
        console.log("Connected to MongoDB");
    }
    catch(err) {
        console.log(err);
    }
}
module.exports = connect;