import React from "react"
import { HashRouter, Link, Route, Routes } from "react-router-dom"
import Index from "./pages/Index"
import About from "./pages/About"
import Header from "./components/Header"
import NotFound from "./pages/NotFound"

export default function App() {
    return (
        <HashRouter>
            <Header></Header>
            <Routes>
                <Route path="/" Component={Index}></Route>
                <Route path="/about" Component={About}></Route>
                <Route path="/*" Component={NotFound}></Route>
            </Routes>
        </HashRouter>
    )
}
