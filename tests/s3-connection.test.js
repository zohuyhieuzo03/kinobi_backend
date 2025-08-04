// Mock AWS S3 before requiring it
const mockListObjectsPromise = jest.fn();
const mockS3Instance = {
  listObjectsV2: jest.fn(() => ({
    promise: mockListObjectsPromise
  }))
};

jest.mock('aws-sdk', () => ({
  S3: jest.fn(() => mockS3Instance)
}));

const AWS = require('aws-sdk');

describe('S3 Connection Tests', () => {
  let s3;
  let bucket;

  beforeEach(() => {
    jest.clearAllMocks();
    s3 = new AWS.S3({
      accessKeyId: 'test-access-key',
      secretAccessKey: 'test-secret-key',
      region: 'ap-southeast-1'
    });
    bucket = 'test-bucket';
  });

  test('should connect to S3 and list objects successfully', async () => {
    const mockContents = [
      { Key: 'uploads/user1/file1.jpg' },
      { Key: 'uploads/user1/file2.pdf' },
      { Key: 'uploads/user2/file3.png' },
      { Key: 'uploads/user2/file4.doc' },
      { Key: 'uploads/user3/file5.txt' }
    ];

    mockListObjectsPromise.mockResolvedValue({
      Contents: mockContents
    });

    const result = await s3.listObjectsV2({ Bucket: bucket, MaxKeys: 5 }).promise();
    
    expect(mockS3Instance.listObjectsV2).toHaveBeenCalledWith({ 
      Bucket: bucket, 
      MaxKeys: 5 
    });
    expect(result.Contents).toEqual(mockContents);
    expect(result.Contents).toHaveLength(5);
  });

  test('should handle S3 connection errors', async () => {
    const errorMessage = 'Access Denied';
    mockListObjectsPromise.mockRejectedValue(new Error(errorMessage));

    await expect(
      s3.listObjectsV2({ Bucket: bucket, MaxKeys: 5 }).promise()
    ).rejects.toThrow(errorMessage);

    expect(mockS3Instance.listObjectsV2).toHaveBeenCalledWith({ 
      Bucket: bucket, 
      MaxKeys: 5 
    });
  });

  test('should handle empty bucket', async () => {
    mockListObjectsPromise.mockResolvedValue({
      Contents: []
    });

    const result = await s3.listObjectsV2({ Bucket: bucket, MaxKeys: 5 }).promise();
    
    expect(result.Contents).toEqual([]);
    expect(result.Contents).toHaveLength(0);
  });

  test('should handle invalid bucket name', async () => {
    const errorMessage = 'The specified bucket does not exist';
    mockListObjectsPromise.mockRejectedValue(new Error(errorMessage));

    await expect(
      s3.listObjectsV2({ Bucket: 'invalid-bucket', MaxKeys: 5 }).promise()
    ).rejects.toThrow(errorMessage);
  });
}); 