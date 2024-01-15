const connectToMongo = require("./db")

connectToMongo()

const express = require("express")

const cors = require("cors")

const app = express()

const path = require("path")

app.use(express.json())

app.use(cors())

app.use('/uploads', express.static(path.join(__dirname, 'routes', 'uploads')));

app.use("/api/auth", require("./routes/auth"))

app.listen(8000, ()=>{
    console.log("app listing at http://localhost:8000")
})