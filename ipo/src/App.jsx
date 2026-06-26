import { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';

const API_BASE = 'https://obscure-doodle-97vxxqq5px3w47-3000.app.github.dev';

function App() {
  return (
    <div>
      {/* Barra de navegação superior em bootstap 4 */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">

        <div className="container">
          <Link className="navbar-brand" to="/">IPO</Link>
          <div className="navbar-nav">
            <Link className="nav-link" to="/clientes">Clientes</Link>
            <Link className="nav-link" to="/veiculos">Veículos</Link>
            <Link className="nav-link" to="/inspecoes">Inspeções</Link>

          </div>
        </div>

      </nav>

      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Inicio />} />

          {/* Rotas do formulário de Clientes */}
          <Route path="/clientes/create" element={<ClienteForm modo="create" />} />
          <Route path="/clientes/update/:id" element={<ClienteForm modo="update" />} />
          <Route path="/clientes/read/:id" element={<ClienteForm modo="read" />} />

          <Route path="/veiculos/create" element={<VeiculoForm modo="create" />} />
          <Route path="/veiculos/update/:id" element={<VeiculoForm modo="update" />} />
          <Route path="/veiculos/read/:id" element={<VeiculoForm modo="read" />} />

          <Route path="/clientes" element={<ClientesList />} />
          <Route path="/veiculos" element={<VeiculosList />} />
          <Route path="/inspecoes" element={<InspecoesList />} />
        </Routes>
      </div>

    </div>
  );
}

// Estas páginas serão criadas nas próximas etapas
function Inicio() {
  return (
    <div className="jumbotron jumbotron-fluid">
      <div className="container text-center">
        <h1>Centro de Inspeções de Automóveis</h1>
        <p>IPO - ESDS1</p>
      </div>
    </div>
  );
}

function ClientesList() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mensagemErro, setMensagemErro] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const openDeleteModal = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setDeleteId(null);
    setShowDeleteModal(false);
  };

  const confirmDelete = async (id) => {
    try {
      const response = await fetch(API_BASE + '/clientes/' + id, { method: 'DELETE' });
      const data = await response.json();
      if (data.success) {
        fetchData();
      } else {
        setMensagemErro(data.message);
      }
    } catch {
      setMensagemErro('Erro ao eliminar cliente');
    }
    finally {
      closeDeleteModal();
    }
  };

  const fetchData = async () => {
    try {
      const response = await fetch(API_BASE + '/clientes');
      const data = await response.json();

      if (data.success) {
        setClientes(data.data);
      } else {
        setMensagemErro(data.message);
      }

    } catch {
      setMensagemErro('Erro ao carregar clientes');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Carregando...</p>;
  return (
    <>
      <div className="row">
        <div className="col-6">
          <h2>Clientes</h2>
        </div>
        <div className="col-6 text-right">
          <button className="btn btn-dark" onClick={() => navigate('/clientes/create')}>Novo cliente</button>
          <button className="btn btn-light ml-3" onClick={fetchData}><i className="fa fa-refresh" aria-hidden="true"></i> Atualizar</button>
        </div>
      </div>
      {mensagemErro && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {mensagemErro}
          <button type="button" className="close" onClick={() => setMensagemErro('')} aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
      )}
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Código</th>
            <th>Nome</th>
            <th>Morada</th>
            <th>NIF</th>
            <th>Opções</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map(cliente => (
            <tr key={cliente.codcli}>
              <td>{cliente.codcli}</td>
              <td>{cliente.nome}</td>
              <td>{cliente.morada}</td>
              <td>{cliente.nif}</td>
              <td style={{ whiteSpace: 'nowrap' }}>
                <button className="btn btn-dark btn-sm mr-2" onClick={() => navigate(`/clientes/read/${cliente.codcli}`)}>
                  <i className='fa fa-eye' aria-hidden='true'></i>
                </button>
                <button className="btn btn-dark btn-sm mr-2" onClick={() => navigate(`/clientes/update/${cliente.codcli}`)}>
                  <i className='fa fa-pencil' aria-hidden='true'></i>
                </button>
                <button className="btn btn-dark btn-sm" onClick={() => openDeleteModal(cliente.codcli)}>
                  <i className='fa fa-trash' aria-hidden='true'></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showDeleteModal && (
        <>
          <div className="modal-backdrop fade show"></div>
          <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1" role="dialog">
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Confirmação</h5>
                  <button type="button" className="close" onClick={closeDeleteModal}>
                    <span>&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  <p>Tem certeza que deseja eliminar este cliente?</p>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={closeDeleteModal}>Cancelar</button>
                  <button type="button" className="btn btn-danger" onClick={() => confirmDelete(deleteId)}>Confirmar</button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

function ClienteForm({ modo }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ nome: '', morada: '', nif: '' });
  const [loading, setLoading] = useState(true);
  const [mensagemErro, setMensagemErro] = useState(null);

  useEffect(() => {
    fetchData();
  }, [id]);
  const fetchData = async () => {
    try {
      if (id) {
        const response = await fetch(API_BASE + '/clientes/' + id);
        const data = await response.json();
        if (data.success) {
          setFormData(data.data);
        } else {
          setMensagemErro(data.message);
        }
      }
    } catch {
      setMensagemErro('Erro ao carregar cliente');
    } finally {
      setLoading(false);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const method = modo === 'update' ? 'PUT' : 'POST';
      const url = modo === 'update' ? `${API_BASE}/clientes/${id}` : `${API_BASE}/clientes`;
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.success) {
        if (modo === '/clientes/update') {
          navigate('/clientes/update/' + id);
        } else {
          navigate('/clientes');
        }
      } else {
        setMensagemErro(data.message);
      }
    } catch {
      setMensagemErro('Erro ao guardar o cliente');
    }
  };
  if (loading) return <p>Carregando...</p>;

  let title;

  if (modo === 'create') title = 'Novo Cliente';
  else if (modo === 'update') title = 'Editar Cliente #' + id;
  else title = 'Cliente #' + id;

  return (
    <form onSubmit={modo !== 'read' ? handleSubmit : undefined}>
      <h2>{title}</h2>
      {mensagemErro && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {mensagemErro}
          <button type="button" className="close" onClick={() => setMensagemErro('')} aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
      )}
      <div className="row">
        <div className="col-sm-8">
          <div className="form-group">
            <label for="nome">Nome:</label>
            <input type="text" className="form-control" value={formData.nome} onChange={(e) => setFormData({
              ...formData, nome:

                e.target.value
            })} required readOnly={modo === 'read'} />
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-sm-6">
          <div className="form-group">
            <label>Morada</label>
            <input type="text" className="form-control" value={formData.morada} onChange={(e) => setFormData({
              ...formData, morada:
                e.target.value
            })} required readOnly={modo === 'read'} />
          </div>
        </div>
        <div className="col-sm-6">
          <div className="form-group">
            <label>NIF</label>
            <input type="text" className="form-control" value={formData.nif} onChange={(e) => setFormData({
              ...formData, nif:

                e.target.value
            })} required readOnly={modo === 'read'} />
          </div>
        </div>
      </div>
      {modo !== 'read' ? (
        <>
          <button type="submit" className="btn btn btn-dark mr-2">Guardar</button>
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/clientes')}>Cancelar</button>
        </>
      ) : (
        <button type="button" className="btn btn-secondary" onClick={() => navigate('/clientes')}>Voltar</button>
      )}
    </form>
  );
}

function VeiculoForm({ modo }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ codmatricula: '', datalivrete: '', anofabrico: '', codcli: '', codmarca: '' });
  const [loading, setLoading] = useState(true);
  const [mensagemErro, setMensagemErro] = useState(null);
  const [clientes, setClientes] = useState([]);
  const [marcas, setMarcas] = useState([]);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      if (id) {
        const response1 = await fetch(`${API_BASE}/veiculos/${id}`);
        const data1 = await response1.json();
        if (data1.success) {
          setFormData(data1.data);
        } else {
          setMensagemErro(data1.message);
        }
      }
      const response2 = await fetch(`${API_BASE}/clientes`);
      const data2 = await response2.json();
      if (data2.success) {
        setClientes(data2.data);
      } else {
        setMensagemErro(data2.message);
      }
    } catch {
      setMensagemErro('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const method = modo === 'update' ? 'PUT' : 'POST';
      const url = modo === 'update' ? `${API_BASE}/veiculos/${id}` : `${API_BASE}/veiculos`;
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.success) {
        if (modo === '/veiculos/update') {
          navigate('/veiculos/update/' + id);
        } else {
          navigate('/veiculos');
        }
      } else {
        setMensagemErro(data.message);
      }
    } catch {
      setMensagemErro('Erro ao guardar o veiculo');
    }
  };
  if (loading) return <p>Carregando...</p>;

  let title;

  if (modo === 'create') title = 'Novo Veiculo';
  else if (modo === 'update') title = 'Editar Veiculo #' + id;
  else title = 'Veiculo #' + id;

  return (
    <form onSubmit={modo !== 'read' ? handleSubmit : undefined}>
      <h2>{title}</h2>
      {mensagemErro && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {mensagemErro}
          <button type="button" className="close" onClick={() => setMensagemErro('')} aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
      )}
      <div className="row">
        <div className="col-8">
          <div className="form-group">
            <label for="codmatricula">Código da Matrícula:</label>
            <input type="text" className="form-control" value={formData.codmatricula} onChange={(e) => setFormData({
              ...formData, codmatricula:

                e.target.value
            })} required readOnly={modo === 'read'} />
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-6">
          <div className="form-group">
            <label for="datalivrete">Data de Livrete:</label>
            <input type="date" className="form-control" value={formData.datalivrete} onChange={(e) => setFormData({
              ...formData, datalivrete:
                e.target.value
            })} required readOnly={modo === 'read'} />
          </div>
        </div>
        <div className="col-6">
          <div className="form-group">
            <label>Ano Fabrico</label>
            <input type="text" className="form-control" value={formData.anofabrico} onChange={(e) => setFormData({
              ...formData, anofabrico:

                e.target.value
            })} required readOnly={modo === 'read'} />
          </div>
        </div>
      </div>
      <div className="row">
        <div className="form-group">
          <label>Cliente</label>
          <select className="form-control" value={formData.codcli} onChange={(e) => setFormData({
            ...formData, codcli:
              e.target.value
          })} required disabled={modo === 'read'}>
            <option value="">Selecione</option>
            {veiculos.map(veiculo => <option key={veiculo.codcli} value={veiculo.codcli}>{veiculo.nome}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label>Código da Marca</label>
          <select className="form-control" value={formData.codmarca} onChange={(e) => setFormData({
            ...formData, codmarca:
              e.target.value
          })} required disabled={modo === 'read'}>
            <option value="">Selecione</option>
            {veiculos.map(veiculo => <option key={veiculo.codmarca} value={veiculo.codmarca}>{veiculo.nome}</option>)}
          </select>
        </div>
      </div>
      {modo !== 'read' ? (
        <>
          <button type="submit" className="btn btn btn-dark mr-2">Guardar</button>
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/veiculos')}>Cancelar</button>
        </>
      ) : (
        <button type="button" className="btn btn-secondary" onClick={() => navigate('/veiculos')}>Voltar</button>
      )}
    </form>
  );
}



