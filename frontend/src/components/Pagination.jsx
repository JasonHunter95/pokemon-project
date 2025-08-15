import React from 'react';
import './Pagination.css';

const Pagination = ({ pagination, onNext, onPrevious, loading }) => {
  const { offset, limit, count } = pagination;
  const currentPage = Math.floor(offset / limit) + 1;
  const totalPages = Math.ceil(count / limit);

  return (
    <div className="pagination">
      <div className="pagination-info">
        <span>
          Page {currentPage} of {totalPages} • Showing {offset + 1}-
          {Math.min(offset + limit, count)} of {count} Pokemon
        </span>
      </div>
      <div className="pagination-controls">
        <button
          onClick={onPrevious}
          disabled={!pagination.previous || loading}
          className="pagination-button"
        >
          ← Previous
        </button>
        <button
          onClick={onNext}
          disabled={!pagination.next || loading}
          className="pagination-button"
        >
          Next →
        </button>
      </div>
    </div>
  );
};

export default Pagination;
