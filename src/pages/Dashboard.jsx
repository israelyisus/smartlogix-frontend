import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function Dashboard() {
  const { usuario } = useAuth();
  const [stats, setStats] = useState({
    productos: 0,
    pedidos: 0,
    envios: 0,
    alertas: 0,
  });
  const [pedidosRecientes, setPedidosRecientes] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarDatos();
  }, []);

  const toArray = (data) => {
    if (Array.isArray(data)) return data;
    if (data?.content) return data.content;
    if (data?.data) return data.data;
    return [];
  };

  const cargarDatos = async () => {
    try {
      const [productosRes, pedidosRes, enviosRes, alertasRes] = await Promise.all([
        api.get('/api/inventario/productos'),
        api.get('/api/pedidos'),
        api.get('/api/envios'),
        api.get('/api/inventario/alertas/stock-bajo'),
      ]);

      const productos = toArray(productosRes.data);
      const pedidos = toArray(pedidosRes.data);
      const envios = toArray(enviosRes.data);
      const alertas = toArray(alertasRes.data);

      setStats({
        productos: productos.length,
        pedidos: pedidos.length,
        envios: envios.length,
        alertas: alertas.length,
      });

      setPedidosRecientes([...pedidos].slice(-5).reverse());
    } catch (err) {
      console.error('Error cargando datos:', err);
    } finally {
      setCargando(false);
    }
  };

  const estadoColor = (estado) => {
    const colores = {
      CONFIRMADO: 'badge-success',
      PENDIENTE: 'badge-warning',
      CANCELADO: 'badge-danger',
      EN_ENVIO: 'badge-info',
      PENDIENTE_ENVIO: 'badge-warning',
      ENTREGADO: 'badge-success',
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
            <h1>Bienvenido, {usuario?.nombre} 👋</h1>
            <p>Resumen general de tu operación logística</p>
          </div>
          <div style={{
            background: 'rgba(0,212,255,0.1)',
            border: '1px solid rgba(0,212,255,0.3)',
            borderRadius: '8px',
            padding: '8px 16px',
            fontSize: '13px',
            color: 'var(--accent)',
          }}>
            {new Date().toLocaleDateString('es-CL', {
              weekday: 'long', year: 'numeric',
              month: 'long', day: 'numeric'
            })}
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(0,212,255,0.1)' }}>📦</div>
            <div className="stat-info">
              <h3>{stats.productos}</h3>
              <p>Productos</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(124,58,237,0.1)' }}>🛒</div>
            <div className="stat-info">
              <h3>{stats.pedidos}</h3>
              <p>Pedidos</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(16,185,129,0.1)' }}>🚚</div>
            <div className="stat-info">
              <h3>{stats.envios}</h3>
              <p>Envíos</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(239,68,68,0.1)' }}>⚠️</div>
            <div className="stat-info">
              <h3 style={{ color: stats.alertas > 0 ? 'var(--danger)' : 'var(--text)' }}>
                {stats.alertas}
              </h3>
              <p>Alertas stock</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '18px' }}>Pedidos recientes</h2>
            <a href="/pedidos" style={{ color: 'var(--accent)', fontSize: '13px', textDecoration: 'none' }}>
              Ver todos →
            </a>
          </div>

          {pedidosRecientes.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
              <p style={{ fontSize: '32px', marginBottom: '8px' }}>📭</p>
              <p>No hay pedidos aún</p>
            </div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Cliente</th>
                  <th>Total</th>
                  <th>Estado</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {pedidosRecientes.map(pedido => (
                  <tr key={pedido.id}>
                    <td style={{ color: 'var(--accent)', fontWeight: 600 }}>#{pedido.id}</td>
                    <td>{pedido.emailCliente}</td>
                    <td>${pedido.total?.toLocaleString('es-CL')}</td>
                    <td>
                      <span className={`badge ${estadoColor(pedido.estado)}`}>
                        {pedido.estado}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-muted)' }}>
                      {new Date(pedido.creadoEn).toLocaleDateString('es-CL')}
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