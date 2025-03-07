import { MongoClient } from "mongodb";
import { MONGODB_URL, DB_NAME, DB_COLL_NAME } from '$env/static/private';


const client = new MongoClient(MONGODB_URL);
export const newsletter = client.db(DB_NAME).collection(DB_COLL_NAME);

export function start_mongo(): Promise<MongoClient> {
    console.log("Starting mongo...");
    return client.connect()
}
