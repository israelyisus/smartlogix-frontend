import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import api from '../services/api';

export default function Notificaciones() {
  const [alertas, setAlertas] = useState([]);
  const [historial, setHistorial] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const [alertasRes, historialRes] = await Promise.all([
        api.get('/api/inventario/alertas/stock-bajo'),
        api.get('/api/inventario/alertas/historial'),
      ]);
      setAlertas(alertasRes.data);
      setHistorial(historialRes.data);
    } catch (err) {
      setError('Error al cargar notificaciones');
    } finally {
      setCargando(false);
    }
  };

  if (cargando) return <div className="loading">Cargando...</div>;

  return (
    <div className="layout">
      <Navbar />
      <main className="main-content">
        <div className="page-header">
          <div>
            <h1>Notificaciones 🔔</h1>
            <p>Alertas y eventos del sistema</p>
          </div>
          <button className="btn btn-secondary" onClick={cargarDatos}>
            🔄 Actualizar
          </button>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {/* Alertas stock bajo */}
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '18px', marginBottom: '16px' }}>
            ⚠️ Alertas de stock bajo
            {alertas.length > 0 && (
              <span className="badge badge-danger" style={{ marginLeft: '10px', fontSize: '12px' }}>
                {alertas.length}
              </span>
            )}
          </h2>

          {alertas.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
              <p style={{ fontSize: '32px', marginBottom: '8px' }}>✅</p>
              <p style={{ color: 'var(--text-muted)' }}>Todo el inventario está en niveles normales</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '12px' }}>
              {alertas.map(p => (
                <div key={p.id} style={{
                  background: 'rgba(239,68,68,0.05)',
                  border: '1px solid rgba(239,68,68,0.3)',
                  borderRadius: 'var(--radius)',
                  padding: '16px 20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                  <div>
                    <p style={{ fontWeight: 600, marginBottom: '4px' }}>{p.nombre}</p>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>SKU: {p.sku} | Categoría: {p.categoria}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ color: 'var(--danger)', fontWeight: 700, fontSize: '20px' }}>
                      {p.stockActual}
                    </p>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      Mínimo: {p.stockMinimo}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Historial */}
        <div>
          <h2 style={{ fontSize: '18px', marginBottom: '16px' }}>
            📋 Historial de alertas
            <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 400, marginLeft: '8px' }}>
              (últimas 20 alertas)
            </span>
          </h2>

          <div className="card">
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              alignItems: 'center', marginBottom: '16px'
            }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
                Total alertas generadas: <strong style={{ color: 'var(--accent)' }}>
                  {historial.totalAlertas}
                </strong>
              </p>
            </div>

            {!historial.alertas || historial.alertas.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                <p>No hay alertas en el historial aún.</p>
                <p style={{ fontSize: '13px', marginTop: '8px' }}>
                  Las alertas se generan cuando se reserva stock por debajo del mínimo.
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {historial.alertas.map((alerta, index) => (
                  <div key={index} style={{
                    background: 'var(--bg)',
                    borderRadius: '8px',
                    padding: '10px 14px',
                    fontFamily: 'monospace',
                    fontSize: '13px',
                    color: 'var(--text-muted)',
                    borderLeft: '3px solid var(--warning)',
                  }}>
                    {alerta}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}