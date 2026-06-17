import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import api from '../services/api';

export default function Inventario() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');
  const [form, setForm] = useState({
    nombre: '', sku: '', descripcion: '',
    precio: '', stockActual: '', stockMinimo: '',
    categoria: 'Tecnología'
  });

  const categorias = ['Tecnología', 'Hogar', 'Ropa', 'Alimentos', 'Herramientas', 'Otros'];

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      const res = await api.get('/api/inventario/productos');
      setProductos(res.data);
    } catch (err) {
      setError('Error al cargar productos');
    } finally {
      setCargando(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/api/inventario/productos', {
        ...form,
        precio: parseFloat(form.precio),
        stockActual: parseInt(form.stockActual),
        stockMinimo: parseInt(form.stockMinimo),
      });
      setExito('Producto creado exitosamente');
      setModalAbierto(false);
      setForm({ nombre: '', sku: '', descripcion: '', precio: '', stockActual: '', stockMinimo: '', categoria: 'Tecnología' });
      cargarProductos();
      setTimeout(() => setExito(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al crear producto');
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Eliminar este producto?')) return;
    try {
      await api.delete(`/api/inventario/productos/${id}`);
      cargarProductos();
    } catch (err) {
      setError('Error al eliminar producto');
    }
  };

  const stockEstado = (producto) => {
    if (producto.stockActual <= producto.stockMinimo) return 'badge-danger';
    if (producto.stockActual <= producto.stockMinimo * 2) return 'badge-warning';
    return 'badge-success';
  };

  if (cargando) return <div className="loading">Cargando...</div>;

  return (
    <div className="layout">
      <Navbar />
      <main className="main-content">
        <div className="page-header">
          <div>
            <h1>Inventario 📦</h1>
            <p>{productos.length} productos registrados</p>
          </div>
          <button className="btn btn-primary" onClick={() => setModalAbierto(true)}>
            + Nuevo producto
          </button>
        </div>

        {error  && <div className="alert alert-error">{error}</div>}
        {exito  && <div className="alert alert-success">{exito}</div>}

        <div className="card">
          {productos.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
              <p style={{ fontSize: '40px', marginBottom: '12px' }}>📦</p>
              <p>No hay productos. Agrega el primero.</p>
            </div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>SKU</th>
                  <th>Categoría</th>
                  <th>Precio</th>
                  <th>Stock</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {productos.map(p => (
                  <tr key={p.id}>
                    <td style={{ fontWeight: 500 }}>{p.nombre}</td>
                    <td style={{ color: 'var(--accent)', fontFamily: 'monospace' }}>{p.sku}</td>
                    <td>{p.categoria}</td>
                    <td>${p.precio?.toLocaleString('es-CL')}</td>
                    <td>{p.stockActual} / mín {p.stockMinimo}</td>
                    <td>
                      <span className={`badge ${stockEstado(p)}`}>
                        {p.stockActual <= p.stockMinimo ? 'Stock bajo' :
                         p.stockActual <= p.stockMinimo * 2 ? 'Stock medio' : 'OK'}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-danger"
                        style={{ padding: '6px 12px', fontSize: '12px' }}
                        onClick={() => handleEliminar(p.id)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Modal */}
        {modalAbierto && (
          <div className="modal-overlay" onClick={() => setModalAbierto(false)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <h2>Nuevo producto</h2>
              {error && <div className="alert alert-error">{error}</div>}
              <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label>Nombre</label>
                    <input name="nombre" value={form.nombre} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label>SKU</label>
                    <input name="sku" value={form.sku} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label>Precio</label>
                    <input name="precio" type="number" value={form.precio} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label>Categoría</label>
                    <select name="categoria" value={form.categoria} onChange={handleChange}>
                      {categorias.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Stock actual</label>
                    <input name="stockActual" type="number" value={form.stockActual} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label>Stock mínimo</label>
                    <input name="stockMinimo" type="number" value={form.stockMinimo} onChange={handleChange} required />
                  </div>
                </div>
                <div className="form-group">
                  <label>Descripción</label>
                  <input name="descripcion" value={form.descripcion} onChange={handleChange} />
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setModalAbierto(false)}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Crear producto
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