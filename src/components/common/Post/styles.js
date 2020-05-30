import styled from 'styled-components'
import { flexbox, layout, style } from 'styled-system'

export const ArticleWrapper = styled.div`
  color: #212121;
  padding: 2rem 1rem;

  i {
    color: #a7a7a7;
  }

  h1 {
    text-align: center;
  }

  ${({ theme }) =>
    theme === 'dark' &&
    `
			color: #fff;
	`};
`

export const Flex = styled.div`
  ${layout}
  ${flexbox}
  
  @media (max-width: 960px) {
    flex-direction: column;
  }
`

export const Back = styled.div`
  margin-top: 2rem;
`

export const Ad = styled.div`
min-height: 140px;
`

export const Content = styled.div`
`

export const Comments = styled.div`
  margin-top: 2rem;
`

export const ArticleDate = styled.div`
  display: flex;
  justify-content: center;
  text-align: center;
  margin-top: -1rem;
  margin-bottom: 1rem;

  i {

    &:first-child {
      margin-right: 0.2rem;
    }
  }
`

export const Tags = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  padding: 1rem 0;

  a {
    margin: 0 1rem 1rem 0;
    color: #fff;

    &:last-child {
      margin: 0 0 1rem 0;
    }
  }
`
