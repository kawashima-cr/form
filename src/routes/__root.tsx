import { Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import Header from "../layout/Header";

export const Route = createRootRoute({
  component: () => (
    <div>
      <Header />
      <main className="pt-30 pb-15 max-w-7xl mx-auto">
        <Outlet />
      </main>

      <TanStackRouterDevtools position="bottom-right" />
    </div>
  ),
});
