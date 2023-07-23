import { drive } from './config.js';

async function saveToDrive(documentContent, documentName) {
  try {
    const buffer = Buffer.from(documentContent, 'utf8');

    const response = await drive.files.create({
      requestBody: {
        name: documentName,
        mimeType: 'application/vnd.google-apps.document',
      },
      media: {
        mimeType: 'text/plain',
        body: buffer,
      },
      fields: 'webViewLink', 
    });

    console.log(response.data);
    return response.data.webViewLink; 
  } catch (err) {
    console.error(err);
    throw new Error('Failed to save document to Google Drive');
  }
}

export { saveToDrive };
