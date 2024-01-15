const mongoose = require("mongoose")
const { Schema } = mongoose

const signUpSchema = new Schema({
    name:{
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require : true
    },
    confirmPassword: {
        type: String,
        require : true
    },
    role: {
        type: String,
        require : true
    }
})

module.exports = mongoose.model("SignUp", signUpSchema)