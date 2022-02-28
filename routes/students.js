const studentsRouter = require('express').Router()
const Joi = require('joi')
const pool = require('../db')

studentsRouter.post('/add', async (req, res, next)=>{
	try{
		// validating the input using Joi
		const schema = Joi.object({
			firstname: Joi.string().required(),
			lastname: Joi.string(),
			gender: Joi.string().required(),
			dob: Joi.date().required(),
			address: Joi.string().required(),
			phonenumber: Joi.number().required(),
		})
		const result = schema.validate(req.body)
		// send error message if input not in required format
		if (result.error) {
			res.status(400).send({message: "Error: "+ result.error.details[0].message})
			return
		}

		var { firstname, lastname, gender, dob, address, phonenumber } = req.body
		
		if (isNaN(phonenumber) || (!isNaN(phonenumber) && !Number.isInteger(parseFloat(phonenumber))) || phonenumber < 1000000000 || phonenumber > 9999999999) {
			res.status(400).send({message: "Error: Phone number must be a 10-digit number"})
			return
		}

		if (typeof lastname === "undefined") {
			lastname = null
		}
		var q = `INSERT INTO students(firstname, lastname, gender, dob, address, phonenumber)
					VALUES($1, $2, $3, $4, $5, $6) returning *`
		const student = await pool.query(q, [firstname, lastname, gender, dob, address, phonenumber])
		// check if data was successfully inserted
		if (typeof student.rows === "undefined") {
			console.log("Data not inserted.")
			res.status(500).send({message: "Server Error: Data not inserted. Try again later!"})
			return
		}
		res.status(200).json({ message: "Student data added successfully", studentDetails: student.rows[0] });
	} catch(e) {
		console.log(e.message)
		res.status(500).send({message: "Server Error: " + e.message})
		next(e)
	}
})

studentsRouter.get('/getAll', async (req, res, next)=>{
	try{
		var q = `SELECT * FROM students`
		const students = await pool.query(q)
		if (typeof students.rows === "undefined") {
			res.status(500).send({message: "Server Error!"})
			return
		}
		res.status(200).json({ studentDetails: students.rows });
	} catch(e) {
		console.log(e.message)
		res.status(500).send({message: "Server Error: " + e.message})
		next(e)
	}
})

studentsRouter.get('/get/:id', async (req, res, next)=>{
	try{
		var id = req.params.id
		var q = `SELECT * FROM students WHERE studentid=$1`
		const students = await pool.query(q, [id])
		if (typeof students.rows === "undefined") {
			res.status(500).send({message: "Server Error!"})
			return
		}
		if (students.rows.length === 0) {
			res.status(404).send({message: "Student details not found"})
			return
		}
		res.status(200).json({ studentDetails: students.rows[0] });
	} catch(e) {
		console.log(e.message)
		res.status(500).send({message: "Server Error: " + e.message})
		next(e)
	}
})

module.exports = {
    studentsRouter
}