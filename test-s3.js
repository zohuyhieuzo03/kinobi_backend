// backend/test-s3.js
const AWS = require('aws-sdk');
require('dotenv').config();

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: 'ap-southeast-1'
});

const bucket = process.env.S3_BUCKET_NAME;

async function testS3() {
  try {
    const result = await s3.listObjectsV2({ Bucket: bucket, MaxKeys: 5 }).promise();
    console.log('✅ Kết nối thành công với bucket:', bucket);
    console.log('📂 Danh sách file mẫu:', result.Contents.map(obj => obj.Key));
  } catch (err) {
    console.error('❌ Không thể kết nối S3:', err.message);
  }
}

testS3();
