const ErrorHandlingMiddleware = async (req, res, next) => {
    try {
        // res.send('Hello');
    } catch (error) {
        res.status(405).json({ error: 'Middleware error' });
    }
}
module.exports = ErrorHandlingMiddleware;