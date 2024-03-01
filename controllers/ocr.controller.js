const OCRBiz = require("../biz/ocr.biz");
const { MissingParamException, SchemaException } = require("../exceptions");
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
            .post(upload.single('file'), async (req, res, next) => {
                try {
                    const ocrBiz = new OCRBiz();
                    if (req && req.file) {
                        const data = await ocrBiz.uploadDocument(req.file);
                        res.json({ data, message: 'Document inserted!' });
                    } else {
                        throw new BaseException('File not found!', 404);
                    }
                } catch (error) {
                    next(error);
                }
            })
        app.route('/api/docs/:id')
            .get(async (req, res, next) => {
                try {
                    const { id } = req.params;
                    if (!id) {
                        throw new MissingParamException('id');
                    }
                    const ocrBiz = new OCRBiz();
                    const data = await ocrBiz.getDocument(id);
                    res.json({ data, message: 'Document detail!', request: req.headers });
                } catch (error) {
                    next(error);
                }
            })
            .delete(async (req, res, next) => {
                try {
                    const { id } = req.params;
                    if (!id) {
                        throw new MissingParamException('id');
                    }
                    const ocrBiz = new OCRBiz();
                    const data = await ocrBiz.deleteDocument(id);
                    res.json({ data, message: 'Deleted successfully!' });
                } catch (error) {
                    next(error);
                }

            })
        app.route('/download')
            .get(async (req, res, next) => {
                try {
                    res.download('uploads/text_files/3ad89a3a-f255-4304-b72c-520efa5d5b2d.txt', (err) => {
                        if (err) throw err;
                        console.log("File download");
                    })
                } catch (error) {
                    next(error);
                }
            })
    }
}
module.exports = OCRController