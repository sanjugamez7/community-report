import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>Select Login Type</h2>

      <br /><br />

      <button
        style={{ padding: "10px 20px", marginRight: "20px" }}
        onClick={() => navigate("/citizen-login")}
      >
        Citizen Login
      </button>

      <button
        style={{ padding: "10px 20px" }}
        onClick={() => navigate("/staff-login")}
      >
        Staff Login
      </button>

      
    </div>
  );
}

export default Login;
