import day from 'assets/icons/day.svg'
import night from 'assets/icons/night.svg'
import { Link } from 'gatsby'
import { ThemeContext } from 'providers/ThemeProvider'
import React, { useContext } from 'react'
import { Links, StyledButton } from './styles'

export default ({ desktop }) => {
  const { theme, toggleTheme } = useContext(ThemeContext)

  return (
    <Links desktop={desktop} theme={theme}>
      <Link to="/" activeClassName="current">
        Home
      </Link>
      <Link to="/blog" activeClassName="current">
        Blog
      </Link>
      <Link to="/archives" activeClassName="current">
        Archives
      </Link>
      <a href="https://www.youtube.com/user/rahulnathp/" rel="noopener noreferrer" target="_blank">
        YouTube
      </a>
      <Link to="/about" activeClassName="current">
        About
      </Link>
      <StyledButton type="button" onClick={toggleTheme}>
        <img src={theme === 'dark' ? day : night} alt={theme} />
      </StyledButton>
    </Links>
  )
}
