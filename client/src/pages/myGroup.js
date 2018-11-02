import React from 'react'
import { connect } from 'redux-bundler-react'
import { isNil } from 'lodash'

import EditGroupForm from '../components/editGroupForm'
import CreateGroupForm from '../components/createGroupForm'

const MyGroup = ({
  doCreateGroup,
  doUpdateGroup,
  doUpdateGroupNameField,
  groupNameField,
  currentUser,
  group,
  doUpdateHash
 }) => {
  if (isNil(currentUser)) return null
  if (isNil(currentUser.group_id)) {
    return (
      <CreateGroupForm
        doCreateGroup={doCreateGroup}
        doUpdateGroupNameField={doUpdateGroupNameField}
        groupNameField={groupNameField}
        currentUser={currentUser}
      />
    )
  } else {
    if (isNil(group)) return null
    return (
      <EditGroupForm
        doUpdateGroup={doUpdateGroup}
        doUpdateGroupNameField={doUpdateGroupNameField}
        groupNameField={groupNameField}
        currentUser={currentUser}
        group={group}
        doUpdateHash={doUpdateHash}
      />
    )
  }
}

export default connect(
  'doCreateGroup',
  'doUpdateGroup',
  'doUpdateGroupNameField',
  'selectGroupNameField',
  'selectCurrentUser',
  'selectGroup',
  'doUpdateHash',
  MyGroup
)
