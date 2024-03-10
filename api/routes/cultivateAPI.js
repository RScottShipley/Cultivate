const express = require('express');
const {google} = require("googleapis");

const app = express();

app.get("/", async (req, res) => {
    const auth = new google.auth.GoogleAuth({
        keyFile: "credentials.json",
        scopes: "https://www.googleapis.com/auth/spreadsheets"
    });

    const client = await auth.getClient();

    const googleSheets = google.sheets({version: "v4", auth: client });

    const spreadsheetId = "1-2tKjyDPvRkwF3zqwdIDBGOZd7ZQoMh22stHsMtj1L0";

    const getRows = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: "Sheet1"
    });
    

    res.send(getRows.data);
});

app.listen()

module.exports = app;