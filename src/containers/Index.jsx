import React from 'react';
import FormioGrid from '../components/FormioGrid';

export default ({form, submissions, pagination, limit, isFetching, onSortChange, onPageChange, onButtonClick}) => {
  if (isFetching) {
    return <div>Loading</div>;
  }
  return (
    <div className="form-index">
      <FormioGrid
        submissions={submissions}
        form={form}
        onSortChange={onSortChange}
        onPageChange={onPageChange}
        pagination={pagination}
        limit={limit}
        onButtonClick={onButtonClick}
      />
    </div>
  );
};
