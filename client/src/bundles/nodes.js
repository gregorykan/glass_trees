import { createAsyncResourceBundle, createSelector } from 'redux-bundler'
import cuid from 'cuid'
import { omit, concat, isNil, find, filter, map, includes, reduce, uniq } from 'lodash'
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
      currentNodeId: !isNil(action.payload) ? Number(action.payload) : null,
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
      nodeTypeToBeCreated: null
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
      nodeTypeToBeCreated: action.payload
    }
  }
  if (action.type === 'RESOLVE_NODE_SUCCESS') {
    const updatedNode = action.payload
    const updatedOptions = updatedNode.options
    const allUpdatedNodes = concat([updatedNode], updatedOptions)
    const allUpdatedNodeIds = map(allUpdatedNodes, (node) => node.id)
    return {
      ...state,
      data: concat(filter(state.data, (node) => { return !includes(allUpdatedNodeIds, node.id) }), allUpdatedNodes)
    }
  }
  if (action.type === 'UNRESOLVE_NODE_SUCCESS') {
    const updatedNode = action.payload
    const updatedOptions = updatedNode.options
    const allUpdatedNodes = concat([updatedNode], updatedOptions)
    const allUpdatedNodeIds = map(allUpdatedNodes, (node) => node.id)
    return {
      ...state,
      data: concat(filter(state.data, (node) => { return !includes(allUpdatedNodeIds, node.id) }), allUpdatedNodes)
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
    .then(response => {
      if (!response.ok) {
        return Promise.reject(new Error(`${response.status} ${response.statusText}`))
      }
      return response.json()
    })
    .then((data) => {
      dispatch({ type: 'CREATE_NODE_SUCCESS', payload: data })
    })
    .catch((error) => {
      dispatch({ type: 'CREATE_NODE_ERROR', payload: error })
    })
}

bundle.doCreateFirstNode = (formData) => ({ dispatch, apiFetch, getState }) => {
  dispatch({ type: 'CREATE_FIRST_NODE_START' })
  const credentials = getState().accounts.credentials
  const sanitizedCredentials = {
    'access-token': credentials.accessToken,
    'token-type': credentials.tokenType,
    client: credentials.client,
    uid: credentials.uid,
    expiry: credentials.expiry
  }
  apiFetch('api/nodes', {
    method: 'POST',
    headers: sanitizedCredentials,
    body: JSON.stringify(formData)
  })
    .then(response => {
      if (!response.ok) {
        return Promise.reject(new Error(`${response.status} ${response.statusText}`))
      }
      return response.json()
    })
    .then((data) => {
      dispatch({ type: 'CREATE_FIRST_NODE_SUCCESS', payload: data })
    })
    .catch((error) => {
      dispatch({ type: 'CREATE_FIRST_NODE_ERROR', payload: error })
    })
}

bundle.doResolveNode = (nodeId) => ({ dispatch, apiFetch, getState }) => {
  dispatch({ type: 'RESOLVE_NODE_START' })
  const credentials = getState().accounts.credentials
  const sanitizedCredentials = {
    'access-token': credentials.accessToken,
    'token-type': credentials.tokenType,
    client: credentials.client,
    uid: credentials.uid,
    expiry: credentials.expiry
  }
  apiFetch(`api/nodes/${nodeId}/resolve`, {
    method: 'PATCH',
    headers: sanitizedCredentials
  })
    .then(response => {
      if (!response.ok) {
        return Promise.reject(new Error(`${response.status} ${response.statusText}`))
      }
      return response.json()
    })
    .then((data) => {
      dispatch({ type: 'RESOLVE_NODE_SUCCESS', payload: data })
    })
    .catch((error) => {
      dispatch({ type: 'RESOLVE_NODE_ERROR', payload: error })
    })
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
    .then(response => {
      if (!response.ok) {
        return Promise.reject(new Error(`${response.status} ${response.statusText}`))
      }
      return response.json()
    })
    .then((data) => {
      dispatch({ type: 'UNRESOLVE_NODE_SUCCESS', payload: data })
    })
    .catch((error) => {
      dispatch({ type: 'UNRESOLVE_NODE_ERROR', payload: error })
    })
}

bundle.selectNodes = (state) => state.nodes.data
bundle.selectNodesByCurrentNode = createSelector(
  'selectNodes',
  'selectLinksByCurrentNodeId',
  'selectCurrentNodeId',
  (nodes, relatedLinks, currentNodeId) => {
    if (isNil(currentNodeId)) return nodes
    const relatedNodeIds = uniq(reduce(relatedLinks, (sofar, relatedLink) => {
      return concat(concat(sofar, relatedLink.target_id), relatedLink.source_id)
    }, []))
    return filter(nodes, (node) => {
      return includes(relatedNodeIds, node.id)
    })
  }
)
bundle.selectNodesForRendering = createSelector(
  'selectNodesByCurrentNode',
  'selectThisWorkspaceId',
  (rawNodes, workspaceId) => {
    if (isNil(rawNodes) || isNil(workspaceId)) return []
    const nodesToRender = filter(rawNodes, (rawNode) => { return rawNode.workspace_id === workspaceId })
    return map(nodesToRender, (rawNode) => {
      return {
        id: rawNode.id,
        label: `(${rawNode.id}) ${rawNode.label}`,
        symbolType: rawNode.node_type === 'question' ? 'diamond' : 'circle',
        color: rawNode.node_type === 'question' ? rawNode.resolved ? 'grey' : 'red' : rawNode.resolved ? 'gray' : 'lightgreen'
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
bundle.selectNodeFormData = (state) => state.nodes.nodeFormData
bundle.selectNodeTypeToBeCreated = (state) => state.nodes.nodeTypeToBeCreated

bundle.reactNodesFetch = createSelector(
  'selectNodesShouldUpdate',
  (shouldUpdate) => {
    if (shouldUpdate) {
      return { actionCreator: 'doFetchNodes' }
    }
    return false
  }
)

export default bundle
