# TRPC and Planetscale using Next.js Vercel Edge Functions Demo

- [x] You may find this implementation useful if you use Next.js, Planetscale, and TRPC and you have a performance critical API that you want to move to an edge function.

This project shows how to take advantage of Planetscale's serverless driver and Vercel's edge functions to speed up your API calls while still getting the benefits of a seamless TRPC integration.

The key takeaway of this demo is that you can connect some TRPC routes to an edge function and others to a traditional API route. This allows you to take advantage of the speed of edge functions while still having the flexibility of a traditional API route. All within the same Vercel deployment.

---

### How to use:

##### Call the traditional non-edge API route:


```typescript jsx
const latestPost = api.post.getLatest.useQuery();
```

This example uses prisma to connect to planetscale. Prisma is not compatible with edge functions so this call needs to be routed to the traditional backend.

##### Call the equivalent edge API route:
```typescript jsx
const latestPost = api.edge.post.getLatest.useQuery();
```

This edge function uses kysely to connect to planetscale. Kysely is compatible with planetscale's serverless driver and edge functions so this call can be routed to the edge backend.

For demo purposes the APIs are duplicated across both edge and non-edge routes to show how the same call differs between traditional and edge functions. In a real world scenario you may move a performance critical API from the traditional backend to the edge backend without duplication.

---

### Files changed from `create-t3-app`:
- [src/utils/api.ts](src/utils/api.ts) - the trpc client dynamically routes the request to either the edge or the non-edge backend based on the request path.
- [src/pages/api/trpc-edge/[trpc].ts](src/pages/api/trpc-edge/[trpc].ts) - an http handler using trpc's edge compatible handler which only accepts `api.edge.*` requests from the client. This file and all imported files must only import edge compatible files and dependencies. This is where we use kyesly to connect to Planetscale instead of prisma.
- [src/server/api/root.ts](src/server/api/root.ts) - This seamlessly combines the edge and non-edge routes into a single TRPC router for client type safety.
- [src/server/api/middleware/db-context.ts](src/server/api/middleware/db-context.ts) - Traditional function alls get the prisma database connection added to the request context.
- [src/server/api/middleware/edge-db-context.ts](src/server/api/middleware/edge-db-context.ts) - Edge function calls get the kysely database connection added to the request context.
- [src/server/api/edge/edge-router-root.ts](src/server/api/edge/edge-router-root.ts) - TRPC server router for edge APIs. Only import code and dependencies that are compatible with edge functions.

### References:
- https://planetscale.com/blog/introducing-the-planetscale-serverless-driver-for-javascript
- https://depot.dev/blog/kysely-dialect-planetscale
- https://davidparks.dev/blog/type-safe-database-access-at-the-edge-with-next-and-planetscale/#kysely 


This is a [T3 Stack](https://create.t3.gg/) project bootstrapped with `create-t3-app`