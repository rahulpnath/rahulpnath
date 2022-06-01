import Thumbnail from 'assets/me.jpg'
import {
  address,
  author,
  contact,
  defaultDescription,
  defaultTitle,
  foundingDate,
  legalName,
  logo,
  social,
  socialLinks,
  url,
} from 'data/config'
import React from 'react'
import Helmet from 'react-helmet'

export const SEO = ({
  title,
  type,
  description,
  datePublished,
  dateModified,
  cover,
  location = '',
  readTime,
}) => {
  const structuredDataArticle = `{
		"@context": "http://schema.org",
		"@type": "${type}",
		"headline": ${JSON.stringify(title)},
		"image": "${
      cover
        ? `https://www.rahulpnath.com${cover}`
        : `https://www.rahulpnath.com${Thumbnail}`
    }",
		"datePublished": "${datePublished}",
    "dateModified": "${dateModified}",
    "publisher": {
      "@type": "Organization",
      "name": "Rahul Nath",
      "logo":{
         "@type":"ImageObject",
          "url": "https://www.rahulpnath.com/favicon/logo-48.png"
          }
    },
		"author": {
			"@type": "Person",
			"name": "${author}"
		},
		"description": ${JSON.stringify(description)},
    "url": "${url}${location}",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "${url}${location}"
   }
	}`

  const structuredDataOrganization = `{
		"@context": "http://schema.org",
		"@type": "${type}",
		"legalName": "${legalName}",
		"url": "${url}",
		"logo": "${logo}",
		"foundingDate": "${foundingDate}",
		"founders": [{
			"@type": "Person",
			"name": "${legalName}"
		}],
		"contactPoint": [{
			"@type": "ContactPoint",
			"email": "${contact.email}",
			"telephone": "${contact.phone}",
			"contactType": "customer service"
		}],
		"address": {
			"@type": "PostalAddress",
			"addressLocality": "${address.city}",
			"addressRegion": "${address.region}",
			"addressCountry": "${address.country}",
			"postalCode": "${address.zipCode}"
		},
		"sameAs": [
			"${socialLinks.twitter}",
			"${socialLinks.google}",
			"${socialLinks.youtube}",
			"${socialLinks.linkedin}",
			"${socialLinks.instagram}",
			"${socialLinks.github}"
		]
    }`

  return (
    <Helmet>
      <meta name="description" content={description || defaultDescription} />
      <meta
        name="image"
        content={cover ? `${url}${cover}` : `${url}${Thumbnail}`}
      />

      <meta
        property="og:url"
        content={`${url}${location}/?ref=rahulpnath.com`}
      />
      <meta
        property="og:type"
        content={type === 'BlogPosting' ? 'blog' : 'website'}
      />
      <meta
        property="og:title"
        content={title ? `${title} | Rahul Nath` : defaultTitle}
      />
      <meta
        property="og:description"
        content={description || defaultDescription}
      />
      <meta
        property="og:image"
        content={cover ? `${url}${cover}` : `${url}${Thumbnail}`}
      />
      <meta property="fb:app_id" content={social.facebook} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:creator" content={socialLinks.twitter} />
      <meta name="twitter:site" content={social.twitter} />
      <meta
        name="twitter:title"
        content={title ? `${title} | Rahul Nath` : defaultTitle}
      />
      <meta
        name="twitter:description"
        content={description || defaultDescription}
      />
      <meta
        name="twitter:image:src"
        content={cover ? `${url}${cover}` : `${url}${Thumbnail}`}
      />
      <meta name="p:domain_verify" content="8b98c12d91967ce1fde7230da80b3d2b" />
      <script type="application/ld+json">
        {type === 'BlogPosting'
          ? structuredDataArticle
          : structuredDataOrganization}
      </script>
      <link rel="publisher" href={socialLinks.google} />
      <title>{title ? `${title} | Rahul Nath` : defaultTitle}</title>
      {type === 'BlogPosting' && (
        <meta name="twitter:label1" value="Reading time" />
      )}
      {type === 'BlogPosting' && (
        <meta name="twitter:data1" value={`${readTime} min read`} />
      )}
      {type === 'BlogPosting' && (
        <meta name="author" content="Rahul Nath" data-react-helmet="true" />
      )}
      {type === 'BlogPosting' && (
        <meta
          name="article:published_time"
          content={datePublished}
          data-react-helmet="true"
        />
      )}
      {type === 'BlogPosting' && (
        <meta
          name="article:modified_time"
          content={dateModified}
          data-react-helmet="true"
        />
      )}
      {type === 'BlogPosting' && (
        <meta name="monetization" content="$ilp.uphold.com/LkiUJERNhFEK"></meta>
      )}
      <html lang="en" dir="ltr" />
    </Helmet>
  )
}
