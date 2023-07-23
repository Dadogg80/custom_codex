import express from 'express';
import { oauth2Client } from './config.js';
import { saveToDrive } from './drive.js';
import { generateResponse } from './openai.js';

const router = express.Router();

router.get('/auth', (req, res) => {
  const scopes = ['https://www.googleapis.com/auth/drive.readonly'];
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes
  });

  res.redirect(url);
});

router.get('/oauth2callback', async (req, res) => {
  const code = req.query.code;
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);

  res.send('Authentication successful');
});

router.get("/", async (req, res) => {
  res.status(200).send({
    message: "Hello from Codex!"
  });
});

router.post('/', async (req, res) => {
  try {
    const prompt = req.body.prompt;
    const response = await generateResponse(prompt);

    // If the user asked to save the response to a document
    const saveCommand = /save.*document/;
    if (saveCommand.test(prompt.toLowerCase())) {
      const documentContent = response.data.choices[0].text;
      const documentName = 'Response from ' + new Date().toISOString();

      // Save the document to Google Drive and get the link
      const documentLink = await saveToDrive(documentContent, documentName);

      // Add a message to the response indicating that the document was saved
      response.data.choices[0].text += `\n(Document saved to Google Drive: ${documentLink})`;
    }

    // Send back the response
    res.status(200).send({
      bot: response.data.choices[0].text,
      documentLink: documentLink || null
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({error: err.message});
  }
});



export default router;
