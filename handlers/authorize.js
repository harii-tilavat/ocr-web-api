const authorized = (req, res, next) => {
    const { user } = req.query;
    if (user === 'harit') {
        req.user = { name: 'harit', id: 3 };
        next();
    } else {
        res.status(400).send('Unauthorized!');
    }
}
module.exports = authorized;