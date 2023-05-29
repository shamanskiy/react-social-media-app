import React, { useEffect, useContext } from "react"
import { Link } from "react-router-dom"
import ReactTooltip from "react-tooltip"

import DispatchContext from "../DispatchContext"
import StateContext from "../StateContext"

function HeaderLoggedIn() {
  const appDispatch = useContext(DispatchContext)
  const appState = useContext(StateContext)

  function handleLogOut() {
    appDispatch({ type: "logout" })
    appDispatch({ type: "flashMessage", value: "You have successfully logged out." })
  }

  function handlerSearchIcon(e) {
    e.preventDefault()
    appDispatch({ type: "openSearch" })
  }

  return (
    <div className="flex-row my-3 my-md-0">
      <a
        onClick={handlerSearchIcon}
        data-tip="Open search"
        data-for="openSearchTooltip"
        href="#"
        className="text-white mr-2 header-search-icon"
      >
        <i className="fas fa-search"></i>
      </a>
      <ReactTooltip id="openSearchTooltip" className="custom-tooltip" place="bottom" />{" "}
      <span
        onClick={() => appDispatch({ type: "toggleChat" })}
        className={"mr-2 header-chat-icon " + (appState.unreadChatCount ? "text-danger" : "text-white")}
        data-tip="Open chat"
        data-for="openChatTooltip"
      >
        <i className="fas fa-comment"></i>
        {appState.unreadChatCount ? (
          <span className="chat-count-badge text-white">{appState.unreadChatCount < 10 ? appState.unreadChatCount : "9+"}</span>
        ) : (
          ""
        )}
      </span>
      <ReactTooltip id="openChatTooltip" className="custom-tooltip" place="bottom" />{" "}
      <Link to={`/profile/${appState.user.username}`} className="mr-2" data-tip="My profile" data-for="myProfileTooltip">
        <img className="small-header-avatar" src={appState.user.avatar} />
      </Link>
      <ReactTooltip id="myProfileTooltip" className="custom-tooltip" place="bottom" />{" "}
      <Link className="btn btn-sm btn-success mr-2" to="/create-post">
        Create Post
      </Link>
      <button onClick={handleLogOut} className="btn btn-sm btn-secondary">
        Sign Out
      </button>
    </div>
  )
}

export default HeaderLoggedIn
