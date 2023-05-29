import React, { useEffect, useContext } from "react"
import { useImmerReducer } from "use-immer"
import { useParams, Link, useNavigate } from "react-router-dom"
import Axios from "axios"

import Page from "./Page"
import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"
import NotFoundPage from "./NotFoundPage"
import LoadingPage from "./LoadingPage"

function EditPost() {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)
  const navigate = useNavigate()

  const originalState = {
    title: {
      value: "",
      hasErrors: false,
      errorMessage: ""
    },
    body: {
      value: "",
      hasErrors: false,
      errorMessage: ""
    },
    hasErrors: false,
    isFetching: true,
    isSaving: false,
    id: useParams().id,
    sendCount: 0,
    notFound: false
  }
  function ourReducer(draft, action) {
    switch (action.type) {
      case "fetchComplete":
        draft.title.value = action.value.title
        draft.body.value = action.value.body
        draft.isFetching = false
        return
      case "titleChange":
        draft.title.value = action.value
        if (!action.value.trim()) {
          draft.title.errorMessage = "You must provide a title"
        } else {
          draft.title.errorMessage = ""
        }
        draft.hasErrors = draft.title.errorMessage || draft.body.errorMessage
        return
      case "bodyChange":
        draft.body.value = action.value
        if (!action.value.trim()) {
          draft.body.errorMessage = "You must provide a post content"
        } else {
          draft.body.errorMessage = ""
        }
        draft.hasErrors = draft.title.errorMessage || draft.body.errorMessage
        return
      case "submitSaveRequest":
        if (!draft.hasErrors) {
          draft.sendCount++
        }
        return
      case "saveRequestStarted":
        draft.isSaving = true
        return
      case "saveRequestFinished":
        draft.isSaving = false
        return
      case "notFound":
        draft.notFound = true
        draft.isFetching = false
        return
    }
  }
  const [state, dispatch] = useImmerReducer(ourReducer, originalState)

  function submitHandler(e) {
    e.preventDefault()
    dispatch({ type: "submitSaveRequest" })
  }

  useEffect(() => {
    const request = Axios.CancelToken.source()

    async function fetchPost() {
      try {
        const response = await Axios.get(`/post/${state.id}`, { cancelToken: request.token })
        if (response.data) {
          dispatch({ type: "fetchComplete", value: response.data })
          if (appState.user.username != response.data.author.username) {
            appDispatch({ type: "flashMessage", value: "You do not have permission to edit this post." })
            navigate("/")
          }
        } else {
          dispatch({ type: "notFound" })
        }
      } catch (error) {
        console.log("There was a problem or a request was canceled")
      }
    }
    fetchPost()

    // a clean up function to run when the component is unmounted
    return () => {
      request.cancel()
    }
  }, [])

  useEffect(() => {
    if (state.sendCount) {
      dispatch({ type: "saveRequestStarted" })
      const request = Axios.CancelToken.source()

      async function fetchPost() {
        try {
          const response = await Axios.post(
            `/post/${state.id}/edit`,
            { title: state.title.value, body: state.body.value, token: appState.user.token },
            { cancelToken: request.token }
          )
          dispatch({ type: "saveRequestFinished" })
          appDispatch({ type: "flashMessage", value: "Post was updated." })
        } catch (error) {
          console.log("There was a problem or a request was canceled")
        }
      }
      fetchPost()

      // a clean up function to run when the component is unmounted
      return () => {
        request.cancel()
      }
    }
  }, [state.sendCount])

  if (state.notFound) return <NotFoundPage />

  if (state.isFetching) return <LoadingPage />

  return (
    <Page title="Edit Post">
      <Link to={`/post/${state.id}`} className="small font-weight-bold">
        &laquo; Back to the post
      </Link>
      <form onSubmit={submitHandler} className="mt-3">
        <div className="form-group">
          <label htmlFor="post-title" className="text-muted mb-1">
            <small>Title</small>
          </label>
          <input
            onChange={e => dispatch({ type: "titleChange", value: e.target.value })}
            value={state.title.value}
            autoFocus
            name="title"
            id="post-title"
            className="form-control form-control-lg form-control-title"
            type="text"
            placeholder=""
            autoComplete="off"
          />
          {state.title.errorMessage && <div className="alert alert-danger small liveValidateMessage">{state.title.errorMessage}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="post-body" className="text-muted mb-1 d-block">
            <small>Body Content</small>
          </label>
          <textarea
            onChange={e => dispatch({ type: "bodyChange", value: e.target.value })}
            value={state.body.value}
            name="body"
            id="post-body"
            className="body-content tall-textarea form-control"
            type="text"
          />
          {state.body.errorMessage && <div className="alert alert-danger small liveValidateMessage">{state.body.errorMessage}</div>}
        </div>

        <button className="btn btn-primary" disabled={state.isSaving}>
          {state.isSaving ? "Saving..." : "Save changes"}
        </button>
      </form>
    </Page>
  )
}

export default EditPost
