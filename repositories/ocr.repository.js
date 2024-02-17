const mysql = require('../db/mysql');
const BaseException = require('../exceptions/base.exception');
class OCRRepo {
    uploadDocRepo(document) {
        return new Promise(async (resolve, reject) => {
            try {
                // const { id, image_url, vendor, total, category, document_type, invoice_number, ocr_text } = document;
                const { id, image_url, size, mimetype, originalname, ocr_text } = document;
                const query = 'INSERT INTO documents (id, image_url, file_size, file_type, file_name, ocr_text) VALUES (?, ?, ?, ?, ?, ?) ';
                const data = await mysql.execute(query, [id, image_url, size, mimetype, originalname, ocr_text]);
                if (data) {
                    const selectQuery = 'SELECT * FROM documents WHERE id = ?';
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
                const query = 'SELECT * FROM documents WHERE id = ? ';
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
                const query = 'DELETE FROM documents WHERE id = ? ';
                const data = await mysql.execute(query, [id]);
                // Retrive file path
                // const selectFileQuery = 'SELECT image_url FROM documents WHERE id = ?';
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