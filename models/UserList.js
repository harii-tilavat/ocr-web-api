class UserListModel {
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.lastname = data.lastname;
        this.email = data.email;
        this.number = data.number;
        this.country = data.country;
        this.type = data.type;
        this.username = data.username;
        this.ref_code = data.ref_code;
        this.created_at = data.created_at;
        this.updated_at = data.updated_at;
        this.last_login = data.last_login;
    }
}
module.exports = UserListModel;