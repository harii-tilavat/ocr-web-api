const ConfigBiz = require("../biz/config.biz");
const ConfigRepo = require("../repositories/config.repo");

class ConfigController {
    register(app) {
        app.route('/users')
            .get(async (req, res) => {
                try {
                    const configBiz = new ConfigBiz();
                    const data = await configBiz.getUserList();
                    res.json({ message: 'User list!', data });
                } catch (error) {
                    res.json({ error, message: 'Users not found!' });
                }
            })
    }
}
module.exports = ConfigController;