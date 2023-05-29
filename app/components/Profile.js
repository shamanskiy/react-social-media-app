import React, { useEffect, useContext } from "react"
import { useParams, NavLink, Routes, Route } from "react-router-dom"
import { useImmer } from "use-immer"
import Axios from "axios"

import StateContext from "../StateContext"
import Page from "./Page"

import ProfilePosts from "./ProfilePosts"
import ProfileFollowers from "./ProfileFollowers"
import ProfileFollowing from "./ProfileFollowing"

function Profile() {
  // pull username parameter from the URL
  const { username } = useParams()
  const appState = useContext(StateContext)
  const [state, setState] = useImmer({
    followActionLoading: false,
    startFollowingRequestCount: 0,
    stopFollowingRequestCount: 0,
    profileData: {
      profileUsername: "...",
      profileAvatar: "https://gravatar.com/avatar/placeholder?s=128",
      isFollowing: false,
      counts: {
        postCount: "",
        followerCount: "",
        followingCount: ""
      }
    }
  })

  useEffect(() => {
    const request = Axios.CancelToken.source()

    async function fetchData() {
      try {
        const response = await Axios.post(`/profile/${username}`, { token: appState.user.token }, { cancelToken: request.token })
        setState(draft => {
          draft.profileData = response.data
        })
      } catch (error) {
        console.log(error)
      }
    }
    fetchData()

    // a clean up function to run when the component is unmounted
    return () => {
      request.cancel()
    }
  }, [username])

  useEffect(() => {
    if (state.startFollowingRequestCount) {
      const request = Axios.CancelToken.source()
      setState(draft => {
        draft.followActionLoading = true
      })

      async function sendRequest() {
        try {
          const response = await Axios.post(
            `/addFollow/${state.profileData.profileUsername}`,
            { token: appState.user.token },
            { cancelToken: request.token }
          )
          setState(draft => {
            draft.profileData.isFollowing = true
            draft.profileData.counts.followerCount++
            draft.followActionLoading = false
          })
        } catch (error) {
          console.log(error)
        }
      }
      sendRequest()

      // a clean up function to run when the component is unmounted
      return () => {
        request.cancel()
      }
    }
  }, [state.startFollowingRequestCount])

  useEffect(() => {
    if (state.stopFollowingRequestCount) {
      const request = Axios.CancelToken.source()
      setState(draft => {
        draft.followActionLoading = true
      })

      async function sendRequest() {
        try {
          const response = await Axios.post(
            `/removeFollow/${state.profileData.profileUsername}`,
            { token: appState.user.token },
            { cancelToken: request.token }
          )
          setState(draft => {
            draft.profileData.counts.followerCount--
            draft.profileData.isFollowing = false
            draft.followActionLoading = false
          })
        } catch (error) {
          console.log(error)
        }
      }
      sendRequest()

      // a clean up function to run when the component is unmounted
      return () => {
        request.cancel()
      }
    }
  }, [state.stopFollowingRequestCount])

  function showFollowButton() {
    return (
      appState.loggedIn &&
      !state.profileData.isFollowing &&
      state.profileData.profileUsername != appState.user.username &&
      state.profileData.profileUsername != "..."
    )
  }

  function showUnfollowButton() {
    return (
      appState.loggedIn &&
      state.profileData.isFollowing &&
      state.profileData.profileUsername != appState.user.username &&
      state.profileData.profileUsername != "..."
    )
  }

  function startFollowing(e) {
    setState(draft => {
      draft.startFollowingRequestCount++
    })
  }

  function stopFollowing(e) {
    setState(draft => {
      draft.stopFollowingRequestCount++
    })
  }

  return (
    <Page title="Profile Screen">
      <h2>
        <img className="avatar-small" src={state.profileData.profileAvatar} /> {state.profileData.profileUsername}
        {showFollowButton() && (
          <button onClick={startFollowing} disabled={state.followActionLoading} className="btn btn-primary btn-sm ml-2">
            Follow <i className="fas fa-user-plus"></i>
          </button>
        )}
        {showUnfollowButton() && (
          <button onClick={stopFollowing} disabled={state.followActionLoading} className="btn btn-danger btn-sm ml-2">
            Unfollow <i className="fas fa-user-times"></i>
          </button>
        )}
      </h2>

      <div className="profile-nav nav nav-tabs pt-2 mb-4">
        <NavLink to="" end className="nav-item nav-link">
          Posts: {state.profileData.counts.postCount}
        </NavLink>
        <NavLink to="followers" className="nav-item nav-link">
          Followers: {state.profileData.counts.followerCount}
        </NavLink>
        <NavLink to="following" className="nav-item nav-link">
          Following: {state.profileData.counts.followingCount}
        </NavLink>
      </div>

      <Routes>
        <Route path="" element={<ProfilePosts />} />
        <Route path="followers" element={<ProfileFollowers />} />
        <Route path="following" element={<ProfileFollowing />} />
      </Routes>
    </Page>
  )
}

export default Profile
