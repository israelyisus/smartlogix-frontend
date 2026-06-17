import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Registro from './pages/Registro';
import Dashboard from './pages/Dashboard';
import Inventario from './pages/Inventario';
import Pedidos from './pages/Pedidos';
import Envios from './pages/Envios';
import Notificaciones from './pages/Notificaciones';
import Perfil from './pages/Perfil';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={
            <ProtectedRoute><Dashboard /></ProtectedRoute>
          } />
          <Route path="/inventario" element={
            <ProtectedRoute><Inventario /></ProtectedRoute>
          } />
          <Route path="/pedidos" element={
            <ProtectedRoute><Pedidos /></ProtectedRoute>
          } />
          <Route path="/envios" element={
            <ProtectedRoute><Envios /></ProtectedRoute>
          } />
          <Route path="/notificaciones" element={
            <ProtectedRoute><Notificaciones /></ProtectedRoute>
          } />
          <Route path="/perfil" element={
            <ProtectedRoute><Perfil /></ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;