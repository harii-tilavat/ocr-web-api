const mysql = require('../db/mysql');
const BaseException = require('../exceptions/base.exception');
class OCRRepo {
    uploadDocRepo(document, user_id) {
        return new Promise(async (resolve, reject) => {
            try {
                // const { id, image_url, vendor, total, category, document_type, invoice_number, ocr_text ,originalname} = document;
                const { id, image_url, size, mimetype, filename, ocr_text } = document;
                const query = 'INSERT INTO documents (id, user_id, image_url, file_size, file_type, file_name, ocr_text) VALUES (?, ?, ?, ?, ?, ?, ?) ';
                const data = await mysql.execute(query, [id, user_id, image_url, size, mimetype, filename, ocr_text]);
                if (data) {
                    const selectQuery = 'SELECT * FROM documents WHERE id = ? AND user_id = ?';
                    const document = await mysql.execute(selectQuery, [id, user_id]);
                    resolve(document);
                } else {
                    throw new BaseException('Data not inserted!');
                }
            } catch (error) {
                reject(error);
            }
        });
    }
    addCredits(id) {
        return new Promise(async (resolve, reject) => {
            try {
                const query = 'INSERT INTO credits ( user_id ) VALUES (?)';
                const data = await mysql.execute(query, [id]);
                resolve(data);
            } catch (error) {
                reject(error);
            }
        })
    }
    getDocumentListRepo(user_id, searchQuery) {
        return new Promise(async (resolve, reject) => {
            try {
                let search = searchQuery;
                let query = `SELECT * FROM documents WHERE user_id = ? AND is_deleted = 0 AND is_archive = 0 `;
                if (search) {
                    query = query + `AND file_type LIKE '%${search}%'`;
                }
                query = query + 'order by created_at DESC';
                const data = await mysql.execute(query, [user_id]);
                resolve(data);
            } catch (error) {
                reject(error);
            }
        });
    }
    getArchiveDocsList(user_id,searchQuery) {
        return new Promise(async (resolve, reject) => {
            try {
                let search = searchQuery;
                let query = `SELECT * FROM documents WHERE user_id = ? AND is_deleted = 0 AND is_archive = 1 `;
                if (search) {
                    query = query + `AND file_type LIKE '%${search}%'`;
                }
                query = query + 'order by created_at DESC';
                const data = await mysql.execute(query, [user_id]);
                resolve(data);
            } catch (error) {
                reject(error);
            }
        });
    }
    getDocumentRepo(id, user_id) {
        return new Promise(async (resolve, reject) => {
            try {
                const query = 'SELECT * FROM documents WHERE id = ? AND user_id = ? AND is_deleted = 0 AND is_archive = 0 ';
                const data = await mysql.execute(query, [id, user_id]);
                resolve(data);
            } catch (error) {
                reject(error);
            }
        })
    }
    archiveDocRepo(id, user_id) {
        return new Promise(async (resolve, reject) => {
            try {
                // const query = 'DELETE FROM documents WHERE id = ? ';
                const query = 'UPDATE documents SET is_archive = 1 WHERE id = ? AND user_id = ?';
                const data = await mysql.execute(query, [id, user_id]);
                resolve(data);
            } catch (error) {
                reject(error);
            }
        })
    }
    deleteDocumentRepo(id, user_id) {
        return new Promise(async (resolve, reject) => {
            try {
                // const query = 'DELETE FROM documents WHERE id = ? ';
                const query = 'UPDATE documents SET is_deleted = 1 WHERE id = ? AND user_id = ?  ';
                const data = await mysql.execute(query, [id, user_id]);
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