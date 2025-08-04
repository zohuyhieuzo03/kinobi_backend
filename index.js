// backend/index.js
const express = require('express');
const AWS = require('aws-sdk');
const cors = require('cors');
const admin = require('firebase-admin');
require('dotenv').config();

// Initialize Firebase Admin SDK
const serviceAccount = {
  type: "service_account",
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${process.env.FIREBASE_CLIENT_EMAIL.replace('@', '%40')}`
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const app = express();
app.use(cors());
app.use(express.json());

// Authentication middleware
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Error verifying token:', error);
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

const s3 = new AWS.S3({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const BUCKET_NAME = process.env.S3_BUCKET_NAME;

app.post('/get-presigned-url', authenticateToken, async (req, res) => {
  try {
    const { fileName, fileType } = req.body;
    const userId = req.user.uid; // Get user ID from Firebase token
    const Key = `${userId}/${Date.now()}_${fileName}`;

    const params = {
      Bucket: BUCKET_NAME,
      Key,
      ContentType: fileType,
      Expires: 60, // 1 minute
    };

    const url = await s3.getSignedUrlPromise('putObject', params);
    res.json({ url });
  } catch (err) {
    console.error('Error generating presigned URL', err);
    res.status(500).json({ error: 'Failed to generate URL' });
  }
});

app.get('/list-files', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.uid; // Get user ID from Firebase token

    const params = {
      Bucket: BUCKET_NAME,
      Prefix: `${userId}/`,
    };

    const data = await s3.listObjectsV2(params).promise();
    const files = data.Contents.map((item) => ({
      key: item.Key,
      url: s3.getSignedUrl('getObject', {
        Bucket: BUCKET_NAME,
        Key: item.Key,
        Expires: 60 * 5,
      })
    }));

    res.json(files);
  } catch (err) {
    console.error('Error listing files', err);
    res.status(500).json({ error: 'Failed to list files' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});