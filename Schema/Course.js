const mongoose = require("mongoose")
const { Schema } = mongoose

const courseSchema = new Schema({
    title: {
        type: String,
        require: true
    },
    duration: {
        type: String,
        require: true,
    },
    level: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    image:{
        type: String
    }
})

module.exports = mongoose.model("Course", courseSchema)