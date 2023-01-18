<script>
	import PopupComboBox from '$lib/components/PopupComboBox.svelte';
	import TextInput from '$lib/components/TextInput.svelte';
</script>

<div class="px-4">
	<h1 class="text-4xl font-semibold mt-3 mb-12">Add new Track</h1>

	<form method="post">
		<TextInput label="Name" name="name" type="text" class="max-w-xs" />
		<TextInput label="Composer" name="composer" type="text" class="max-w-xs" />
		<TextInput label="Milliseconds" name="milliseconds" type="number" class="max-w-xs" />

		<!-- <TextInput label="Album" name="albumId" type="number" class="max-w-xs" /> -->
		<PopupComboBox
			name="albumId"
			heading="Select an album"
			label="Album"
			apiEndpoint="/api/lov/albums"
		/>

		<PopupComboBox
			name="genreId"
			heading="Select a Genre"
			label="Genre"
			apiEndpoint="/api/lov/genres"
		/>

		<input type="hidden" value="1" name="genreId" />

		<button
			class="inline-flex items-center rounded-md border border-transparent bg-purple-100 px-4 py-2 text-base font-medium text-purple-700 hover:bg-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
			type="submit"
			formaction="?/createTrack">Create</button
		>
	</form>
</div>
