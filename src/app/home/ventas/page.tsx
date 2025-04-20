"use client";
import "./Ventas.css"
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function Ventas() {
    const router = useRouter();

    const [formData, setFormData] = useState({
        phone: "",
        validate: "",
        date: "",
        sir: "",
        correlative: "001", // ejemplo
        address: "",
    });

    const [detail, setDetail] = useState({
        quantity: 0,
        price: "",
        description: "",
    });

    const [detailsList, setDetailsList] = useState<any[]>([]);
    const [saved, setSaved] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    const total = detailsList.reduce(
        (acc, item) => acc + parseFloat(item.price) * item.quantity,
        0
    );

    const handleHeaderSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // enviar formData al backend
        try {
            // await axios.post("/api/header-order", formData);
            setSaved(true);
            setSuccess("Guardado correctamente");
            setError("");
        } catch (err) {
            setError("Error al guardar");
        }
    };

    const handleDetailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const subTotal = parseFloat(detail.price) * detail.quantity;
        setDetailsList([...detailsList, { ...detail, subTotal, id: Date.now() }]);
        setDetail({ quantity: 0, price: "", description: "" });
    };

    const handleDelete = (id: number) => {
        setDetailsList(detailsList.filter((item) => item.id !== id));
    };

    const cancelOrder = () => {
        setSaved(false);
        setFormData({
            phone: "",
            validate: "",
            date: "",
            sir: "",
            correlative: "001",
            address: "",
        });
        setDetailsList([]);
    };

    return (
        <div className="container mb-5">
            <div className="card-home-venta">
                <div className="row">
                    <div className="col-md-4">
                        <input
                            className="form-control input-form"
                            type="text"
                            placeholder="TELEFONO"
                            name="phone"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                    </div>
                    <div className="col-md-4">
                        <input
                            className="form-control input-form"
                            type="text"
                            placeholder="VALIDO POR"
                            name="validate"
                            value={formData.validate}
                            onChange={(e) => setFormData({ ...formData, validate: e.target.value })}
                        />
                    </div>
                    <div className="col-md-4">
                        <input
                            className="form-control input-form"
                            type="date"
                            name="date"
                            required
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        />
                    </div>
                    <div className="col-md-8">
                        <input
                            className="form-control input-form"
                            type="text"
                            placeholder="SEÑOR(A)"
                            name="sir"
                            required
                            value={formData.sir}
                            onChange={(e) => setFormData({ ...formData, sir: e.target.value })}
                        />
                    </div>
                    <div className="col-md-4">
                        <input
                            className="form-control input-form correlative"
                            type="text"
                            value={formData.correlative}
                            name="correlative"
                            required
                            disabled
                        />
                    </div>
                    <div className="col-md-8">
                        <input
                            className="form-control input-form"
                            type="text"
                            placeholder="DIRECCION"
                            name="address"
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        />
                    </div>

                    {/* {!saved && (
                        <div className="col-md-4">
                            <button className="btn btn-danger clock w-100 mt-2" type="submit">
                                GUARDAR
                            </button>
                        </div>
                    )} */}
                </div>
            </div>

            {true && (
                <div className="row mt-3">
                    <div className="col-md-3">
                        <div className="card-home-venta">
                            <input
                                className="form-control input-form"
                                type="number"
                                placeholder="Cantidad"
                                name="quantity"
                                // value={detail.quantity}
                                onChange={(e) => setDetail({ ...detail, quantity: +e.target.value })}
                                required
                            />
                            <input
                                className="form-control input-form"
                                type="text"
                                placeholder="Precio"
                                name="price"
                                value={detail.price}
                                onChange={(e) => setDetail({ ...detail, price: e.target.value })}
                                required
                            />
                            <textarea
                                className="form-control input-form h-25"
                                placeholder="Descripción"
                                name="description"
                                value={detail.description}
                                onChange={(e) => setDetail({ ...detail, description: e.target.value })}
                                required
                            />
                            <button className="btn btn-danger clock w-100 mt-2" type="submit">
                                AGREGAR
                            </button>
                        </div>
                    </div>
                    <div className="col-md-9">
                        <div className="card-home-venta">
                            <table className="table table-hover">
                                <thead>
                                    <tr>
                                        <th>CANTIDAD</th>
                                        <th>DESCRIPCION</th>
                                        <th>PRECIO UNIT</th>
                                        <th>VALOR TOTAL</th>
                                        <th>ACCION</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {detailsList.map((item) => (
                                        <tr key={item.id}>
                                            <td className="text-center">{item.quantity}</td>
                                            <td>{item.description}</td>
                                            <td>S/ {item.price}</td>
                                            <td>S/ {item.subTotal}</td>
                                            <td className="text-center">
                                                <button
                                                    onClick={() => handleDelete(item.id)}
                                                    className="btn btn-second button-small"
                                                >
                                                    🗑️
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    <tr>
                                        <td colSpan={2}></td>
                                        <th>TOTAL</th>
                                        <td>S/ {total.toFixed(2)}</td>
                                        <td></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="float-end d-flex">
                            <button className="btn btn-danger mt-3 mx-4" onClick={() => alert("Finalizado!")}>
                                FINALIZAR
                            </button>
                            <button className="btn btn-outline-danger mt-3" onClick={cancelOrder}>
                                CANCELAR
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* 
            {!saved && (
                <div className="col-md-12 text-end mb-2 d-flex justify-content-between mt-3">
                    <button className="btn btn-outline-danger mt-3 col-md-2" onClick={() => router.push("/inicio")}>
                        ATRÁS
                    </button>
                </div>
            )} */}
        </div>
    );
}
