// This application starts a local server and listens on port 8080 for connections.

// Importing express module and calling the imported function.
const express = require('express')
const app = express()
const cors = require('cors')
// database connection
const pool = require('./db')

// read the request as json data
app.use(express.json())
// cors not needed if server and client runs on same domain in production
app.use(cors())


// handling routes
const { studentsRouter } = require("./routes/students");

app.get("/", (req, res) => {
    res.send({message: "Welcome!"})
})

app.use("/api/students", studentsRouter);


// Defining port.
const port = process.env.PORT || 8080
// Starting local server at defined port.
app.listen(port, () => {console.log(`Listening on port ${port}...`)})