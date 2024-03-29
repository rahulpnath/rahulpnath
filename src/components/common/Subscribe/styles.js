import styled from 'styled-components'

export const FormWrapper = styled.div`
  text-align: center;
  padding-top: 3rem;
`
export const Frame = styled.iframe`
  border: none;
  height: 320px;
  width: 100%;
  background: white;
  margin-bottom: 0px;
`
export const StyledForm = styled.div`
  width: 40%;
  margin: 0 auto;
  background: #fff;
  box-shadow: 0px 1px 5px 0px rgba(0, 0, 0, 0.2),
    0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12);
  border-radius: 5px;
  position: relative;
  margin-bottom: -12rem;

  @media (max-width: 960px) {
    padding: 2rem 1rem;
    width: 80%;
  }

  @media (max-width: 800px) {
    width: 100%;
  }

  ${({ theme }) =>
    theme === 'dark' &&
    `
		background: #212121;
		color: #fff;
	`};
`

export const Subtitle = styled.p`
  margin-bottom: 1em;
  color: #738a94;
  letter-spacing: 0.2px;

  ${({ theme }) =>
    theme === 'dark' &&
    `
		color: #fff;
	`};
`

export const Title = styled.h3`
  margin: 0 0 3px;
  padding: 0;
  color: #15171a;
  line-height: 1;

  ${({ theme }) =>
    theme === 'dark' &&
    `
		color: #fff;
	`};
`

export const Message = styled.h4`
  margin: 1rem 0;
  font-weight: normal;

  @media (max-width: 800px) {
    width: 90%;
    margin: 1rem auto;
  }
`

export const Error = styled.div`
  color: red;

  ${({ server }) =>
    server &&
    `
			margin-top: 1rem;
	`};
`

export const Fields = styled.div`
  display: flex;
  align-items: center;
  padding: 0rem 4rem;

  @media (max-width: 960px) {
    padding: 0rem 2rem;
  }

  @media (max-width: 800px) {
    flex-direction: column;
  }
`

export const Input = styled.input`
  padding: 0.5rem;
  border: 2px solid #823eb7;
  border-radius: 7px;
  flex: 2;

  @media (max-width: 800px) {
    flex: unset;
    width: 100%;
    margin-bottom: 1rem;
  }

  ${({ error }) =>
    error &&
    `
		border-color: #e53935;
	`};
`


