import { Link } from "@tanstack/react-router";

type Link = {
  path: string;
  label: string;
};

export default function Header() {
  const Links: Link[] = [
    { path: "/form", label: "Form" },
    { path: "/list", label: "List" },
    { path: "/registration", label: "Registration" },
  ];

  return (
    <header className="w-full fixed top-0 border-b border-gray-400 bg-white ">
      <nav className="w-100 h-15  mx-auto flex items-center justify-center text-center text-gray-600">
        {Links.map((link) => (
          <Link
            to={link.path}
            className="w-50 p-2 mx-2 "
            activeProps={{ className: "font-bold text-gray-800" }}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
