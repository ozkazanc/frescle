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
        //throw new Error("Email cannot be empty.");
        return;
    }

    // Insert
    console.log(`[MongoDB Insert \"${DB_COLL_NAME}\"]: ${email}`);

    // Rely on db response to see email/token duplicates
    let inserted: boolean = false;
    while(!inserted) {
        try {
            const result = await newsletter.insertOne({
                email: email,
                subscribed: true,
                created_at: new Date(Date.now()).toISOString(),
                token: generateToken()
            });
            console.log(result);
            inserted = result.acknowledged;
        }
        catch(e: any) {
            //console.error(e)
            if(e.errorResponse.code === 11000 && e.errmsg.includes("index: email_1")) {
                console.log("Duplicate email");
                inserted = true; // Silently accept dupe email, don't show error

                // Try to reset the 'subscribed' field to true, in case the user wants to re-subscribe.
                try {
                    const result = await newsletter.updateOne(
                        { email: email },
                        { $set: { subscribed: true } }
                    );
                    console.log(result);
                }
                catch(e: any) {
                    throw e;
                }

            }
            else if(e.errorResponse.code === 11000 && e.errmsg.includes("index: token_1")) {
                console.log("Duplicate token");
            }
        }
    }
}

export async function unsubscribe(token: string) {
    try {
        const result = await newsletter.updateOne(
            { token: token },
            { $set: { subscribed: false } }
        );
        console.log(result);
    }
    catch(e: any) {
        throw e;
    }
}


function generateToken(): string {
    const CHARS: string = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const TOKEN_LENGTH = 32;
    let token: string = "";
    
    for(let i = 0; i < TOKEN_LENGTH; i++){
        token += CHARS[Math.floor(Math.random() * CHARS.length)];
    }
    return token;
}
