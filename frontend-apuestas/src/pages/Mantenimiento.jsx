import logo from "../assets/logo.png";

function Mantenimiento() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        textAlign: 'center',
        padding: '1rem',
      }}
    >
      <h1 style={{ fontSize: '2rem' }}>🔧 Sitio en mantenimiento</h1>
      <p style={{ marginBottom: '2rem' }}>Volveremos pronto.</p>
      <img src={logo} alt="Logo" width={100} height={100} />
    </div>
  );
}

export default Mantenimiento;
