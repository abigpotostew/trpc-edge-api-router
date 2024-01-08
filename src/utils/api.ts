/**
 * This is the client-side entrypoint for your tRPC API. It is used to create the `api` object which
 * contains the Next.js App-wrapper, as well as your type-safe React Query hooks.
 *
 * We also create a few inference helpers for input and output types.
 */
import {httpLink, loggerLink} from "@trpc/client";
import {createTRPCNext} from "@trpc/next";
import {type inferRouterInputs, type inferRouterOutputs} from "@trpc/server";
import superjson from "superjson";

import {type AppRouter} from "~/server/api/root";

const getBaseUrl = () => {
    if (typeof window !== "undefined") return ""; // browser should use relative url
    if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url
    return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
};

/** A set of type-safe react-query hooks for your tRPC API. */
export const api = createTRPCNext<AppRouter>({
    config() {
        return {
            /**
             * Transformer used for data de-serialization from the server.
             *
             * @see https://trpc.io/docs/data-transformers
             */
            transformer: superjson,

            /**
             * Links used to determine request flow from client to server.
             *
             * @see https://trpc.io/docs/links
             */
            links: [
                loggerLink({
                    enabled: (opts) =>
                        process.env.NODE_ENV === "development" ||
                        (opts.direction === "down" && opts.result instanceof Error),
                }),
                // httpBatchLink({
                //   url: `${getBaseUrl()}/api/trpc`,
                // }),
                //dynamic link to route requests to different servers (default api or edge api)
                (runtime) => {
                    // An API can route to the default server or the edge server
                    const servers = {
                        defaultServer: httpLink({
                            url: `${getBaseUrl()}/api/trpc`,
                        })(runtime),
                        edge: httpLink({
                            url: `${getBaseUrl()}/api/trpc-edge`,
                        })(runtime),
                    };
                    return (ctx) => {
                        const {op} = ctx;
                        // split the path by `.` as the first part will signify the server target name
                        const pathParts = op.path.split('.');

                        // edge routed apis will begin `edge.`
                        const serverName = pathParts[0];
                        if (serverName === 'edge') {
                            pathParts.shift();
                        }
                        const path = pathParts.join('.');
                        const link = serverName === 'edge' ? servers.edge : servers.defaultServer;
                        return link({
                            ...ctx,
                            op: {
                                ...op,
                                // override the target path with the prefix removed
                                path,
                            },
                        });
                    };
                },
            ],
        };
    },
    /**
     * Whether tRPC should await queries when server rendering pages.
     *
     * @see https://trpc.io/docs/nextjs#ssr-boolean-default-false
     */
    ssr: false,
});

/**
 * Inference helper for inputs.
 *
 * @example type HelloInput = RouterInputs['example']['hello']
 */
export type RouterInputs = inferRouterInputs<AppRouter>;

/**
 * Inference helper for outputs.
 *
 * @example type HelloOutput = RouterOutputs['example']['hello']
 */
export type RouterOutputs = inferRouterOutputs<AppRouter>;
