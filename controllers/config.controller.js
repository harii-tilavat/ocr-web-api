const ConfigBiz = require("../biz/config.biz");
const MissingParamException = require("../exceptions/missing-param.exception");
const ConfigUserPostRequest = require("../models/configUserPostRequest");
const { SchemaJsonValidator } = require("../validators");

class ConfigController {
    register(app) {
        app.route('/users')
            .get(async (req, res, next) => {
                try {
                    const configBiz = new ConfigBiz();
                    const data = await configBiz.getUserList();
                    res.json({ message: 'User list!', total_user: data.length, data });
                } catch (error) {
                    next(error);
                }
            })
        app.route('/register')
            .post(async (req, res, next) => {
                try {
                    const body = new ConfigUserPostRequest(req.body);
                    const schema = new SchemaJsonValidator();
                    await schema.createUser(req.body);
                    const configBiz = new ConfigBiz();
                    const data = await configBiz.registerUser(body);
                    const token = await configBiz.jwtTokenEncoded(data);
                    res.json({ token, message: 'User registerd!' });
                } catch (error) {
                    next(error);
                }
            })
        app.route('/login')
            .post(async (req, res, next) => {
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
                    next(error);
                }
            })

    }
}
module.exports = ConfigController;