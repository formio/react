import { Utils, Component } from '@formio/core';
import { useState, useEffect, useCallback, ReactNode } from 'react';
import { usePagination } from '../hooks/usePagination';
import { useFormioContext } from '../hooks/useFormioContext';
import { FormProps, FormType, JSON } from './Form';
import { ComponentProp } from './FormGrid';

type FormioPaginationResponse = FetchedSubmission[] & {
	serverCount: number;
};
export type FetchedSubmission = NonNullable<FormProps['submission']> & {
	_id: string;
};

export type SubmissionTableProps = {
	submissions?: FetchedSubmission[];
	components?: {
		Container?: ComponentProp<{ children: ReactNode }>;
		TableContainer?: ComponentProp<{ children: ReactNode }>;
		TableHeadContainer?: ComponentProp<{ children: ReactNode }>;
		TableHeadCell?: ComponentProp<{ children: ReactNode }>;
		TableBodyRowContainer?: ComponentProp<{
			children: ReactNode;
			onClick?: () => void;
		}>;
		TableHeaderRowContainer?: ComponentProp<{ children: ReactNode }>;
		TableBodyContainer?: ComponentProp<{ children: ReactNode }>;
		TableCell?: ComponentProp<{ children: ReactNode }>;
		PaginationContainer?: ComponentProp<{ children: ReactNode }>;
		PaginationButton?: ComponentProp<{
			children: ReactNode;
			isActive?: boolean;
			disabled?: boolean;
			onClick: () => void;
		}>;
	};
	onSubmissionClick?: (id: string) => void;
	limit: number;
	submissionQuery?: {
		[key: string]: JSON;
	};
	formId?: string;
};
type Row = { data: JSON[]; id: string };

const DEFAULT_COMPONENTS = {};
const DEFAULT_QUERY = {};

const isFormioPaginationResponse = (
	obj: unknown,
): obj is FormioPaginationResponse => {
	return !!obj && Object.prototype.hasOwnProperty.call(obj, 'serverCount');
};

const toString = (value: JSON) => {
	switch (typeof value) {
		case 'object':
			return JSON.stringify(value);
		case 'string':
			return value;
	}
};
const getColumnsAndCells = (
	form: FormType,
	submissions: FetchedSubmission[],
) => {
	const columnsSet = new Set<{ key: string; label: string }>();
	Utils.eachComponent(form.components, (component: Component) => {
		if (
			!Object.prototype.hasOwnProperty.call(component, 'tableView') ||
			component.tableView
		) {
			columnsSet.add({
				key: component.key,
				label: component.label ?? component.key,
			});
		}
	});
	const columns = Array.from(columnsSet);
	const cells: Row[] = submissions.map((submission) => {
		const row: JSON[] = columns.map((column) => {
			return submission.data?.[column.key] ?? '';
		});
		return { data: row, id: submission._id };
	});
	return { columns, cells };
};

export const SubmissionTable = ({
	formId,
	limit,
	submissions,
	onSubmissionClick,
	components = DEFAULT_COMPONENTS,
	submissionQuery = DEFAULT_QUERY,
}: SubmissionTableProps) => {
	const {
		Container = ({ children }) => <div>{children}</div>,
		TableContainer = ({ children }) => <table>{children}</table>,
		TableHeadContainer = ({ children }) => <thead>{children}</thead>,
		TableHeaderRowContainer = ({ children }) => <tr>{children}</tr>,
		TableHeadCell = ({ children }) => <th>{children}</th>,
		TableBodyRowContainer = ({ children, onClick }) => (
			<tr onClick={onClick}>{children}</tr>
		),
		TableBodyContainer = ({ children }) => <tbody>{children}</tbody>,
		TableCell = ({ children }) => <td>{children}</td>,
		PaginationContainer = ({ children }) => <ul>{children}</ul>,
		PaginationButton = ({ children }) => <li>{children}</li>,
	} = components;
	const [form, setForm] = useState<FormType | undefined>();
	const { Formio } = useFormioContext();
	const fetchFunction = useCallback(
		(limit: number, skip: number) => {
			if (!formId) {
				console.warn(
					"You're trying to fetch submissions without a form ID, did you mean to pass a submissions prop instead?",
				);
				return Promise.resolve([]);
			}
			const formio = new Formio(
				`${Formio.projectUrl || Formio.baseUrl}/form/${formId}`,
			);
			return formio.loadSubmissions({
				params: { ...submissionQuery, limit, skip },
			});
		},
		[submissionQuery, Formio, formId],
	);
	const dataOrFnArg = submissions ? submissions : fetchFunction;
	const { data, total, page, nextPage, prevPage, setPage, hasMore } =
		usePagination<FetchedSubmission>(1, limit, dataOrFnArg);
	const { columns, cells } = form
		? getColumnsAndCells(form, data)
		: { columns: [], cells: [] };

	useEffect(() => {
		const fetchForm = async () => {
			const formio = new Formio(
				`${Formio.projectUrl || Formio.baseUrl}/form/${formId}`,
			);
			setForm(await formio.loadForm());
		};
		fetchForm();
	}, [Formio, formId]);

	return (
		<Container>
			<TableContainer>
				<TableHeadContainer>
					<TableHeaderRowContainer>
						{form &&
							columns.map(({ key, label }) => {
								return (
									<TableHeadCell key={key}>
										{label}
									</TableHeadCell>
								);
							})}
					</TableHeaderRowContainer>
				</TableHeadContainer>
				<TableBodyContainer>
					{cells.map(({ data, id }, index) => (
						<TableBodyRowContainer
							key={`row-${index}`}
							onClick={() => {
								onSubmissionClick?.(id);
							}}
						>
							{form &&
								data.map((cell, index) => (
									<TableCell key={`cell-${index}`}>
										{toString(cell)}
									</TableCell>
								))}
						</TableBodyRowContainer>
					))}
				</TableBodyContainer>
			</TableContainer>
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
				{}
				<PaginationButton onClick={nextPage} disabled={!hasMore}>
					Next
				</PaginationButton>
			</PaginationContainer>
		</Container>
	);
};
