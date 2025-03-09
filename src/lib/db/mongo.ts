import { MongoClient } from "mongodb";
import { MONGODB_URL, DB_NAME, DB_COLL_NAME } from '$env/static/private';


const client = new MongoClient(MONGODB_URL);
export const newsletter = client.db(DB_NAME).collection(DB_COLL_NAME);

export function start_mongo(): Promise<MongoClient> {
    console.log("Starting mongo...");
    return client.connect()
}

export function subscribe(email: string) {
    if(email === "") {
        throw new Error("Email cannot be empty.");
    }
    else if(email === "hi") {
        throw new Error("Duplicate " + email);
    }
    // Try to insert
}
