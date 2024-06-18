import { renderHook, waitFor } from '@testing-library/react';
import { usePagination } from '../usePagination';

it('should return correct paginated data when passed a static array', () => {
	const myData = Array.from(
		{
			length: 100,
		},
		(_, i) => i,
	);
	const { result } = renderHook(() => usePagination(1, 10, myData));
	const { data } = result.current;
	expect(data).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
});

it('should return correct paginated data when passed a fetch function', async () => {
	const fakeData = Array.from({ length: 100 }, (_, i) => i);
	const fetchFunction = async (limit: number, skip: number) => {
		return fakeData.slice(skip, skip + limit);
	};
	const { result } = renderHook(() => usePagination(1, 10, fetchFunction));
	waitFor(() => {
		const { data } = result.current;
		expect(data).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
	});
});
