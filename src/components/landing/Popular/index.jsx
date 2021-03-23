import {
  CardPost,
  Container,
  CustomButton,
  Row,
  Subtitle,
} from 'components/common'
import { graphql, Link, useStaticQuery } from 'gatsby'
import React from 'react'
import { Center, Wrapper } from './styles.js'

export const Popular = () => {
  const {
    popular: { edges },
  } = useStaticQuery(graphql`
    query {
      popular: allMdx(
        sort: { order: DESC, fields: [frontmatter___date] }
        filter: { frontmatter: { popular: { eq: true }}, fileAbsolutePath: {regex: "/blog/"}}
        limit: 5
      ) {
        edges {
          node {
            summary: excerpt(pruneLength: 230)
            id
            timeToRead
            fields {
              slug
            }
            frontmatter {
              title
              description
              date(formatString: "MMM DD, YYYY")
              tags
              thumbnail {
                childImageSharp {
                  ...imageFields
                }
              }
            }
          }
        }
      }
    }
  `)

  return (
    <Wrapper as={Container}>
      <Subtitle>Popular Articles</Subtitle>
      <Row landing>
        {edges.map(
          ({
            node: {
              id,
              summary,
              timeToRead,
              fields: { slug },
              frontmatter: { title, description, date, thumbnail, tags },
            },
          }) => (
            <CardPost
              landing
              key={id}
              description={description || summary}
              timeToRead={timeToRead}
              title={title}
              date={date}
              path={slug}
              thumbnail={thumbnail}
              tags={tags}
            />
          )
        )}
      </Row>
      <Center>
        <CustomButton>
          <Link to="/blog/">See more</Link>
        </CustomButton>
      </Center>
    </Wrapper>
  )
}
