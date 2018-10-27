import React from 'react'
import { connect } from 'redux-bundler-react'

import AcceptInvitationForm from '../components/acceptInvitationForm'

const AcceptInvitation = ({
  invitationToken,
  doAcceptInvitation,
  doUpdateInvitationPasswordField,
  doUpdateInvitationPasswordConfirmationField,
  invitationPasswordField,
  invitationPasswordConfirmationField
 }) => {
  return (
    <AcceptInvitationForm
      doAcceptInvitation={doAcceptInvitation}
      invitationToken={invitationToken}
      doUpdateInvitationPasswordField={doUpdateInvitationPasswordField}
      doUpdateInvitationPasswordConfirmationField={doUpdateInvitationPasswordConfirmationField}
      invitationPasswordField={invitationPasswordField}
      invitationPasswordConfirmationField={invitationPasswordConfirmationField}
    />
  )
}

export default connect(
  'selectInvitationToken',
  'doAcceptInvitation',
  'doUpdateInvitationPasswordField',
  'doUpdateInvitationPasswordConfirmationField',
  'selectInvitationPasswordField',
  'selectInvitationPasswordConfirmationField',
  AcceptInvitation
)
