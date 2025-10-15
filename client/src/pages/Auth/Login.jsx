import React, { useState } from "react";
import { Button, Col, Form, Input, Row } from "antd";
import { Link, useNavigate } from "react-router-dom";
import Toastify from "../../components/message"; // your toast message helper

const initialState = {
  email: "",
  password: "",
};

const Login = () => {
  const [state, setState] = useState(initialState);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setState((s) => ({ ...s, [e.target.name]: e.target.value }));

  const handleLogin = async () => {
    let { email, password } = state;

    email = email.trim();
    password = password.trim();

    if (!email) return Toastify("Email is required", "error");
    if (!password) return Toastify("Password is required", "error");

    setIsProcessing(true);

    try {
      const res = await fetch("http://localhost:8000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      setIsProcessing(false);

      if (res.ok) {
        Toastify(data.message || "Login successful", "success");

        // Save token and user info
        if (data.token) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
        }

        setState(initialState);
        navigate("/"); 
      } else {
        Toastify(data.message || "Invalid credentials", "error");
      }
    } catch (error) {
      console.error("Login error:", error);
      Toastify("Something went wrong. Please try again.", "error");
      setIsProcessing(false);
    }
  };

  return (
    <main className="auth">
      <div className="card p-3 p-md-4">
        <h2 className="text-center text-primary py-3">Login</h2>
        <Form layout="vertical">
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item label="Email">
                <Input
                  type="email"
                  placeholder="Please enter your Email"
                  name="email"
                  value={state.email}
                  onChange={handleChange}
                />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item label="Password">
                <Input.Password
                  placeholder="Please enter your Password"
                  name="password"
                  value={state.password}
                  onChange={handleChange}
                />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Button
                type="primary"
                loading={isProcessing}
                htmlType="button"
                block
                onClick={handleLogin}
              >
                Login
              </Button>
            </Col>
          </Row>

          <Row>
            <Col span={24} className="text-center">
              <p className="mb-0 pt-2">
                Don’t have an account?{" "}
                <Link to="/auth/register" style={{ textDecoration: "none" }}>
                  Register now
                </Link>
              </p>
            </Col>
          </Row>
        </Form>
      </div>
    </main>
  );
};

export default Login;
