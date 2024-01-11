const OCRService = require('../services/ocrService');
const path = require('path');

class OCRController {
    async getData(req, res) {
        try {
            const result = await OCRService.recognizeImage(path.resolve(__dirname, '../uploads/testing/image1.jpg'));
            console.log(result);
            res.json({ success: true, data: result.data.text });
        } catch (error) {
            console.error(error);
            // res.json({ success: false, msg: error.message });
            res.status(404).json({ success: false, message: error.message });
        }
    }
}

module.exports = new OCRController();