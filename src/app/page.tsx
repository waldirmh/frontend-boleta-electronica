"use client"
import Link from 'next/link';
import { UserLoginDTO } from "@/interface/auth-interface";
import { toast } from 'react-toastify'
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/authContext";
import { useRouter } from 'next/navigation';
import "../styles/Signin.css"

export default function Signin() {

  const { signin, errors, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [loadingSpinner, setLoadingSpinner] = useState<boolean>(false)
  const [formData, setFormData] = useState<UserLoginDTO>({
    email: "",
    password: "",
  });


  const handleLogin = async () => {
    setLoadingSpinner(true)
    try {
      const response = await signin(formData);
      if (response?.status === 200) {
        router.push("/home")
      }
    } catch (error: any) {
      const message = error.response?.data.error.message
      console.log("> message error signup:", message);
    }
    finally {
      setLoadingSpinner(false)
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
    if (!loading && isAuthenticated) {
      router.push("/home");
    }
  }, [loading, isAuthenticated, router]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        handleLogin();
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
        <div className="mt-2 mt-md-4 text-center">
          <h1 className='signin-title mb-1 mb-md-3'> INGRESAR</h1>
          <div className="card-body">
            <div className="form-group">
              <label htmlFor="username" className="form-label form-label-signin">Usuario</label>
              <input
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                type="text"
                name="email"
                id="email"
                placeholder="correo"
                className="form-control form-control-signin"
              />
            </div>
            <div className="form-group mt-4 mt-md-4 mb-3 mb-md-5">
              <label htmlFor="password" className="form-label form-label-signin">Contraseña</label>
              <input
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                type="password"
                name="password"
                id="password"
                placeholder="******"
                className="form-control form-control-signin"
              />
            </div>
            <div className="d-grid gap-2">
              <button
                type="button"
                className="btn btn-primary mt-4 d-flex justify-content-center align-items-center gap-2 btn-signin"
                onClick={handleLogin}
                disabled={loadingSpinner}
              >
                {loadingSpinner && (
                  <Spin
                    indicator={<LoadingOutlined style={{ fontSize: 20, color: "white" }} spin />}
                  />
                )}
                <span className={`${loadingSpinner ? 'd-none' : 'd-block'}`}> INICIAR SESIÓN</span>
              </button>
            </div>
            <div className='mt-4 fs-6 '>
              <Link href={"/register"} className="text-light txt-register">
                Registrarse</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
