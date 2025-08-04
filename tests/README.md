# Test Suite Documentation

## Overview
This test suite covers all the functions and endpoints in the backend application. The tests are organized into separate files for better maintainability and clarity.

## Test Structure

### 1. `setup.js`
- Configures the test environment
- Mocks external dependencies (Firebase Admin, AWS SDK)
- Sets up test environment variables

### 2. `auth.test.js`
Tests for the authentication middleware (`authenticateToken`):
- Missing authorization header
- Invalid authorization format
- Invalid Firebase tokens
- Valid token authentication

### 3. `presigned-url.test.js`
Tests for the `/get-presigned-url` endpoint:
- Successful pre-signed URL generation
- Missing required parameters
- S3 error handling
- Unique key generation
- Different file types

### 4. `list-files.test.js`
Tests for the `/list-files` endpoint:
- Successful file listing
- Empty file list
- S3 error handling
- User folder isolation
- URL generation
- Special characters in filenames

### 5. `delete-file.test.js`
Tests for the `/delete-file/:key` endpoint:
- Successful file deletion
- Access control (user can only delete their own files)
- S3 error handling
- Special characters in filenames
- URL-encoded characters
- Nested folder structures

### 6. `integration.test.js`
Integration tests covering complete workflows:
- Complete file lifecycle (upload → list → delete)
- Multi-user scenarios
- Concurrent operations
- Error scenarios
- Authentication consistency

## Running Tests

### Install Dependencies
```bash
npm install
```

### Run All Tests
```bash
npm test
```

### Run Tests in Watch Mode
```bash
npm run test:watch
```

### Run Tests with Coverage
```bash
npm run test:coverage
```

### Run Specific Test Files
```bash
# Run only authentication tests
npm test auth.test.js

# Run only integration tests
npm test integration.test.js

# Run multiple test files
npm test auth.test.js presigned-url.test.js
```

## Test Coverage

The test suite covers:

### Authentication
- ✅ Token validation
- ✅ Authorization header parsing
- ✅ Firebase token verification
- ✅ Error handling

### File Upload
- ✅ Pre-signed URL generation
- ✅ Parameter validation
- ✅ S3 integration
- ✅ Unique file naming

### File Listing
- ✅ User-specific file listing
- ✅ S3 bucket integration
- ✅ URL generation
- ✅ Error handling

### File Deletion
- ✅ Access control
- ✅ S3 object deletion
- ✅ Security validation
- ✅ Error handling

### Integration
- ✅ Complete workflows
- ✅ Multi-user scenarios
- ✅ Concurrent operations
- ✅ Error scenarios

## Mocking Strategy

### Firebase Admin
- Mocks `verifyIdToken` for authentication testing
- Allows testing different user scenarios

### AWS SDK
- Mocks S3 operations (`getSignedUrlPromise`, `listObjectsV2`, `deleteObject`)
- Simulates success and error scenarios
- Tests S3 parameter validation

## Best Practices

1. **Isolation**: Each test is independent and doesn't rely on other tests
2. **Mocking**: External dependencies are properly mocked
3. **Coverage**: All endpoints and error scenarios are tested
4. **Security**: Access control and authentication are thoroughly tested
5. **Edge Cases**: Special characters, missing parameters, and error conditions are covered

## Adding New Tests

When adding new functionality:

1. Create a new test file in the `tests/` directory
2. Follow the existing naming convention: `feature-name.test.js`
3. Mock external dependencies in the test setup
4. Test both success and error scenarios
5. Update this README with new test documentation 