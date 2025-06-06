// Function to delete multiple photos from B2 storage
import B2 from 'backblaze-b2'
import jwt from 'jsonwebtoken'

// B2 credentials from environment variables
const B2_APPLICATION_KEY_ID = process.env.B2_APPLICATION_KEY_ID
const B2_APPLICATION_KEY = process.env.B2_APPLICATION_KEY
const B2_BUCKET_ID = process.env.B2_BUCKET_ID
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
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  }
  
  // Handle OPTIONS request for CORS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'CORS preflight response' }),
    }
  }
  
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
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
    
    // Parse request body to get file IDs
    const { ids } = JSON.parse(event.body)
    
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: 'Invalid or missing file IDs' }),
      }
    }
    
    // Authenticate with B2
    await b2.authorize()
    
    // Delete each file
    const results = []
    const errors = []
    
    for (const fileId of ids) {
      try {
        // Get file info to retrieve file name
        const fileInfoResponse = await b2.getFileInfo({
          fileId: fileId
        })
        
        const fileName = fileInfoResponse.data.fileName
        
        // Delete the file
        await b2.deleteFileVersion({
          fileId: fileId,
          fileName: fileName
        })
        
        results.push({ fileId, success: true })
      } catch (error) {
        console.error(`Error deleting file ${fileId}:`, error)
        errors.push({ fileId, error: error.message })
        results.push({ fileId, success: false })
      }
    }
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        message: 'Files processed',
        results,
        errors: errors.length > 0 ? errors : undefined
      }),
    }
  } catch (error) {
    console.error('Error deleting files:', error)
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: 'Internal Server Error', error: error.message }),
    }
  }
}