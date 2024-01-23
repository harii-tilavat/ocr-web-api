const ConfigBiz = require("../biz/config.biz");
const ConfigUserPostRequest = require("../models/configUserPostRequest");
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
        app.route('/register')
            .post(async (req, res) => {
                try {
                    const body = new ConfigUserPostRequest(req.body);
                    const configBiz = new ConfigBiz();
                    const data = await configBiz.registerUser(body);
                    res.json({ data,message:'User detail' });
                } catch (error) {
                    res.json({ error });
                }
            })

    }
}
module.exports = ConfigController;