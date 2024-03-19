class ConfigUserPostRequest {
    constructor(data) {
        this.name = data.name;
        this.username = data.username;
        this.password = data.password;
        this.email = data.email;
        this.user_ref_code = data.user_ref_code;
    }
}
module.exports = ConfigUserPostRequest;