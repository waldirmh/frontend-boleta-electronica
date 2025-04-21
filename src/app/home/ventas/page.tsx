"use client";
import "./Ventas.css";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Invoice, Item } from "@/interface/invoice-interface";

export default function Ventas() {
    const router = useRouter();

    const [invoiceData, setInvoiceData] = useState<Invoice>({
        number: '',
        phone: '',
        validate: '',
        date: "",
        client: '',
        address: '',
        items: []
    });

    const [detailsList, setDetailsList] = useState<Item[]>([]);
    const [itemDetail, setItemDetail] = useState<Omit<Item, "id">>({
        quantity: "",
        price: "",
        description: '',
        valuetotal: ""
    });

    const total = detailsList.reduce((acc, item) => acc + Number(item.valuetotal), 0);

    const handleCreateInvoice = (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const invoice: Invoice = {
                ...invoiceData,
                items: detailsList
            };
            console.log("Factura creada:", invoice);
            localStorage.setItem("invoice", JSON.stringify(invoice));

        } catch (err) {
            console.error("Error al guardar:", err);
        }
    };

    const handleAddItem = (e: React.FormEvent) => {
        e.preventDefault();
        const valuetotal = (Number(itemDetail.quantity.trim()) * Number(itemDetail.price.trim())).toFixed(2);
        const newItem: Item = {
            ...itemDetail,
            valuetotal,
            id: crypto.randomUUID(),
        };
        const updatedDetailsList = [...detailsList, newItem];

        setDetailsList(updatedDetailsList);
        setItemDetail({ quantity: "", price: "", description: '', valuetotal: "" });

        const updatedInvoice: Invoice = {
            ...invoiceData,
            items: updatedDetailsList,
        };

        localStorage.setItem("invoice", JSON.stringify(updatedInvoice));
    };


    const handleDelete = (id: string) => {
        const updatedListItem = detailsList.filter(item => item.id !== id)
        setDetailsList(updatedListItem);
        const updatedInvoice: Invoice = {
            ...invoiceData,
            items: updatedListItem
        }
        setInvoiceData(updatedInvoice)
        localStorage.setItem("invoice", JSON.stringify(updatedInvoice))
    };

    const cancelInvoice = () => {
        setDetailsList([]);
        setInvoiceData({
            number: '',
            phone: '',
            validate: '',
            date: '',
            client: '',
            address: '',
            items: []
        });
    };

    useEffect(() => {
        const storageInvoice = localStorage.getItem("invoice")
        if (storageInvoice) {
            const parsedInvoice: Invoice = JSON.parse(storageInvoice)
            setInvoiceData(parsedInvoice)
            setDetailsList(parsedInvoice.items)
        }
    }, [])
    return (
        <div className="container mb-3">
            <div className="card-home-venta">
                <div className="row">
                    <div className="col-md-4">
                        <input
                            className="form-control input-form"
                            type="text"
                            placeholder="TELEFONO"
                            value={invoiceData.phone}
                            onChange={(e) => setInvoiceData({ ...invoiceData, phone: e.target.value })}
                        />
                    </div>
                    <div className="col-md-4">
                        <input
                            className="form-control input-form"
                            type="text"
                            placeholder="VALIDO POR"
                            value={invoiceData.validate}
                            onChange={(e) => setInvoiceData({ ...invoiceData, validate: e.target.value })}
                        />
                    </div>
                    <div className="col-md-4">
                        <input
                            className="form-control input-form"
                            type="date"
                            value={invoiceData.date}
                            onChange={(e) => setInvoiceData({ ...invoiceData, date: e.target.value })}
                        />
                    </div>
                    <div className="col-md-8">
                        <input
                            className="form-control input-form"
                            type="text"
                            placeholder="SEÑOR(A)"
                            value={invoiceData.client}
                            onChange={(e) => setInvoiceData({ ...invoiceData, client: e.target.value })}
                        />
                    </div>
                    <div className="col-md-4">
                        <input
                            className="form-control input-form correlative"
                            type="text"
                            value={invoiceData.number}
                            disabled
                        />
                    </div>
                    <div className="col-md-8">
                        <input
                            className="form-control input-form"
                            type="text"
                            placeholder="DIRECCION"
                            value={invoiceData.address}
                            onChange={(e) => setInvoiceData({ ...invoiceData, address: e.target.value })}
                        />
                    </div>
                </div>
            </div>

            <div className="row mt-2">
                <div className="col-md-3">
                    <div className="card-home-venta">
                        <input
                            className="form-control input-form"
                            type="number"
                            placeholder="Cantidad"
                            value={itemDetail.quantity}
                            onChange={(e) => setItemDetail({ ...itemDetail, quantity: e.target.value })}
                            required
                        />
                        <input
                            className="form-control input-form"
                            type="number"
                            placeholder="Precio"
                            value={itemDetail.price}
                            onChange={(e) => setItemDetail({ ...itemDetail, price: e.target.value })}
                            required
                        />
                        <textarea
                            className="form-control input-form h-25"
                            placeholder="Descripción"
                            value={itemDetail.description}
                            onChange={(e) => setItemDetail({ ...itemDetail, description: e.target.value })}
                            required
                        />
                        <button className="btn btn-danger clock w-100 mt-2" onClick={handleAddItem}>
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
                            <tbody className="t-body">
                                {detailsList.map((item) => (
                                    <tr key={item.id}>
                                        <td className="text-center">{item.quantity}</td>
                                        <td>{item.description}</td>
                                        <td>S/ {Number(item.price).toFixed(2)}</td>
                                        <td>S/ {Number(item.valuetotal).toFixed(2)}</td>
                                        <td className="text-center">
                                            <button
                                                onClick={() => handleDelete(item.id)}
                                                className="btn btn-second button-small"
                                            >
                                                <i className="bi bi-trash"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot className="table-footer">
                                <tr>
                                    <td colSpan={2}></td>
                                    <th>TOTAL</th>
                                    <td>S/ {total.toFixed(2)}</td>
                                    <td></td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                    <div className="float-end d-flex">
                        <button className="btn btn-danger mt-3 mx-4" onClick={handleCreateInvoice}>
                            FINALIZAR
                        </button>
                        <button className="btn btn-outline-danger mt-3" onClick={cancelInvoice}>
                            CANCELAR
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
