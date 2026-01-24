// src/components/child/BonusFilter.jsx
'use client'
import React, { useState, useEffect } from 'react'
import { Icon } from '@iconify/react'

const BonusFilter = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState({});
    const [limit] = useState(10);

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/users/paginatedusers?page=${currentPage}&limit=${limit}&search=${searchTerm}`);
                const data = await res.json();
                console.log("API Response:", data); // Debug log
                setUsers(data.users || []);
                setPagination(data.pagination || {});
            } catch (error) {
                console.error("Error fetching users:", error);
                setUsers([]);
                setPagination({});
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [currentPage, searchTerm, limit]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // Reset to first page when searching
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // Remove client-side filtering since we're using server-side search
    const filteredUsers = users;

    return (
        <div className="card shadow-none border">
            <div className="card-header border-bottom bg-base d-flex flex-wrap align-items-center justify-content-between">
                <div>
                    <h6 className="text-lg mb-0">Users with Bonus Points</h6>
                </div>
                <div className="navbar-search">
                    <input
                        type="text"
                        className="bg-base h-40-px"
                        style={{ minWidth: '250px' }}
                        name="search"
                        placeholder="Search by Username or Email"
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                    <Icon icon="ion:search-outline" className="icon" />
                </div>
            </div>
            <div className="card-body p-0">
                <div className="table-responsive scroll-sm">
                    <table className="table bordered-table sm-table mb-0">
                        <thead>
                            <tr>
                                <th scope="col">S.No</th>
                                <th scope="col">Username</th>
                                <th scope="col">Email</th>
                                <th scope="col">Bonus Points</th>
                                <th scope="col">Created At</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-4">
                                        <Icon icon="mdi:loading" className="text-2xl animate-spin" />
                                        <p className="mt-2 mb-0">Loading users...</p>
                                    </td>
                                </tr>
                            ) : filteredUsers.length > 0 ? (
                                filteredUsers.map((user, index) => (
                                    <tr key={user._id}>
                                        <td>{index + 1}</td>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>
                                            <span className="badge bg-success-100 text-success-600 fw-bold">
                                                {user.credits?.bonus || 0} pts
                                            </span>
                                        </td>
                                        <td>
                                            {user.createdAt ? 
                                                new Date(user.createdAt).toLocaleDateString('en-GB', {
                                                    day: '2-digit',
                                                    month: '2-digit',
                                                    year: 'numeric'
                                                }) : 'N/A'
                                            }
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center py-4">
                                        <Icon icon="mdi:account-off" className="text-4xl text-muted" />
                                        <p className="mt-2 mb-0 text-muted">No users found</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            
            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
                <div className="card-footer d-flex justify-content-between align-items-center">
                    <div className="text-muted">
                        Showing {((currentPage - 1) * limit) + 1} to {Math.min(currentPage * limit, pagination.totalUsers)} of {pagination.totalUsers} users with bonus points
                    </div>
                    <div className="d-flex gap-2">
                        <button 
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={!pagination.hasPrevPage}
                        >
                            <Icon icon="mdi:chevron-left" />
                            Previous
                        </button>
                        
                        {/* Page Numbers */}
                        {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                            const startPage = Math.max(1, currentPage - 2);
                            const pageNum = startPage + i;
                            if (pageNum <= pagination.totalPages) {
                                return (
                                    <button
                                        key={pageNum}
                                        className={`btn btn-sm ${pageNum === currentPage ? 'btn-primary' : 'btn-outline-primary'}`}
                                        onClick={() => handlePageChange(pageNum)}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            }
                            return null;
                        })}
                        
                        <button 
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={!pagination.hasNextPage}
                        >
                            Next
                            <Icon icon="mdi:chevron-right" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BonusFilter;
