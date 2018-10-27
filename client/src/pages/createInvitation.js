import React from 'react'
import { connect } from 'redux-bundler-react'

import CreateInvitationForm from '../components/createInvitationForm'

const CreateInvitation = ({
  doCreateInvitation,
  doUpdateInvitationEmailField,
  invitationEmailField
 }) => {
  return (
    <CreateInvitationForm
      doCreateInvitation={doCreateInvitation}
      doUpdateInvitationEmailField={doUpdateInvitationEmailField}
      invitationEmailField={invitationEmailField}
    />
  )
}

export default connect(
  'doCreateInvitation',
  'doUpdateInvitationEmailField',
  'selectInvitationEmailField',
  CreateInvitation
)
