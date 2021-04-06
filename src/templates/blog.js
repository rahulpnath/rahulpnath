import { CardPost, Container, Layout, PageTitle, Pagination, Row, SEO } from 'components/common'
import React from 'react'

export default ({ pageContext }) => {
  const { group, index, pageCount, pathPrefix, title } = pageContext
  const previousUrl = index - 1 === 1 ? '/' : (index - 1).toString()
  const nextUrl = (index + 1).toString()

  return (
    <Layout>
      <Container>
        <SEO title="Blog" type="Organization" location="/blog" />
        <Row>
          <PageTitle>{title || 'Recent Articles'}</PageTitle>
          {group.map(
            ({
              node: {
                id,
                summary,
                fields : {slug},
                frontmatter: { title, description,  thumbnail },
              },
            }) => (
              <CardPost
                key={id}
                description={description || summary}
                title={title}
                path={slug}
                thumbnail={thumbnail}
              />
            )
          )}
          <Pagination
            pathPrefix={pathPrefix}
            index={index}
            pageCount={pageCount}
            previousUrl={previousUrl}
            nextUrl={nextUrl}
          />
        </Row>
      </Container>
    </Layout>
  )
}
