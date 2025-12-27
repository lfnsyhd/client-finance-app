import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div className="pageloader">
                <div className="container h-100">
                    <div className="row justify-content-center align-items-center text-center h-100">
                        <div className="col-auto">
                            <div className="loader5 mb-2 mx-auto"></div>
                            <p className="small text-secondary">Loading...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
