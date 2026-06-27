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

interface FieldErrors {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({ email: "", username: "", password: "", confirmPassword: "" });
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateEmail = (value: string): string => {
    if (!value.trim()) return "El correo es obligatorio";
    if (!EMAIL_REGEX.test(value.trim())) return "Ingrese un correo válido";
    return "";
  };

  const validateUsername = (value: string): string => {
    if (!value.trim()) return "El usuario es obligatorio";
    if (value.trim().length < 3) return "El usuario debe tener al menos 3 caracteres";
    return "";
  };

  const validatePassword = (value: string): string => {
    if (!value) return "La contraseña es obligatoria";
    if (value.length < 6) return "La contraseña debe tener al menos 6 caracteres";
    return "";
  };

  const validateConfirmPassword = (value: string): string => {
    if (!value) return "Confirme la contraseña";
    if (value !== formData.password) return "Las contraseñas no coinciden";
    return "";
  };

  const validateField = (field: string, value: string): string => {
    switch (field) {
      case "email": return validateEmail(value);
      case "username": return validateUsername(value);
      case "password": return validatePassword(value);
      case "confirmPassword": return validateConfirmPassword(value);
      default: return "";
    }
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    if (field === "confirmPassword") {
      setFieldErrors((prev) => ({ ...prev, confirmPassword: validateConfirmPassword(confirmPassword) }));
    } else {
      setFieldErrors((prev) => ({ ...prev, [field]: validateField(field, (formData as any)[field]) }));
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (touched[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: validateField(field, value) }));
    }
    if (field === "password" && touched.confirmPassword) {
      setFieldErrors((prev) => ({ ...prev, confirmPassword: validateConfirmPassword(confirmPassword) }));
    }
  };

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
    if (touched.confirmPassword) {
      setFieldErrors((prev) => ({ ...prev, confirmPassword: validateConfirmPassword(value) }));
    }
  };

  const isFormValid = (): boolean => {
    const emailErr = validateEmail(formData.email);
    const userErr = validateUsername(formData.username);
    const passErr = validatePassword(formData.password);
    const confirmErr = validateConfirmPassword(confirmPassword);
    setFieldErrors({ email: emailErr, username: userErr, password: passErr, confirmPassword: confirmErr });
    setTouched({ email: true, username: true, password: true, confirmPassword: true });
    return !emailErr && !userErr && !passErr && !confirmErr;
  };

  const handleRegister = async () => {
    if (!isFormValid()) return;
    setLoadingRegister(true)
    const userData = {
      ...formData,
      role: formData.role || "USER"
    };
    try {
      const response = await signup(userData);
      if (response && response.status === 201) {
        toast.success("Usuario Registrado")
        router.replace("/")
      }
    } catch (error: any) {
      const message = error.response?.data.error.message
      console.error("> message error signup:", message);
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
  }, [formData, confirmPassword]);

  const getFieldClass = (field: string) => {
    return `form-control form-control-signup ${touched[field] && fieldErrors[field as keyof FieldErrors] ? "is-invalid" : ""}`;
  };

  return (
    <div className="row align-items-center justify-content-center flex-grow-1">
      <div className="col-12 col-sm-10 col-md-6 col-lg-5">
        <div className="mt-1 mt-md-4 text-center">
          <h1 className='register-title mb-0 mb-md-3'> REGISTRAR</h1>
          <div className="card-body">
            <div className="form-group">
              <label htmlFor="email" className="form-label form-label-signup">
                Correo
              </label>
              <input
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                onBlur={() => handleBlur("email")}
                type="text"
                name="email"
                id="email"
                placeholder="correo"
                className={getFieldClass("email")}
                aria-invalid={touched.email && !!fieldErrors.email}
                aria-describedby={fieldErrors.email ? "email-error-reg" : undefined}
              />
              {touched.email && fieldErrors.email && (
                <div id="email-error-reg" className="text-danger text-start small mt-1" role="alert">{fieldErrors.email}</div>
              )}
            </div>
            <div className="form-group mt-2 mt-md-4 mb-2 mb-md-4">
              <label htmlFor="username" className="form-label form-label-signup">
                Usuario
              </label>
              <input
                value={formData.username}
                onChange={(e) => handleChange("username", e.target.value)}
                onBlur={() => handleBlur("username")}
                type="text"
                name="username"
                id="username"
                placeholder="nombre de usuario"
                className={getFieldClass("username")}
                aria-invalid={touched.username && !!fieldErrors.username}
                aria-describedby={fieldErrors.username ? "username-error" : undefined}
              />
              {touched.username && fieldErrors.username && (
                <div id="username-error" className="text-danger text-start small mt-1" role="alert">{fieldErrors.username}</div>
              )}
            </div>
            <div className="form-group mt-2 mb-1 mb-md-4" >
              <label htmlFor="password" className="form-label form-label-signup">
                Contraseña
              </label>
              <input
                value={formData.password}
                onChange={(e) => handleChange("password", e.target.value)}
                onBlur={() => handleBlur("password")}
                type="password"
                name="password"
                id="password"
                placeholder="******"
                className={getFieldClass("password")}
                aria-invalid={touched.password && !!fieldErrors.password}
                aria-describedby={fieldErrors.password ? "password-error-reg" : undefined}
              />
              {touched.password && fieldErrors.password && (
                <div id="password-error-reg" className="text-danger text-start small mt-1" role="alert">{fieldErrors.password}</div>
              )}
            </div>
            <div className="form-group mt-2 mb-1 mb-md-4" >
              <label htmlFor="confirmPassword" className="form-label form-label-signup">
                Confirmar Contraseña
              </label>
              <input
                value={confirmPassword}
                onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                onBlur={() => handleBlur("confirmPassword")}
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                placeholder="******"
                className={getFieldClass("confirmPassword")}
                aria-invalid={touched.confirmPassword && !!fieldErrors.confirmPassword}
                aria-describedby={fieldErrors.confirmPassword ? "confirm-password-error" : undefined}
              />
              {touched.confirmPassword && fieldErrors.confirmPassword && (
                <div id="confirm-password-error" className="text-danger text-start small mt-1" role="alert">{fieldErrors.confirmPassword}</div>
              )}
            </div>
            <div className="d-grid gap-2">
              <button
                className="btn btn-red mt-4 d-flex justify-content-center align-items-center gap-2 btn-signup"
                onClick={handleRegister}
                aria-busy={loadingRegister}
                aria-live="polite"
              >
                {loadingRegister ? (
                  <>
                    <Spin indicator={<LoadingOutlined className="spin" spin />} />
                    <span> REGISTRANDO...</span>
                  </>)
                  : (
                    <span> REGISTRAR</span>
                  )}
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
