import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Layout from '../Layout/Layout'
import Login from '../Pages/Login'
import ProtectedRoute from './ProtectedRoute'
import Upd_pass from '../Pages/Upd_pass'
import Home from '../Pages/Home'
import Register from '../Pages/Register'
import Sales from '../Pages/Sales'
import AdminUsers from '../Pages/AdminUsers'
import ProfitAnalysis from '../Pages/ProfitAnalysis'
import Reports from '../Pages/Reports'

const NotFound = () => {
    return <h1>404 - Página no encontrada</h1>
}
const isAuthenticated = false

const AppRouter = () => {
    return (
        <Router>
            <Layout>
                <Routes>
                    {/* Rutas públicas */}
                    <Route path="/" element={isAuthenticated ? <Navigate to="/Principal" /> : <Login />} />
                    <Route path="/Cambio-de-contrasena" element={<Upd_pass />} />

                    {/* Rutas protegidas */}
                    <Route path='/Principal' element={<Home />}/>
                    <Route path='/Registro' element={<Register />}/>
                    <Route path='/Ventas' element={<Sales />}/>
                    <Route path='/Administrar-usuarios' element={<AdminUsers />}/>
                    <Route path='/Analisis-de-rentabilidad' element={<ProfitAnalysis />}/>
                    <Route path='/Informes' element={<Reports />}/>
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Layout>
        </Router>
    )
}

export default AppRouter
