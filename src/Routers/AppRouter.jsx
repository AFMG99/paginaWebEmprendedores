import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from '../Layout/Layout';
import Login from '../pages/Login';
import ProtectedRoute from './ProtectedRoute';
import Upd_pass from '../Pages/Upd_pass';
import Home from '../pages/Home';
import Register from '../Pages/Register';
import { AuthProvider } from '../context/AuthContext';

const NotFound = () => {
    return <h1>404 - Página no encontrada</h1>;
};

const AppRouter = () => {
    return (
        <Router>
            <AuthProvider>
                <Layout>
                    <Routes>
                        {/* Rutas públicas */}
                        <Route path='/' element={
                            <ProtectedRoute publicOnly>
                                <Login />
                            </ProtectedRoute>
                        } />
                        <Route path="/Cambio-de-contrasena" element={<Upd_pass />} />
                        <Route path="/Registro" element={<Register />} />

                        {/* Rutas protegidas */}
                        <Route path="/Principal" element={
                            <ProtectedRoute>
                                <Home />
                            </ProtectedRoute>
                        } />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </Layout>
            </AuthProvider>
        </Router>
    );
};

export default AppRouter;