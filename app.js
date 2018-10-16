const express = require('express');
const app = express();

app.use(express.json());
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port} ...`));

var courses = [
	{ id : 1, name : 'Course 1'},
	{ id : 2, name : 'Course 2'},
	{ id : 3, name : 'Course 3'},
]

app.get('/api/courses/:id', (req, res) => {
	const course = courses.find(c => c.id === parseInt(req.params.id));
	if (!course) res.status(404).send("Given course id not found, fuck off please.");
	res.send(course);
});

app.post('/api/courses', (req, res) => {
	const course = {
		id : courses.length + 1,
		name : req.body.name
	};
	courses.push(course);
	res.send(course);
});