import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { transactionsAPI } from '../services/api';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useNavigate } from 'react-router-dom';
import logoImg from '../assets/img/dollar.png';

const Report = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [loading, setLoading] = useState(false);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
    };

    const getMonthYear = (dateString) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            month: 'long',
            year: 'numeric'
        });
    };

    const generatePDF = async () => {
        if (!startDate || !endDate) {
            alert('Silakan pilih tanggal mulai dan tanggal akhir');
            return;
        }

        setLoading(true);

        try {
            console.log('Fetching transactions...', { startDate, endDate });

            // Fetch transactions for the selected date range
            const response = await transactionsAPI.getAll({ startDate, endDate });
            const transactions = response.data;

            console.log('Transactions fetched:', transactions);

            if (!transactions || transactions.length === 0) {
                alert('Tidak ada transaksi pada rentang tanggal yang dipilih');
                setLoading(false);
                return;
            }

            console.log('Creating PDF...');

            // Create PDF
            const doc = new jsPDF();

            // Title
            doc.setFontSize(16);
            doc.setFont('helvetica', 'bold');
            doc.text('LAPORAN ALUR KAS KELUAR/MASUK', 105, 20, { align: 'center' });

            // Date Range
            doc.setFontSize(11);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(0, 0, 0);
            doc.text(`Periode: ${formatDate(startDate)} - ${formatDate(endDate)}`, 105, 28, { align: 'center' });
            doc.setTextColor(0, 0, 0); // Reset to black

            // Prepare table data
            let saldoAwal = 0;
            let runningBalance = saldoAwal;
            let totalMasuk = 0;
            let totalKeluar = 0;

            const tableData = [];

            transactions.forEach((t, index) => {
                const masuk = t.tipe === 'masuk' ? parseFloat(t.jumlah) : 0;
                const keluar = t.tipe === 'keluar' ? parseFloat(t.jumlah) : 0;

                totalMasuk += masuk;
                totalKeluar += keluar;
                runningBalance = runningBalance + masuk - keluar;

                tableData.push([
                    (index + 1).toString(),
                    formatDate(t.tanggal),
                    t.keterangan || '-',
                    masuk > 0 ? formatCurrency(masuk) : '',
                    keluar > 0 ? formatCurrency(keluar) : '',
                    formatCurrency(runningBalance)
                ]);
            });

            // Add summary row
            tableData.push([
                '',
                '',
                'Jumlah',
                formatCurrency(totalMasuk),
                formatCurrency(totalKeluar),
                formatCurrency(runningBalance)
            ]);

            console.log('Table data prepared:', tableData);

            // Create table - use autoTable function directly
            autoTable(doc, {
                startY: 33,
                head: [[
                    'No',
                    'Tanggal',
                    'Keterangan',
                    'Masuk',
                    'Keluar',
                    'Saldo'
                ]],
                body: tableData,
                theme: 'grid',
                styles: {
                    fontSize: 9,
                    cellPadding: 2,
                },
                headStyles: {
                    fillColor: [255, 255, 255],
                    textColor: [0, 0, 0],
                    fontStyle: 'bold',
                    lineWidth: 0.5,
                    lineColor: [0, 0, 0],
                    halign: 'center'
                },
                bodyStyles: {
                    lineWidth: 0.5,
                    lineColor: [0, 0, 0]
                },
                columnStyles: {
                    0: { halign: 'center', cellWidth: 12 },
                    1: { halign: 'center', cellWidth: 30 },
                    2: { halign: 'left', cellWidth: 60 },
                    3: { halign: 'right', cellWidth: 28 },
                    4: { halign: 'right', cellWidth: 28 },
                    5: { halign: 'right', cellWidth: 28 }
                },
                didParseCell: function (data) {
                    // Bold the summary row (last row)
                    if (data.row.index === tableData.length - 1) {
                        data.cell.styles.fontStyle = 'bold';
                    }
                }
            });

            console.log('PDF created successfully');

            // Save PDF
            const startMonth = new Date(startDate).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' });
            const endMonth = new Date(endDate).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' });
            const fileName = `Laporan_Keuangan_${startMonth}_sampai_${endMonth}.pdf`.replace(/ /g, '_');
            doc.save(fileName);

            console.log('PDF saved:', fileName);

            alert('PDF berhasil dibuat dan didownload!');
            setLoading(false);
        } catch (error) {
            console.error('Error generating PDF:', error);
            console.error('Error details:', error.message, error.stack);
            alert(`Gagal membuat PDF: ${error.message}. Cek console untuk detail.`);
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="main-bg main-bg-opac main-bg-blur roundedui theme-pista bg-r-gradient" data-theme="theme-pista">
            {/* Header */}
            <header className="adminuiux-header">
                <nav className="navbar navbar-expand-lg fixed-top bg-white shadow-sm">
                    <div className="container-fluid">
                        <a className="navbar-brand" href="#">
                            <img src={logoImg} alt="Logo" className="avatar avatar-30" />
                            <div className="d-block ps-2">
                                <h6 className="fs-6 mb-0">Finance<span className="fs-6">App</span></h6>
                                <p className="company-tagline d-none d-sm-block">Report</p>
                            </div>
                        </a>
                        <div className="ms-auto d-flex align-items-center gap-1 gap-sm-2">
                            <button className="btn btn-sm btn-outline-theme" onClick={() => navigate('/dashboard')} title="Back to Dashboard">
                                <i className="bi bi-arrow-left"></i>
                                <span className="d-none d-md-inline ms-1">Back</span>
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
                    <div className="container mt-3">
                        <div className="row gx-3 align-items-center mb-4 py-4">
                            <div className="col mb-3">
                                <h5>Laporan Keuangan PDF</h5>
                                <p className="text-secondary small mb-0">Generate laporan alur kas dalam format PDF</p>
                            </div>
                        </div>

                        <div className="row justify-content-center">
                            <div className="col-12 col-md-8 col-lg-6">
                                <div className="card bg-none mb-4">
                                    <div className="card-body">
                                        <h6 className="mb-4">Pilih Rentang Tanggal</h6>

                                        <div className="mb-3">
                                            <label htmlFor="startDate" className="form-label">Tanggal Mulai</label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                id="startDate"
                                                value={startDate}
                                                onChange={(e) => setStartDate(e.target.value)}
                                            />
                                        </div>

                                        <div className="mb-4">
                                            <label htmlFor="endDate" className="form-label">Tanggal Akhir</label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                id="endDate"
                                                value={endDate}
                                                onChange={(e) => setEndDate(e.target.value)}
                                                min={startDate}
                                            />
                                        </div>

                                        <button
                                            className="btn btn-lg btn-theme w-100"
                                            onClick={generatePDF}
                                            disabled={loading || !startDate || !endDate}
                                        >
                                            {loading ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                    Generating PDF...
                                                </>
                                            ) : (
                                                <>
                                                    <i className="bi bi-file-earmark-pdf me-2"></i>
                                                    Generate PDF Report
                                                </>
                                            )}
                                        </button>

                                        <div className="alert alert-info mt-4" role="alert">
                                            <i className="bi bi-info-circle me-2"></i>
                                            <strong>Info:</strong> Laporan akan berisi semua transaksi pada rentang tanggal yang dipilih, lengkap dengan saldo berjalan.
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            <footer className="adminuiux-footer mt-auto">
                <div className="container-fluid text-center">
                    <span className="small">Copyright @2025, Finance Tracking App - ASH</span>
                </div>
            </footer>
        </div>
    );
};

export default Report;
