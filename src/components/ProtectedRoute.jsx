import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div className="position-fixed top-0 start-0 w-100 vh-100 d-flex justify-content-center align-items-center bg-white" style={{ zIndex: 1060, backdropFilter: 'blur(5px)' }}>
                <div className="text-center">
                    <div className="spinner-border text-theme-1" role="status" style={{ width: '3.5rem', height: '3.5rem' }}>
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <h5 className="mt-4 text-theme-1">Authenticating</h5>
                    <p className="text-secondary">Please wait...</p>
                </div>
            </div>
        );
    }

    return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
