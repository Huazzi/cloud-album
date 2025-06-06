// Authentication function for securing the photo album
import jwt from 'jsonwebtoken'

// Set a secret key for JWT - should be in environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here'
// Set the password - should be in environment variables
const APP_PASSWORD = process.env.APP_PASSWORD || 'your-password-here'
// Set token expiration time (in seconds)
const TOKEN_EXPIRATION = 60 * 60 * 24 * 7 // 7 days

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
    // Parse the request body
    const data = JSON.parse(event.body)
    const { password } = data
    
    // Check if password matches
    if (!password || password !== APP_PASSWORD) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ message: 'Invalid password' }),
      }
    }
    
    // Generate a JWT token
    const token = jwt.sign(
      { authorized: true },
      JWT_SECRET,
      { expiresIn: TOKEN_EXPIRATION }
    )
    
    // Return the token
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        token,
        expiresIn: TOKEN_EXPIRATION,
      }),
    }
  } catch (error) {
    console.error('Authentication error:', error)
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: 'Internal Server Error' }),
    }
  }
}