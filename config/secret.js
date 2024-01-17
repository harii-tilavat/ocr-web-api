const Client = require("@veryfi/veryfi-sdk");

const ocrConfig = {
    client_id: 'vrfnyNiV2hYKLiMuT7NTpxLCVrXPgt9YCJWs6tl',
    client_secret: 'JynNAEBGLlPLuyFNNiDYVJEZDLEKJtaecsvu1omlYow1E4NLwoFueTlnm9ZGJngEUahvv5Jgm0UI7AsFxprlD5vgipajLelkFZtga9swSlKPRpO2GpU3FtkyDUth82bK',
    username: 'jerryff81',
    api_key: '57f6f447615b5c8d2cb9eb4107a0d572'
}
const veryfiClient = new Client(ocrConfig.client_id, ocrConfig.client_secret, ocrConfig.username, ocrConfig.api_key);
module.exports = { ocrConfig, veryfiClient };