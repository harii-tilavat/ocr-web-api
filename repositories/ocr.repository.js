const mysql = require('../db/mysql');
const BaseException = require('../exceptions/base.exception');
class OCRRepo {
    uploadDocRepo(document) {
        return new Promise(async (resolve, reject) => {
            try {
                const { doc_id, image_url, vendor, total, category, document_type, invoice_number, ocr_text } = document;
                const query = 'INSERT INTO documents (doc_id, image_url, vendor_name, total, category, document_type, invoice_number, ocr_text) VALUES (?, ?, ?, ?, ?, ?, ?,?) ';
                const data = await mysql.execute(query, [doc_id, image_url, vendor.name, total, category, document_type, invoice_number, ocr_text]);
                if (data) {
                    const selectQuery = 'SELECT * FROM documents WHERE doc_id = ?';
                    const document = await mysql.execute(selectQuery, [doc_id]);
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
                const query = 'SELECT * FROM documents order by created_at DESC';
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
    deleteDocumentRepo(id) {
        return new Promise(async (resolve, reject) => {
            try {
                const query = 'DELETE FROM documents WHERE doc_id = ? ';
                const data = await mysql.execute(query, [id]);
                // Retrive file path
                // const selectFileQuery = 'SELECT image_url FROM documents WHERE doc_id = ?';
                // const filePath = await mysql.execute(selectFileQuery, [id]);
                // resolve({ ...filePath[0], ...data });
                resolve(data);
            } catch (error) {
                reject(error);
            }
        })
    }
}
module.exports = OCRRepo;