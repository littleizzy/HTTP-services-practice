//Importing Modules
const express = require('express');
const Joi = require('joi');
const helmet = require('helmet');
const morgan = require('morgan');
const config = require('config');
const routeDebugger = require('debug')('app:route'); //export DEBUG=app:route
const dbDebugger = require('debug')('app:db');
const courses = require('./routes/courses.js');
const home = require('./routes/homepage.js');


const logger = require('./middleware/logger.js');
const autenticator = require('./middleware/authenticator.js');


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

app.use('/api/courses', courses);
app.use('/', home);

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



