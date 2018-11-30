import { createAsyncResourceBundle, createSelector } from 'redux-bundler'
import cuid from 'cuid'
import { omit, concat, isNil, find, filter, map, includes, uniq, reduce, compact } from 'lodash'
import ms from 'milliseconds'

const bundle = createAsyncResourceBundle({
  name: 'nodes',
  getPromise: async ({ apiFetch, getState }) => {
    const credentials = getState().accounts.credentials
    const sanitizedCredentials = {
      'access-token': credentials.accessToken,
      'token-type': credentials.tokenType,
      client: credentials.client,
      uid: credentials.uid,
      expiry: credentials.expiry
    }
    return apiFetch(`api/nodes`, {
      headers: sanitizedCredentials
    })
      .then(response => response.json())
      .catch(err => {
        console.log('err', err)
        throw new Error({ permanent: true })
      })
  },
  staleAfter: ms.minutes(5),
  retryAfter: ms.minutes(2)
})

const initialState = {
  currentNodeId: null,
  nodeFormData: {},
  nodeTypeToBeCreated: '',
  updatedNodeIds: [],
  removedNodeIds: [],
  newNodeIds: [],
  // needed by createAsyncResourceBundle
  data: null,
  errorTimes: [],
  errorType: null,
  failedPermanently: false,
  isExpired: false,
  isLoading: false,
  isOutdated: false,
  lastSuccess: null
}

const baseReducer = bundle.reducer
bundle.reducer = (state = initialState, action) => {
  if (action.type === 'SELECT_NODE') {
    return {
      ...state,
      currentNodeId: Number(action.payload),
      nodeTypeToBeCreated: null
    }
  }
  if (action.type === 'UPDATE_NODE_FORM_DATA_LABEL') {
    return {
      ...state,
      nodeFormData: {
        ...state.nodeFormData,
        label: action.payload
      }
    }
  }
  if (action.type === 'UPDATE_NODE_FORM_DATA_DESCRIPTION') {
    return {
      ...state,
      nodeFormData: {
        ...state.nodeFormData,
        description: action.payload
      }
    }
  }
  if (action.type === 'CREATE_NODE_SUCCESS') {
    return {
      ...state,
      nodeFormData: {},
      data: concat(state.data, action.payload),
      nodeTypeToBeCreated: null,
      newNodeIds: concat(state.newNodeIds, [ action.payload.id ])
    }
  }
  if (action.type === 'CREATE_FIRST_NODE_SUCCESS') {
    return {
      ...state,
      nodeFormData: {},
      data: concat(state.data, action.payload)
    }
  }
  if (action.type === 'UPDATE_NODE_TYPE_TO_BE_CREATED') {
    return {
      ...state,
      nodeTypeToBeCreated: action.payload,
      nodeFormData: {}
    }
  }
  if (action.type === 'RESOLVE_NODE_SUCCESS') {
    const updatedNode = action.payload
    // const updatedOptions = updatedNode.options
    // const allUpdatedNodes = concat([updatedNode], updatedOptions)
    // const allUpdatedNodeIds = map(allUpdatedNodes, (node) => node.id)
    return {
      ...state,
      data: concat(filter(state.data, (node) => { return node.id !== updatedNode.id }), [updatedNode]),
      updatedNodeIds: concat(state.updatedNodeIds, [updatedNode.id]),
      nodeFormData: null,
      nodeTypeToBeCreated: null
    }
  }
  if (action.type === 'UNRESOLVE_NODE_SUCCESS') {
    const updatedNode = action.payload
    // const updatedOptions = updatedNode.options
    // const allUpdatedNodes = concat([updatedNode], updatedOptions)
    // const allUpdatedNodeIds = map(allUpdatedNodes, (node) => node.id)
    return {
      ...state,
      data: concat(filter(state.data, (node) => { return node.id !== updatedNode.id }), [updatedNode]),
      updatedNodeIds: concat(state.updatedNodeIds, [updatedNode.id])
    }
  }
  if (action.type === 'VOTE_NODE_SUCCESS') {
    return {
      ...state,
      data: concat(filter(state.data, (node) => { return node.id !== action.payload.id }), action.payload),
      updatedNodeIds: concat(state.updatedNodeIds, [ action.payload.id ])
    }
  }
  if (action.type === 'CREATE_WORKSPACE_SUCCESS') {
    return {
      ...state,
      data: concat(state.data, [action.payload.node])
    }
  }
  if (action.type === 'CLEAR_NEW_NODE_IDS') {
    return {
      ...state,
      newNodeIds: []
    }
  }
  if (action.type === 'CLEAR_UPDATED_NODE_IDS') {
    return {
      ...state,
      updatedNodeIds: []
    }
  }
  if (action.type === 'SIGN_OUT_SUCCESS') {
    return initialState
  }
  return baseReducer(state, action)
}

