import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { path: '/dashboard',      icon: '⬡',  label: 'Dashboard' },
  { path: '/inventario',     icon: '📦', label: 'Inventario' },
  { path: '/pedidos',        icon: '🛒', label: 'Pedidos' },
  { path: '/envios',         icon: '🚚', label: 'Envíos' },
  { path: '/notificaciones', icon: '🔔', label: 'Notificaciones' },
  { path: '/perfil',         icon: '👤', label: 'Perfil' },
];

export default function Navbar() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={{
      position: 'fixed',
      left: 0, top: 0, bottom: 0,
      width: '240px',
      background: '#0d1424',
      borderRight: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      padding: '24px 16px',
      zIndex: 100,
    }}>
      {/* Logo */}
      <div style={{ marginBottom: '36px', padding: '0 8px' }}>
        <h2 style={{
          fontFamily: 'Syne, sans-serif',
          fontSize: '22px',
          fontWeight: 800,
          background: 'linear-gradient(135deg, #00d4ff, #7c3aed)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          SmartLogix
        </h2>
        <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
          Gestión Logística
        </p>
      </div>

      {/* Nav items */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {navItems.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px 12px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: isActive ? 600 : 400,
              color: isActive ? 'var(--accent)' : 'var(--text-muted)',
              background: isActive ? 'rgba(0,212,255,0.08)' : 'transparent',
              transition: 'all 0.2s',
            })}
          >
            <span style={{ fontSize: '18px' }}>{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </div>

      {/* Usuario */}
      <div style={{
        borderTop: '1px solid var(--border)',
        paddingTop: '16px',
        marginTop: '16px',
      }}>
        <div style={{ padding: '0 8px', marginBottom: '12px' }}>
          <p style={{ fontSize: '13px', fontWeight: 600 }}>{usuario?.nombre}</p>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{usuario?.tipo}</p>
        </div>
        <button onClick={handleLogout} className="btn btn-secondary" style={{ width: '100%', fontSize: '13px' }}>
          Cerrar sesión
        </button>
      </div>
    </nav>
  );
}