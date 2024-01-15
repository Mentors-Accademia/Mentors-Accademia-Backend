const mongoose = require("mongoose")
require("dotenv").config()

const mongoURI = process.env.MONGODB_URI
const connectToMongo = async ()=>{
    try {
        mongoose.connect(mongoURI)
        console.log('connect with mongodb successfully')
    } catch (error) {
        console.log(error)
        process.exit()
    }
}

module.exports = connectToMongo