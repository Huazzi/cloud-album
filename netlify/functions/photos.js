// Function to list all photos from B2 storage
import B2 from 'backblaze-b2'
import jwt from 'jsonwebtoken'

// B2 credentials from environment variables
const B2_APPLICATION_KEY_ID = process.env.B2_APPLICATION_KEY_ID
const B2_APPLICATION_KEY = process.env.B2_APPLICATION_KEY
const B2_BUCKET_ID = process.env.B2_BUCKET_ID
const B2_BUCKET_NAME = process.env.B2_BUCKET_NAME
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here'

// Initialize B2 SDK
const b2 = new B2({
  applicationKeyId: B2_APPLICATION_KEY_ID,
  applicationKey: B2_APPLICATION_KEY,
})

export async function handler(event, context) {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
  }
  
  // Handle OPTIONS request for CORS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'CORS preflight response' }),
    }
  }
  
  // Only allow GET requests
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ message: 'Method Not Allowed' }),
    }
  }
  
  try {
    // Verify authentication token
    const authHeader = event.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ message: 'Unauthorized: Missing or invalid token' }),
      }
    }
    
    const token = authHeader.split(' ')[1]
    
    try {
      jwt.verify(token, JWT_SECRET)
    } catch (error) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ message: 'Unauthorized: Invalid token' }),
      }
    }
    
    // Authenticate with B2
    const authResponse = await b2.authorize()
    
    // Get the download URL from the auth response
    const downloadUrl = authResponse.data.downloadUrl
    
    // List all files in the bucket
    const response = await b2.listFileNames({
      bucketId: B2_BUCKET_ID,
      maxFileCount: 1000, // Adjust as needed
    })
    
    // Format the response
    const photos = response.data.files.map(file => {
      // Create thumbnail and full URLs
      const fileUrl = `${downloadUrl}/b2api/v2/b2_download_file_by_id?fileId=${file.fileId}`
      
      return {
        id: file.fileId,
        fileName: file.fileName,
        fileSize: file.contentLength,
        uploadDate: file.uploadTimestamp,
        contentType: file.contentType,
        url: fileUrl,
        thumbnailUrl: fileUrl, // In a real app, you might have a thumbnail version
        metadata: {}
      }
    })
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(photos),
    }
  } catch (error) {
    console.error('Error listing photos:', error)
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: 'Internal Server Error', error: error.message }),
    }
  }
}