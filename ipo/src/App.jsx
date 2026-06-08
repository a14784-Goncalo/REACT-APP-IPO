import { Routes, Route, Link } from 'react-router-dom';

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
            <Link className="nav-link" to="/inspecoes">Inpeções</Link>
          </div>
        </div>

      </nav>

      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Inicio />} />
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
  return (
    <div>
      <div>
        <h2 className="float-left">Clientes</h2>
        <button className="btn btn-light float-right mr-2"><i className="fa fa-refresh"></i>
          Atualizar
        </button>
        <button className="btn btn-dark float-right mr-2"><i className="fa fa-plus-square"></i>
          Novo Cliente
        </button>
      </div>

      <div class="container">
        <table class="table table-striped">
          <thead>
            <tr>
              <th>Código</th>
              <th>Nome</th>
              <th>Morada</th>
              <th>Nif</th>
              <th>Opções</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>Júlio Pinho</td>
              <td>Lisboa</td>
              <td>1853713571</td>
              <td><button className="btn btn-dark mr-2"><i className="fa fa-eye"></i></button>
                <button className="btn btn-dark mr-2"><i className="fa fa-pencil"></i></button>
                <button className="btn btn-dark"><i className="fa fa-trash"></i></button>
              </td>
            </tr>
            <tr>
              <td>1</td>
              <td>Barros Silva</td>
              <td>Madeira</td>
              <td>1577532871</td>
              <td><button className="btn btn-dark mr-2"><i className="fa fa-eye"></i></button>
                <button className="btn btn-dark mr-2"><i className="fa fa-pencil"></i></button>
                <button className="btn btn-dark"><i className="fa fa-trash"></i></button>
              </td>
            </tr>
            <tr>
              <td>1</td>
              <td>Maria Juhana</td>
              <td>Leiria</td>
              <td>7512383122</td>
              <td><button className="btn btn-dark mr-2"><i className="fa fa-eye"></i></button>
                <button className="btn btn-dark mr-2"><i className="fa fa-pencil"></i></button>
                <button className="btn btn-dark"><i className="fa fa-trash"></i></button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  );
}

function VeiculosList() {
  return (<h2>Página de Veículos</h2>);
}

function InspecoesList() {
  return (<h2>Página de Inspeções</h2>);
}

export default App

