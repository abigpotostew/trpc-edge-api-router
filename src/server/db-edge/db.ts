import {Kysely} from 'kysely'
import {PlanetScaleDialect} from 'kysely-planetscale'
import type {DBSchema} from "./schema";
import {env} from "../../env";

export type EdgeDb = Kysely<DBSchema>;

const connect = (): EdgeDb => {
    return new Kysely<DBSchema>({
        dialect: new PlanetScaleDialect({
            //warning, pscale connect proxy doesn't work here. You must use a full connection string.
            url: env.DATABASE_URL,
        }),
        log(event) {
            if (env.KYSLEY_LOGGING && event.level === 'query') {
                const params = event.query.parameters
                    .map((p) => (typeof p === 'string' ? `'${p}'` : p))
                    .join(',');
                console.log(event.query.sql, ` Parameters: [${params}]`);
            }
        },
    });
};

let defaultConnectionInstance: Kysely<DBSchema> | null = null;
export const defaultDbConnection = () => {
    if (!defaultConnectionInstance) {
        defaultConnectionInstance = connect();
    }
    return defaultConnectionInstance;
};
