"use client";
import "./Ventas.css";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Invoice, Item } from "@/interface/invoice-interface";
import { InvoiceService } from '@/services/invoice';
import { createInvoiceRequest, getNextNumberRequest } from "@/api/invoice";
import { toast } from "react-toastify";

export default function Ventas() {

    const router = useRouter();
    const invoiceService = new InvoiceService();

    const [invoiceData, setInvoiceData] = useState<Invoice>(invoiceService.getEmptyInvoice());
    const [itemList, setItemList] = useState<Item[]>([]);
    const [itemInvoice, setItemInvoice] = useState<Omit<Item, "id">>(invoiceService.getEmptyItem());
    const total = invoiceService.calculateTotal(itemList);

    const handleCreateInvoice = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const invoice: Invoice = {
                ...invoiceData,
                items: itemList
            };
            const response = await createInvoiceRequest(invoice)
            if (response && response.status === 201) {
                setItemList([]);
                setInvoiceData(invoiceService.getEmptyInvoice());
                invoiceService.deletedInvoice()
                toast.success(response?.data.message)
                router.push("/home")
            }
        } catch (err) {
            console.error("Error al guardar:", err);
        }
    };

    const handleAddItem = (e: React.FormEvent) => {
        e.preventDefault();
        const newItem = invoiceService.createItem(itemInvoice);
        const updatedItems = [...itemList, newItem];
        setItemList(updatedItems);
        setItemInvoice(invoiceService.getEmptyItem());
        const updatedInvoice: Invoice = { ...invoiceData, items: updatedItems };
        invoiceService.saveInvoice(updatedInvoice);
    };

    const handleDeleteItem = (id: string) => {
        const updatedItems = itemList.filter((item) => item.id !== id);
        setItemList(updatedItems);
        const updatedInvoice: Invoice = { ...invoiceData, items: updatedItems };
        setInvoiceData(updatedInvoice);
        invoiceService.saveInvoice(updatedInvoice);
    };

    const cancelInvoice = () => {
        setItemList([]);
        setInvoiceData(invoiceService.getEmptyInvoice());
        invoiceService.deletedInvoice()
        router.push("/home")
    };


    const getNextNumber = async () => {
        try {
            const response = await getNextNumberRequest()
            if (response && response.status === 200) {
                const number = response?.data?.nextnumber
                setInvoiceData((prev) => ({ ...prev, number: number }))
            }
        } catch (error) {
            console.log(">request number", error);
        }
    }
    useEffect(() => {
        const storageInvoice = invoiceService.getInvoice();
        if (storageInvoice) {
            setInvoiceData(storageInvoice);
            setItemList(storageInvoice.items);
        }
        getNextNumber()
    }, []);

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
                            required
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
                            className="form-control input-form number"
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
                            value={itemInvoice.quantity}
                            onChange={(e) => setItemInvoice({ ...itemInvoice, quantity: e.target.value })}
                            required
                        />
                        <input
                            className="form-control input-form"
                            type="number"
                            placeholder="Precio"
                            value={itemInvoice.price}
                            onChange={(e) => setItemInvoice({ ...itemInvoice, price: e.target.value })}
                            required
                        />
                        <textarea
                            className="form-control input-form h-25"
                            placeholder="Descripción"
                            value={itemInvoice.description}
                            onChange={(e) => setItemInvoice({ ...itemInvoice, description: e.target.value })}
                            required
                        />
                        <button className="btn btn-danger clock w-100 mt-2" onClick={handleAddItem}>
                            AGREGAR
                        </button>
                    </div>
                </div>
                <div className="col-md-9">
                    <div className="card-home-venta">
                        <div className="table-responsive">
                            <table className="table align-middle">
                                <thead>
                                    <tr>
                                        <th>CANTIDAD</th>
                                        <th>DESCRIPCION</th>
                                        <th>PRECIO UNIT</th>
                                        <th>VALOR TOTAL</th>
                                        <th className="text-center">ACCION</th>
                                    </tr>
                                </thead>
                                <tbody className="t-body">
                                    {itemList.map((item) => (
                                        <tr key={item.id}>
                                            <td className="text-center">{item.quantity}</td>
                                            <td>{item.description}</td>
                                            <td>S/ {Number(item.price).toFixed(2)}</td>
                                            <td>S/ {Number(item.valuetotal).toFixed(2)}</td>
                                            <td className="text-center">
                                                <button
                                                    onClick={() => handleDeleteItem(item.id)}
                                                    className="btn btn-second button-small btn-deleted"
                                                >
                                                    <i className="bi bi-trash icon-deleted"></i>
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
