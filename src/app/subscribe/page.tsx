'use client'

import { Metadata } from 'next'
import { useState } from 'react'

export default function SubscribePage() {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, name }),
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setStatus('success')
        setMessage('Thank you for subscribing!')
        setEmail('')
        setName('')
      } else {
        setStatus('error')
        setMessage(data.error || 'Something went wrong')
      }
    } catch (error) {
      setStatus('error')
      setMessage('Failed to subscribe. Please try again.')
    }
  }
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Subscribe to My Newsletter</h1>
      
      <div className="prose prose-lg">
        <p>
          Stay updated with my latest blog posts, tutorials, and insights on AWS, 
          .NET, software development, and more. I share practical tips and real-world 
          experiences that can help you in your development journey.
        </p>
        
        <div className="bg-gray-50 p-6 rounded-lg my-8">
          <h2 className="text-xl font-semibold mb-4">What you'll get:</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Weekly updates on new blog posts</li>
            <li>Exclusive tips and tutorials</li>
            <li>Early access to new content</li>
            <li>Behind-the-scenes insights</li>
          </ul>
        </div>

        {/* Newsletter Signup Form */}
        <div className="border border-gray-200 rounded-lg p-6 my-8">
          <h3 className="text-lg font-semibold mb-4">Subscribe Now</h3>
          
          {/* You can replace this with your preferred newsletter service */}
          {/* Examples: Mailchimp, ConvertKit, Substack, etc. */}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="your@email.com"
              />
            </div>
            
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Name (Optional)
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Your Name"
              />
            </div>
            
            {status === 'success' && (
              <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded-md">
                {message}
              </div>
            )}
            
            {status === 'error' && (
              <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
                {message}
              </div>
            )}
            
            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === 'loading' ? 'Subscribing...' : 'Subscribe to Newsletter'}
            </button>
          </form>
          
          <p className="text-xs text-gray-500 mt-4">
            I respect your privacy. Unsubscribe at any time.
          </p>
        </div>

        {/* Alternative: Embed from Newsletter Service */}
        {/* Uncomment and customize based on your newsletter service */}
        {/*
        <div className="my-8">
          <h3 className="text-lg font-semibold mb-4">Or subscribe via:</h3>
          
          <!-- Mailchimp Example -->
          <div id="mc_embed_signup">
            <form action="YOUR_MAILCHIMP_ACTION_URL" method="post" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" className="validate" target="_blank" noValidate>
              <div id="mc_embed_signup_scroll">
                <div className="mc-field-group">
                  <input type="email" name="EMAIL" className="required email w-full px-3 py-2 border border-gray-300 rounded-md" id="mce-EMAIL" placeholder="Email Address" required />
                </div>
                <div id="mce-responses" className="clear">
                  <div className="response" id="mce-error-response" style={{display:'none'}}></div>
                  <div className="response" id="mce-success-response" style={{display:'none'}}></div>
                </div>
                <div style={{position: 'absolute', left: '-5000px'}} aria-hidden="true">
                  <input type="text" name="b_YOUR_BOT_PROTECTION_CODE" tabIndex={-1} value="" />
                </div>
                <div className="clear">
                  <input type="submit" value="Subscribe" name="subscribe" id="mc-embedded-subscribe" className="bg-primary-500 text-white py-2 px-4 rounded-md hover:bg-primary-600 focus:bg-primary-700 active:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 transition-colors duration-200" />
                </div>
              </div>
            </form>
          </div>
        */}
        
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Want to browse my content instead?{' '}
            <a href="/blog" className="text-blue-600 hover:text-blue-800">
              Check out all blog posts
            </a>{' '}
            or{' '}
            <a href="/archives" className="text-blue-600 hover:text-blue-800">
              browse the archives
            </a>.
          </p>
        </div>
      </div>
    </div>
  )
}
