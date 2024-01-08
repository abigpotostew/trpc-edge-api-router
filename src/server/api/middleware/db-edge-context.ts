import {publicProcedure} from "../trpc";
import {defaultDbConnection} from "../../db-edge/db";

// in the edge api context, initialize `db` to the planetscale fetch compatible dialect database connection
// see https://depot.dev/blog/kysely-dialect-planetscale
export const publicProcedureDbEdge = publicProcedure.use(async (opts) => {
    const {ctx} = opts;
    
    return opts.next({
        ctx: {
            db: defaultDbConnection(),
        },
    });
});