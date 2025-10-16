import React, { useState } from "react";
import { Button, Col, Form, Input, Row } from "antd";
import { Link, useNavigate } from "react-router-dom";
import Toastify from "../../components/message";

const initialState = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
};


const Register = () => {
  const [state, setState] = useState(initialState);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setState((s) => ({ ...s, [e.target.name]: e.target.value }));

  const handleRegister = async () => {
    let { firstName, lastName, email, password, confirmPassword } = state;

    firstName = firstName.trim();
    lastName = lastName.trim();
    email = email.trim();
    password = password.trim();
    confirmPassword = confirmPassword.trim();

    if (firstName.length < 3)
      return Toastify("First Name must be at least 3 characters long", "error");
    if (lastName.length < 3)
      return Toastify("Last Name must be at least 3 characters long", "error");
    if (!email) return Toastify("Email is required", "error");
    if (!password) return Toastify("Password is required", "error");
    if (!confirmPassword || confirmPassword !== password) {
      return Toastify("Passwords do not match", "error");
    }

    setIsProcessing(true);
    const URL = import.meta.env.VITE_API_URL;

    try {
      const res = await fetch(`${URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
          confirmPassword,
        }),
      });

      const data = await res.json();
      setIsProcessing(false);

      if (res.ok) {
        Toastify(data.message || "Registration successful", "success");

        if (data.token) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
        }

        setState(initialState);
        navigate("/");
      } else {
        Toastify(data.message || "Registration failed", "error");
      }
    } catch (error) {
      console.error("Registration error:", error);
      Toastify("Something went wrong. Please try again.", "error");
      setIsProcessing(false);
    }
  };

  return (
    <main className="auth">
      <div className="card p-3 p-md-4">
        <h2 className="text-center text-primary py-3">Register</h2>
        <Form layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="First Name">
                <Input
                  type="text"
                  placeholder="Please enter your First Name"
                  name="firstName"
                  value={state.firstName}
                  onChange={handleChange}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Last Name">
                <Input
                  type="text"
                  placeholder="Please enter your Last Name"
                  name="lastName"
                  value={state.lastName}
                  onChange={handleChange}
                />
              </Form.Item>
            </Col>
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
              <Form.Item label="Confirm Password">
                <Input.Password
                  placeholder="Please confirm your Password"
                  name="confirmPassword"
                  value={state.confirmPassword}
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
                onClick={handleRegister}
              >
                Register
              </Button>
            </Col>
          </Row>
          <Row>
            <Col span={24} className="text-center">
              <p className="mb-0 pt-2">
                Already a user?{" "}
                <Link to="/auth/login" style={{ textDecoration: "none" }}>
                  Login now
                </Link>
              </p>
            </Col>
          </Row>
        </Form>
      </div>
    </main>
  );
};

export default Register;
