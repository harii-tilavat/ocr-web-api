const express = require('express');
const Client = require('@veryfi/veryfi-sdk');
const cors = require('cors');
const PORT = process.env.PORT || 8000;
const path = require('path');
const app = express();

// const CLIENT_ID = 'vrfnyNiV2hYKLiMuT7NTpxLCVrXPgt9YCJWs6tl';
// const CLIENT_SECRET = 'JynNAEBGLlPLuyFNNiDYVJEZDLEKJtaecsvu1omlYow1E4NLwoFueTlnm9ZGJngEUahvv5Jgm0UI7AsFxprlD5vgipajLelkFZtga9swSlKPRpO2GpU3FtkyDUth82bK';
// const API_URL = 'https://api.veryfi.com/api/v8/partner/documents';
// const AUTHORIZATION = 'apikey jerryff81:57f6f447615b5c8d2cb9eb4107a0d572';
// const USERNAME = 'jerryff81';
// const API_KEY = '57f6f447615b5c8d2cb9eb4107a0d572';

// const client = new Client(CLIENT_ID, CLIENT_SECRET, USERNAME, API_KEY);


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


const routes = require('./routes/routes');

app.use('/', routes);

app.listen(PORT, () => {
	console.log(`Server running on http://localhost:8000`);
})