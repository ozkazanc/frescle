import { Collection, MongoClient } from "mongodb";
import { MONGODB_URL } from '$env/static/private';

interface Newsletter {
    email: string,
    subscribed: boolean,
    created_at: Date,
    token: string
}
export let newsletter = {} as Collection<Newsletter>;
//export const collections: Newsletter = {}
//export let newsletter_collection: Collection = {}

export async function start_mongo() {
    const client = new MongoClient(MONGODB_URL);
    
    console.log("Starting mongo...");
    await client.connect()
    .then(() => {
        console.log("MongoClient started.");
    })
    .catch((e) => console.error(e));

    const db = client.db("users");
    newsletter = db.collection<Newsletter>("newsletter");

    console.log(`Successfully connected to database: ${db.databaseName} and collection: ${newsletter}`);
}
