import React from 'react'

import Graph from './graph'
import WorkspaceForm from './workspaceForm'
import NodeDetails from './nodeDetails'

const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center'
}

const nodeDetailsContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  margin: 30,
  width: 70 / 100 * Number(window.innerWidth)
}

const graphContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  borderWidth: '1px',
  borderColor: 'black',
  borderStyle: 'solid'
}

const submitButtonStyle = {
  marginTop: 20
}

class WorkspaceComponent extends React.Component {
  componentDidMount () {
    const { doUpdateWorkspaceNameField, workspace } = this.props
    doUpdateWorkspaceNameField(workspace.name)
  }

  componentWillUnmount () {
    const { doUpdateWorkspaceNameField, doSelectNode } = this.props
    doUpdateWorkspaceNameField(null)
    doSelectNode(null)
  }

  scrollToBottom = () => {
    this.pageBottom.scrollIntoView({ behavior: 'smooth' })
  }

  scrollToTop = () => {
    this.pageTop.scrollIntoView({ behavior: 'smooth' })
  }

  render () {
    const {
      doUpdateWorkspace,
      doUpdateWorkspaceNameField,
      workspaceNameField,
      workspace,
      doUpdateHash,
      nodes,
      links,
      doSelectNode,
      currentNode,
      doUpdateNodeFormDataLabel,
      doUpdateNodeFormDataDescription,
      nodeFormData,
      doCreateNode,
      nodeTypeToBeCreated,
      doUpdateNodeTypeToBeCreated,
      doResolveNode,
      doUnresolveNode,
      currentUser,
      doVoteForNode,
      parentQuestionsForCurrentNode,
      parentOptionsForCurrentNode,
      childQuestionsForCurrentNode,
      childOptionsForCurrentNode,
      linkIdsToHighlight,
      nodeIdsToHighlight
    } = this.props

    const data = {
      nodes: nodes,
      links: links
    }

    const onClickNode = (nodeId) => {
      doSelectNode(nodeId)
      setTimeout(this.scrollToBottom, 50)
    }

    const handleNameChange = (e) => {
      return doUpdateWorkspaceNameField(e.target.value)
    }

    const handleSubmit = () => {
      const formData = {
        name: workspaceNameField,
        id: workspace.id
      }
      return doUpdateWorkspace(formData)
    }

    const cancelSingleNodeView = () => {
      doSelectNode(null)
      setTimeout(this.scrollToTop, 50)
    }

    return (
      <div style={containerStyle}>
        <WorkspaceForm
          handleNameChange={handleNameChange}
          handleSubmit={handleSubmit}
          nameFieldValue={workspaceNameField}
          workspace={workspace}
        />
        <div style={graphContainerStyle} ref={(el) => { this.pageTop = el }}>
          <Graph
            data={data}
            onClickNode={onClickNode}
            currentNode={currentNode}
            linkIdsToHighlight={linkIdsToHighlight}
            nodeIdsToHighlight={nodeIdsToHighlight}
          />
        </div>
        <div style={nodeDetailsContainerStyle}>
          <NodeDetails
            currentNode={currentNode}
            nodeFormData={nodeFormData}
            doUpdateNodeFormDataLabel={doUpdateNodeFormDataLabel}
            doUpdateNodeFormDataDescription={doUpdateNodeFormDataDescription}
            doCreateNode={doCreateNode}
            doUpdateNodeTypeToBeCreated={doUpdateNodeTypeToBeCreated}
            currentUser={currentUser}
            workspace={workspace}
            doResolveNode={doResolveNode}
            doUnresolveNode={doUnresolveNode}
            nodeTypeToBeCreated={nodeTypeToBeCreated}
            cancelSingleNodeView={cancelSingleNodeView}
            doVoteForNode={doVoteForNode}
            doSelectNode={doSelectNode}
            parentQuestionsForCurrentNode={parentQuestionsForCurrentNode}
            parentOptionsForCurrentNode={parentOptionsForCurrentNode}
            childQuestionsForCurrentNode={childQuestionsForCurrentNode}
            childOptionsForCurrentNode={childOptionsForCurrentNode}
          />
        </div>
        <div style={{ float:"left", clear: "both" }}
           ref={(el) => { this.pageBottom = el }}>
        </div>
      </div>
    )
  }
}

export default WorkspaceComponent
