import styled from 'styled-components'

export const Ad = styled.div`
  min-height: 140px;
  background-color: hsl(0, 0%, 98%);
  box-shadow: 0 1px 4px 1px hsla(0, 0%, 0%, 0.1);

  ${({ theme }) =>
    theme === 'dark' &&
    `
background-color: hsl(0, 0%, 10%);
box-shadow: 0 0 1px hsla(0, 0%, 0%, 0.5);
`};
`