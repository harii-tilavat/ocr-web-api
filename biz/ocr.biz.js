const { veryfiClient } = require('../config/secret');
const path = require('path');
const { default: Client } = require('@veryfi/veryfi-sdk');
const OCRRepo = require('../repositories/ocr.repository');
const BaseException = require('../exceptions/base.exception');
class OCRBiz {
    constructor() {
        this.ocrRepo = new OCRRepo();
    }
    uploadDocument(file) {
        return new Promise(async (resolve, reject) => {
            try {
                const { destination, filename } = file;
                const filePath = path.join(destination, filename);
                const data = await veryfiClient.process_document(filePath, []);
                const lookup = await this.ocrRepo.uploadDocRepo(data);
                let documentObj = {};
                if (lookup && lookup.length > 0) {
                    documentObj = lookup[0];
                }
                resolve(documentObj);
            } catch (error) {
                reject(error);
            }
        })
    }
    getDocumentList() {
        return new Promise(async (resolve, reject) => {
            try {
                // this.ocrRepo.
                const lookup = await this.ocrRepo.getDocumentListRepo();
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
    getDocument(id) {
        return new Promise(async (resolve, reject) => {
            try {
                const lookup = await this.ocrRepo.getDocumentRepo(id);
                let documentObj = {};
                if (lookup && lookup.length > 0) {
                    documentObj = lookup[0];
                }
                resolve(documentObj);

            } catch (error) {
                reject(error);
            }
        })
    }
}
module.exports = OCRBiz;