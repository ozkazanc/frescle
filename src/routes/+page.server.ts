//import type { FrescoData } from '$lib/frescodata';
import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit'

import { frescoData } from '$lib/frescodata';
import * as db from "$lib/db/mongo";

//export const ssr = false;

export const load: PageServerLoad = async () => {	
	const data = await db.newsletter.find({}).toArray();
	console.log(data);

	return {
		fresco: JSON.stringify(frescoData)
	};
};

export const actions = {
	subscribe: async ({ cookies, request }) => {
		console.log("Request received");
		const data = await request.formData();
		console.log(data);
		
		const email = data.get('email') as string;
		console.log(email);
		
		try {
			db.subscribe(email);
		} catch (error) {
			return fail(422, {
				email: data.get('email'),
				error: error instanceof Error ? error.message : "Unknown error."
			});
		}
	}
} satisfies Actions;
