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
    <div className="min-h-screen bg-theme-bg text-theme-text">
      {/* Skip to main content link */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium z-50 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2"
      >
        Skip to main content
      </a>
      
      <main 
        id="main-content" 
        className="max-w-2xl mx-auto px-4 py-8" 
        role="main" 
        aria-labelledby="page-title"
      >
        <header>
          <h1 id="page-title" className="text-3xl font-bold mb-6 text-theme-text-high-contrast">Subscribe to My Newsletter</h1>
        </header>
      
        <div className="prose prose-lg max-w-none">
          <p className="text-theme-text-secondary text-lg leading-relaxed">
            Stay updated with my latest blog posts, tutorials, and insights on AWS, 
            .NET, software development, and more. I share practical tips and real-world 
            experiences that can help you in your development journey.
          </p>
        
          <section className="bg-theme-bg-card p-6 rounded-lg my-8 border border-theme-border-muted" aria-labelledby="benefits-heading">
            <h2 id="benefits-heading" className="text-xl font-semibold mb-4 text-theme-text-high-contrast">What you'll get:</h2>
            <ul className="list-disc pl-6 space-y-2 text-theme-text-secondary" role="list">
              <li role="listitem">Weekly updates on new blog posts</li>
              <li role="listitem">Exclusive tips and tutorials</li>
              <li role="listitem">Early access to new content</li>
              <li role="listitem">Behind-the-scenes insights</li>
            </ul>
          </section>

          {/* Newsletter Signup Form */}
          <section className="border border-theme-border-muted rounded-lg p-6 my-8" aria-labelledby="subscription-form">
            <h3 id="subscription-form" className="text-lg font-semibold mb-4 text-theme-text-high-contrast">Subscribe Now</h3>
          
          {/* You can replace this with your preferred newsletter service */}
          {/* Examples: Mailchimp, ConvertKit, Substack, etc. */}
          
            <form onSubmit={handleSubmit} className="space-y-4" role="form" aria-labelledby="subscription-form">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-theme-text mb-2">
                  Email Address
                  <span className="sr-only"> (required)</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-theme-border-muted rounded-md bg-theme-bg text-theme-text focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="your@email.com"
                  aria-describedby="email-help"
                />
                <div id="email-help" className="sr-only">
                  Enter your email address to receive newsletter updates
                </div>
              </div>
            
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-theme-text mb-2">
                  Name (Optional)
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-theme-border-muted rounded-md bg-theme-bg text-theme-text focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Your Name"
                  aria-describedby="name-help"
                />
                <div id="name-help" className="sr-only">
                  Optional: Enter your name for personalized newsletter content
                </div>
              </div>
            
              {status === 'success' && (
                <div 
                  className="p-3 bg-green-100 border border-green-400 text-green-700 rounded-md" 
                  role="status" 
                  aria-live="polite"
                  aria-describedby="success-message"
                >
                  <span id="success-message">{message}</span>
                </div>
              )}
              
              {status === 'error' && (
                <div 
                  className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-md" 
                  role="alert" 
                  aria-live="assertive"
                  aria-describedby="error-message"
                >
                  <span id="error-message">{message}</span>
                </div>
              )}
            
              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-describedby="submit-help"
              >
                {status === 'loading' ? 'Subscribing...' : 'Subscribe to Newsletter'}
              </button>
              <div id="submit-help" className="sr-only">
                {status === 'loading' ? 'Processing your subscription request' : 'Click to subscribe to the newsletter'}
              </div>
            </form>
          
            <p className="text-xs text-theme-text-light mt-4">
              I respect your privacy. Unsubscribe at any time.
            </p>
          </section>

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
                  <input type="email" name="EMAIL" className="required email w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 rounded-md" id="mce-EMAIL" placeholder="Email Address" required />
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
        
          <nav className="mt-8 pt-6 border-t border-theme-border-light" aria-label="Alternative content options">
            <p className="text-sm text-theme-text-secondary">
              Want to browse my content instead?{' '}
              <a 
                href="/blog" 
                className="text-primary-600 hover:text-primary-800 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 rounded"
                aria-label="Browse all blog posts"
              >
                Check out all blog posts
              </a>{' '}
              or{' '}
              <a 
                href="/archives" 
                className="text-primary-600 hover:text-primary-800 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 rounded"
                aria-label="Browse content archives"
              >
                browse the archives
              </a>.
            </p>
          </nav>
        </div>
      </main>
    </div>
  )
}
