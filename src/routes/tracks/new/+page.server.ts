import { insertTrack } from '$lib/server/db';
import type { DbTrack } from '$lib/server/db/types';
import { error, type Actions } from '@sveltejs/kit';

export const actions: Actions = {
	createTrack: async ({ request }) => {
		const data = await request.formData();

		const name = data.get('name')?.toString();
		const composer = data.get('composer')?.toString();
		const msStr = data.get('milliseconds')?.toString();
		const ms = msStr ? parseInt(msStr) : null;

		const albumIdStr = data.get('albumId')?.toString();
		const albumId = albumIdStr ? parseInt(albumIdStr) : null;

		const genreIdStr = data.get('genreId')?.toString();
		const genreId = genreIdStr ? parseInt(genreIdStr) : null;

		if (!(name && composer && ms && albumId && genreId)) {
			throw error(400, 'Missing data');
		}

		const track: DbTrack = {
			name,
			composer,
			milliseconds: ms,
			albumId,
			genreId
		};

		insertTrack(track);
	}
};