function VeiculosList() {
  const [veiculos, setVeiculos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mensagemErro, setMensagemErro] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const openDeleteModal = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setDeleteId(null);
    setShowDeleteModal(false);
  };

  const confirmDelete = async (id) => {
    try {
      const response = await fetch(API_BASE + '/veiculos/' + id, { method: 'DELETE' });
      const data = await response.json();
      if (data.success) {
        fetchData();
      } else {
        setMensagemErro(data.message);
      }
    } catch {
      setMensagemErro('Erro ao eliminar veiculo');
    }
    finally {
      closeDeleteModal();
    }
  };

  const fetchData = async () => {
    try {
      const response = await fetch(API_BASE + '/veiculos');
      const data = await response.json();

      if (data.success) {
        setVeiculos(data.data);
      } else {
        setMensagemErro(data.message);
      }

    } catch {
      setMensagemErro('Erro ao carregar veiculos');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Carregando...</p>;

  return (
    <>
      <div className="row">
        <div className="col-6">
          <h2>Veiculos</h2>
        </div>
        <div className="col-6 text-right">
          <button className="btn btn-dark" onClick={() => navigate('/veiculos/create')}>Novo veiculo</button>
          <button className="btn btn-light ml-3" onClick={fetchData}><i className="fa fa-refresh" aria-hidden="true"></i> Atualizar</button>
        </div>
      </div>
      {mensagemErro && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {mensagemErro}
          <button type="button" className="close" onClick={() => setMensagemErro('')} aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
      )}
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Veiculo</th>
            <th>Matrícula</th>
            <th>Data Livrete</th>
            <th>Ano Fabrico</th>
            <th>Código do Cliente</th>
            <th>Código da Marca</th>
            <th>Opções</th>
          </tr>
        </thead>
        <tbody>
          {veiculos.map(veiculo => (
            <tr key={veiculo.codveiculo}>
              <td>{veiculo.codveiculo}</td>
              <td>{veiculo.codmatricula}</td>
              <td>{veiculo.datalivrete}</td>
              <td>{veiculo.anofabrico}</td>
              <td>{veiculo.codcli}</td>
              <td>{veiculo.codmarca}</td>
              <td style={{ whiteSpace: 'nowrap' }}>
                <button className="btn btn-dark btn-sm mr-2" ><i className='fa fa-eye' aria-hidden='true'></i></button>
                <button className="btn btn-dark btn-sm mr-2" ><i className='fa fa-pencil' aria-hidden='true'></i></button>
                <button className="btn btn-dark btn-sm" onClick={() => openDeleteModal(veiculo.codveiculo)}>
                  <i className='fa fa-trash' aria-hidden='true'></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showDeleteModal && (
        <>
          <div className="modal-backdrop fade show"></div>
          <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1" role="dialog">
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Confirmação</h5>
                  <button type="button" className="close" onClick={closeDeleteModal}>
                    <span>&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  <p>Tem certeza que deseja eliminar este veiculo?</p>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={closeDeleteModal}>Cancelar</button>
                  <button type="button" className="btn btn-danger" onClick={() => confirmDelete(deleteId)}>Confirmar</button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

function InspecoesList() {
  const [inspecoes, setInspecoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mensagemErro, setMensagemErro] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(API_BASE + '/inspecoes');
      const data = await response.json();

      if (data.success) {
        setInspecoes(data.data);
      } else {
        setMensagemErro(data.message);
      }

    } catch {
      setMensagemErro('Erro ao carregar inspeções');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Carregando...</p>;

  return (
    <>
      <div className="row">
        <div className="col-6">
          <h2>Inspecoes</h2>
        </div>
        <div className="col-6 text-right">
          <button className="btn btn-dark ml-3" ><i className="fa fa-plus-square" aria-hidden="true"></i> Nova Inspeção</button>
          <button className="btn btn-light ml-3" onClick={fetchData}><i className="fa fa-refresh" aria-hidden="true"></i> Atualizar</button>
        </div>
      </div>
      {mensagemErro && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {mensagemErro}
          <button type="button" className="close" onClick={() => setMensagemErro('')} aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
      )}
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Inspeção</th>
            <th>Código Cliente</th>
            <th>Matrícula</th>
            <th>Código Inspetor</th>
            <th>Data Inspeção</th>
            <th>Faltas</th>
            <th>Aprovado</th>
            <th>Opções</th>
          </tr>
        </thead>
        <tbody>
          {inspecoes.map(inspecao => (
            <tr key={inspecao.codinspecao}>
              <td>{inspecao.codinspecao}</td>
              <td>{inspecao.codcli}</td>
              <td>{inspecao.codmatricula}</td>
              <td>{inspecao.codinspetor}</td>
              <td>{inspecao.datainspecao}</td>
              <td>{inspecao.numerofaltas}</td>
              <td>{inspecao.descricaofaltas}</td>
              <td>{inspecao.aprovado}</td>

              <td style={{ whiteSpace: 'nowrap' }}>
                <button className="btn btn-dark btn-sm mr-2" ><i className='fa fa-eye' aria-hidden='true'></i></button>
                <button className="btn btn-dark btn-sm mr-2" ><i className='fa fa-pencil' aria-hidden='true'></i></button>
              </td>

            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default App

