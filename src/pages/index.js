import { Layout, SEO } from 'components/common'
import { Intro, Popular, Work } from 'components/landing'
import React from 'react'

export default () => (
  <Layout>
    <SEO title="Rahul Nath" type="Organization" />
    <Intro />
    <Work />
    <Popular />
  </Layout>
)
