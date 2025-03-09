//import type { FrescoData } from '$lib/frescodata';
import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit'

import { frescoData } from '$lib/frescodata';
import * as db from "$lib/db/mongo";

//export const ssr = false;

export const load: PageServerLoad = async ({ url }) => {	
	//const data = await db.newsletter.find({}).toArray();
	//console.log(data);
	
	// URL Example: http://localhost:5173/?token=JVGo1RmKLW6IjAijjE92r4TOg61jm9TS&unsubscribe
	//console.log(url);
	const unsubscribe = url.searchParams.has("unsubscribe");
	const emailToken = url.searchParams.get("token");
	if(unsubscribe && emailToken) {
		// Quick token sanity check
		const TOKEN_LENGTH = 32;
		if(emailToken.toString().length == TOKEN_LENGTH) {
			// Only then go into the db
			console.log("Sorry to see you go.");
			try {
				await db.unsubscribe(emailToken.toString());
				return {
					unsubscribed: true
				}
			} catch (error) {
				return fail(422, {
					unsubscribed: false,
					error: error instanceof Error ? error.message : "Unknown error."
				});
			}
		}
	}

	return {
		fresco: JSON.stringify(frescoData)
	};
};

export const actions = {
	subscribe: async ({ cookies, request }) => {
		console.log("Subscription request received");
		
		const data = await request.formData();
		console.log(data);
		const email = data.get('email') as string;
		
		try {
			await db.subscribe(email);
			return {
				email: email,
				success: true
			}
		} catch (error) {
			return fail(422, {
				invalid_email: email,
				error: error instanceof Error ? error.message : "Unknown error."
			});
		}
	}
} satisfies Actions;
