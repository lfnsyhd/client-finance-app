import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { transactionsAPI } from '../services/api';
import TransactionForm from './TransactionForm';
import logoImg from '../assets/img/dollar.png';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [transactions, setTransactions] = useState([]);
    const [summary, setSummary] = useState({ totalMasuk: 0, totalKeluar: 0, saldo: 0 });
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState(null);
    const [filterType, setFilterType] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchTransactions();
        fetchSummary();
    }, [filterType]);

    const fetchTransactions = async () => {
        try {
            const params = {};
            if (filterType) params.tipe = filterType;

            const response = await transactionsAPI.getAll(params);
            setTransactions(response.data);
        } catch (error) {
            console.error('Error fetching transactions:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchSummary = async () => {
        try {
            const response = await transactionsAPI.getSummary();
            setSummary(response.data);
        } catch (error) {
            console.error('Error fetching summary:', error);
        }
    };

    const handleSaveTransaction = async (formData) => {
        try {
            if (editingTransaction) {
                await transactionsAPI.update(editingTransaction.id, formData);
            } else {
                await transactionsAPI.create(formData);
            }

            setShowForm(false);
            setEditingTransaction(null);
            fetchTransactions();
            fetchSummary();
        } catch (error) {
            throw new Error(error.response?.data?.error || 'Failed to save transaction');
        }
    };

    const handleDeleteTransaction = async (id) => {
        if (window.confirm('Are you sure you want to delete this transaction?')) {
            try {
                await transactionsAPI.delete(id);
                fetchTransactions();
                fetchSummary();
            } catch (error) {
                alert('Failed to delete transaction');
            }
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const filteredTransactions = transactions.filter(t =>
        t.keterangan?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    if (loading) {
        return <div className="loader5 mb-2 mx-auto"></div>;
    }

    return (
        <div className="main-bg main-bg-opac main-bg-blur roundedui theme-pista bg-r-gradient" data-theme="theme-pista">
            {/* Header */}
            <header className="adminuiux-header">
                <nav className="navbar navbar-expand-lg fixed-top">
                    <div className="container-fluid">
                        <a className="navbar-brand" href="#">
                            <img src={logoImg} alt="Logo" className="avatar avatar-30" />
                            <div className="d-block ps-2">
                                <h6 className="fs-6 mb-0">Finance<span className="fs-6">App</span></h6>
                                <p className="company-tagline d-none d-sm-block">Dashboard</p>
                            </div>
                        </a>
                        <div className="ms-auto d-flex align-items-center gap-1 gap-sm-2">
                            <button className="btn btn-sm btn-accent" onClick={() => navigate('/report')} title="Report PDF">
                                <i className="bi bi-file-earmark-pdf"></i>
                                <span className="d-none d-md-inline ms-1">Report</span>
                            </button>
                            <span className="text-theme-1 d-none d-lg-inline me-2" style={{ fontSize: '0.875rem' }}>Welcome, {user?.email}</span>
                            <button className="btn btn-sm btn-outline-theme" onClick={handleLogout} title="Logout">
                                <i className="bi bi-box-arrow-right"></i>
                                <span className="d-none d-sm-inline ms-1">Logout</span>
                            </button>
                        </div>
                    </div>
                </nav>
            </header>

            <div className="adminuiux-wrap">
                <main className="adminuiux-content" style={{ marginTop: '80px' }}>
                    {loading ? (
                        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
                            <div className="text-center">
                                <div className="spinner-border text-theme-1" role="status" style={{ width: '3rem', height: '3rem' }}>
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                                <p className="mt-3 text-secondary">Loading transactions...</p>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Breadcrumb */}
                            <div className="container mt-3">
                                <div className="row gx-3 align-items-center py-4">
                                    <div className="col mb-3">
                                        <h5>Finance Billing</h5>
                                        <p className="text-secondary small mb-0">Manage your income and expenses</p>
                                    </div>
                                    <div className="col-auto mb-3">
                                        <button
                                            className="btn btn-theme"
                                            onClick={() => {
                                                setEditingTransaction(null);
                                                setShowForm(true);
                                            }}
                                        >
                                            <i className="bi bi-plus-circle me-2"></i>
                                            Add Transaction
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Summary Cards */}
                            <div className="container mt-3">
                                <div className="row gx-3 gx-lg-4">
                                    <div className="col-6 col-md-4">
                                        <div className="card bg-none mb-3 mb-lg-4">
                                            <div className="card-body">
                                                <p className="text-secondary small mb-0">Total Income</p>
                                                <h4 className="mb-0 text-success">{formatCurrency(summary.totalMasuk)}</h4>
                                                <span className="badge badge-sm badge-light text-bg-success">
                                                    <i className="bi bi-arrow-down-circle"></i> Masuk
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-6 col-md-4">
                                        <div className="card bg-none mb-3 mb-lg-4">
                                            <div className="card-body">
                                                <p className="text-secondary small mb-0">Total Expense</p>
                                                <h4 className="mb-0 text-danger">{formatCurrency(summary.totalKeluar)}</h4>
                                                <span className="badge badge-sm badge-light text-bg-danger">
                                                    <i className="bi bi-arrow-up-circle"></i> Keluar
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-12 col-md-4">
                                        <div className="card bg-none mb-3 mb-lg-4">
                                            <div className="card-body">
                                                <p className="text-secondary small mb-0">Balance</p>
                                                <h4 className={`mb-0 ${summary.saldo >= 0 ? 'text-success' : 'text-danger'}`}>
                                                    {formatCurrency(summary.saldo)}
                                                </h4>
                                                <span className="badge badge-sm badge-light text-bg-primary">
                                                    <i className="bi bi-wallet2"></i> Saldo
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Transactions Table */}
                            <div className="container mt-3">
                                <div className="card bg-none mb-3 mb-lg-4">
                                    <div className="card-body pb-0">
                                        <div className="row gx-3 align-items-center">
                                            <div className="col-auto mb-3">
                                                <div className="avatar avatar-50 rounded card">
                                                    <i className="bi bi-arrow-down-up"></i>
                                                </div>
                                            </div>
                                            <div className="col mb-3">
                                                <h6 className="mb-0">Transactions</h6>
                                                <p className="small text-secondary">Total: {transactions.length} transactions</p>
                                            </div>
                                            <div className="col-6 col-md-4 col-lg-3 col-xl-auto mb-3">
                                                <div className="input-group">
                                                    <span className="input-group-text bg-none">
                                                        <i className="bi bi-search"></i>
                                                    </span>
                                                    <input
                                                        className="form-control pe-0 bg-none"
                                                        type="search"
                                                        placeholder="Search..."
                                                        value={searchTerm}
                                                        onChange={(e) => setSearchTerm(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-4 col-md-4 col-lg-3 col-xl-auto mb-3">
                                                <select
                                                    className="form-select bg-none"
                                                    value={filterType}
                                                    onChange={(e) => setFilterType(e.target.value)}
                                                >
                                                    <option value="">All</option>
                                                    <option value="masuk">Income</option>
                                                    <option value="keluar">Expense</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="table-responsive">
                                            <table className="table">
                                                <thead>
                                                    <tr>
                                                        <th>Date</th>
                                                        <th>Type</th>
                                                        <th>Amount</th>
                                                        <th>Description</th>
                                                        <th>Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {filteredTransactions.length === 0 ? (
                                                        <tr>
                                                            <td colSpan="5" className="text-center">
                                                                No transactions found
                                                            </td>
                                                        </tr>
                                                    ) : (
                                                        filteredTransactions.map((transaction) => (
                                                            <tr key={transaction.id}>
                                                                <td>
                                                                    <p className="mb-0">{formatDate(transaction.tanggal)}</p>
                                                                </td>
                                                                <td>
                                                                    <span
                                                                        className={`badge ${transaction.tipe === 'masuk'
                                                                            ? 'text-bg-success'
                                                                            : 'text-bg-danger'
                                                                            }`}
                                                                    >
                                                                        {transaction.tipe === 'masuk' ? (
                                                                            <><i className="bi bi-arrow-down-circle"></i> Income</>
                                                                        ) : (
                                                                            <><i className="bi bi-arrow-up-circle"></i> Expense</>
                                                                        )}
                                                                    </span>
                                                                </td>
                                                                <td>
                                                                    <p className={`mb-0 fw-bold ${transaction.tipe === 'masuk' ? 'text-success' : 'text-danger'
                                                                        }`}>
                                                                        {formatCurrency(transaction.jumlah)}
                                                                    </p>
                                                                </td>
                                                                <td>
                                                                    <p className="mb-0">{transaction.keterangan || '-'}</p>
                                                                </td>
                                                                <td>
                                                                    <button
                                                                        className="btn btn-sm btn-square btn-link text-theme-1"
                                                                        onClick={() => {
                                                                            setEditingTransaction(transaction);
                                                                            setShowForm(true);
                                                                        }}
                                                                    >
                                                                        <i className="bi bi-pencil"></i>
                                                                    </button>
                                                                    <button
                                                                        className="btn btn-sm btn-square btn-link text-danger"
                                                                        onClick={() => handleDeleteTransaction(transaction.id)}
                                                                    >
                                                                        <i className="bi bi-trash"></i>
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ))
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </main>
            </div>

            {/* Transaction Form Modal */}
            {showForm && (
                <TransactionForm
                    transaction={editingTransaction}
                    onSave={handleSaveTransaction}
                    onCancel={() => {
                        setShowForm(false);
                        setEditingTransaction(null);
                    }}
                />
            )}

            <footer className="adminuiux-footer mt-auto">
                <div className="container-fluid text-center">
                    <span className="small">Copyright @2025, Finance Tracking App - ASH</span>
                </div>
            </footer>
        </div>
    );
};

export default Dashboard;
