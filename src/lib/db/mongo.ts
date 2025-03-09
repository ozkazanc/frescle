import { MongoClient } from "mongodb";
import { MONGODB_URL, DB_NAME, DB_COLL_NAME } from '$env/static/private';


const client = new MongoClient(MONGODB_URL);
export const newsletter = client.db(DB_NAME).collection(DB_COLL_NAME);

export function start_mongo(): Promise<MongoClient> {
    console.log("Starting mongo...");
    return client.connect()
}

export async function subscribe(email: string) {
    if(email === "") {
        throw new Error("Email cannot be empty.");
    }

    // Try to Insert
    console.log(`[MongoDB Insert \"${DB_COLL_NAME}\"]: ${email}`);

    // Check for duplicate
    const duplicate = await newsletter.findOne({ email: email} );
    if(duplicate) {
        //throw new Error(`\"${email}\" already exists.`);
        return; // Fail silently: don't add but don't raise an error
    }

    // Create a token for unsubscription


    // Insert
}
