<script lang="ts">
	export let label = 'label';
	export let name = 'name';

	const props = $$restProps;
	const additionalClasses = props.class ?? '';
	delete props.class;
</script>

<div class={`mb-4 mt-1 ${additionalClasses}`}>
	<label for={name} class="block text-sm font-medium text-gray-700">{label}</label>
	<div class="mt-1">
		<input
			id={name}
			{name}
			{...props}
			class="block w-full rounded-md border border-gray-300 px-2 py-1 shadow-sm read-only:cursor-not-allowed read-only:select-none read-only:border-gray-200 read-only:bg-gray-50 read-only:text-gray-500 focus:border-purple-500 focus:ring-purple-500 disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500  sm:text-sm"
		/>
	</div>
</div>
