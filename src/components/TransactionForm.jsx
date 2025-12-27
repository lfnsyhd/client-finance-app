import { useState } from 'react';

const TransactionForm = ({ transaction, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        tanggal: transaction?.tanggal || new Date().toISOString().split('T')[0],
        tipe: transaction?.tipe || 'masuk',
        jumlah: transaction?.jumlah || '',
        keterangan: transaction?.keterangan || '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await onSave(formData);
        } catch (err) {
            setError(err.message || 'Failed to save transaction');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">
                            {transaction ? 'Edit Transaction' : 'Add New Transaction'}
                        </h5>
                        <button type="button" className="btn-close" onClick={onCancel}></button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="modal-body">
                            {error && (
                                <div className="alert alert-danger" role="alert">
                                    {error}
                                </div>
                            )}

                            <div className="mb-3">
                                <label htmlFor="tanggal" className="form-label">Tanggal</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    id="tanggal"
                                    name="tanggal"
                                    value={formData.tanggal}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="tipe" className="form-label">Tipe</label>
                                <select
                                    className="form-select"
                                    id="tipe"
                                    name="tipe"
                                    value={formData.tipe}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="masuk">Masuk (Income)</option>
                                    <option value="keluar">Keluar (Expense)</option>
                                </select>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="jumlah" className="form-label">Jumlah (Rp)</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    id="jumlah"
                                    name="jumlah"
                                    value={formData.jumlah}
                                    onChange={handleChange}
                                    min="0"
                                    step="0.01"
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="keterangan" className="form-label">Keterangan (Optional)</label>
                                <textarea
                                    className="form-control"
                                    id="keterangan"
                                    name="keterangan"
                                    rows="3"
                                    value={formData.keterangan}
                                    onChange={handleChange}
                                ></textarea>
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button type="button" className="btn btn-outline-secondary" onClick={onCancel}>
                                Cancel
                            </button>
                            <button type="submit" className="btn btn-theme" disabled={loading}>
                                {loading ? 'Saving...' : 'Save Transaction'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default TransactionForm;
