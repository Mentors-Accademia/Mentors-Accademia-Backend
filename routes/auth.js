const express = require("express")
const router = express.Router()
const Role = require("../Schema/Role")
const signUp = require("../Schema/Signup")
const Course = require("../Schema/Course")
const Teacher = require("../Schema/Teacher")
const School = require("../Schema/School")
const bcrypt = require("bcrypt")

router.get("/get", async(req,res)=>{
    res.send("working perfectly")
})
module.exports = router;