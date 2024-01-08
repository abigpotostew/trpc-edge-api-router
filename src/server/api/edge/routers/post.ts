import {createTRPCRouter} from "~/server/api/trpc";
import {publicProcedureDbEdge} from "../../middleware/db-edge";
import {z} from "zod";

export const postRouterEdge = createTRPCRouter({
    hello: publicProcedureDbEdge
        .input(z.object({text: z.string()}))
        .query(({input}) => {
            return {
                greeting: `Hello Edge API ${input.text}`,
            };
        }),
    getLatest: publicProcedureDbEdge.query(({ctx}) => {
        return ctx.db.selectFrom('Post').selectAll().orderBy('createdAt', 'desc').limit(1).executeTakeFirst() ?? null;
    }),
});