bundle.doSelectNode = (nodeId) => ({ dispatch }) => {
  dispatch({ type: 'SELECT_NODE', payload: nodeId })
}

bundle.doUpdateNodeFormDataLabel = (label) => ({ dispatch }) => {
  dispatch({ type: 'UPDATE_NODE_FORM_DATA_LABEL', payload: label })
}

bundle.doUpdateNodeFormDataDescription = (description) => ({ dispatch }) => {
  dispatch({ type: 'UPDATE_NODE_FORM_DATA_DESCRIPTION', payload: description })
}

bundle.doUpdateNodeTypeToBeCreated = (type) => ({ dispatch }) => {
  dispatch({ type: 'UPDATE_NODE_TYPE_TO_BE_CREATED', payload: type })
}

bundle.doClearNewNodeIds = () => ({ dispatch }) => {
  dispatch({ type: 'CLEAR_NEW_NODE_IDS' })
}

bundle.doClearUpdatedNodeIds = () => ({ dispatch }) => {
  dispatch({ type: 'CLEAR_UPDATED_NODE_IDS' })
}

bundle.doCreateNode = (formData) => ({ dispatch, apiFetch, getState }) => {
  dispatch({ type: 'CREATE_NODE_START' })
  const credentials = getState().accounts.credentials
  const sanitizedCredentials = {
    'access-token': credentials.accessToken,
    'token-type': credentials.tokenType,
    client: credentials.client,
    uid: credentials.uid,
    expiry: credentials.expiry
  }
  apiFetch('api/nodes/create_node', {
    method: 'POST',
    headers: sanitizedCredentials,
    body: JSON.stringify(formData)
  })
    // GK: NB: response is now being handled through ActionCable - see ActionCables mounted on Landing page
    // .then(response => {
    //   if (!response.ok) {
    //     return Promise.reject(new Error(`${response.status} ${response.statusText}`))
    //   }
    //   return response.json()
    // })
    // .then((data) => {
    //   dispatch({ type: 'CREATE_NODE_SUCCESS', payload: data })
    // })
    // .catch((error) => {
    //   dispatch({ type: 'CREATE_NODE_ERROR', payload: error })
    // })
}

bundle.doCreateNodeSuccess = (node) => ({ dispatch }) => {
  dispatch({ type: 'CREATE_NODE_SUCCESS', payload: node })
}

bundle.doResolveNode = (formData) => ({ dispatch, apiFetch, getState }) => {
  const resolveNodeFormData = {
    resolution_label: formData.label,
    resolution_description: formData.description
  }
  dispatch({ type: 'RESOLVE_NODE_START' })
  const credentials = getState().accounts.credentials
  const sanitizedCredentials = {
    'access-token': credentials.accessToken,
    'token-type': credentials.tokenType,
    client: credentials.client,
    uid: credentials.uid,
    expiry: credentials.expiry
  }
  apiFetch(`api/nodes/${formData.current_node_id}/resolve`, {
    method: 'PATCH',
    headers: sanitizedCredentials,
    body: JSON.stringify(resolveNodeFormData)
  })
    // .then(response => {
    //   if (!response.ok) {
    //     return Promise.reject(new Error(`${response.status} ${response.statusText}`))
    //   }
    //   return response.json()
    // })
    // .then((data) => {
    //   dispatch({ type: 'RESOLVE_NODE_SUCCESS', payload: data })
    // })
    // .catch((error) => {
    //   dispatch({ type: 'RESOLVE_NODE_ERROR', payload: error })
    // })
}

