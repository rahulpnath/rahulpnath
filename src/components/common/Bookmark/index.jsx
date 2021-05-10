import { graphql, Link, useStaticQuery } from 'gatsby'
import Img from 'gatsby-image'
import { ThemeContext } from 'providers/ThemeProvider'
import React, { useContext } from 'react'
import {
  ArticleContent,
  ArticleImg,
  ArticleTitle,
  Item,
  Paragraph,
  Post
} from './styles'

export const Bookmark = ({ slug, title, description }) => {
  const { theme } = useContext(ThemeContext)
  const { posts } = useStaticQuery(graphql`
    query {
      posts: allMdx(filter: { fileAbsolutePath: { regex: "//blog//" } }) {
        edges {
          node {
            id
            summary: excerpt(pruneLength: 260)
            fields {
              slug
            }
            frontmatter {
              originalTitle: title
              originalDescription: description
              thumbnail {
                childImageSharp {
                  fluid {
                    aspectRatio
                    base64
                    originalImg
                    originalName
                    presentationHeight
                    presentationWidth
                    sizes
                    src
                    srcSet
                    srcSetWebp
                    srcWebp
                    tracedSVG
                  }
                }
              }
            }
          }
        }
      }
    }
  `)
  const path = `/blog/${slug}/`
  const {
    node: {
      summary,
      frontmatter: { originalTitle, originalDescription, thumbnail },
    },
  } = posts.edges.find(p => p.node.fields.slug === path)

  const linkPath = `${path}?utm_source=site-bookmark`
  return (
    <Link to={linkPath}>
      <Item>
        <Post theme={theme}>
          <ArticleImg>
            {thumbnail && thumbnail.childImageSharp && (
              <Img fluid={thumbnail.childImageSharp.fluid} />
            )}
          </ArticleImg>
          <ArticleContent>
            <ArticleTitle theme={theme}>{title || originalTitle}</ArticleTitle>
            <Paragraph theme={theme} path={linkPath}>
              {description || originalDescription || summary}
            </Paragraph>
          </ArticleContent>
        </Post>
      </Item>
    </Link>
  )
}
