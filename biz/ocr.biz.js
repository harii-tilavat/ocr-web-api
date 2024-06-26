const { veryfiClient } = require('../config/secret');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const OCRRepo = require('../repositories/ocr.repository');
const BaseException = require('../exceptions/base.exception');
const json2xls = require('json2xls');
const FileListModel = require('../models/FileList');
const { OCRService } = require('../services/ocr.service');
const UserListModel = require('../models/UserList');
const ConfigRepo = require('../repositories/config.repo');

class OCRBiz {
    constructor() {
        this.ocrRepo = new OCRRepo();
    }
    uploadDocument(file, user_id) {
        return new Promise(async (resolve, reject) => {
            try {
                const id = uuidv4();
                const { filename } = file;
                const ocrService = new OCRService();
                const image_url = `/uploads/files/${filename}`;
                let ocr_text = '';
                if (file && file.mimetype === 'application/pdf') {
                    ocr_text = await ocrService.convertTextFromPdf(file.path);
                } else {
                    if (+process.env.ADVANCE_MODE === 1) {
                        const ocr_data = await veryfiClient.process_document(file.path, [], true);
                        ocr_text = ocr_data && ocr_data.ocr_text;
                    } else {
                        ocr_text = await ocrService.convertTextFromImage(file.path);
                    }
                }
                const data = { ocr_text, id, image_url, ...file };
                const lookup = await this.ocrRepo.uploadDocRepo(data, user_id);
                let documentObj = {};
                if (lookup && lookup.length > 0) {
                    const data = lookup.map(item => new FileListModel(item));
                    documentObj = data[0];
                    this.updateCredits(user_id, 0, -1);
                }
                resolve(documentObj);
            } catch (error) {
                reject(error);
            }
        })
    }
    getAllDocs() {
        return new Promise(async (resolve, reject) => {
            try {
                const lookup = await this.ocrRepo.getAllDocsRepo();
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
                    documentObj = lookup.map(item => new FileListModel(item))[0];
                    resolve(documentObj);
                } else {
                    throw new BaseException('Id not found!', 404);
                }
            } catch (error) {
                reject(error);
            }
        })
    }
    getCredits(user_id) {
        return new Promise(async (resolve, reject) => {
            try {
                const lookup = await this.ocrRepo.getCreditsRepo(user_id);
                let creditObj = {};
                if (lookup && lookup.length > 0) {
                    if (user_id) {
                        const { avail_credit, max_credit } = lookup[0];
                        creditObj = { avail_credit, max_credit };
                        resolve(creditObj);
                    } else {
                        resolve(lookup);
                    }
                } else {
                    throw new BaseException('Id not found!', 404);
                }
            } catch (error) {
                reject(error);
            }
        })
    }
    getReferalById(user_id) {
        return new Promise(async (resolve, reject) => {
            try {
                const lookup = await this.ocrRepo.getReferalByIdRepo(user_id);
                if (lookup) {
                    const data = lookup.map(item => new UserListModel(item));
                    resolve(data);
                } else {
                    throw new BaseException('Id not found!', 404);
                }
            } catch (error) {
                reject(error);
            }
        })
    }
    getReferals() {
        return new Promise(async (resolve, reject) => {
            try {
                const lookup = await this.ocrRepo.getReferalRepo();
                if (lookup) {
                    resolve(lookup);
                } else {
                    throw new BaseException('Data not found!', 404);
                }
            } catch (error) {
                reject(error);
            }
        })
    }
    updateCredits(ids, max_credit, credit) {
        return new Promise(async (resolve, reject) => {
            try {
                const lookup = await this.ocrRepo.updateCredit(ids, max_credit, credit);
                if (lookup) {
                    resolve(lookup);
                } else {
                    throw new BaseException('Credit not updated!', 404);
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
    downloadFile(data, user_id, type) {
        return new Promise(async (resolve, reject) => {
            try {
                const ocrService = new OCRService();
                let url = '';
                url = path.resolve('uploads/converted/' + (data && data.id || uuidv4()));
                let text = '';
                if (data && data.ocr_text) {
                    text = data && data.ocr_text;
                }

                if (type === 'WORD') {
                    url = url + '.doc';
                    await ocrService.convertTextToWord(url, text);
                    resolve(url);
                }
                else if (type === 'TEXT') {
                    url = url + '.txt';
                    await ocrService.generateTextFile(url, text);
                    resolve(url);
                }
                else if (type === 'UPLOADED_FILE') {
                    let newUrl = data.image_url ? data.image_url.replace('/', '') : '';
                    newUrl = path.resolve(newUrl);
                    if (fs.existsSync(newUrl)) {
                        resolve(newUrl);
                    } else {
                        throw new BaseException('File not exists! ', 405);
                    }
                }
                else if (type === 'EXPORT_EXCEL') {
                    const ocrBiz = new OCRBiz();
                    const filepath = await ocrBiz.exportDocumentExcel(user_id);
                    if (fs.existsSync(filepath)) {
                        resolve(filepath);
                    } else {
                        throw new BaseException('Data can not be exported! ', 404);
                    }
                }
                else if (type === 'EXCEL') {
                    url = url + '.xls';
                    await ocrService.convertJsonToExcel(url, data);
                    resolve(url);
                }
                else {
                    throw new BaseException('File downloading error!!!');
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
                const fileUrlExcel = path.resolve(`uploads/converted/${user_id}.xls`);
                ocrService.convertJsonToExcel(fileUrlExcel, data);
                resolve(fileUrlExcel);
            } catch (error) {
                reject(error);
            }
        })
    }
    getFeedbackList() {
        return new Promise(async (resolve, reject) => {
            try {
                // this.ocrRepo.
                const lookup = await this.ocrRepo.getFeedbackRepo();
                if (lookup) {
                    resolve(lookup);
                } else {
                    throw new BaseException("Data not found!");
                }
            } catch (error) {
                reject(error);
            }
        });
    }
    setFeedback(contact) {
        return new Promise(async (resolve, reject) => {
            try {
                // ----------- Bussiness Logic ------
                // const { empName, empLocation, empPosition, empSalary } = employee;
                const lookup = await this.ocrRepo.setFeedbackRepo(contact);
                if (lookup) {
                    resolve(lookup);
                } else {
                    throw new BaseException("Data not found!");
                }
            } catch (error) {
                reject(error);
            }
        });
    }

    getContactList() {
        return new Promise(async (resolve, reject) => {
            try {
                // this.ocrRepo.
                const lookup = await this.ocrRepo.getContactRepo();
                if (lookup) {
                    resolve(lookup);
                } else {
                    throw new BaseException("Data not found!");
                }
            } catch (error) {
                reject(error);
            }
        });
    }
    setContact(contact) {
        return new Promise(async (resolve, reject) => {
            try {
                // ----------- Bussiness Logic ------
                // const { empName, empLocation, empPosition, empSalary } = employee;
                const lookup = await this.ocrRepo.setContactRepo(contact);
                if (lookup) {
                    resolve(lookup);
                } else {
                    throw new BaseException("Data not found!");
                }
            } catch (error) {
                reject(error);
            }
        });
    }
    getDashboard() {
        return new Promise(async (resolve, reject) => {
            try {
                // this.ocrRepo.
                const configRepo = new ConfigRepo();
                const docsList = await this.ocrRepo.getAllDocsRepo();
                const contactList = await this.ocrRepo.getContactRepo();
                const feedbackList = await this.ocrRepo.getFeedbackRepo();
                const creditList = await this.ocrRepo.getCreditsRepo();
                const usersList = await configRepo.getUserListRepo();
                const lookup = {
                    docsList,
                    contactList,
                    feedbackList,
                    creditList,
                    usersList
                };
                if (lookup) {
                    resolve(lookup);
                } else {
                    throw new BaseException("Data not found!");
                }
            } catch (error) {
                reject(error);
            }
        });
    }
}
module.exports = OCRBiz;