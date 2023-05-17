import { useEffect, useState } from "react";
import Spinner from "react-bootstrap/Spinner";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import "./Register.css"
export default function Register() {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("userAuthToken");
    if (!token || token === "undefined") return navigate("/register");

  
}, [navigate])

  const [username, setUsername] = useState("");
  const [address, SetAddress] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || username.match(/^\s*$/)) {
      toast.error("* username field required");
      return;
    }
    if (!address || address.match(/^\s*$/)) {
      toast.error("* email field required");
      return;
    }
    if (!password || password.match(/^\s*$/)) {
      toast.error("* Password field required");
      return;
    }
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
    if (!passwordRegex.test(password)) {
      toast.error(
        "password should contain at least one uppercase letter, one lowercase letter, one digit, and at least 8 characters"
      );
      return;
    }
    setLoading(true);

    const generateErrorToast = (err) =>
      toast.error(err, { position: "top-center" });

    try {
      const { data } = await axios.post(`${process.env.REACT_APP_USER_SERVER_API}/register`,{
          username: username,
          address: address,
          password: password,
        });

      if (data) {
        if (data.status) {
          navigate("/register");
        } else{
          toast.error("Some Error Occurred")
        }
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
      generateErrorToast(err.message)
    }
  };

  return (
    <div className="signupParentDiv bg-light">
      <div className="signupDiv bg-white m-4">
        <h2 className="text-center">Create Account</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="fname">Username</label>
          <input
            className="input"
            type="text"
            id="fname"
            name="name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <label htmlFor="email">Address</label>
          <input
            className="input"
            type="text-area"
            id="email"
            value={address}
            onChange={(e) => SetAddress(e.target.value)}
            name="email"
          />
          <label htmlFor="password">Password</label>
          <div className="password_div">
            <input
              className="input "
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              name="password"
            />
          </div>
          {loading ? (
            <button type="button">
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
            </button>
          ) : (
            <button>Signup</button>
          )}
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}