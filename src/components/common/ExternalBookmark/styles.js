import styled from 'styled-components'

export const Item = styled.div`
  width: 100%;
  margin-bottom: 1rem;
  height: 100%;
  border: 2px solid #e4e4e4;
`

export const Post = styled.div`
  background: #fff;
  width: 100%;
  display: flex;
  flex-direction: row;

  @media (max-width: 680px) {
    flex-direction: column;
  }

  &:hover,
  &:focus {
    box-shadow: 0 3px 20px 0 rgba(0, 0, 0, 0.2);
  }

  ${({ theme }) =>
    theme === 'dark' &&
    `
      background: #2b2a2a;
      
      a {
        color: #adad2e;
      }
	`};
`

export const ArticleContent = styled.div`
  padding: 1rem;
  flex: auto;

  @media (max-width: 680px) {
    flex: 2;
    padding: 1.5rem;
  }
`

export const ArticleImg = styled.div`
  width: 280px;
  min-width: 280px;
  margin: 20px;
  overflow: hidden;
  background-image: linear-gradient(10deg, #823eb7 0%, #823eb7 100%);

  .gatsby-image-wrapper {
    height: 100%;
  }

  @media (max-width: 992px) {
    height: 300px;
    display: none;
  }

  @media (max-width: 680px) {
    height: 100px;
    width: auto;
    flex: 1;
  }
`

export const ArticleTitle = styled.div`
  color: #212121;
  margin-left: 0;
  margin-right: 0;
  margin-top: 1.625rem;
  padding-bottom: calc(0.40625rem - 1px);
  padding-left: 0;
  padding-right: 0;
  padding-top: 0;
  margin-bottom: 0.40625rem;
  font-weight: 600;
  text-rendering: optimizeLegibility;
  font-size: 1.51572rem;
  line-height: 1.1;

  a {
    color: inherit;
  }

  ${({ theme }) =>
    theme === 'dark' &&
    `
      color: #fff;
      
      a {
        color: #fff;
      }
	`};
`

export const Paragraph = styled.p`
  color: #616161;

  @media (max-width: 680px) {
    margin-bottom: 1rem;
  }

  ${({ theme }) =>
    theme === 'dark' &&
    `
			color: #fff;
	`};
`
