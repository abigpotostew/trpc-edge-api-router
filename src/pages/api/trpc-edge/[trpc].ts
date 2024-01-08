/**
 * This file contains tRPC's HTTP Edge API response handler
 */
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { NextRequest } from 'next/server';
import {appRouterEdge} from "../../../server/api/edge/root-edge";

export const config = {
    runtime: 'edge',
};

//from https://github.com/trpc/trpc/blob/1d017dd603cdf32689258baa487bc43166d9d199/examples/next-edge-runtime/src/pages/api/trpc/%5Btrpc%5D.ts
// export API handler
export default async function handler(req: NextRequest) {
    return fetchRequestHandler({
        // this endpoint must match the edge http link in `src/utils/api.ts`
        endpoint: '/api/trpc-edge',
        router: appRouterEdge, //specifically need to use appRouterEdge which is compatible with edge runtime without all the incompatible imports from appRouter such as prisma.
        req,
        createContext: () => ({}),
    });
}
