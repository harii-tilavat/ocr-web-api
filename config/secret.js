const Client = require("@veryfi/veryfi-sdk");

const ocrConfig = {
    client_id: 'vrf7mdsu112RzrfSee1ZM3o1yHJzL9bRrw71X2N',
    client_secret: 'so35tFi8IarNMR2SVkIsiDRDeR4MyoHw8M0yLSoTAZ2k5lLxCLYXOtciVZrrJ2CYpKZu19fbkdmOtRGt8jlk6dVM02UuaR6cxs8XF8KpHfWe6A6kgslXu60lRRX8Euno',
    username: 'mexava6164',
    api_key: 'bda8a070469d4ed7aacd1a3befa69a89'
}
const veryfiClient = new Client(ocrConfig.client_id, ocrConfig.client_secret, ocrConfig.username, ocrConfig.api_key);
module.exports = { ocrConfig, veryfiClient };