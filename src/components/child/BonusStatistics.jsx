// src/components/child/BonusStatistics.jsx
'use client'
import React, { useState, useEffect } from 'react'
import { Icon } from '@iconify/react'

const BonusStatistics = () => {
    const [stats, setStats] = useState({
        totalBonusUsers: 0,
        remainingBonusCount: 0,
        totalBonusAmount: 0,
        bonusAmount: 0,
        bonusUserLimit: 0,
        totalUsersCount: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBonusStats = async () => {
            setLoading(true);
            try {
                const res = await fetch('/api/users/bonusstats');
                const data = await res.json();
                setStats(data);
            } catch (error) {
                console.error("Error fetching bonus statistics:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBonusStats();
    }, []);

    return (
        <section className='row gy-4'>
            <div className="col-md-4">
                <div className="card shadow-none border bg-gradient-start-1 h-100">
                    <div className="card-body p-20">
                        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                            <div>
                                <p className="fw-medium text-primary-light mb-1">Users with Bonus Points</p>
                                <h6 className="mb-0">{stats.totalBonusUsers} / {stats.bonusUserLimit || 0}</h6>
                                <p className="text-muted small mt-1">Amount: ${stats.bonusAmount}/user</p>
                            </div>
                            <div className="w-50-px h-50-px bg-primary-600 rounded-circle d-flex justify-content-center align-items-center">
                                <Icon
                                    icon="mdi:account-check"
                                    className="text-white text-2xl mb-0"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="col-md-4">
                <div className="card shadow-none border bg-gradient-start-2 h-100">
                    <div className="card-body p-20">
                        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                            <div>
                                <p className="fw-medium text-primary-light mb-1">Remaining Users</p>
                                <h6 className="mb-0">{stats.remainingBonusCount}</h6>
                                <p className="text-muted small mt-1">Available slots</p>
                            </div>
                            <div className="w-50-px h-50-px bg-warning rounded-circle d-flex justify-content-center align-items-center">
                                <Icon
                                    icon="mdi:account-multiple-outline"
                                    className="text-white text-2xl mb-0"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="col-md-4">
                <div className="card shadow-none border bg-gradient-start-3 h-100">
                    <div className="card-body p-20">
                        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                            <div>
                                <p className="fw-medium text-primary-light mb-1">Total Bonus Points Value</p>
                                <h6 className="mb-0">${stats.totalBonusAmount.toLocaleString()}</h6>
                                <p className="text-muted small mt-1">Total bonus points value</p>
                            </div>
                            <div className="w-50-px h-50-px bg-success rounded-circle d-flex justify-content-center align-items-center">
                                <Icon
                                    icon="mdi:currency-usd"
                                    className="text-white text-2xl mb-0"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default BonusStatistics
