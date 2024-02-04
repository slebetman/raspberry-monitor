#! /usr/bin/env node

const path = require('path');
const express = require('express');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const compress = require('express-compress').compress;
const components = require('express-htmx-components');
const requestLogger = require('./lib/request-logger');
const conf = require('./lib/config');
const loginMiddleware = require('./lib/loginMiddleware');

const app = express();

const COMPONENTS_DIR = path.join(path.resolve(__dirname), 'components');

app.disable('x-powered-by');
app.enable('trust proxy');

app.use(
	session({
		secret: 'xxx',
		resave: true,
		saveUninitialized: true,
		store: new FileStore({
			path: './sessions',
		}),
		cookie: {
			secure: false,
			httpOnly: true,
		},
	})
);

app.use('/static', express.static('static'));
app.use(express.urlencoded({ extended: false }));
app.use(compress({ contentType: /html|js|css/ }));

if (process.env.DEV) {
	app.use(requestLogger);
}

app.use(loginMiddleware);

components.init(app, COMPONENTS_DIR, {
	css : [
		"https://fonts.googleapis.com/icon?family=Material+Icons+Outlined",
		"/static/monitor.css",
	],
	js : [
		"https://unpkg.com/htmx.org/dist/ext/remove-me.js",
	],
}).then(() => {
	app.use((req, res) => {
		console.log('404: Not Found');
		res.status(404);
		res.send('404: Not Found.');
	})

	app.listen(conf.port, () => console.log(`Server started, listening on ${conf.port} ..`));
});
