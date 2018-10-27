import React from 'react'
import { connect } from 'redux-bundler-react'

import SignUpForm from '../components/signUpForm'

const SignUp = ({
  doUpdateSignUpEmailField,
  doUpdateSignUpPasswordField,
  doUpdateSignUpPasswordConfirmationField,
  signUpEmailField,
  signUpPasswordField,
  signUpPasswordConfirmationField,
  doSignUp
 }) => {
  return (
    <SignUpForm
      doUpdateSignUpEmailField={doUpdateSignUpEmailField}
      doUpdateSignUpPasswordField={doUpdateSignUpPasswordField}
      doUpdateSignUpPasswordConfirmationField={doUpdateSignUpPasswordConfirmationField}
      signUpEmailField={signUpEmailField}
      signUpPasswordField={signUpPasswordField}
      signUpPasswordConfirmationField={signUpPasswordConfirmationField}
      doSignUp={doSignUp}
    />
  )
}

export default connect(
  'doUpdateSignUpEmailField',
  'doUpdateSignUpPasswordField',
  'doUpdateSignUpPasswordConfirmationField',
  'selectSignUpEmailField',
  'selectSignUpPasswordField',
  'selectSignUpPasswordConfirmationField',
  'doSignUp',
  SignUp
)
