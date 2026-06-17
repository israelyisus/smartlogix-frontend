import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Registro() {
  const [form, setForm] = useState({
    nombre: '', email: '', password: '',
    tipo: 'PYME', rut: '', empresa: '',
    region: 'Metropolitana', codigoAdmin: ''
  });
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');
  const [cargando, setCargando] = useState(false);
  const { registro } = useAuth();
  const navigate = useNavigate();

  const regiones = [
    'Arica y Parinacota', 'Tarapacá', 'Antofagasta', 'Atacama',
    'Coquimbo', 'Valparaíso', 'Metropolitana', "O'Higgins",
    'Maule', 'Ñuble', 'Biobío', 'Araucanía',
    'Los Ríos', 'Los Lagos', 'Aysén', 'Magallanes'
  ];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setCargando(true);
    try {
      await registro(form);
      setExito('Cuenta creada exitosamente. Redirigiendo...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al crear la cuenta.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg)',
      padding: '40px 20px',
    }}>
      <div style={{ width: '100%', maxWidth: '480px' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{
            fontFamily: 'Syne, sans-serif',
            fontSize: '32px',
            fontWeight: 800,
            background: 'linear-gradient(135deg, #00d4ff, #7c3aed)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            SmartLogix
          </h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '6px', fontSize: '14px' }}>
            Crea tu cuenta y empieza a gestionar tu logística
          </p>
        </div>

        <div className="card">
          <h2 style={{ marginBottom: '4px', fontSize: '20px' }}>Crear cuenta</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '24px' }}>
            Completa el formulario para registrarte
          </p>

          {error  && <div className="alert alert-error">{error}</div>}
          {exito  && <div className="alert alert-success">{exito}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Tipo de cuenta</label>
              <select name="tipo" value={form.tipo} onChange={handleChange}>
                <option value="PYME">PYME</option>
                <option value="ADMIN">Administrador</option>
              </select>
            </div>

            <div className="form-group">
              <label>Nombre completo</label>
              <input name="nombre" value={form.nombre} onChange={handleChange}
                placeholder="Tu nombre" required />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input name="email" type="email" value={form.email} onChange={handleChange}
                placeholder="tu@empresa.cl" required />
            </div>

            <div className="form-group">
              <label>Contraseña</label>
              <input name="password" type="password" value={form.password} onChange={handleChange}
                placeholder="Mínimo 6 caracteres" required />
            </div>

            {form.tipo === 'PYME' && (
              <>
                <div className="form-group">
                  <label>RUT empresa</label>
                  <input name="rut" value={form.rut} onChange={handleChange}
                    placeholder="76.123.456-7" required />
                </div>
                <div className="form-group">
                  <label>Nombre empresa</label>
                  <input name="empresa" value={form.empresa} onChange={handleChange}
                    placeholder="Mi Empresa Ltda." required />
                </div>
                <div className="form-group">
                  <label>Región</label>
                  <select name="region" value={form.region} onChange={handleChange}>
                    {regiones.map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
              </>
            )}

            {form.tipo === 'ADMIN' && (
              <div className="form-group">
                <label>Código de administrador</label>
                <input name="codigoAdmin" value={form.codigoAdmin} onChange={handleChange}
                  placeholder="Código secreto" required />
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary"
              disabled={cargando}
              style={{ width: '100%', padding: '12px', fontSize: '15px', marginTop: '8px' }}
            >
              {cargando ? 'Creando cuenta...' : 'Crear cuenta'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: 'var(--text-muted)' }}>
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}>
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}