const mongoose = require('mongoose');

const connectDB = async() => {
    try{
        const conn = await mongoose.connect(process.env.mongodb_url, {
            useNewUrlParser:true,
            useUnifiedTopology: true
        })
        const db = mongoose.connection;
        console.log(`MongoDB Connected: ${conn.connection.host}`)
    }
    catch(err) {
        console.log(err)
        process.exit(1)
    }
}

module.exports = connectDB;