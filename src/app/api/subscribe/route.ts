import { NextRequest, NextResponse } from 'next/server'

// Rate limiting map (in production, use Redis or similar)
const rateLimitMap = new Map<string, { count: number; timestamp: number }>()

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Content validation function
function validateInput(input: string): boolean {
  // Check for basic XSS patterns
  const xssPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i,
    /<iframe/i,
    /<object/i,
    /<embed/i,
    /data:text\/html/i
  ]
  
  return !xssPatterns.some(pattern => pattern.test(input))
}

// Rate limiting function
function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const windowMs = 15 * 60 * 1000 // 15 minutes
  const maxRequests = 5 // Max 5 requests per 15 minutes
  
  const userLimit = rateLimitMap.get(ip)
  
  if (!userLimit) {
    rateLimitMap.set(ip, { count: 1, timestamp: now })
    return false
  }
  
  // Reset window if expired
  if (now - userLimit.timestamp > windowMs) {
    rateLimitMap.set(ip, { count: 1, timestamp: now })
    return false
  }
  
  // Check if limit exceeded
  if (userLimit.count >= maxRequests) {
    return true
  }
  
  // Increment count
  userLimit.count++
  return false
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip = request.headers.get('x-forwarded-for') || 
              request.headers.get('x-real-ip') || 
              'unknown'
    
    // Rate limiting
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many subscription attempts. Please try again later.' },
        { status: 429 }
      )
    }
    
    const body = await request.json()
    const { email, name } = body
    
    // Validate email format
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Valid email address is required' },
        { status: 400 }
      )
    }
    
    // Validate email length
    if (email.length > 320) { // RFC 5321 limit
      return NextResponse.json(
        { error: 'Email address is too long' },
        { status: 400 }
      )
    }
    
    // Validate name if provided
    if (name && (typeof name !== 'string' || name.length > 100)) {
      return NextResponse.json(
        { error: 'Name must be a string and less than 100 characters' },
        { status: 400 }
      )
    }
    
    // Validate for XSS attempts
    if (!validateInput(email) || (name && !validateInput(name))) {
      return NextResponse.json(
        { error: 'Invalid input detected' },
        { status: 400 }
      )
    }
    
    // Check for suspicious patterns (common spam emails)
    const suspiciousPatterns = [
      /test@test\.com/i,
      /admin@admin\.com/i,
      /noreply@/i,
      /abuse@/i,
      /postmaster@/i
    ]
    
    if (suspiciousPatterns.some(pattern => pattern.test(email))) {
      return NextResponse.json(
        { error: 'Please use a valid email address' },
        { status: 400 }
      )
    }
    
    // Here you would integrate with your newsletter service API
    // Examples:
    
    // Mailchimp API integration
    // const response = await fetch(`https://${datacenter}.api.mailchimp.com/3.0/lists/${listId}/members`, {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `apikey ${process.env.MAILCHIMP_API_KEY}`,
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     email_address: email,
    //     status: 'subscribed',
    //     merge_fields: {
    //       FNAME: name || '',
    //     },
    //   }),
    // })
    
    // ConvertKit API integration
    // const response = await fetch(`https://api.convertkit.com/v3/forms/${formId}/subscribe`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     api_key: process.env.CONVERTKIT_API_KEY,
    //     email: email,
    //     first_name: name || '',
    //   }),
    // })
    
    // For now, just log the subscription (replace with actual integration)
    console.log('New subscription:', { email, name })
    
    // You might want to store in a database or send to your newsletter service
    
    return NextResponse.json(
      { message: 'Successfully subscribed!' },
      { status: 200 }
    )
    
  } catch (error) {
    console.error('Subscription error:', error)
    return NextResponse.json(
      { error: 'Failed to subscribe. Please try again.' },
      { status: 500 }
    )
  }
}
