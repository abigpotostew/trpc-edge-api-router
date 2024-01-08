import { publicProcedure } from "../trpc";
import {db} from "../../db";

// in the primary api context, initialize `db` to the planetscale mysql driver connection which is not compatible
// with the edge API. Only use this for APIs defined outside of the edge API router.
export const publicProcedureDb = publicProcedure.use(async (opts) => {
    const { ctx } = opts;
    
    return opts.next({
        ctx: {
            db,
        },
    });
});