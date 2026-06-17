import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import api from '../services/api';

export default function Pedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');
  const [items, setItems] = useState([{ sku: '', nombre: '', cantidad: 1, precioUnitario: 0 }]);
  const [direccion, setDireccion] = useState('');
  const [region, setRegion] = useState('Metropolitana');
  const [tipoEnvio, setTipoEnvio] = useState('ECONOMICO');

  const regiones = [
    'Arica y Parinacota', 'Tarapacá', 'Antofagasta', 'Atacama',
    'Coquimbo', 'Valparaíso', 'Metropolitana', "O'Higgins",
    'Maule', 'Ñuble', 'Biobío', 'Araucanía',
    'Los Ríos', 'Los Lagos', 'Aysén', 'Magallanes'
  ];

  useEffect(() => {
    cargarDatos();
  }, []);

  useEffect(() => {
    if (modalAbierto) {
      api.get('/api/inventario/productos')
        .then(res => setProductos(Array.isArray(res.data) ? res.data : []))
        .catch(err => console.error('Error cargando productos:', err));
    }
  }, [modalAbierto]);

  const cargarDatos = async () => {
    try {
      const pedidosRes = await api.get('/api/pedidos');
      const lista = Array.isArray(pedidosRes.data)
        ? pedidosRes.data
        : pedidosRes.data?.content || pedidosRes.data?.data || [];
      setPedidos([...lista].reverse());
    } catch (err) {
      console.error('Error cargando pedidos:', err);
    }

    try {
      const productosRes = await api.get('/api/inventario/productos');
      setProductos(Array.isArray(productosRes.data) ? productosRes.data : []);
    } catch (err) {
      console.error('Error cargando productos:', err);
    }

    setCargando(false);
  };

  const handleItemChange = (index, field, value) => {
    const nuevosItems = [...items];
    nuevosItems[index][field] = value;
    if (field === 'sku') {
      const producto = productos.find(p => p.sku === value);
      if (producto) {
        nuevosItems[index].nombre = producto.nombre;
        nuevosItems[index].precioUnitario = producto.precio;
      }
    }
    setItems(nuevosItems);
  };

  const agregarItem = () => {
    setItems([...items, { sku: '', nombre: '', cantidad: 1, precioUnitario: 0 }]);
  };

  const eliminarItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const calcularTotal = () => {
    return items.reduce((sum, item) => sum + (item.precioUnitario * item.cantidad), 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const usuario = JSON.parse(localStorage.getItem('usuario'));
      await api.post('/api/pedidos', {
        emailCliente: usuario.email,
        direccionEntrega: direccion,
        region: region,
        tipoEnvio: tipoEnvio,
        items: items.map(i => ({
          sku: i.sku,
          nombre: i.nombre,
          cantidad: parseInt(i.cantidad),
          precioUnitario: parseFloat(i.precioUnitario),
        }))
      });
      setExito('Pedido creado exitosamente');
      setModalAbierto(false);
      setItems([{ sku: '', nombre: '', cantidad: 1, precioUnitario: 0 }]);
      setDireccion('');
      setRegion('Metropolitana');
      setTipoEnvio('ECONOMICO');
      cargarDatos();
      setTimeout(() => setExito(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al crear pedido');
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
            <h1>Pedidos 🛒</h1>
            <p>{pedidos.length} pedidos registrados</p>
          </div>
          <button className="btn btn-primary" onClick={() => setModalAbierto(true)}>
            + Nuevo pedido
          </button>
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {exito && <div className="alert alert-success">{exito}</div>}

        <div className="card">
          {pedidos.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
              <p style={{ fontSize: '40px', marginBottom: '12px' }}>🛒</p>
              <p>No hay pedidos aún.</p>
            </div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Cliente</th>
                  <th>Dirección</th>
                  <th>Total</th>
                  <th>Estado</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {pedidos.map(p => (
                  <tr key={p.id}>
                    <td style={{ color: 'var(--accent)', fontWeight: 600 }}>#{p.id}</td>
                    <td>{p.emailCliente}</td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '13px' }}>{p.direccionEntrega}</td>
                    <td style={{ fontWeight: 600 }}>${p.total?.toLocaleString('es-CL')}</td>
                    <td><span className={`badge ${estadoColor(p.estado)}`}>{p.estado}</span></td>
                    <td style={{ color: 'var(--text-muted)' }}>
                      {new Date(p.creadoEn).toLocaleDateString('es-CL')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {modalAbierto && (
          <div className="modal-overlay" onClick={() => setModalAbierto(false)}>
            <div className="modal" style={{ maxWidth: '600px' }} onClick={e => e.stopPropagation()}>
              <h2>Nuevo pedido</h2>
              {error && <div className="alert alert-error">{error}</div>}
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Dirección de entrega</label>
                  <input
                    value={direccion}
                    onChange={e => setDireccion(e.target.value)}
                    placeholder="Av. Providencia 123"
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label>Región</label>
                    <select value={region} onChange={e => setRegion(e.target.value)}>
                      {regiones.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Tipo de envío</label>
                    <select value={tipoEnvio} onChange={e => setTipoEnvio(e.target.value)}>
                      <option value="ECONOMICO">💰 Económico</option>
                      <option value="RAPIDO">⚡ Rápido</option>
                      <option value="REGIONAL">🗺️ Regional</option>
                    </select>
                  </div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <label style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 500 }}>
                      Productos
                    </label>
                    <button type="button" className="btn btn-secondary"
                      style={{ padding: '4px 10px', fontSize: '12px' }} onClick={agregarItem}>
                      + Agregar
                    </button>
                  </div>

                  {items.map((item, index) => (
                    <div key={index} style={{
                      display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto',
                      gap: '8px', marginBottom: '8px', alignItems: 'end'
                    }}>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label style={{ fontSize: '11px' }}>Producto</label>
                        <select
                          value={item.sku}
                          onChange={e => handleItemChange(index, 'sku', e.target.value)}
                          required
                        >
                          <option value="">Seleccionar</option>
                          {productos.map(p => (
                            <option key={p.sku} value={p.sku}>
                              {p.nombre} ({p.sku})
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label style={{ fontSize: '11px' }}>Cantidad</label>
                        <input type="number" min="1" value={item.cantidad}
                          onChange={e => handleItemChange(index, 'cantidad', e.target.value)} required />
                      </div>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label style={{ fontSize: '11px' }}>Precio</label>
                        <input type="number" value={item.precioUnitario}
                          onChange={e => handleItemChange(index, 'precioUnitario', e.target.value)} required />
                      </div>
                      {items.length > 1 && (
                        <button type="button" className="btn btn-danger"
                          style={{ padding: '8px', fontSize: '12px' }}
                          onClick={() => eliminarItem(index)}>✕</button>
                      )}
                    </div>
                  ))}
                </div>

                <div style={{
                  background: 'var(--bg)', borderRadius: '8px', padding: '12px 16px',
                  marginBottom: '16px', display: 'flex', justifyContent: 'space-between'
                }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Total estimado</span>
                  <span style={{ fontWeight: 700, color: 'var(--accent)', fontSize: '16px' }}>
                    ${calcularTotal().toLocaleString('es-CL')}
                  </span>
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setModalAbierto(false)}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Crear pedido
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}