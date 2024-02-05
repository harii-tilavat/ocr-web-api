const Client = require("@veryfi/veryfi-sdk");

const ocrConfig = {
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    username: process.env.CLIENT_USERNAME,
    api_key: process.env.API_KEY
}
const veryfiClient = new Client(ocrConfig.client_id, ocrConfig.client_secret, ocrConfig.username, ocrConfig.api_key);
module.exports = { ocrConfig, veryfiClient };