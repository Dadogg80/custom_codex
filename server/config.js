import * as dotenv from "dotenv";
import { Configuration, OpenAIApi } from "openai";
import { google } from 'googleapis';

dotenv.config();

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URL
);

const drive = google.drive({
  version: 'v3',
  auth: oauth2Client
});

const openai = new OpenAIApi(configuration);

export { drive, openai, oauth2Client };
