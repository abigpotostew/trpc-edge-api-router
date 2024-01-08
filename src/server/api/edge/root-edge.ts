import { createTRPCRouter } from "../trpc";
import {postRouterEdge} from "./routers/post";

/**
 * This is the edge root router for apis called through the trpc edge API
 *
 * All routers added in /api/edge/routers should be manually added here.
 */
export const appRouterEdge = createTRPCRouter({
    postEdge: postRouterEdge,
});

