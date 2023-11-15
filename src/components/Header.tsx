import { Link } from "react-router-dom";

export default function Header() {
    const links = [
        { name: "Home", path: "/" },
        { name: "About", path: "/about" },
        { name: "Not", path: "/not" }
    ]

    return (
        <header className="flex items-center bg-slate-500 text-white">
            <Link to="/" className="text-lg font-bold px-4 py-2 transition-colors hover:text-blue-200">Home</Link>
            <div className="flex items-center gap-2">
                {links.map(link => (
                    <Link key={link.name} to={link.path} className="text-sm py-2 px-2 transition-colors hover:text-blue-200">{link.name}</Link>
                ))}
            </div>
        </header >
    )
}
