import React from 'react'
import { connect } from 'redux-bundler-react'

import ProfileForm from '../components/profileForm'

const Profile = ({
  currentUser,
  doUpdatePhoneField,
  doUpdateNameField,
  doUpdateShippingAddressField,
  nameField,
  phoneField,
  shippingAddressField,
  doUpdateMyProfile
 }) => {
  return (
    <ProfileForm
      currentUser={currentUser}
      doUpdatePhoneField={doUpdatePhoneField}
      doUpdateNameField={doUpdateNameField}
      doUpdateShippingAddressField={doUpdateShippingAddressField}
      nameField={nameField}
      phoneField={phoneField}
      shippingAddressField={shippingAddressField}
      doUpdateMyProfile={doUpdateMyProfile}
    />
  )
}

export default connect(
  'selectCurrentUser',
  'doUpdatePhoneField',
  'doUpdateNameField',
  'doUpdateShippingAddressField',
  'selectPhoneField',
  'selectNameField',
  'selectShippingAddressField',
  'doUpdateMyProfile',
  Profile
)
