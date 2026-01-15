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
    { path: "/orderList", label: "Order List" },
  ];

  return (
    <header className="w-full fixed top-0 border-b border-gray-300 bg-neutral-50 shadow-2xl ">
      <nav className="h-15  mx-auto flex items-center justify-center text-center text-gray-600">
        {Links.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className="min-w-30 p-2 mx-2 hover:text-gray-800 transition-all"
            activeProps={{
              className: "font-bold text-gray-800 border-b-2 border-indigo-600",
            }}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
