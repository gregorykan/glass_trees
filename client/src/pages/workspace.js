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
    doSetNodeToHighlight,
    nodeToHighlight,
    parentQuestionsForCurrentNode,
    parentOptionsForCurrentNode,
    childQuestionsForCurrentNode,
    childOptionsForCurrentNode
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
      doSetNodeToHighlight={doSetNodeToHighlight}
      nodeToHighlight={nodeToHighlight}
      parentQuestionsForCurrentNode={parentQuestionsForCurrentNode}
      parentOptionsForCurrentNode={parentOptionsForCurrentNode}
      childQuestionsForCurrentNode={childQuestionsForCurrentNode}
      childOptionsForCurrentNode={childOptionsForCurrentNode}
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
  'doSetNodeToHighlight',
  'selectNodeToHighlight',
  'selectParentQuestionsForCurrentNode',
  'selectParentOptionsForCurrentNode',
  'selectChildQuestionsForCurrentNode',
  'selectChildOptionsForCurrentNode',
  Workspace
)
