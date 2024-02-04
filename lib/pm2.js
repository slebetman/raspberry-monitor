const pm2 = require('pm2');

function connect () {
	return new Promise((ok,fail) => {
		pm2.connect((err) => {
			if (err) return fail(err);
			ok();
		})
	})
}

function list () {
	return new Promise((ok,fail) => {
		pm2.list((err, list) => {
			if (err) return fail(err);
			ok(list);
		})
	})
}

function start (proc) {
	return new Promise((ok,fail) => {
		pm2.restart(proc,(err) => {
			if (err) return fail(err);
			ok();
		})
	})
}

function stop (proc) {
	return new Promise((ok,fail) => {
		pm2.stop(proc,(err) => {
			if (err) return fail(err);
			ok();
		})
	})
}

module.exports = {
	connect,
	list,
	start,
	stop,
}