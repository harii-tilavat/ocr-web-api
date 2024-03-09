const { veryfiClient } = require('../config/secret');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const OCRRepo = require('../repositories/ocr.repository');
const BaseException = require('../exceptions/base.exception');

class OCRBiz {
    constructor() {
        this.ocrRepo = new OCRRepo();
    }
    uploadDocument(file,user_id) {
        return new Promise(async (resolve, reject) => {
            try {
                const id = uuidv4();
                const textFileExt = '.txt';
                const { filename } = file;
                const image_url = `/uploads/files/${filename}`;
                const txtFileUrl = `uploads/text_files/${id}.${textFileExt}`;
                const data = { ...(await veryfiClient.process_document(file.path, [], true)), id, image_url, ...file, };
                const lookup = await this.ocrRepo.uploadDocRepo(data,user_id);
                let documentObj = {};
                if (lookup && lookup.length > 0) {
                    documentObj = lookup[0];
                    fs.writeFileSync(txtFileUrl, documentObj.ocr_text);
                }
                resolve(documentObj);
            } catch (error) {
                reject(error);
            }
        })
    }
    getDocumentList(user_id) {
        return new Promise(async (resolve, reject) => {
            try {
                const lookup = await this.ocrRepo.getDocumentListRepo(user_id);
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
    getDocument(id,user_id) {
        return new Promise(async (resolve, reject) => {
            try {
                const lookup = await this.ocrRepo.getDocumentRepo(id,user_id);
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
    deleteDocument(id) {
        return new Promise(async (resolve, reject) => {
            try {
                // const filePath = '/uploads/files/1705573230745dmart_invoice.png'.replace('/', '');
                // fs.existsSync(path.join(lookup.image_url.replace('/', ''))) Logic of filepath getting
                // fs.unlinkSync(filePath);

                const lookup = await this.ocrRepo.deleteDocumentRepo(id);
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
}
module.exports = OCRBiz;