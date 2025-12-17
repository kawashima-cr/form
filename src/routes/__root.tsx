import { Link, Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

export const Route = createRootRoute({
  component: () => (
    <div>
      <nav className="w-100 h-20 mx-auto flex items-center justify-center mb-10 text-center">
        <Link
          to="/form"
          className="w-50 p-2 border border-zinc-300 hover:border-zinc-400 rounded-3xl mr-4 bg-indigo-50 hover:bg-indigo-100"
          activeProps={{ className: "ring-2 ring-indigo-300" }}
        >
          Form
        </Link>

        <Link
          to="/list"
          className="w-50 p-2 border border-zinc-300 hover:border-zinc-400 rounded-3xl mr-4 bg-indigo-50 hover:bg-indigo-100"
          activeProps={{ className: "ring-2 ring-indigo-300" }}
        >
          List
        </Link>

        <Link
          to="/registration"
          className="w-50 p-2 border border-zinc-300 hover:border-zinc-400 rounded-3xl bg-indigo-50 hover:bg-indigo-100"
          activeProps={{ className: "ring-2 ring-indigo-300" }}
        >
          Registration
        </Link>
        {/* <Link to="/posts" activeProps={{ style: { fontWeight: 700 } }}>
          Post 1
        </Link>
        <Link
          to="/posts/$postId"
          params={{ postId: "1" }}
          activeProps={{ style: { fontWeight: 700 } }}
        >
          Post 1
        </Link> */}
      </nav>

      <Outlet />
      <TanStackRouterDevtools position="bottom-right" />
    </div>
  ),
});
