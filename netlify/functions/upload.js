// Function to upload photos to B2 storage
import B2 from 'backblaze-b2'
import jwt from 'jsonwebtoken'
import Busboy from 'busboy'
import fs from 'fs'
import mime from 'mime-types'
import { v4 as uuidv4 } from 'uuid'
import { Readable } from 'stream'
import { promisify } from 'util'
import path from 'path'
import os from 'os'

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

// List of allowed image MIME types
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml'
]

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
    
    // Parse the multipart form data using busboy
    const contentType = event.headers['content-type'] || event.headers['Content-Type']
    if (!contentType || !contentType.includes('multipart/form-data')) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: 'Invalid content type. Expected multipart/form-data' }),
      }
    }
    
    // Create a readable stream from the body
    const bodyBuffer = Buffer.from(event.body, event.isBase64Encoded ? 'base64' : 'utf8')
    const bodyStream = new Readable()
    bodyStream.push(bodyBuffer)
    bodyStream.push(null)
    
    // Parse form data with busboy
    const formData = await parseMultipartForm(bodyStream, contentType)
    
    if (!formData.file) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: 'No file uploaded' }),
      }
    }
    
    const file = formData.file
    
    // Validate file type
    const contentTypeFile = mime.lookup(file.filename) || file.mimeType
    if (!ALLOWED_MIME_TYPES.includes(contentTypeFile)) {
      // Clean up temporary file
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path)
      }
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: 'Invalid file type. Only image files are allowed.' }),
      }
    }
    
    // Authenticate with B2
    await b2.authorize()
    
    // Read the file
    const fileData = fs.readFileSync(file.path)
    
    // Generate a unique filename
    // const uniqueFileName = `${uuidv4()}-${file.filename}`
    const uniqueFileName = file.filename
    
    // Get upload URL and auth token
    const uploadUrlResponse = await b2.getUploadUrl({
      bucketId: B2_BUCKET_ID
    })
    
    // Upload the file to B2
    const uploadResponse = await b2.uploadFile({
      uploadUrl: uploadUrlResponse.data.uploadUrl,
      uploadAuthToken: uploadUrlResponse.data.authorizationToken,
      fileName: uniqueFileName,
      contentType: contentTypeFile,
      data: fileData
    })
    
    // Get download URL base
    const downloadUrlResponse = await b2.getDownloadAuthorization({
      bucketId: B2_BUCKET_ID,
      fileNamePrefix: '',
      validDurationInSeconds: 86400, // 24 hours
    })
    
    const downloadUrl = downloadUrlResponse.data.downloadUrl
    const fileUrl = `${downloadUrl}/file/${B2_BUCKET_NAME}/${encodeURIComponent(uniqueFileName)}`
    
    // Clean up temporary file
    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path)
    }
    
    // Return the uploaded file info
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        id: uploadResponse.data.fileId,
        fileName: uniqueFileName,
        fileSize: file.size,
        uploadDate: new Date().toISOString(),
        contentType: contentTypeFile,
        url: fileUrl,
        thumbnailUrl: fileUrl, // In a real app, you might generate a thumbnail
      }),
    }
  } catch (error) {
    console.error('Error uploading file:', error)
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: 'Internal Server Error', error: error.message }),
    }
  }
}

// Helper function to parse multipart form data
function parseMultipartForm(stream, contentType) {
  return new Promise((resolve, reject) => {
    const busboy = Busboy({ headers: { 'content-type': contentType } })
    const result = {}
    
    busboy.on('file', (fieldname, file, info) => {
      const { filename, encoding, mimeType } = info
      
      // Create temporary file path
      const tempPath = path.join(os.tmpdir(), `upload-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`)
      const writeStream = fs.createWriteStream(tempPath)
      
      let size = 0
      
      file.on('data', (data) => {
        size += data.length
        writeStream.write(data)
      })
      
      file.on('end', () => {
        writeStream.end()
        result.file = {
          filename,
          encoding,
          mimeType,
          path: tempPath,
          size
        }
      })
    })
    
    busboy.on('field', (fieldname, value) => {
      result[fieldname] = value
    })
    
    busboy.on('finish', () => {
      resolve(result)
    })
    
    busboy.on('error', (err) => {
      reject(err)
    })
    
    stream.pipe(busboy)
  })
}