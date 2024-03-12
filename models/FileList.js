class FileListModel {
    constructor(data) {
        this.id = data.id;
        this.image_url = data.image_url;
        this.file_size = data.file_size;
        this.file_type = data.file_type;
        this.file_name = data.file_name;
        this.created_at = data.created_at;
        this.updated_at = data.updated_at;
        this.ocr_text = data.ocr_text;
    }
}
module.exports = FileListModel;