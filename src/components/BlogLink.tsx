'use client'

interface BlogLinkProps {
  href: string
  title?: string
  description?: string
  authorImage?: string
  authorName?: string
  authorTitle?: string
  featureImage?: string
}

export default function BlogLink({
  href,
  title = "Blog Post",
  description = "Read this interesting blog post",
  authorImage = "/images/logo-512x512-24.png",
  authorName = "Rahul Nath", 
  authorTitle = "Rahul Pulikkot Nath",
  featureImage = "/images/default-feature.jpg"
}: BlogLinkProps) {
  return (
    <figure className="kg-card kg-bookmark-card my-6">
      <a className="kg-bookmark-container" href={href}>
        <div className="kg-bookmark-content">
          <div className="kg-bookmark-title">{title}</div>
          <div className="kg-bookmark-description">{description}</div>
          <div className="kg-bookmark-metadata">
            <img 
              className="kg-bookmark-icon" 
              src={authorImage} 
              alt=""
            />
            <span className="kg-bookmark-author">{authorName}</span>
            <span className="kg-bookmark-publisher">{authorTitle}</span>
          </div>
        </div>
        <div className="kg-bookmark-thumbnail">
          <img 
            src={featureImage} 
            alt="" 
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
          />
        </div>
      </a>
    </figure>
  )
}