bundle.doResolveNodeSuccess = (node) => ({ dispatch }) => {
  dispatch({ type: 'RESOLVE_NODE_SUCCESS', payload: node })
}

bundle.doUnresolveNode = (nodeId) => ({ dispatch, apiFetch, getState }) => {
  dispatch({ type: 'UNRESOLVE_NODE_START' })
  const credentials = getState().accounts.credentials
  const sanitizedCredentials = {
    'access-token': credentials.accessToken,
    'token-type': credentials.tokenType,
    client: credentials.client,
    uid: credentials.uid,
    expiry: credentials.expiry
  }
  apiFetch(`api/nodes/${nodeId}/unresolve`, {
    method: 'PATCH',
    headers: sanitizedCredentials
  })
    // .then(response => {
    //   if (!response.ok) {
    //     return Promise.reject(new Error(`${response.status} ${response.statusText}`))
    //   }
    //   return response.json()
    // })
    // .then((data) => {
    //   dispatch({ type: 'UNRESOLVE_NODE_SUCCESS', payload: data })
    // })
    // .catch((error) => {
    //   dispatch({ type: 'UNRESOLVE_NODE_ERROR', payload: error })
    // })
}

bundle.doUnresolveNodeSuccess = (node) => ({ dispatch }) => {
  dispatch({ type: 'UNRESOLVE_NODE_SUCCESS', payload: node })
}

bundle.doVoteForNode = (formData) => ({ dispatch, apiFetch, getState }) => {
  dispatch({ type: 'VOTE_NODE_START' })
  const credentials = getState().accounts.credentials
  const sanitizedCredentials = {
    'access-token': credentials.accessToken,
    'token-type': credentials.tokenType,
    client: credentials.client,
    uid: credentials.uid,
    expiry: credentials.expiry
  }
  apiFetch(`api/nodes/${formData.node_id}/vote`, {
    method: 'POST',
    headers: sanitizedCredentials,
    body: JSON.stringify(formData)
  })
    // .then(response => {
    //   if (!response.ok) {
    //     return Promise.reject(new Error(`${response.status} ${response.statusText}`))
    //   }
    //   return response.json()
    // })
    // .then((data) => {
    //   dispatch({ type: 'VOTE_NODE_SUCCESS', payload: data })
    // })
    // .catch((error) => {
    //   dispatch({ type: 'VOTE_NODE_ERROR', payload: error })
    // })
}

bundle.doVoteForNodeSuccess = (node) => ({ dispatch }) => {
  dispatch({ type: 'VOTE_NODE_SUCCESS', payload: node })
}

bundle.selectNodes = (state) => state.nodes.data
bundle.selectNewNodeIds = (state) => state.nodes.newNodeIds
bundle.selectUpdatedNodeIds = (state) => state.nodes.updatedNodeIds
bundle.selectNodesForRendering = createSelector(
  'selectNodes',
  'selectThisWorkspaceId',
  (rawNodes, workspaceId) => {
    if (isNil(rawNodes) || isNil(workspaceId)) return []
    const nodesToRender = filter(rawNodes, (rawNode) => { return rawNode.workspace_id === workspaceId })
    return map(nodesToRender, (rawNode) => {
      return {
        id: rawNode.id,
        label: rawNode.resolved ? rawNode.resolution_label : rawNode.label,
        nodeType: rawNode.node_type,
        resolved: rawNode.resolved
      }
    })
  }
)
bundle.selectCurrentNodeId = (state) => state.nodes.currentNodeId
bundle.selectCurrentNode = createSelector(
  'selectCurrentNodeId',
  'selectNodes',
  (nodeId, rawNodes) => {
    if (isNil(rawNodes) || isNil(nodeId)) return null
    return find(rawNodes, { 'id': nodeId })
  }
)
bundle.selectNodesByCurrentNode = createSelector(
  'selectNodes',
  'selectLinksByCurrentNodeId',
  'selectCurrentNodeId',
  (nodes, relatedLinks, currentNodeId) => {
    if (isNil(currentNodeId)) return []
    const relatedNodeIds = uniq(reduce(relatedLinks, (sofar, relatedLink) => {
      return concat(concat(sofar, relatedLink.target_id), relatedLink.source_id)
    }, []))
    return filter(nodes, (node) => {
      return includes(omit(relatedNodeIds, (relatedNodeId) => { return relatedNodeId === currentNodeId }), node.id)
    })
  }
)

