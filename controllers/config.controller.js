const ConfigBiz = require("../biz/config.biz");
const MissingParamException = require("../exceptions/missing-param.exception");
const ConfigUserRequest = require("../models/config");
const ConfigUserPostRequest = require("../models/configUserPostRequest");

class ConfigController {
    register(app) {
        app.route('/users')
            .get(async (req, res) => {
                try {
                    const configBiz = new ConfigBiz();
                    const data = await configBiz.getUserList();
                    res.json({ message: 'User list!', total_user: data.length, data });
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
                    const token = await configBiz.jwtTokenEncoded(data);
                    res.json({ token, message: 'User registerd!' });
                } catch (error) {
                    res.json({ error });
                }
            })
        app.route('/login')
            .post(async (req, res) => {
                try {
                    const { username, password } = req.body;
                    if (!username || !password) {
                        throw MissingParamException('Username or password missing !!');
                    }
                    const configBiz = new ConfigBiz();
                    const user = await configBiz.loginUser(username, password);
                    const token = await configBiz.jwtTokenEncoded(user);
                    res.json({ token, message: 'Success!' });
                } catch (error) {
                    res.json({ error });
                }
            })

    }
}
module.exports = ConfigController;