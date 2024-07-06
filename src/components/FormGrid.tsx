import { useFormioContext } from '../hooks/useFormioContext';
import { Form as FormType } from '@formio/core';
import { usePagination } from '../hooks/usePagination';
import { JSON } from './Form';
import { ReactNode, useCallback } from 'react';

export type Action = {
	name: string;
	fn: (id: string) => void;
};

export type ComponentProp<T = object> = (props: T) => JSX.Element;
export type FormGridProps = {
	actions?: Action[];
	forms?: FormType[];
	components?: {
		Container?: ComponentProp<{ children: ReactNode }>;
		FormContainer?: ComponentProp<{ children: ReactNode }>;
		FormNameContainer?: ComponentProp<{
			children: ReactNode;
			onClick?: () => void;
		}>;
		FormActionsContainer?: ComponentProp<{ children: ReactNode }>;
		FormActionButton?: ComponentProp<{
			action: Action;
			onClick: () => void;
		}>;
		PaginationContainer?: ComponentProp<{ children: ReactNode }>;
		PaginationButton?: ComponentProp<{
			children: ReactNode;
			isActive?: boolean;
			disabled?: boolean;
			onClick: () => void;
		}>;
	};
	onFormClick?: (id: string) => void;
	formQuery?: {
		[key: string]: JSON;
	};
	limit?: number;
};

type PaginationResponse = FormType[] & { serverCount: number };

const isFormioPaginationResponse = (obj: any): obj is PaginationResponse => {
	return obj.serverCount !== undefined && Array.isArray(obj);
};

export const DEFAULT_COMPONENTS = {};
const DEFAULT_QUERY = {};

export const FormGrid = ({
	actions,
	components = DEFAULT_COMPONENTS,
	onFormClick,
	forms,
	formQuery = DEFAULT_QUERY,
	limit = 10,
}: FormGridProps) => {
	const {
		Container = ({ children }) => <div>{children}</div>,
		FormContainer = ({ children }) => <div>{children}</div>,
		FormNameContainer = ({ children, onClick }) => (
			<div onClick={onClick}>{children}</div>
		),
		FormActionsContainer = ({ children }) => <div>{children}</div>,
		FormActionButton = ({ action }) => (
			<button type="button">{action?.name}</button>
		),
		PaginationContainer = ({ children }) => <ul>{children}</ul>,
		PaginationButton = ({ children }) => <li>{children}</li>,
	} = components;
	const { Formio } = useFormioContext();
	const fetchFunction = useCallback(
		(limit: number, skip: number) => {
			const formio = new Formio('/form');
			return formio.loadForms({ params: { ...formQuery, limit, skip } });
		},
		[formQuery, Formio],
	);
	const dataOrFnArg = forms ? forms : fetchFunction;
	const { data, total, page, nextPage, prevPage, setPage, hasMore } =
		usePagination<FormType>(1, limit, dataOrFnArg);
	const defaultActions = [
		{ name: 'Edit', fn: (id: string) => onFormClick?.(id) },
		{
			name: 'Delete',
			fn: async (id: string) => {
				if (
					window.confirm('Are you sure you want to delete this form?')
				) {
					const formio = new Formio(`/form/${id}`);
					await formio.deleteForm();
					setPage(1);
				}
			},
		},
	];
	const formActions = actions || defaultActions;
	return (
		<Container>
			{data.map((form) => (
				<FormContainer key={form._id}>
					<FormNameContainer onClick={() => onFormClick?.(form._id)}>
						{form.title || form.name || form._id}
					</FormNameContainer>
					<FormActionsContainer>
						{formActions.map((action, index) => (
							<FormActionButton
								action={action}
								onClick={() => action.fn(form._id)}
								key={`${action.name}-${index}`}
							/>
						))}
					</FormActionsContainer>
				</FormContainer>
			))}
			<PaginationContainer>
				<PaginationButton onClick={prevPage} disabled={page === 1}>
					Prev
				</PaginationButton>
				{isFormioPaginationResponse(data) &&
					!total &&
					Array.from(
						{
							length: Math.ceil(data.serverCount / limit),
						},
						(_, i) => i + 1,
					).map((n) => (
						<PaginationButton
							key={`page-link-${n}`}
							onClick={() => setPage(n)}
							isActive={n === page}
						>
							{n}
						</PaginationButton>
					))}
				{data &&
					total &&
					Array.from(
						{
							length: Math.ceil(total / limit),
						},
						(_, i) => i + 1,
					).map((n) => (
						<PaginationButton
							key={`page-link-${n}`}
							onClick={() => setPage(n)}
							isActive={n === page}
						>
							{n}
						</PaginationButton>
					))}
				<PaginationButton onClick={nextPage} disabled={!hasMore}>
					Next
				</PaginationButton>
			</PaginationContainer>
		</Container>
	);
};
