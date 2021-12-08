import { ArchivePost, Container, Layout, PageTitle, Row, SEO, Subtitle } from 'components/common';
import React from 'react';

export default ({ pageContext : { allPosts } }) => {

  const postsPerMonth = allPosts.reduce((result, current) => {
    const groupKey = new Date(current.node.frontmatter.date)
      .toLocaleDateString(undefined, {'month': 'long', year: 'numeric' });
    (result[groupKey] = result[groupKey] || []).push(current);
    return result;
  }, {});


  return (
    <Layout>
      <Container>
        <SEO title="Archives" type="Organization" location="/archives" />
        <Row>
          <PageTitle>{'Archives'}</PageTitle>
          <div>
          {
            Object.keys(postsPerMonth).map(groupKey => {
              const postsForMonth = postsPerMonth[groupKey]
              return (
                <div>
                    <Subtitle>{groupKey}</Subtitle>
                    {postsForMonth.map(({
                  node: {
                    id,
                    timeToRead,
                    fields : {slug},
                    frontmatter: { title, date, tags },
                  },
                }) => (
              <ArchivePost
                key={id}
                title={title}
                path={slug}
                tags={tags}
                date={date}
                timeToRead={timeToRead}
              />
            )
          )}
                </div>)
            })
          }
          </div>
        </Row>
      </Container>
    </Layout>
  )
}
