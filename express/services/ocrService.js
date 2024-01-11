const Tesseract = require('tesseract.js');

class OCRService {
    recognizeImage(imagePath) {
        return Tesseract.recognize(imagePath);
    }
}
module.exports = new OCRService();  

