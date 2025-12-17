import { Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import Header from "../components/layout/Header";

export const Route = createRootRoute({
  component: () => (
    <div>
      <Header />
      <main className="pt-20 pb-5 max-w-7xl mx-auto">
        <Outlet />
      </main>

      <TanStackRouterDevtools position="bottom-right" />
    </div>
  ),
});
