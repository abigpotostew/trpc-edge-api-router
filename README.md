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

##### Call the equivalent edge API route:
```typescript jsx
const latestPost = api.edge.post.getLatest.useQuery();
```

For demo purposes the above API is duplicated across both edge and non-edge routes to show how the same calls differs between traditional and edge functions. In a real world scenario you may move a performance critical API from the traditional backend to the edge backend without duplication.


### Files changed from `create-t3-app`:
- `src/utils/api.ts` - the trpc client dynamically routes the request to either the edge or the non-edge backend based on the request path.
- `src/pages/api/trpc-edge/[trpc].ts` - an http handler using trpc's edge compatible handler which only accepts `api.edge.*` requests from the client. This file and all imported files must only import edge compatible files and dependencies. This is where we use kyesly to connect to Planetscale instead of prisma.
- `src/server/api/root.ts` - This seamlessly combines the edge and non-edge routes into a single TRPC router for client type safety.

### References:
- https://planetscale.com/blog/introducing-the-planetscale-serverless-driver-for-javascript
- https://depot.dev/blog/kysely-dialect-planetscale
- https://davidparks.dev/blog/type-safe-database-access-at-the-edge-with-next-and-planetscale/#kysely 


This is a [T3 Stack](https://create.t3.gg/) project bootstrapped with `create-t3-app`