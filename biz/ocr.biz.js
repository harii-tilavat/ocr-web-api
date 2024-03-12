const { veryfiClient } = require('../config/secret');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const OCRRepo = require('../repositories/ocr.repository');
const BaseException = require('../exceptions/base.exception');
const json2xls = require('json2xls');
const FileListModel = require('../models/FileList');
const { OCRService } = require('../services/ocr.service');

class OCRBiz {
    constructor() {
        this.ocrRepo = new OCRRepo();
    }
    uploadDocument(file, user_id) {
        return new Promise(async (resolve, reject) => {
            try {
                const id = uuidv4();
                const { filename } = file;
                const image_url = `/uploads/files/${filename}`;
                const data = { ...(await veryfiClient.process_document(file.path, [], true)), id, image_url, ...file, };
                const lookup = await this.ocrRepo.uploadDocRepo(data, user_id);
                let documentObj = {};
                if (lookup && lookup.length > 0) {
                    const data = lookup.map(item => new FileListModel(item));
                    documentObj = data[0];
                    const ocrService = new OCRService();
                    const fileUrlText = `uploads/text_files/${id}.txt`;
                    const fileUrlWord = `uploads/word_files/${id}.doc`;
                    const fileUrlExcel = `uploads/excel_files/${id}.xlsx`;
                    ocrService.generateTextFile(fileUrlText, documentObj.ocr_text);
                    ocrService.convertTextToWord(fileUrlWord, documentObj.ocr_text);
                    ocrService.convertJsonToExcel(fileUrlExcel, documentObj);
                }
                resolve(documentObj);
            } catch (error) {
                reject(error);
            }
        })
    }
    getDocumentList(user_id, query) {
        return new Promise(async (resolve, reject) => {
            try {
                const lookup = await this.ocrRepo.getDocumentListRepo(user_id, query);
                if (lookup) {
                    resolve(lookup);
                } else {
                    throw new BaseException('Data not found!');
                }
            } catch (error) {
                reject(error);
            }

        })
    }
    getArchiveDocsList(user_id, query) {
        return new Promise(async (resolve, reject) => {
            try {
                const lookup = await this.ocrRepo.getArchiveDocsList(user_id, query);
                if (lookup) {
                    resolve(lookup);
                } else {
                    throw new BaseException('Data not found!');
                }
            } catch (error) {
                reject(error);
            }

        })
    }
    getDocument(id, user_id) {
        return new Promise(async (resolve, reject) => {
            try {
                const lookup = await this.ocrRepo.getDocumentRepo(id, user_id);
                let documentObj = {};
                if (lookup && lookup.length > 0) {
                    documentObj = lookup[0];
                    resolve(documentObj);
                } else {
                    throw new BaseException('Id not found!', 404);
                }
            } catch (error) {
                reject(error);
            }
        })
    }
    deleteDocument(id, user_id) {
        return new Promise(async (resolve, reject) => {
            try {
                // const filePath = '/uploads/files/1705573230745dmart_invoice.png'.replace('/', '');
                // fs.existsSync(path.join(lookup.image_url.replace('/', ''))) Logic of filepath getting
                // fs.unlinkSync(filePath);
                const lookup = await this.ocrRepo.deleteDocumentRepo(id, user_id);
                if (lookup && lookup.affectedRows > 0) {
                    resolve(lookup);
                } else {
                    throw new BaseException('Id not found!', 404);
                }
            } catch (error) {
                reject(error);
            }
        })
    }
    archiveDocument(id, user_id) {
        return new Promise(async (resolve, reject) => {
            try {
                const lookup = await this.ocrRepo.archiveDocRepo(id, user_id);
                if (lookup && lookup.affectedRows > 0) {
                    resolve(lookup);
                } else {
                    throw new BaseException('Id not found!', 404);
                }
            } catch (error) {
                reject(error);
            }
        })
    }
    restoreDocument(id, user_id) {
        return new Promise(async (resolve, reject) => {
            try {
                const lookup = await this.ocrRepo.restoreDocRepo(id, user_id);
                if (lookup && lookup.affectedRows > 0) {
                    resolve(lookup);
                } else {
                    throw new BaseException('Id not found!', 404);
                }
            } catch (error) {
                reject(error);
            }
        })
    }
    getTextFile(filename) {
        return new Promise(async (resolve, reject) => {
            try {
                const downloadFile = 'uploads/text_files/' + filename + '.txt';
                if (fs.existsSync(downloadFile)) {
                    resolve(downloadFile);
                } else {
                    throw new BaseException("File not found!");
                }
            } catch (error) {
                reject(error);
            }
        })
    }
    exportDocumentExcel(user_id) {
        return new Promise(async (resolve, reject) => {
            try {
                const ocrService = new OCRService();
                const lookup = await this.getDocumentList(user_id);
                const data = lookup.map(item => new FileListModel(item));
                const fileUrlExcel = `uploads/excel_files/${user_id}.xls`;
                ocrService.convertJsonToExcel(fileUrlExcel, data);
                resolve(fileUrlExcel);
            } catch (error) {
                reject(error);
            }
        })
    }
}
module.exports = OCRBiz;