import React, { useState, useEffect, useContext } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import Axios from "axios"
import ReactMarkdown from "react-markdown"
import ReactTooltip from "react-tooltip"

import Page from "./Page"
import DispatchContext from "../DispatchContext"
import StateContext from "../StateContext"
import LoadingPage from "./LoadingPage"
import NotFoundPage from "./NotFoundPage"

function ComponentName() {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)
  const navigate = useNavigate()

  const { id } = useParams()
  const [isLoading, setIsLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [post, setPost] = useState()

  useEffect(() => {
    const request = Axios.CancelToken.source()

    async function fetchPost() {
      try {
        const response = await Axios.get(`/post/${id}`, { cancelToken: request.token })
        if (response.data) {
          setPost(response.data)
        } else {
          setNotFound(true)
        }
        setIsLoading(false)
      } catch (error) {
        console.log("There was a problem or a request was canceled")
      }
    }
    fetchPost()

    // a clean up function to run when the component is unmounted
    return () => {
      request.cancel()
    }
  }, [id])

  if (notFound) return <NotFoundPage />
  if (isLoading) return <LoadingPage />

  const date = new Date(post.createdDate)
  const dateFormatted = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`

  function isOwner() {
    return appState.user.username == post.author.username
  }

  async function deleteHandler(e) {
    const areYouSure = window.confirm("Do you really want to delete this post?")
    if (areYouSure) {
      try {
        const response = await Axios.delete(`/post/${id}`, { data: { token: appState.user.token } })
        if (response.data == "Success") {
          appDispatch({ type: "flashMessage", value: "Your post was deleted." })
          navigate(`/profile/${post.author.username}`)
        }
      } catch (e) {
        console.log("there was a problem deleting the post")
      }
    }
  }

  return (
    <Page title={post.title}>
      <div className="d-flex justify-content-between">
        <h2>{post.title}</h2>
        {isOwner() && (
          <span className="pt-2">
            <Link to={`/post/${id}/edit`} data-tip="Edit post" data-for="editTooltip" className="text-primary mr-2">
              <i className="fas fa-edit"></i>
            </Link>
            <ReactTooltip id="editTooltip" className="custom-tooltip" />{" "}
            <a onClick={deleteHandler} data-tip="Delete post" data-for="deleteTooltip" className="delete-post-button text-danger">
              <i className="fas fa-trash"></i>
            </a>
            <ReactTooltip id="deleteTooltip" className="custom-tooltip" />
          </span>
        )}
      </div>

      <p className="text-muted small mb-4">
        <Link to={`/profile/${post.author.username}`}>
          <img className="avatar-tiny" src={post.author.avatar} />
        </Link>
        Posted by <Link to={`/profile/${post.author.username}`}>{post.author.username}</Link> on {dateFormatted}
      </p>

      <div className="body-content">
        <ReactMarkdown
          children={post.body}
          allowedElements={["p", "br", "strong", "em", "h1", "h2", "h3", "h4", "h5", "h6", "ul", "ol", "li"]}
        />
      </div>
    </Page>
  )
}

export default ComponentName
