import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await login(email, password);

        if (result.success) {
            navigate('/dashboard');
        } else {
            setError(result.error);
        }

        setLoading(false);
    };

    return (
        <div className="main-bg main-bg-opac main-bg-blur roundedui theme-pista bg-r-gradient" data-theme="theme-pista">
            <header className="adminuiux-header">
                <nav className="navbar">
                    <div className="container-fluid">
                        <a className="navbar-brand" href="#">
                            <img src="/src/assets/img/dollar.png" alt="Logo" className="avatar avatar-30" />
                            <div className="d-block ps-2">
                                <h6 className="fs-6 mb-0">Finance<span className="fs-6">App</span></h6>
                                <p className="company-tagline">Track Your Money</p>
                            </div>
                        </a>
                    </div>
                </nav>
            </header>

            <div className="adminuiux-wrap z-index-0 position-relative">
                <main className="adminuiux-content">
                    <div className="container-fluid">
                        <div className="row gx-3 align-items-center justify-content-center py-3 mt-auto z-index-1 height-dynamic" style={{ '--h-dynamic': 'calc(100vh - 120px)', minHeight: '500px' }}>
                            <div className="col login-box maxwidth-400">
                                <div className="mb-4">
                                    <h3 className="text-theme-1 fw-normal mb-0">Welcome to,</h3>
                                    <h1 className="fw-bold text-theme-accent-1 mb-0">Finance<b>App</b></h1>
                                </div>

                                {error && (
                                    <div className="alert alert-danger" role="alert">
                                        {error}
                                    </div>
                                )}

                                <form onSubmit={handleSubmit}>
                                    <div className="form-floating mb-3">
                                        <input
                                            type="email"
                                            className="form-control"
                                            id="emailadd"
                                            placeholder="Enter email address"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                        <label htmlFor="emailadd">Email Address</label>
                                    </div>

                                    <div className="position-relative">
                                        <div className="form-floating mb-3">
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                className="form-control"
                                                id="passwd"
                                                placeholder="Enter your password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                            />
                                            <label htmlFor="passwd">Password</label>
                                        </div>
                                        <button
                                            type="button"
                                            className="btn btn-square btn-link text-theme-1 position-absolute end-0 top-0 mt-2 me-2"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                                        </button>
                                    </div>

                                    <button
                                        type="submit"
                                        className="btn btn-lg btn-theme w-100 mb-4"
                                        disabled={loading}
                                    >
                                        {loading ? 'Loading...' : 'Login'}
                                    </button>
                                </form>
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

export default Login;
