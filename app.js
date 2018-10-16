const express = require('express');
const Joi = require('joi');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.listen(port, () => console.log(`Listening on port ${port} ...`));


var courses = [
	{ id : 1, name : 'Course 1'},
	{ id : 2, name : 'Course 2'},
	{ id : 3, name : 'Course 3'},
]




app.get('/api/courses/:id', (req, res) => {
	const course = courses.find(c => c.id === parseInt(req.params.id));
	if (!course) return res.status(404).send("Given course id not found, fuck off please.");
	res.send(course);
});



app.post('/api/courses', (req, res) => {
	var { error } = validateCourse(req.body); //object destructure
	if (error) return res.status(400).send(error.details[0].message);

	const course = {
		id : courses.length + 1,
		name : req.body.name
	};
	courses.push(course);
	res.send(course);
});


app.put('/api/courses/:id', (req, res) => {
	const course = courses.find(c => c.id === parseInt(req.params.id));
	if (!course) return res.status(404).send("Given course id not found, fuck off please.");

	var { error } = validateCourse(req.body); //object destructure
	if (error) return res.status(400).send(error.details[0].message);

	course.name = req.body.name;
	res.send(course);
});

app.delete('/api/courses/:id', (req, res) => {
	const course = courses.find(c => c.id === parseInt(req.params.id));
	if (!course) return res.status(404).send("Given course id not found, fuck off please.");

	var index = courses.indexOf(course);
	courses.splice(index, 1);	
});


function validateCourse(course) {
	const schema = {
		name: Joi.string().min(3).required()
	};
	return Joi.validate(course, schema);
}