const mysql = require('../db/mysql');
const { v4: uuidv4 } = require('uuid');
const BaseException = require('../exceptions/base.exception');
class OCRRepo {
    uploadDocRepo(document) {
        return new Promise(async (resolve, reject) => {
            try {
                const id = uuidv4();
                const { vendor, total, category, document_type, invoice_number, ocr_text } = document;
                const query = 'INSERT INTO documents (doc_id, vendor_name, total, category, document_type, invoice_number, ocr_text) VALUES (?, ?, ?, ?, ?, ?,?) ';
                const data = await mysql.execute(query, [id, vendor.name, total, category, document_type, invoice_number, ocr_text]);
                if (data) {
                    const selectQuery = 'SELECT * FROM documents WHERE doc_id = ?';
                    const document = await mysql.execute(selectQuery, [id]);
                    resolve(document);
                } else {
                    throw new BaseException('Data not inserted!');
                }
            } catch (error) {
                reject(error);
            }
        });
    }
    getDocumentListRepo() {
        return new Promise(async (resolve, reject) => {
            try {
                const query = 'SELECT * FROM documents';
                const data = await mysql.execute(query, []);
                resolve(data);
            } catch (error) {
                reject(error);
            }
        });
    }
    getDocumentRepo(id) {
        return new Promise(async (resolve, reject) => {
            try {
                const query = 'SELECT * FROM documents WHERE doc_id = ? ';
                const data = await mysql.execute(query, [id]);
                resolve(data);
            } catch (error) {
                reject(error);
            }
        })
    }
}
module.exports = OCRRepo;