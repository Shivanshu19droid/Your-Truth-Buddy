import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function GoogleLogin({ onLogin }) {   // take onLogin as prop
  const navigate = useNavigate();

  useEffect(() => {
    if (!window.google) return;

    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: handleCredentialResponse,
    });

    window.google.accounts.id.renderButton(
      document.getElementById("googleBtn"),
      { theme: "outline", size: "large" }
    );
  }, []);

  const handleCredentialResponse = (response) => {
    try {
      const userObject = jwtDecode(response.credential);
      console.log("Decoded user:", userObject);

      localStorage.setItem("currentUser", JSON.stringify(userObject));

      onLogin(userObject);   // ✅ update App.jsx state
      navigate("/home");
    } catch (err) {
      console.error("JWT decode failed", err);
    }
  };

  return <div id="googleBtn"></div>;
}

export default GoogleLogin;



