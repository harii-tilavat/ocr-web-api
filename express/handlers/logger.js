const logger = (req, res, next) => {
	console.log(req.url);
	console.log(req.method);
	console.log(new Date().getFullYear());
	next();
	// debugger
}

module.exports = logger;