'use client';

import { useEffect, useState } from 'react';
import { Icon } from "@iconify/react";
import Link from "next/link";

const Loginlog = () => {
  const [logs, setLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(10); // entries per page
  const [totalPages, setTotalPages] = useState(1);
  const [totalLogs, setTotalLogs] = useState(0);

  // 🔹 Fetch login logs with pagination
  useEffect(() => {
    fetch(`/api/admin/login-logs?page=${page}&limit=${limit}`)
      .then(res => res.json())
      .then(data => {
        setLogs(data.logs);
        setTotalPages(data.pages);
        setTotalLogs(data.total);
      })
      .catch(err => console.error('Failed to fetch logs', err));
  }, [page, limit]);

  // Filter logs by search term
  const filteredLogs = logs.filter(log =>
    log.ip.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className='card h-100 p-0 radius-12'>
      <div className='card-header border-bottom bg-base py-16 px-24 d-flex align-items-center flex-wrap gap-3 justify-content-between'>
        <div className='d-flex align-items-center flex-wrap gap-3'>
          <form className='navbar-search' onSubmit={e => e.preventDefault()}>
            <input
              type='text'
              className='bg-base h-40-px w-auto'
              placeholder='Search'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Icon icon='ion:search-outline' className='icon' />
          </form>
        </div>
      </div>

      <div className='card-body p-24'>
        <div className='table-responsive scroll-sm'>
          <table className='table bordered-table sm-table mb-0'>
            <thead>
              <tr>
                <th scope='col'>S.No.</th>
                <th scope='col'>IP address</th>
                <th scope='col'>Date & Time</th>
                <th scope='col'>Email</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log, idx) => (
                  <tr key={idx}>
                    <td>{(page - 1) * limit + idx + 1}</td>
                    <td>
                      <span className='px-10 py-2 radius-4 fw-medium text-xs'>
                        {log.ip}
                      </span>
                    </td>
                    <td>{new Date(log.date).toLocaleString()}</td>
                    <td>{log.email || '—'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className='text-center'>No records found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 🔹 Pagination */}
        <div className='d-flex align-items-center justify-content-between flex-wrap gap-2 mt-24'>
          <span>
            Showing {filteredLogs.length} of {totalLogs} entries
          </span>
          <ul className='pagination d-flex flex-wrap align-items-center gap-2 justify-content-center'>

            {/* Prev button */}
            <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
              <button
                onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                className='page-link bg-neutral-200 text-secondary-light fw-semibold radius-8 border-0 d-flex align-items-center justify-content-center h-32-px text-md'
              >
                <Icon icon='ep:d-arrow-left' />
              </button>
            </li>

            {/* Dynamic pages - Show only 5 page numbers */}
            {(() => {
              const maxVisiblePages = 5;
              const startPage = Math.max(1, Math.min(page - Math.floor(maxVisiblePages / 2), totalPages - maxVisiblePages + 1));
              const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
              
              return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map(num => (
                <li className='page-item' key={num}>
                  <button
                    onClick={() => setPage(num)}
                    className={`page-link fw-semibold radius-8 border-0 d-flex align-items-center justify-content-center h-32-px w-32-px text-md ${
                      num === page ? 'bg-primary-600 text-white' : 'bg-neutral-200 text-secondary-light'
                    }`}
                  >
                    {num}
                  </button>
                </li>
              ));
            })()}

            {/* Next button */}
            <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
              <button
                onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                className='page-link bg-neutral-200 text-secondary-light fw-semibold radius-8 border-0 d-flex align-items-center justify-content-center h-32-px text-md'
              >
                <Icon icon='ep:d-arrow-right' />
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Loginlog;
