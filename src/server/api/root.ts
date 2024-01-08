import { postRouter } from "~/server/api/routers/post";
import { createTRPCRouter } from "~/server/api/trpc";
import {appRouterEdge} from "./edge/edge-router-root";


export const nonEdgeRoutes = {
  post: postRouter,
};

/**
 * This is the primary router for your server which includes both the edge and non-edge routes.
 */
export const appRouter = createTRPCRouter({
  edge: appRouterEdge,
  ...nonEdgeRoutes,
});


// export type definition of API
export type AppRouter = typeof appRouter;
