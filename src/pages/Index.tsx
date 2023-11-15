import React from "react"
import { Link } from "react-router-dom"

export default function Index() {
    return (
        <div>
            <h1>Index Page</h1>
            <Link to="/about">About</Link>
        </div>
    )
}
