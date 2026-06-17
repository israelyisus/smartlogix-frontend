import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Perfil() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  const [confirmando, setConfirmando] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="layout">
      <Navbar />
      <main className="main-content">
        <div className="page-header">
          <div>
            <h1>Perfil 👤</h1>
            <p>Información de tu cuenta</p>
          </div>
        </div>

        <div style={{ maxWidth: '600px' }}>
          {/* Información del usuario */}
          <div className="card" style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px' }}>
              <div style={{
                width: '72px', height: '72px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #00d4ff, #7c3aed)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '28px', fontWeight: 800,
                fontFamily: 'Syne, sans-serif',
                color: '#000',
              }}>
                {usuario?.nombre?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 style={{ fontSize: '22px', marginBottom: '4px' }}>{usuario?.nombre}</h2>
                <span className={`badge ${usuario?.tipo === 'ADMIN' ? 'badge-info' : 'badge-success'}`}>
                  {usuario?.tipo}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                padding: '12px 16px',
                background: 'var(--bg)',
                borderRadius: '8px',
              }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Email</span>
                <span style={{ fontWeight: 500, fontSize: '14px' }}>{usuario?.email}</span>
              </div>

              <div style={{
                display: 'flex', justifyContent: 'space-between',
                padding: '12px 16px',
                background: 'var(--bg)',
                borderRadius: '8px',
              }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Tipo de cuenta</span>
                <span style={{ fontWeight: 500, fontSize: '14px' }}>{usuario?.tipo}</span>
              </div>

              <div style={{
                display: 'flex', justifyContent: 'space-between',
                padding: '12px 16px',
                background: 'var(--bg)',
                borderRadius: '8px',
              }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Estado</span>
                <span className="badge badge-success">Activo</span>
              </div>
            </div>
          </div>

          {/* Cerrar sesión */}
          <div className="card">
            <h3 style={{ marginBottom: '12px', fontSize: '16px' }}>Sesión</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '16px' }}>
              Al cerrar sesión serás redirigido a la pantalla de login.
            </p>
            {!confirmando ? (
              <button className="btn btn-danger" onClick={() => setConfirmando(true)}>
                Cerrar sesión
              </button>
            ) : (
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>¿Estás seguro?</p>
                <button className="btn btn-danger" onClick={handleLogout}>Sí, cerrar sesión</button>
                <button className="btn btn-secondary" onClick={() => setConfirmando(false)}>Cancelar</button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}