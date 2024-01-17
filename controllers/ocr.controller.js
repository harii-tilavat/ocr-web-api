const OCRBiz = require("../biz/ocr.biz");
const upload = require("../services/multerService");

class OCRController {
    register(app) {
        app.route('/docs')
            .get(async (req, res) => {
                try {
                    const ocrBiz = new OCRBiz();
                    const data = await ocrBiz.getDocumentList();
                    res.json({ data, message: 'Document list' });
                } catch (error) {
                    res.json({ error, message: 'something went wrong' });
                }
            })
            .post(upload.single('file'), async (req, res) => {
                try {
                    const ocrBiz = new OCRBiz();
                    const data = await ocrBiz.uploadDocument(req.file);
                    res.json({ data, message: 'Document inserted!' });
                } catch (error) {
                    res.status(400).json({ error: error });
                }
            })
        app.route('/docs/:id')
            .get(async (req, res) => {
                try {
                    const { id } = req.params;
                    const ocrBiz = new OCRBiz();
                    const data = await ocrBiz.getDocument(id);
                    res.json({ data, message: 'Document detail!' });
                } catch (error) {
                    res.json({ error, message: 'something went wrong' });
                }
            })
    }
}
module.exports = OCRController