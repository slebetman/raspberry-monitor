const express = require('express');

/**
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @param {express.NextFunction} next 
 */
function loginMiddleware (req, res, next) {
	if (!req.session.user && req.path !== '/login') {
		res.set('HX-Refresh', 'true');
		res.redirect('/login');
		return;
	}
	next();
}

module.exports = loginMiddleware;