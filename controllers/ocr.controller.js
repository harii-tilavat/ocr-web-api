const { Router } = require("express");
const OCRBiz = require("../biz/ocr.biz");
const { MissingParamException, SchemaException } = require("../exceptions");
const BaseException = require("../exceptions/base.exception");
const upload = require("../services/multerService");
const multer = require('multer');
const storage = multer.memoryStorage();
const testupload = multer({ storage: storage });
const pdfParse = require('pdf-parse');
const officegen = require('officegen');
class OCRController {
    register(app) {
        app.route('/api/docs')
            .get(async (req, res, next) => {
                try {
                    const { user_id, query, isArchivedList } = req.query;
                    let searchQuery = query || '';
                    const ocrBiz = new OCRBiz();
                    if (isArchivedList === 'true') {
                        const data = await ocrBiz.getArchiveDocsList(user_id, searchQuery);
                        res.json({ data, message: 'Archive Document list' });
                    } else {
                        const data = await ocrBiz.getDocumentList(user_id, searchQuery);
                        res.json({ data, message: 'Document list' });
                    }
                } catch (error) {
                    next(error);
                }
            })
            .post(upload.single('file'), async (req, res, next) => {
                try {
                    const { user_id } = req.query;
                    const ocrBiz = new OCRBiz();
                    if (req && req.file) {
                        const data = await ocrBiz.uploadDocument(req.file, user_id);
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
                    const { user_id } = req.query;
                    if (!id) {
                        throw new MissingParamException('id');
                    }
                    const ocrBiz = new OCRBiz();
                    const data = await ocrBiz.getDocument(id, user_id);
                    res.json({ data, message: 'Document detail!', request: req.headers });
                } catch (error) {
                    next(error);
                }
            })
            .delete(async (req, res, next) => {
                try {
                    const { id } = req.params;
                    const { user_id, isArchivedList } = req.query;
                    if (!id) {
                        throw new MissingParamException('id');
                    }
                    const ocrBiz = new OCRBiz();
                    if (isArchivedList === 'true') {
                        const data = await ocrBiz.deleteDocument(id, user_id);
                        res.json({ data, message: 'Deleted successfully!' });
                    } else {
                        const data = await ocrBiz.archiveDocument(id, user_id);
                        res.json({ data, message: 'Moved to bin successfully!' });

                    }
                } catch (error) {
                    next(error);
                }

            })
            .patch(async (req, res, next) => {
                try {
                    const { id } = req.params;
                    const { user_id } = req.query;
                    if (!id) {
                        throw new MissingParamException('id');
                    }
                    const ocrBiz = new OCRBiz();
                    const data = await ocrBiz.restoreDocument(id, user_id);
                    res.json({ data, message: 'Restore successfully!' });
                } catch (error) {
                    next(error);
                }
            })
        app.route('/download')
            .get(async (req, res, next) => {
                try {
                    res.download('uploads/pdf-file.jpg', (err) => {
                        if (err) throw err;
                        // console.log("File download");
                    })
                } catch (error) {
                    next(error);
                }
            })
        app.route('/api/contact')
            .post(async (req, res, next) => {
                try {
                    // Himanshu your code will here
                    const data = req.body;
                    console.log("Data => ", data);
                } catch (error) {
                    next(error);
                }
            })
        app.route('/api/credits')
            .get(async (req, res, next) => {
                try {
                    const { user_id } = req.query;
                    let uid = user_id || null;
                    const ocrBiz = new OCRBiz();
                    const data = await ocrBiz.getCredits(uid);
                    res.json({ data, message: 'Your credits!', request: req.headers });
                } catch (error) {
                    next(error);
                }
            })
        app.route('/api/export/:id')
            .get(async (req, res, next) => {
                try {
                    const { id } = req.params;
                    const ocrBiz = new OCRBiz();
                    const filepath = await ocrBiz.exportDocumentExcel(id);
                    res.sendFile(filepath);
                    console.log("ERROR => downloading");
                } catch (error) {
                    next(error);
                }
            })
        app.route('/pdf-to-word')
            .post(testupload.single('file'), async (req, res, next) => {
                try {
                    let pdfBuffer = req.file.buffer;

                    let dataBuffer = await pdfParse(pdfBuffer);

                    let docx = officegen('docx');

                    docx.on('error', function (err) {
                        console.log(err);
                    });

                    docx.on('finalize', function (written) {
                        console.log('Finish to create Word file.\nTotal bytes created: ' + written + '\n');
                    });

                    docx.createP().addText(dataBuffer.text);

                    res.attachment('output.docx');
                    docx.generate(res);
                } catch (error) {
                    next(error);
                }
            })
    }
}
module.exports = OCRController