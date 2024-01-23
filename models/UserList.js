class UserListModel {
    constructor(data) {
        this.id = data.id;
        this.created_at = data.created_at;
        this.name = data.name;
        this.lastname = data.lastname;
        this.username = data.username;
    }
}
module.exports = UserListModel;