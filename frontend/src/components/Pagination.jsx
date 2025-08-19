import React from 'react';
import styles from './Pagination.module.css';

const Pagination = ({ pagination, onNext, onPrevious, loading }) => {
  const { offset, limit, count } = pagination;

  // Defensive calculations and zero-results UX
  const safeLimit = Math.max(1, Number(limit) || 1);
  const hasResults = count > 0;
  const currentPage = hasResults ? Math.floor(offset / safeLimit) + 1 : 1;
  const totalPages = hasResults ? Math.ceil(count / safeLimit) : 1;

  return (
    <nav className={styles['pagination']} aria-label="Pagination navigation">
      <div className={styles['pagination-info']}>
        <span>
          Page {currentPage} of {totalPages} •{' '}
          {hasResults ? (
            <>
              Showing {offset + 1}-{Math.min(offset + safeLimit, count)} of {count} Pokemon
            </>
          ) : (
            <>Showing 0 of 0 Pokemon</>
          )}
        </span>
      </div>
      <div className={styles['pagination-controls']}>
        <button
          type="button"
          onClick={onPrevious}
          disabled={!pagination.previous || loading || !hasResults}
          className={styles['pagination-button']}
        >
          ← Previous
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={!pagination.next || loading || !hasResults}
          className={styles['pagination-button']}
        >
          Next →
        </button>
      </div>
    </nav>
  );
};

export default Pagination;
