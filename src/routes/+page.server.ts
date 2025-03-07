//import type { FrescoData } from '$lib/frescodata';
import type { PageServerLoad } from './$types';
import { frescoData } from '$lib/frescodata';
import { newsletter } from "$lib/db/mongo";

//export const ssr = false;

export const load: PageServerLoad = async () => {	
	const data = await newsletter.find({}).toArray();
	console.log(data);

	return {
		fresco: JSON.stringify(frescoData)
	};
};