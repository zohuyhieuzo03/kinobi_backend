# Backend Kinobi

A secure file upload and management backend API built with Node.js, Express, Firebase Authentication, and AWS S3.

## 🚀 Features

- **Firebase Authentication**: Secure user authentication using Firebase ID tokens
- **AWS S3 Integration**: File storage and management using Amazon S3
- **Presigned URLs**: Secure file upload mechanism using S3 presigned URLs
- **User-specific Storage**: Files are organized by user ID for privacy and security
- **File Listing**: Retrieve user's uploaded files with temporary access URLs
- **CORS Support**: Cross-origin resource sharing enabled
- **Testing Suite**: Comprehensive test coverage with Jest

## 📋 Prerequisites

Before running this project, make sure you have:

- Node.js (v14 or higher)
- npm or yarn
- AWS Account with S3 bucket access
- Firebase project with Admin SDK credentials

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend_kinobi
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   
   Create a `.env` file in the root directory with the following variables:
   ```env
   # Server Configuration
   PORT=3001
   
   # AWS S3 Configuration
   AWS_REGION=your-aws-region
   AWS_ACCESS_KEY_ID=your-access-key-id
   AWS_SECRET_ACCESS_KEY=your-secret-access-key
   S3_BUCKET_NAME=your-s3-bucket-name
   
   # Firebase Configuration
   FIREBASE_SERVICE_ACCOUNT_BASE64=your-base64-encoded-service-account-json
   ```

4. **Firebase Setup**
   
   - Download your Firebase service account JSON file
   - Convert it to base64 encoding:
     ```bash
     base64 -i path/to/your/service-account.json
     ```
   - Add the base64 string to your `.env` file as `FIREBASE_SERVICE_ACCOUNT_BASE64`

## 🚦 Usage

### Starting the Server

```bash
npm start
```

The server will start on `http://localhost:3001` (or your configured PORT).

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 📡 API Endpoints

### Authentication

All endpoints require a valid Firebase ID token in the Authorization header:
```
Authorization: Bearer <firebase-id-token>
```

### Get Presigned URL for File Upload

**POST** `/get-presigned-url`

Request body:
```json
{
  "fileName": "example.jpg",
  "fileType": "image/jpeg"
}
```

Response:
```json
{
  "url": "https://your-bucket.s3.amazonaws.com/user-id/timestamp_example.jpg?..."
}
```

**Usage Example:**
```javascript
const response = await fetch('/get-presigned-url', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${firebaseToken}`
  },
  body: JSON.stringify({
    fileName: 'my-file.jpg',
    fileType: 'image/jpeg'
  })
});

const { url } = await response.json();

// Upload file to S3 using the presigned URL
await fetch(url, {
  method: 'PUT',
  body: fileData,
  headers: {
    'Content-Type': 'image/jpeg'
  }
});
```

### List User Files

**GET** `/list-files`

Response:
```json
[
  {
    "key": "user-id/1703123456789_example.jpg",
    "url": "https://your-bucket.s3.amazonaws.com/user-id/1703123456789_example.jpg?..."
  }
]
```

**Usage Example:**
```javascript
const response = await fetch('/list-files', {
  headers: {
    'Authorization': `Bearer ${firebaseToken}`
  }
});

const files = await response.json();
console.log('User files:', files);
```

## 🏗️ Project Structure

```
backend_kinobi/
├── index.js              # Main application file
├── package.json          # Project dependencies and scripts
├── account.json          # Firebase service account (gitignored)
├── decode.txt            # Utility file
├── test-s3.js           # S3 connection testing
├── tests/               # Test directory
│   ├── app.test.js      # Application tests
│   ├── s3-connection.test.js  # S3 connection tests
│   ├── setup.js         # Test setup configuration
│   └── README.md        # Test documentation
└── README.md            # This file
```

## 🔧 Configuration Details

### AWS S3 Setup

1. Create an S3 bucket in your AWS account
2. Configure bucket permissions for your use case
3. Create an IAM user with S3 access permissions
4. Generate access keys for the IAM user

### Firebase Setup

1. Create a Firebase project
2. Enable Authentication in Firebase console
3. Generate a service account key:
   - Go to Project Settings → Service Accounts
   - Click "Generate new private key"
   - Save the JSON file securely

### Security Features

- **User Isolation**: Files are stored with user ID prefixes
- **Token Verification**: All requests verify Firebase ID tokens
- **Temporary URLs**: Presigned URLs expire after 1 minute (uploads) or 5 minutes (downloads)
- **CORS Protection**: Configurable cross-origin settings

## 🧪 Testing

The project includes comprehensive tests for:

- Authentication middleware
- S3 connection and operations
- API endpoint functionality
- Error handling

Test files are located in the `tests/` directory and use Jest with Supertest for API testing.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

ISC License

## 🛡️ Security Considerations

- Keep your `.env` file secure and never commit it to version control
- Regularly rotate your AWS access keys
- Monitor S3 bucket access and costs
- Implement rate limiting for production deployments
- Consider implementing file type and size restrictions

## 📞 Support

For issues and questions, please create an issue in the repository or contact the development team.