const express = require('express');
const router = express.Router();


var courses = [
	{ id : 1, name : 'Course 1'},
	{ id : 2, name : 'Course 2'},
	{ id : 3, name : 'Course 3'},
]

router.get('/', (req, res) => {
	res.send(courses);
})


router.get('/:id', (req, res) => {
	const course = courses.find(c => c.id === parseInt(req.params.id));
	if (!course) return res.status(404).send("Given course id not found, fuck off please.");
	res.send(course);
});


router.post('/', (req, res) => {
	var { error } = validateCourse(req.body); //object destructure
	if (error) return res.status(400).send(error.details[0].message);

	const course = {
		id : courses.length + 1,
		name : req.body.name
	};
	courses.push(course);
	res.send(course);
});


router.put('/:id', (req, res) => {
	const course = courses.find(c => c.id === parseInt(req.params.id));
	if (!course) return res.status(404).send("Given course id not found, fuck off please.");

	var { error } = validateCourse(req.body); //object destructure
	if (error) return res.status(400).send(error.details[0].message);

	course.name = req.body.name;
	res.send(course);
});

router.delete('/:id', (req, res) => {
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

module.exports = router;