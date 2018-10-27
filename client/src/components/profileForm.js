import React from 'react'
import { Button, TextField } from '@material-ui/core'
import { isNil } from 'lodash'

const containerStyle = {
  display: 'flex',
  flexDirection: 'column'
}

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  marginTop: 20,
  width: 300
}

const buttonStyle = {
  marginTop: 20
}

const headerStyle = {
  textAlign: 'center'
}

const ProfileForm = (props) => {
  const {
    currentUser,
    doUpdateNameField,
    doUpdateBusinessNameField,
    doUpdateBillingAddressField,
    doUpdateShippingAddressField,
    doUpdatePhoneField,
    nameField,
    phoneField,
    shippingAddressField,
    doUpdateMyProfile
  } = props

  const handleNameChange = (e) => {
    return doUpdateNameField(e.target.value)
  }

  const handleShippingAddressChange = (e) => {
    return doUpdateShippingAddressField(e.target.value)
  }
  const handlePhoneChange = (e) => {
    return doUpdatePhoneField(e.target.value)
  }

  const handleSubmit = () => {
    const sanitizedProfileData = {
      name: nameField,
      shipping_address: shippingAddressField,
      phone: phoneField
    }
    return doUpdateMyProfile(sanitizedProfileData)
  }

  return (
    <div style={containerStyle}>
      <h1 style={headerStyle}>My Profile</h1>
      <form style={formStyle}>
        <TextField
          label={'Name'}
          type='text'
          value={nameField}
          onChange={handleNameChange}
        />
        <TextField
          label={'Shipping Address'}
          type='text'
          value={shippingAddressField}
          onChange={handleShippingAddressChange}
        />
        <TextField
          label={'Contact Phone'}
          type='number'
          value={phoneField}
          onChange={handlePhoneChange}
        />
        <Button
          variant='outlined'
          style={buttonStyle}
          type='button'
          onClick={handleSubmit}
        >
          Update Profile
        </Button>
      </form>
    </div>
  )
}

export default ProfileForm
