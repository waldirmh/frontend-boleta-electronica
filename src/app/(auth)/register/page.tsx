"use client";

import Link from "next/link";
import "./Register.css";
import { useAuth } from "@/context/authContext";
import React, { useState } from "react";
import { UserRegisterDTO } from "@/interface/auth-interface";

export default function Register() {
  const { signup } = useAuth();

  const [formData, setFormData] = useState<UserRegisterDTO>({
    email: "",
    username: "",
    password: "",
    role: ""
  });

  const handleRegister = async () => {
    const userData = {
      ...formData,
      role: formData.role || "USER"
    };
    const response = await signup(userData);
    console.log(">response:", response);
  };

  return (
    <div className="row">
      <div className="col-md-4 offset-md-4">
        <div className="mt-4 text-center">
          <div className="signin-title">REGISTRAR</div>
          <div className="card-body">
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Correo
              </label>
              <input
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                type="text"
                name="email"
                id="email"
                placeholder="correo"
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label htmlFor="username" className="form-label">
                Usuario
              </label>
              <input
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                type="text"
                name="username"
                id="username"
                placeholder="nombre de usuario"
                className="form-control"
              />
            </div>
            <div className="form-group mt-4 mb-5">
              <label htmlFor="password" className="form-label">
                Contraseña
              </label>
              <input
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                type="password"
                name="password"
                id="password"
                placeholder="******"
                className="form-control"
              />
            </div>
            <div className="d-grid gap-2">
              <button className="btn btn-primary mt-4" onClick={handleRegister}>
                REGISTRAR
              </button>
            </div>
            <div className="mt-3 fs-6">
              <Link href="/" className="text-light txt-iniciar-sesion">
                Iniciar sesión
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
