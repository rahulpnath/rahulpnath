import { CardPost, Container, Layout, PageTitle, Row, SEO } from 'components/common'
import { graphql } from 'gatsby'
import React from 'react'

export default ({ data: { posts }, pageContext: {tag, slug } }) => (
  <Layout>
    <Container>
      <SEO type="Organization" title={tag} location={`/${slug}`} />
      <Row>
        <PageTitle>Articles related to {tag}</PageTitle>
        {posts.edges.map(
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
    </Container>
  </Layout>
)

export const postQuery = graphql`
  query($tag: String!) {
    posts: allMdx(
      filter: { frontmatter: { tags: { in: [$tag] } }, fileAbsolutePath: {regex: "/blog/"}}
      sort: { order: DESC, fields: [frontmatter___date] }
      limit: 200
    ) {
      edges {
        node {
          summary: excerpt(pruneLength: 260)
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
`
