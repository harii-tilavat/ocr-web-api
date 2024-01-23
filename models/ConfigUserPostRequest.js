class ConfigUserPostRequest {
    constructor(data) {
        this.name = data.name;
        this.lastname = data.lastname;
        this.username = data.username;
        this.password = data.password;
    }
}
module.exports = ConfigUserPostRequest;