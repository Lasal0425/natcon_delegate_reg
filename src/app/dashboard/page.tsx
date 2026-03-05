'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

interface Delegate {
    delegateId: string;
    name: string;
    email: string;
    age: number;
    entity: string;
    foodPreference: string;
    delegatePack: boolean;
    checkedIn: boolean;
    checkedInAt?: string;
}

interface Stats {
    total: number;
    checkedIn: number;
    remaining: number;
    percentage: number;
}

export default function DashboardPage() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [delegates, setDelegates] = useState<Delegate[]>([]);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState<'all' | 'checked' | 'remaining'>('all');
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        try {
            const [statsRes, delegatesRes] = await Promise.all([
                fetch('/api/stats'),
                fetch('/api/delegates'),
            ]);
            const statsData = await statsRes.json();
            const delegatesData = await delegatesRes.json();

            if (statsData.success) setStats(statsData.data);
            if (delegatesData.success) setDelegates(delegatesData.data);
        } catch {
            console.error('Failed to fetch data');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 10000); // Auto-refresh every 10s
        return () => clearInterval(interval);
    }, [fetchData]);

    const filteredDelegates = delegates.filter((d) => {
        const matchesSearch =
            search === '' ||
            d.name.toLowerCase().includes(search.toLowerCase()) ||
            d.entity.toLowerCase().includes(search.toLowerCase()) ||
            d.delegateId.toLowerCase().includes(search.toLowerCase());

        const matchesFilter =
            filter === 'all' ||
            (filter === 'checked' && d.checkedIn) ||
            (filter === 'remaining' && !d.checkedIn);

        return matchesSearch && matchesFilter;
    });

    if (loading) {
        return (
            <div className="page-container">
                <div className="loading-spinner">
                    <div className="spinner"></div>
                    <p>Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="page-container">
            <nav className="top-nav">
                <Link href="/" className="nav-back">← Home</Link>
                <h1 className="nav-title">Dashboard</h1>
                <button className="btn btn-small btn-ghost" onClick={fetchData}>🔄</button>
            </nav>

            <div className="dashboard-content">
                {/* Stats Cards */}
                {stats && (
                    <div className="stats-grid">
                        <div className="stat-card stat-total">
                            <div className="stat-number">{stats.total}</div>
                            <div className="stat-label">Total Delegates</div>
                        </div>
                        <div className="stat-card stat-checked">
                            <div className="stat-number">{stats.checkedIn}</div>
                            <div className="stat-label">Checked In</div>
                        </div>
                        <div className="stat-card stat-remaining">
                            <div className="stat-number">{stats.remaining}</div>
                            <div className="stat-label">Remaining</div>
                        </div>
                    </div>
                )}

                {/* Progress Bar */}
                {stats && stats.total > 0 && (
                    <div className="progress-section">
                        <div className="progress-header">
                            <span>Check-in Progress</span>
                            <span className="progress-percent">{stats.percentage}%</span>
                        </div>
                        <div className="progress-bar">
                            <div
                                className="progress-fill"
                                style={{ width: `${stats.percentage}%` }}
                            />
                        </div>
                    </div>
                )}

                {/* Search and Filter */}
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="🔍 Search by name, entity, or ID..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="search-input"
                    />
                    <div className="filter-buttons">
                        <button
                            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                            onClick={() => setFilter('all')}
                        >
                            All
                        </button>
                        <button
                            className={`filter-btn ${filter === 'checked' ? 'active' : ''}`}
                            onClick={() => setFilter('checked')}
                        >
                            ✅ Checked
                        </button>
                        <button
                            className={`filter-btn ${filter === 'remaining' ? 'active' : ''}`}
                            onClick={() => setFilter('remaining')}
                        >
                            ⏳ Remaining
                        </button>
                    </div>
                </div>

                {/* Delegates Table */}
                <div className="table-wrapper">
                    <table className="data-table dashboard-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Entity</th>
                                <th>Food</th>
                                <th>Pack</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredDelegates.map((d) => (
                                <tr key={d.delegateId} className={d.checkedIn ? 'row-checked' : ''}>
                                    <td className="cell-id">{d.delegateId}</td>
                                    <td className="cell-name">{d.name}</td>
                                    <td>{d.entity}</td>
                                    <td>{d.foodPreference}</td>
                                    <td>{d.delegatePack ? '✓' : '✗'}</td>
                                    <td>
                                        <span className={`status-badge ${d.checkedIn ? 'badge-checked' : 'badge-pending'}`}>
                                            {d.checkedIn ? '✅ In' : '⏳'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredDelegates.length === 0 && (
                        <div className="empty-state">
                            <p>No delegates found</p>
                        </div>
                    )}
                    <div className="table-footer">
                        Showing {filteredDelegates.length} of {delegates.length} delegates
                    </div>
                </div>
            </div>
        </div>
    );
}
