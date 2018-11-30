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
    linkIdsToHighlight,
    nodeIdsToHighlight,
    newNodeIds,
    updatedNodeIds,
    newLinkIds,
    doClearNewNodeIds,
    doClearUpdatedNodeIds,
    doClearNewLinkIds
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
      linkIdsToHighlight={linkIdsToHighlight}
      nodeIdsToHighlight={nodeIdsToHighlight}
      newNodeIds={newNodeIds}
      updatedNodeIds={updatedNodeIds}
      newLinkIds={newLinkIds}
      doClearNewNodeIds={doClearNewNodeIds}
      doClearUpdatedNodeIds={doClearUpdatedNodeIds}
      doClearNewLinkIds={doClearNewLinkIds}
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
  'selectLinksByCurrentNodeId',
  'selectLinkIdsToHighlight',
  'selectNodeIdsToHighlight',
  'selectNewNodeIds',
  'selectUpdatedNodeIds',
  'selectNewLinkIds',
  'doClearNewNodeIds',
  'doClearUpdatedNodeIds',
  'doClearNewLinkIds',
  Workspace
)
