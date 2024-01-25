const OCRBiz = require("../biz/ocr.biz");
const BaseException = require("../exceptions/base.exception");
const upload = require("../services/multerService");

class OCRController {
    register(app) {
        app.route('/api/docs')
            .get(async (req, res, next) => {
                try {
                    const ocrBiz = new OCRBiz();
                    const data = await ocrBiz.getDocumentList();
                    res.json({ data, message: 'Document list' });
                } catch (error) {
                    next(error);
                }
            })
            .post(upload.single('file'), async (req, res,next) => {
                try {
                    const ocrBiz = new OCRBiz();
                    const data = await ocrBiz.uploadDocument(req.file);
                    res.json({ data, message: 'Document inserted!' });
                } catch (error) {
                    next(error);
                }
            })
        app.route('/api/docs/:id')
            .get(async (req, res, next) => {
                try {
                    const { id } = req.params;
                    const ocrBiz = new OCRBiz();
                    const data = await ocrBiz.getDocument(id);
                    res.json({ data, message: 'Document detail!' });
                } catch (error) {
                    next(error);
                }
            })
            .delete(async (req, res, next) => {
                try {
                    const { id } = req.params;
                    const ocrBiz = new OCRBiz();
                    const data = await ocrBiz.deleteDocument(id);
                    res.json({ data, message: 'Deleted successfully!' });
                } catch (error) {
                    next(error);
                }

            })
    }
}
module.exports = OCRController