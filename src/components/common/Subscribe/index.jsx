import { ThemeContext } from 'providers/ThemeProvider'
import React, { useContext } from 'react'
import styled from 'styled-components'
import logo from '../../../assets/icons/revue.svg'

const FormControl = styled.div`
   {
    position: relative;
    margin: 0 auto;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    max-width: 50rem;
    padding: 3rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    border-radius: 6px;
    background-color: white;
    margin-bottom: -10rem;
  }

  & input:focus {
    outline: none;
    background-color: #fff;
    outline-color: #823eb7;
  }
`

const Heading = styled.div`
  display: flex;
  align-items: center;
  padding: 0rem 4rem;
  border-radius: 7px;
  flex-direction: column;
  margin-top: -4.25rem;
`
const StyledImage = styled.img`
  margin-bottom: 8px;
`

const Title = styled.h2`
  margin: 0 0 3px;
  padding: 0;
  color: #15171a;
  line-height: 1;
  letter-spacing: 0.3px;
  border-bottom: none;
`

const StyledPara = styled.p`
  font: inherit;
  font-weight: 400;
  // margin-bottom: 1em;
  // margin-top: 0.25em;
  margin: 6px auto 22px;
  color: #738a94;
`

const Fields = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0rem;
  border-radius: 7px;
  width: 40rem;

  @media (max-width: 400px) {
    flex-direction: column;
  }
`

const StyledInput = styled.input`
   {
    width: 40%;
    color: inherit;
    padding: 0.5rem;
    border: 1px solid #823eb7;
    background-color: #f0f0f0;
    font: inherit;
    line-height: 1.5rem;
    transition: all 0.3s;
    text-transform: none;
    border-radius: 6px;
    margin-right: 0.5rem;
  }
`

const StyledSubmit = styled.input`
   {
    width: 20%;
    color: #fff;
    padding: 0.5rem;
    border: 1px solid #823eb7;
    background-color: #823eb7;
    font: inherit;
    line-height: 1.5rem;
    transition: all 0.3s;
    text-transform: uppercase;
    border-radius: 6px;
    margin-right: none;

    @media (max-width: 400px) {
      margin-top: 0.5rem;
      width: 40%;
    }
  }
`

const Footer = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  border-radius: 7px;
  bottom: 0rem;
  right: 1rem;

  & img {
    height: 35px;
    width: 80px;
    opacity: 0.3;
  }

  @media (max-width: 400px) {
    right: 2rem;
  }
`

export const Subscribe = ({}) => {
  const { theme } = useContext(ThemeContext)
  return (
    <FormControl>
      <Heading>
        <StyledImage
          src="https://www.rahulpnath.com/favicon/logo-48.png"
          alt="Logo"
        />
        <Title>Rahul's Newsletter</Title>
        <StyledPara>Tech, Productivity, and Life in general.</StyledPara>
      </Heading>
      <form
        action="https://www.getrevue.co/profile/rahulpnath/add_subscriber"
        method="post"
        id="revue-form"
        name="revue-form"
        target="_blank"
      >
        <Fields>
          <StyledInput
            placeholder="Your email address"
            type="email"
            name="member[email]"
            id="member_email"
          />
          <StyledSubmit
            type="submit"
            value="Subscribe"
            name="member[subscribe]"
            id="member_submit"
          />
        </Fields>
        {/* <div class="revue-form-group">
          <label for="member_first_name">
            First name <span class="optional">(Optional)</span>
          </label>
          <input
            class="revue-form-field"
            placeholder="First name... (Optional)"
            type="text"
            name="member[first_name]"
            id="member_first_name"
          />
        </div>
        <div class="revue-form-group">
          <label for="member_last_name">
            Last name <span class="optional">(Optional)</span>
          </label>
          <input
            class="revue-form-field"
            placeholder="Last name... (Optional)"
            type="text"
            name="member[last_name]"
            id="member_last_name"
          />
        </div> */}
        {/* <div class="revue-form-actions">
          <input
            type="submit"
            value="Subscribe"
            name="member[subscribe]"
            id="member_submit"
          />
        </div> */}
      </form>
      <Footer>
        <a target="_blank" href="https://www.getrevue.co/terms">
          <img src={logo} alt="Logo" />
        </a>
      </Footer>
    </FormControl>
  )
}
