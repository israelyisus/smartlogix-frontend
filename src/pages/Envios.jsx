import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import api from '../services/api';

export default function Envios() {
  const [envios, setEnvios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    cargarEnvios();
  }, []);

  const cargarEnvios = async () => {
    try {
      const res = await api.get('/api/envios');
      setEnvios(res.data.reverse());
    } catch (err) {
      setError('Error al cargar envíos');
    } finally {
      setCargando(false);
    }
  };

  const handleActualizarEstado = async (id, estado) => {
    try {
      await api.patch(`/api/envios/${id}/estado?estado=${estado}`);
      cargarEnvios();
    } catch (err) {
      setError('Error al actualizar estado');
    }
  };

  const estadoColor = (estado) => {
    const colores = {
      EN_CAMINO: 'badge-info',
      PENDIENTE: 'badge-warning',
      ENTREGADO: 'badge-success',
      FALLIDO: 'badge-danger',
    };
    return colores[estado] || 'badge-info';
  };

  if (cargando) return <div className="loading">Cargando...</div>;

  return (
    <div className="layout">
      <Navbar />
      <main className="main-content">
        <div className="page-header">
          <div>
            <h1>Envíos 🚚</h1>
            <p>{envios.length} envíos registrados</p>
          </div>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <div className="card">
          {envios.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
              <p style={{ fontSize: '40px', marginBottom: '12px' }}>🚚</p>
              <p>No hay envíos aún. Crea un pedido primero.</p>
            </div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Pedido</th>
                  <th>Transportista</th>
                  <th>Código seguimiento</th>
                  <th>Dirección</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {envios.map(e => (
                  <tr key={e.id}>
                    <td style={{ color: 'var(--accent)', fontWeight: 600 }}>#{e.id}</td>
                    <td>#{e.pedidoId}</td>
                    <td style={{ fontWeight: 500 }}>{e.transportista}</td>
                    <td style={{ fontFamily: 'monospace', fontSize: '13px', color: 'var(--text-muted)' }}>
                      {e.codigoSeguimiento}
                    </td>
                    <td style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{e.direccionEntrega}</td>
                    <td>
                      <span className={`badge ${estadoColor(e.estado)}`}>{e.estado}</span>
                    </td>
                    <td>
                      <select
                        value={e.estado}
                        onChange={ev => handleActualizarEstado(e.id, ev.target.value)}
                        style={{
                          background: 'var(--bg)',
                          border: '1px solid var(--border)',
                          borderRadius: '6px',
                          color: 'var(--text)',
                          padding: '4px 8px',
                          fontSize: '12px',
                          cursor: 'pointer',
                        }}
                      >
                        <option value="PENDIENTE">PENDIENTE</option>
                        <option value="EN_CAMINO">EN_CAMINO</option>
                        <option value="ENTREGADO">ENTREGADO</option>
                        <option value="FALLIDO">FALLIDO</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}