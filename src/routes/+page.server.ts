//import type { FrescoData } from '$lib/frescodata';
import type { PageServerLoad } from './$types';
import { frescoData } from '$lib/frescodata';
import { newsletter, start_mongo } from "$lib/db/mongo";

//export const ssr = false;

export const load: PageServerLoad = async () => {	
	try {
		await start_mongo();
		const data = await newsletter.find({}).toArray();
		console.log(data);
	} catch (error){
		console.error(error);
	}
	
	return {
		fresco: JSON.stringify(frescoData)
	};
};