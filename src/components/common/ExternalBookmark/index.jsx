import { graphql, useStaticQuery } from 'gatsby'
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

export const ExternalBookmark = ({ url, title, description, thumbnail }) => {
  const { theme } = useContext(ThemeContext)
  const { LambdaCourseImage } = useStaticQuery(graphql`
  query LambdaCourseImageQuery {
    LambdaCourseImage: imageSharp(fluid: { originalName: { eq: "aws-lambda-net-course-udemy.jpg" } }) {
      ...imageFields
    }
  }
`)
  const linkPath = `${url}?utm_source=site-bookmark`
  return (
    <a href={linkPath} target="_blank" rel="noopener noreferrer">
      <Item>
        <Post theme={theme}>
          <ArticleImg>
              <Img fluid={LambdaCourseImage.fluid} />
          </ArticleImg>
          <ArticleContent>
            <ArticleTitle theme={theme}>{title}</ArticleTitle>
            <Paragraph theme={theme} path={linkPath}>
              {description}
            </Paragraph>
          </ArticleContent>
        </Post>
      </Item>
    </a>
  )
}
