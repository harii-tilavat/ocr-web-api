const ConfigBiz = require("./../biz/config.biz");
const MissingParamException = require("./../exceptions/missing-param.exception");
const ConfigUserPostRequest = require("./../models/ConfigUserPostRequest")
const { OCRService } = require("./../services/ocr.service");
const { SchemaJsonValidator } = require("./../validators");
const nodemailer = require('nodemailer');
const { otp_email } = require("../middleware/otp");
const OCRBiz = require("../biz/ocr.biz");

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
                    // OTP
                    // console.log("🚀 ~ ConfigController ~ .post ~ req.body:", req.body)
                    // const otp = `${Math.floor(Math.random() * (9999 - 9000 + 1) + 1000)}`
                    // console.log(otp);
                    // const users = {
                    //     otp: otp,
                    //     email : req.body.email
                    // }
                    // otp_email(users);
                    // OTP
                    const schema = new SchemaJsonValidator();
                    await schema.createUser(req.body);
                    const configBiz = new ConfigBiz();
                    const data = await configBiz.registerUser(body);
                    res.json({ data, message: `We have send you OTP at ${req.body.email}` });
                } catch (error) {
                    next(error);
                }
            })
        app.route('/update-user/:id')
            .put(async (req, res, next) => {
                try {
                    const userdata = req.body;
                    const { id } = req.params;
                    const configBiz = new ConfigBiz();
                    const data = await configBiz.updateUser(id, userdata);
                    res.json({ data, message: 'Your detail has been updated successfully!' });
                } catch (error) {
                    next(error);
                }
            })

        app.route('/update-type')
            .put(async (req, res, next) => {
                try {
                    const configBiz = new ConfigBiz();
                    const data = await configBiz.updateType(req.body);
                    res.json({ data, message: 'Data has been updated successfully!' });
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
            .post(async (req, res, next) => {
                try {
                    const body = new ConfigUserPostRequest(req.body);
                    const configBiz = new ConfigBiz();
                    const { email, user_id } = req.body;
                    const data = await configBiz.addOtp(email, user_id);

                    res.json({ msg: 'Email sent' });
                } catch (error) {
                    next(error);
                }
            })
        app.route('/verify-otp')
            .post(async (req, res, next) => {
                try {

                    const configBiz = new ConfigBiz();
                    const { otp } = req.body;
                    const data = await configBiz.verifyOTPRepo(otp);

                    res.json({ data, message: 'You are verified. You can login' });
                } catch (error) {
                    next(error);
                }
            })

        app.route('/change-password')
            .post(async (req, res, next) => {
                try {
                    const configBiz = new ConfigBiz();
                    const data = await configBiz.changePassword(req.body);
                    
                    res.json({ data, message: 'Your password has been changed!' });
                } catch (error) {
                    next(error);
                }
            })

        app.route('/forgot-password')
            .post(async (req, res, next) => {
                try {
                    const { email } = req.body;
                    const configBiz = new ConfigBiz();
                    const data = await configBiz.getUserByEmail(email);
                    res.json({ message: `We have sent you reset password email at the ${email}`, data });
                } catch (error) {
                    next(error);
                }
            })
        // app.post('/reset-password', (req, res) => {
        //     const { token, newPassword } = req.body;

        //     // Verify token
        //     jwt.verify(token, jwtSecret, (err, decoded) => {
        //         if (err) {
        //             return res.status(401).send('Invalid or expired token');
        //         }

        //         const { email } = decoded;

        //         // Update password in database (replace with your database logic)
        //         users[email].password = bcrypt.hashSync(newPassword, 10);

        //         res.status(200).send('Password reset successfully');
        //     });
        // });

    }
}
module.exports = ConfigController;

