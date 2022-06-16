import { Link } from 'gatsby'
import Img from 'gatsby-image'
import { ThemeContext } from 'providers/ThemeProvider'
import React, { useContext } from 'react'
import { ArticleContent, ArticleImg, ArticleTitle, Item, Paragraph, Post } from './styles'

export const CardPost = ({
  path,
  thumbnail,
  title,
  description,
  landing,
}) => {
  const { theme } = useContext(ThemeContext)

  return (
    <Link to={path}>
    <Item>
      <Post theme={theme}>
        <ArticleImg landing={landing}>
          {thumbnail && thumbnail.childImageSharp && (
            <Img
              imgStyle={{ objectFit: "fill" }}
              fluid={thumbnail.childImageSharp.fluid}
            />
          )}
        </ArticleImg>
        <ArticleContent>
          <ArticleTitle theme={theme}>
              {title}
          </ArticleTitle>
          <Paragraph
            landing={landing}
            theme={theme}
            path={path}
          >
            {description}
          </Paragraph>

       
        </ArticleContent>
      </Post>
    </Item>
    </Link>
  )
}