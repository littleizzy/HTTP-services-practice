//Importing Modules
const express = require('express');
const Joi = require('joi');
const helmet = require('helmet');
const morgan = require('morgan');
const config = require('config');
const routeDebugger = require('debug')('app:route'); //export DEBUG=app:route
const dbDebugger = require('debug')('app:db');


const logger = require('./logger.js');
const autenticator = require('./authenticator.js');


//Creating Server
const app = express();
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port} ...`));


//Loading Middleware
app.use(express.json());
app.use(express.urlencoded({ extended : true}));
app.use(express.static('public'));

app.use(logger);
app.use(autenticator);

//Development mode specific actions
if (app.get('env') === 'development') { //process.env.NODE_ENV is another way to get the enviroment mode. Default is undefined. For app.get('env'), development is default.
	app.use(helmet());
	app.use(morgan('tiny'));
	routeDebugger('[Helmet] Enabled');
	routeDebugger('[Morgan] Enabled');
}

//Some db work
dbDebugger('Debugging app:db...')

//Configuration using config
console.log(`Application name: ${config.get('name')}`);
console.log(`Application server: ${config.get('mail.host')}`);

//Templating engine
app.set('view engine', 'pug');
app.set('views', './views'); //This is set by default, here just to show


var courses = [
	{ id : 1, name : 'Course 1'},
	{ id : 2, name : 'Course 2'},
	{ id : 3, name : 'Course 3'},
]

app.get('/', (req, res) => {
	res.render('index', { title: 'My Express App', message: 'Fuck off'});
})

app.get('/api/courses', (req, res) => {
	res.send(courses);
})


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