bundle.selectSourceNodesForCurrentNode = createSelector(
  'selectNodes',
  'selectAllLinksByCurrentNodeId',
  'selectCurrentNodeId',
  (nodes, relatedLinks, currentNodeId) => {
    if (isNil(currentNodeId)) return []
    const linksWhereCurrentNodeIsTarget = filter(relatedLinks, (link) => {
      return link.target_id === currentNodeId
    })
    const sourceNodeIdsForCurrentNode = map(linksWhereCurrentNodeIsTarget, (link) => {
      return link.source_id
    })
    return filter(nodes, (node) => {
      return includes(sourceNodeIdsForCurrentNode, node.id)
    })
  }
)
bundle.selectParentQuestionsForCurrentNode = createSelector(
  'selectSourceNodesForCurrentNode',
  (sourceNodesForCurrentNode) => {
    if (isNil(sourceNodesForCurrentNode)) return []
    const sourceNodesThatAreQuestions = filter(sourceNodesForCurrentNode, (node) => {
      return node.node_type !== 'option'
    })
    return sourceNodesThatAreQuestions
  }
)

bundle.selectParentOptionsForCurrentNode = createSelector(
  'selectSourceNodesForCurrentNode',
  (sourceNodesForCurrentNode) => {
    if (isNil(sourceNodesForCurrentNode)) return []
    const sourceNodesThatAreQuestions = filter(sourceNodesForCurrentNode, (node) => {
      return node.node_type === 'option'
    })
    return sourceNodesThatAreQuestions
  }
)

bundle.selectTargetNodesForCurrentNode = createSelector(
  'selectNodes',
  'selectAllLinksByCurrentNodeId',
  'selectCurrentNodeId',
  (nodes, relatedLinks, currentNodeId) => {
    if (isNil(currentNodeId)) return []
    const linksWhereCurrentNodeIsSource = filter(relatedLinks, (link) => {
      return link.source_id === currentNodeId
    })
    const targetNodeIdsForCurrentNode = map(linksWhereCurrentNodeIsSource, (link) => {
      return link.target_id
    })
    return filter(nodes, (node) => {
      return includes(targetNodeIdsForCurrentNode, node.id)
    })
  }
)

bundle.selectChildQuestionsForCurrentNode = createSelector(
  'selectTargetNodesForCurrentNode',
  (targetNodesForCurrentNode) => {
    if (isNil(targetNodesForCurrentNode)) return []
    const targetNodesThatAreQuestions = filter(targetNodesForCurrentNode, (node) => {
      return node.node_type !== 'option'
    })
    return targetNodesThatAreQuestions
  }
)

bundle.selectChildOptionsForCurrentNode = createSelector(
  'selectTargetNodesForCurrentNode',
  (targetNodesForCurrentNode) => {
    if (isNil(targetNodesForCurrentNode)) return []
    const targetNodesThatAreQuestions = filter(targetNodesForCurrentNode, (node) => {
      return node.node_type !== 'question'
    })
    return targetNodesThatAreQuestions
  }
)

bundle.selectNodeFormData = (state) => state.nodes.nodeFormData
bundle.selectNodeTypeToBeCreated = (state) => state.nodes.nodeTypeToBeCreated

bundle.reactNodesFetch = createSelector(
  'selectNodesShouldUpdate',
  'selectIsSignedIn',
  (shouldUpdate, isSignedIn) => {
    if (shouldUpdate && isSignedIn) {
      return { actionCreator: 'doFetchNodes' }
    }
    return false
  }
)

export default bundle
