<script lang="ts">
	import { Popover, PopoverButton, PopoverPanel } from '@rgossiaux/svelte-headlessui';
	import type { APILovResponse, APILovResponseDataDef } from 'src/routes/api/lov/types';

	export let name = 'name';
	export let label = 'label';
	export let heading = 'Select a value';

	export let valueId: string | number | undefined | null = undefined;
	export let valueDisplay: string | number | undefined | null = undefined;

	export let apiEndpoint: string;
	let loadingState: 'waiting' | 'loading' | 'loaded' | 'error' = 'waiting';
	let data: APILovResponse;

	function fetchData() {
		fetch(`${apiEndpoint}?searchTerm=${searchTerm}`)
			.then((response) => {
				if (response.ok) {
					return response.json();
				}
				throw new Error(`Network response was not ok: ${response.status} - ${response.statusText}`);
			})
			.then((respData) => {
				console.log('respData', respData);
				data = respData as APILovResponse;
				loadingState = 'loaded';
			})
			.catch((error) => {
				console.error('Error:', error);
				loadingState = 'error';
			});
	}

	function handleHover() {
		if (loadingState === 'waiting') {
			loadingState = 'loading';
			fetchData();
		}
	}

	function handleSelection(item: APILovResponseDataDef, close: Function) {
		const idCol = data.columns.find((c) => c.role === 'id');
		const displayCol = data.columns.find((c) => c.role === 'display');

		if (idCol && displayCol) {
			valueId = item[idCol.accessor];
			valueDisplay = item[displayCol.accessor];
			close();
		} else {
			console.error('Could not find id or display column');
		}
	}

	let timer: NodeJS.Timeout;
	let searchTerm = '';

	function handleSearch(e: Event) {
		clearTimeout(timer);
		timer = setTimeout(() => {
			const target = e.target as HTMLInputElement;
			searchTerm = target.value;
			fetchData();
		}, 300);
	}

	const notypecheck = (x: any) => x;
	const popupName = `${name}-popup`;
</script>

<div class="mb-4 mt-1 max-w-xs">
	<input type="hidden" {name} value={valueId} />
	<label for={popupName}>{label}</label>

	<Popover class="relative" id={popupName}>
		<PopoverButton
			on:mouseenter={handleHover}
			class="relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
		>
			<span class="inline-flex w-full truncate">{valueDisplay ?? ''}</span>
			<span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
				<!-- Heroicon name: mini/chevron-up-down -->
				<svg
					class="h-5 w-5 text-gray-400"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 20 20"
					fill="currentColor"
					aria-hidden="true"
				>
					<path
						fill-rule="evenodd"
						d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.76 9.2a.75.75 0 011.06.04l2.7 2.908 2.7-2.908a.75.75 0 111.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 01.04-1.06z"
						clip-rule="evenodd"
					/>
				</svg>
			</span>
		</PopoverButton>
		<PopoverPanel
			let:close
			focus
			class="absolute z-10 mt-3 rounded-xl border border-slate-300 bg-white py-4 px-5 shadow-lg"
		>
			<h3 class="mb-3 text-lg font-semibold">{heading}</h3>

			<input
				{...notypecheck({})}
				type="search"
				class="mb-3 block w-full max-w-[40ch] rounded-md border border-gray-300 px-3 py-2 pr-12 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
				placeholder="Search"
				on:keyup={handleSearch}
				on:search={handleSearch}
			/>

			<div>
				{#if loadingState === 'loading'}
					<div>Loading...</div>
				{:else if loadingState === 'error'}
					<div class="text-red-500">Unexpected error occurred...</div>
				{:else if loadingState === 'loaded'}
					<table class="min-w-[40ch]">
						<thead
							class="select-none border border-slate-300 shadow-md"
							style="display: table; width: 100%; table-layout: fixed;"
						>
							<tr class="">
								{#each data.columns as column}
									<th
										scope="col"
										class="table-cell px-3 py-2 text-left text-sm font-semibold text-gray-900"
										>{column.display}</th
									>
								{/each}
							</tr>
						</thead>
						<tbody class="block h-64 overflow-auto">
							{#each data.data as item}
								<tr
									role="button"
									class="border border-slate-300 hover:bg-indigo-500/25 focus:ring focus:ring-indigo-500"
									style="display: table; width: 100%; table-layout: fixed;"
									on:click={() => handleSelection(item, close)}
								>
									{#each data.columns as column}
										<td class="select-none px-3 py-2 text-sm text-gray-900"
											>{item[column.accessor]}</td
										>
									{/each}
								</tr>
							{/each}
						</tbody>
					</table>
				{/if}
			</div>
		</PopoverPanel>
	</Popover>
</div>
