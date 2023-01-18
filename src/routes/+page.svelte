<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;

	let timer: NodeJS.Timeout;
	let searchTerm = '';

	function fetchTracks() {
		fetch(`/api/searchTracks?searchTerm=${searchTerm}`)
			.then((res) => res.json())
			.then((data) => {
				tracks = data;
			});
	}

	function handleSearch(e: Event) {
		clearTimeout(timer);
		timer = setTimeout(() => {
			const target = e.target as HTMLInputElement;
			searchTerm = target.value;
			fetchTracks();
		}, 300);
	}

	let tracks = data.tracks;
</script>

<div class="px-4">
	<h1 class="text-4xl font-semibold mt-3 mb-12">Tracks</h1>

	<div class="mb-8 flex justify-between">
		<input
			type="search"
			placeholder="Search..."
			class="text-xl py-2 px-3 block w-full rounded-md border border-gray-300 pr-12 shadow-sm focus:border-purple-500 focus:ring-purple-500 focus:ring-1 focus:outline-none"
			style="max-width: 80ch;"
			value={searchTerm}
			on:keyup={handleSearch}
		/>
		<a
			href="/tracks/new"
			class="inline-flex items-center rounded-md border border-transparent bg-purple-100 px-4 py-2 text-base font-medium text-purple-700 hover:bg-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
			>New Track</a
		>
	</div>

	<table class="min-w-full divide-y divide-gray-300">
		<thead class="bg-gray-50">
			<tr>
				<th class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Track</th>
				<th class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Artist</th>
				<th class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Album</th>
				<th class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Genre</th>
			</tr>
		</thead>
		<tbody>
			{#each tracks as track}
				<tr>
					<td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{track.trackName}</td>
					<td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{track.artistName}</td>
					<td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500"
						><a
							href={`/album/${track.albumId}`}
							class="text-purple-600 underline hover:text-purple-400">{track.albumTitle}</a
						></td
					>
					<td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{track.genre}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
