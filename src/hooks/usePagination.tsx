import { useState, useEffect, useCallback } from 'react';

type PaginationResult<T> = {
	data: T[];
	total: number | undefined;
	page: number;
	hasMore: boolean;
	nextPage: () => void;
	prevPage: () => void;
	setPage: (page: number) => void;
	fetchPage: (page: number, limit: number) => Promise<void>;
};

type FetchFunction<T> = (limit: number, skip: number) => Promise<T[]>;

export function usePagination<T>(
	initialPage: number,
	limit: number,
	dataOrFetchFunction: T[] | FetchFunction<T>,
): PaginationResult<T> {
	const [data, setData] = useState<T[]>([]);
	const [page, setPage] = useState<number>(initialPage);
	const [hasMore, setHasMore] = useState<boolean>(true);
	const total: number | undefined = Array.isArray(dataOrFetchFunction)
		? dataOrFetchFunction.length
		: undefined;

	const fetchPage = useCallback(
		async (page: number): Promise<void> => {
			const skip = (page - 1) * limit;
			let result;
			if (Array.isArray(dataOrFetchFunction)) {
				result = dataOrFetchFunction.slice(skip, skip + limit);
				setData(result);
			} else {
				result = await dataOrFetchFunction(limit, skip);
				setData(result);
			}
			if (result.length < limit) {
				setHasMore(false);
			} else {
				setHasMore(true);
			}
		},
		[limit, dataOrFetchFunction],
	);

	const nextPage = () => {
		if (hasMore) {
			const newPage = page + 1;
			fetchPage(newPage);
			setPage(newPage);
		}
	};

	const prevPage = () => {
		if (page > 1) {
			const newPage = page - 1;
			fetchPage(newPage);
			setPage(newPage);
		}
	};

	useEffect(() => {
		fetchPage(page);
	}, [fetchPage, page]);

	return {
		data,
		page,
		hasMore,
		nextPage,
		prevPage,
		total,
		setPage: (page: number) => {
			setPage(page);
			fetchPage(page);
		},
		fetchPage,
	};
}
