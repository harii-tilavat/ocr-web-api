const { Router } = require("express");
const OCRBiz = require("../biz/ocr.biz");
const { MissingParamException, SchemaException } = require("../exceptions");
const BaseException = require("../exceptions/base.exception");
const upload = require("../services/multerService");
const multer = require('multer');
const storage = multer.memoryStorage();
const testupload = multer({ storage: storage });
const pdfParse = require('pdf-parse');
const fs = require('fs');
const path = require('path');
const { OCRService } = require("../services/ocr.service");
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
                    res.json({ data, message: 'Document detail!' });
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
            .post(async (req, res, next) => {
                try {
                    const { data, user_id, type } = req.body;
                    const ocrBiz = new OCRBiz();
                    const file_url = await ocrBiz.downloadFile(data, user_id, type);
                    if (fs.existsSync(file_url)) {
                        res.download(file_url, (err) => {
                            if (err) throw err;
                            if (!(type === 'UPLOADED_FILE')) {
                                fs.unlinkSync(file_url);
                            }
                            console.log("File downloaded");
                        })
                    }
                    else {
                        throw new BaseException('File not exists!', 404);
                    }
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
                    res.json({ data, message: 'Your credits!' });
                } catch (error) {
                    next(error);
                }
            })
        app.route('/api/referal')
            .get(async (req, res, next) => {
                try {
                    const { user_id } = req.query;
                    const uid = user_id || null
                    const ocrBiz = new OCRBiz();
                    if (uid) {
                        const data = await ocrBiz.getReferalById(uid);
                        res.json({ data, message: 'Your Referal info!' });
                    } else {
                        const data = await ocrBiz.getReferals();
                        res.json({ data, message: 'Total referals!' });
                    }
                } catch (error) {
                    next(error);
                }
            })
        app.route('/pdf-to-word')
            .post(testupload.single('file'), async (req, res, next) => {
                try {
                    let pdfBuffer = req.file.buffer;
                    let outputImages = await pdf2img.convert(pdfBuffer);

                    res.send({ hello: 'Test' });
                } catch (error) {
                    next(error);
                }
            })
    }
}
module.exports = OCRController