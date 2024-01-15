const mongoose = require("mongoose")
const { Schema } = mongoose

const roleSchema = new Schema({
    role: {
        type: String,
        require: true
    },
    status: {
        type: String,
        default: "Y"
    }
})

module.exports = mongoose.model("Role", roleSchema)