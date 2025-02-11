//import type { FrescoData } from '$lib/frescodata';
import type { PageServerLoad } from './$types';
import { frescoData } from '$lib/frescodata';

//export const ssr = false;

export const load: PageServerLoad = () => {
	return {
		fresco: JSON.stringify(frescoData)
	};
};