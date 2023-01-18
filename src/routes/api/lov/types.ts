export type APILovResponseColDef = {
	display: string;
	accessor: string;
	role?: 'id' | 'display' | undefined;
};

export type APILovResponseDataDef = { [key: string]: string | number | null };

export type APILovResponse = {
	columns: APILovResponseColDef[];
	data: APILovResponseDataDef[];
};
