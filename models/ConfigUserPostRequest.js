class ConfigUserPostRequest {
    constructor(data) {
        this.name = data.name;
        this.username = data.username;
        this.password = data.password;
        this.email = data.email;
    }
}
module.exports = ConfigUserPostRequest;