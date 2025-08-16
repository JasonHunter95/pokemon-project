import React from 'react';
import styles from './Pagination.module.css';

const Pagination = ({ pagination, onNext, onPrevious, loading }) => {
  const { offset, limit, count } = pagination;
  const currentPage = Math.floor(offset / limit) + 1;
  const totalPages = Math.ceil(count / limit);

  return (
    <div className={styles['pagination']}>
      <div className={styles['pagination-info']}>
        <span>
          Page {currentPage} of {totalPages} • Showing {offset + 1}-
          {Math.min(offset + limit, count)} of {count} Pokemon
        </span>
      </div>
      <div className={styles['pagination-controls']}>
        <button
          onClick={onPrevious}
          disabled={!pagination.previous || loading}
          className={styles['pagination-button']}
        >
          ← Previous
        </button>
        <button
          onClick={onNext}
          disabled={!pagination.next || loading}
          className={styles['pagination-button']}
        >
          Next →
        </button>
      </div>
    </div>
  );
};

export default Pagination;
