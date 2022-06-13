import { Layout, Post, SEO, SmallerContainer } from 'components/common'
import { graphql } from 'gatsby'
import React from 'react'
import './highlight.css'

export default ({ data: { post } }) => (
  <Layout>
    <SmallerContainer>
      <SEO
        type="BlogPosting"
        title={post.frontmatter.title}
        articleBody={post.description}
        datePublished={post.frontmatter.normalDate}
        dateModified={
          post.frontmatter.edited
            ? post.frontmatter.edited
            : post.frontmatter.normalDate
        }
        cover={
          post.frontmatter.thumbnail &&
          post.frontmatter.thumbnail.childImageSharp &&
          post.frontmatter.thumbnail.childImageSharp.fluid.originalImg
        }
        location={post.fields.slug}
        description={post.frontmatter.description || post.summary}
        readTime={post.timeToRead}
      />
      <Post {...post} />
    </SmallerContainer>
  </Layout>
)

export const postQuery = graphql`
  query($path: String!) {
    post: mdx(fields: { slug: { eq: $path } }) {
      body
      summary: excerpt(pruneLength: 155)  
      timeToRead
      fields {
        slug
      }
      frontmatter {
        normalDate: date
        description
        date(formatString: "MMMM DD, YYYY")
        edited(formatString: "MMMM DD, YYYY")
        title
        tags
        thumbnail {
          childImageSharp {
            fluid(maxWidth: 700) {
              originalImg
            }
          }
        }
      }
    }
  }
`
