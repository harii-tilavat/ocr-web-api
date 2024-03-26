const ConfigBiz = require("./../biz/config.biz");
const MissingParamException = require("./../exceptions/missing-param.exception");
const ConfigUserPostRequest = require("./../models/ConfigUserPostRequest")
const { OCRService } = require("./../services/ocr.service");
const { SchemaJsonValidator } = require("./../validators");
const nodemailer = require('nodemailer');

class ConfigController {
    register(app) {
        app.route('/api/users')
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
        app.route('/update-user/:id')
            .put(async (req, res, next) => {
                try {
                    const userdata = req.body;
                    const {id} = req.params;
                    const configBiz = new ConfigBiz();
                    const data = await configBiz.updateUser(id, userdata);
                    res.json({ data, message: 'Your detail has been updated successfully!' });
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
        app.route('/otp')
            .get(async (req, res, next) => {
                try {
                    const ocrService = new OCRService();
                    const otp = ocrService.generateOtp();
                    const transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: 'ocrweb441@gmail.com',
                            pass: 'ocrweb@123'
                        }
                    })
                    var mailOptions = {
                        from: 'ocrweb441@gmail.com',
                        to: 'jerryff81@gmail.com',
                        subject: 'OTP Verification',
                        text: `Your OTP for verification is: ${otp}`
                    };
                    transporter.sendMail(mailOptions, function (error, info) {
                        if (error) {
                            console.log("ERRORRRRRR ==>>", error);
                        } else {
                            console.log('Email sent: ' + info.response);
                        }
                    });
                    // console.log("Trasport ==>> ", transporter);
                    res.json({ otp, transporter });
                } catch (error) {
                    next(error);
                }
            })
        

    }
}
module.exports = ConfigController;

