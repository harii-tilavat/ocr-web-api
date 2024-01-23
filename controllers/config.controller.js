class ConfigController {
    register(app) {
        app.route('/users')
            .get(async (req, res) => {
                try {
                    res.json({ message: 'Found!',data });
                } catch (error) {
                    res.json({ error, message: 'Users not found!' });
                }
            })
    }
}
module.exports = ConfigController;