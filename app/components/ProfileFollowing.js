import React, { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"

import Axios from "axios"
import LoadingDotsIcon from "./LoadingDotsIcon"

function ProfileFollowing() {
  // pull username parameter from the URL
  const { username } = useParams()
  const [isLoading, setIsLoading] = useState(true)
  const [posts, setPosts] = useState([])

  useEffect(() => {
    const request = Axios.CancelToken.source()

    async function fetchPosts() {
      try {
        const response = await Axios.get(`/profile/${username}/following`, { cancelToken: request.token })
        setPosts(response.data)
        setIsLoading(false)
      } catch (error) {
        console.log("There was a problem or a request was canceled")
      }
    }
    fetchPosts()

    // a clean up function to run when the component is unmounted
    return () => {
      request.cancel()
    }
  }, [username])

  if (isLoading) return <LoadingDotsIcon />

  return (
    <div className="list-group">
      {posts.map((follower, index) => {
        return (
          <Link key={index} to={`/profile/${follower.username}`} className="list-group-item list-group-item-action">
            <img className="avatar-tiny" src={follower.avatar} /> {follower.username}
          </Link>
        )
      })}
    </div>
  )
}

export default ProfileFollowing
