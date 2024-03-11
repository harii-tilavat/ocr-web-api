class UserListModel {
    constructor(data) {
        this.id = data.id;
        this.created_at = data.created_at;
        this.name = data.name;
        // this.lastname = data.lastname;
        this.type = data.type;
        this.username = data.username;
        this.ref_code = data.ref_code;
    }
}
module.exports = UserListModel;