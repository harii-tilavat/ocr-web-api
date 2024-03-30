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
    getAllDocsRepo() {
        return new Promise(async (resolve, reject) => {
            try {
                let query = `SELECT file_size,file_type FROM documents WHERE is_deleted = 0 `;
                const data = await mysql.execute(query);
                resolve(data);
            } catch (error) {
                reject(error);
            }
        });
    }
    getDocumentListRepo(user_id, searchQuery) {
        return new Promise(async (resolve, reject) => {
            try {
                let search = searchQuery;
                let query = `SELECT * FROM documents WHERE user_id = ? AND is_deleted = 0 AND is_archive = 0 `;
                if (search) {
                    query = query + `AND (file_type LIKE '%${search}%' OR file_name LIKE '%${search}%')`;
                }
                query = query + 'order by created_at DESC';
                const data = await mysql.execute(query, [user_id]);
                resolve(data);
            } catch (error) {
                reject(error);
            }
        });
    }
    getArchiveDocsList(user_id, searchQuery) {
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
    getCreditsRepo(user_id) {
        return new Promise(async (resolve, reject) => {
            try {
                let query = 'SELECT c.*,u.username FROM credits c INNER JOIN users u ON c.user_id = u.id';
                if (user_id) {
                    query = query + ` WHERE user_id = '${user_id}'`
                }
                const data = await mysql.execute(query, []);
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
    restoreDocRepo(id, user_id) {
        return new Promise(async (resolve, reject) => {
            try {
                // const query = 'DELETE FROM documents WHERE id = ? ';
                const query = 'UPDATE documents SET is_archive = 0 WHERE id = ? AND user_id = ?';
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
    getReferalRepo() {
        return new Promise(async (resolve, reject) => {
            try {
                let query = `
                SELECT * FROM referal`;
                const data = await mysql.execute(query, []);
                resolve(data);
            } catch (error) {
                reject(error);
            }
        })
    }
    getReferalByIdRepo(user_id) {
        return new Promise(async (resolve, reject) => {
            try {
                let innerQuery = 'SELECT user_id FROM referal WHERE user_ref_id IN (?)';
                let query = `SELECT * FROM users WHERE id IN(${innerQuery})`;
                const data = await mysql.execute(query, [user_id]);
                resolve(data);
            } catch (error) {
                reject(error);
            }
        })
    }
    addReferalRepo(user_id, user_ref_id) {
        // user_id which is register from other refer code
        // user_ref_id is which is user refer from
        return new Promise(async (resolve, reject) => {
            try {
                const query = 'INSERT INTO referal (user_id, user_ref_id) VALUES (?, ?);';
                const data = await mysql.execute(query, [user_id, user_ref_id]);
                resolve(data);
            } catch (error) {
                reject(error);
            }
        })
    }
    checkReferal(user_ref_code) {
        return new Promise(async (resolve, reject) => {
            try {
                const query = 'SELECT id FROM users WHERE ref_code = ?';
                const id = await mysql.execute(query, [user_ref_code]);
                resolve(id);
            } catch (error) {
                reject(error);
            }
        })
    }
    updateCredit(ids, max_credit, credit) {
        return new Promise(async (resolve, reject) => {
            try {
                const query = 'UPDATE credits  SET max_credit = max_credit + (?), avail_credit = avail_credit +  (?) WHERE user_id IN (?)'; // WHERE user_id IN(?)
                const data = await mysql.execute(query, [max_credit, credit, ids]);
                resolve(data);
            } catch (error) {
                reject(error);
            }
        })
    }
    getFeedbackRepo() {
        return new Promise(async (resolve, reject) => {
            try {
                const query = "SELECT f.*,u.username FROM feedback f INNER JOIN users u ON f.user_id = u.id";
                const data = await mysql.execute(query, []);
                resolve(data);
            } catch (error) {
                reject(error);
            }
        });
    }
    setFeedbackRepo(contact) {
        return new Promise(async (resolve, reject) => {
            try {
                // Generate unique employee id
                const { user_id, rating, comment } = contact;
                const query =
                    "INSERT INTO `feedback`(`user_id`, `rating`, `comment`) VALUES (?,?,?)";
                const data = await mysql.execute(query, [user_id, rating, comment]);
                resolve(data);
            } catch (error) {
                reject(error);
            }
        });
    }
    getContactRepo() {
        return new Promise(async (resolve, reject) => {
            try {
                const query = "SELECT * FROM contact";
                const data = await mysql.execute(query, []);
                resolve(data);
            } catch (error) {
                reject(error);
            }
        });
    }
    setContactRepo(contact) {
        return new Promise(async (resolve, reject) => {
            try {
                // Generate unique employee id
                const { name, surname, email, subject, message } = contact;
                const query =
                    "INSERT INTO `contact`(`name`, `surname`, `email`, `subject`, `message`) VALUES (?,?,?,?,?)";
                const data = await mysql.execute(query, [
                    name,
                    surname,
                    email,
                    subject,
                    message,
                ]);
                resolve(data);
            } catch (error) {
                reject(error);
            }
        });
    }
}
module.exports = OCRRepo;