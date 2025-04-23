"use client";

import Link from "next/link";
import "./Register.css";
import { useAuth } from "@/context/authContext";
import React, { useEffect, useState } from "react";
import { UserRegisterDTO } from "@/interface/auth-interface";
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import { useRouter } from "next/navigation";
import { toast } from 'react-toastify'


export default function Register() {
  const { signup, errors } = useAuth();
  const router = useRouter()
  const [loadingRegister, setLoadingRegister] = useState<boolean>(false)
  const [formData, setFormData] = useState<UserRegisterDTO>({
    email: "",
    username: "",
    password: "",
    role: ""
  });

  const handleRegister = async () => {
    setLoadingRegister(true)
    const userData = {
      ...formData,
      role: formData.role || "USER"
    };
    try {
      const response = await signup(userData);
      if (response && response.status === 201) {
        toast.success("Usuario Registrado")
        router.push("/")
      }
    } catch (error: any) {
      const message = error.response?.data.error.message
      console.log("> message error signup:", message);
    }
    finally {
      setLoadingRegister(false)
    }

  };

  useEffect(() => {
    if (errors.length > 0) {
      errors.forEach(err => {
        toast.info(err);
      });
    }
  }, [errors]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        handleRegister();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [formData]);


  return (
    <div className="row align-items-center justify-content-center">
      <div className="col-12 col-sm-10 col-md-6 col-lg-5">
        <div className="mt-1 mt-md-4 text-center">
          <div className="register-title mb-0 mb-md-3">REGISTRAR</div>
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
            <div className="form-group mt-4 mt-md-4 mb-3 mb-md-4">
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
            <div className="form-group mt-4 mb-3 mb-md-4" >
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
              <button
                className="btn btn-primary mt-4 d-flex justify-content-center align-items-center gap-2"
                onClick={handleRegister}
                disabled={loadingRegister}
              >
                {loadingRegister && <Spin indicator={<LoadingOutlined style={{ fontSize: 20, color: "white" }} spin />} />}
                <span className={`${loadingRegister ? 'd-none' : 'd-block'}`}> REGISTRAR</span>
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
