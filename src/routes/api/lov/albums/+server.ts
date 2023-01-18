import { getLovAlbums } from '$lib/server/db';
import { json } from '@sveltejs/kit';
import type { APILovResponse } from '../types';
import type { RequestHandler } from './$types';

export const GET = (({ url }) => {
	const searchTerm = url.searchParams.get('searchTerm');

	const rows = getLovAlbums(searchTerm);

	const data: APILovResponse = {
		columns: [
			{ display: 'ID', accessor: 'id', role: 'id' },
			{ display: 'Title', accessor: 'title', role: 'display' },
			{ display: 'Artist', accessor: 'artist' }
		],
		data: rows
	};

	return json(data);
}) satisfies RequestHandler;
