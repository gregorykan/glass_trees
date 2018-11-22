import React from 'react'
import { connect } from 'redux-bundler-react'
import { isNil } from 'lodash'

import WorkspaceComponent from '../components/workspace'

const Workspace = (props) => {
  const {
    doUpdateHash,
    thisWorkspace,
    workspaceNameField,
    doUpdateWorkspaceNameField,
    doUpdateWorkspace,
    nodesForRendering,
    linksForRendering,
    doSelectNode,
    currentNode,
    doUpdateNodeFormDataLabel,
    doUpdateNodeFormDataDescription,
    nodeFormData,
    doCreateNode,
    doUpdateNodeTypeToBeCreated,
    nodeTypeToBeCreated,
    doResolveNode,
    doUnresolveNode,
    currentUser,
    doVoteForNode,
    parentQuestionsForCurrentNode,
    parentOptionsForCurrentNode,
    childQuestionsForCurrentNode,
    childOptionsForCurrentNode,
    nodesByCurrentNode
  } = props
  if (isNil(thisWorkspace)) return null
  return (
    <WorkspaceComponent
      workspace={thisWorkspace}
      doUpdateHash={doUpdateHash}
      workspaceNameField={workspaceNameField}
      doUpdateWorkspaceNameField={doUpdateWorkspaceNameField}
      doUpdateWorkspace={doUpdateWorkspace}
      nodes={nodesForRendering}
      links={linksForRendering}
      doSelectNode={doSelectNode}
      currentNode={currentNode}
      doUpdateNodeFormDataDescription={doUpdateNodeFormDataDescription}
      doUpdateNodeFormDataLabel={doUpdateNodeFormDataLabel}
      nodeFormData={nodeFormData}
      doCreateNode={doCreateNode}
      doUpdateNodeTypeToBeCreated={doUpdateNodeTypeToBeCreated}
      nodeTypeToBeCreated={nodeTypeToBeCreated}
      doResolveNode={doResolveNode}
      doUnresolveNode={doUnresolveNode}
      currentUser={currentUser}
      doVoteForNode={doVoteForNode}
      parentQuestionsForCurrentNode={parentQuestionsForCurrentNode}
      parentOptionsForCurrentNode={parentOptionsForCurrentNode}
      childQuestionsForCurrentNode={childQuestionsForCurrentNode}
      childOptionsForCurrentNode={childOptionsForCurrentNode}
      nodesByCurrentNode={nodesByCurrentNode}
    />
  )
}

export default connect(
  'doUpdateHash',
  'selectThisWorkspace',
  'selectWorkspaceNameField',
  'doUpdateWorkspaceNameField',
  'doUpdateWorkspace',
  'selectNodesForRendering',
  'selectLinksForRendering',
  'doSelectNode',
  'selectCurrentNode',
  'doUpdateNodeFormDataLabel',
  'doUpdateNodeFormDataDescription',
  'selectNodeFormData',
  'doCreateNode',
  'doUpdateNodeTypeToBeCreated',
  'selectNodeTypeToBeCreated',
  'doResolveNode',
  'doUnresolveNode',
  'selectCurrentUser',
  'doVoteForNode',
  'selectParentQuestionsForCurrentNode',
  'selectParentOptionsForCurrentNode',
  'selectChildQuestionsForCurrentNode',
  'selectChildOptionsForCurrentNode',
  'selectNodesByCurrentNode',
  Workspace
)
