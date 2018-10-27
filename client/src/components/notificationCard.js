import React from 'react'
import { isEmpty } from 'lodash'
import { Card, CardContent, CardActions, Button } from '@material-ui/core'

const styles = {
  maxWidth: 200,
  position: 'absolute',
  zIndex: 10
}

const textStyle = {
  textAlign: 'center'
}

const innerContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center'
}

const NotificationCard = (props) => {
  const { notifications, doRemoveErrorNotification } = props
  if (isEmpty(notifications)) return null
  const notificationId = Object.keys(notifications)[0]
  const notification = notifications[notificationId]
  return (
    <Card style={styles}>
      <div style={innerContainerStyle}>
        <CardContent style={textStyle}>
          {notification.message}
        </CardContent>
        <CardActions>
          <Button variant='outlined' type='button' onClick={() => doRemoveErrorNotification(notificationId)}>Ok</Button>
        </CardActions>
      </div>
    </Card>
  )
}

export default NotificationCard
