//importing the google object from the "googleapis" module and dotenv module
const { google } = require("googleapis");
const dotenv = require("dotenv");

//This line loads the variables from the .env file into the Node.js environment.
dotenv.config();

//assigning the values of the environment variables to constants
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

//This line creates a new instance of the OAuth2 class from the google.auth module.
const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI,
  REFRESH_TOKEN
);

//This line sets the credentials of the oAuth2Client instance with the refresh_token
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

//This line exports the oAuth2Client object as a module
module.exports = oAuth2Client;
