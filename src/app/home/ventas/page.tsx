"use client";
import "./Ventas.css";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Invoice, Item } from "@/interface/invoice-interface";
import { InvoiceService } from '@/services/invoice';
import { createInvoiceRequest, getNextNumberRequest } from "@/api/invoice";
import { toast } from "react-toastify";
import { Spin } from "antd";
import { LoadingOutlined } from '@ant-design/icons';
import { combineDateWithCurrentTime } from "@/utils/dateUtils";

import type { DatePickerProps } from 'antd';
import { DatePicker } from 'antd';


export default function Ventas() {

    const router = useRouter();
    const invoiceService = new InvoiceService();
    const [loadingSpinner, setLoadingSpinner] = useState<boolean>(false)
    const [invoiceData, setInvoiceData] = useState<Invoice>(invoiceService.getEmptyInvoice());
    const [itemList, setItemList] = useState<Item[]>([]);
    const [itemInvoice, setItemInvoice] = useState<Omit<Item, "id">>(invoiceService.getEmptyItem());
    const [touchedHeader, setTouchedHeader] = useState<boolean>(false)
    const [touchedItem, setTouchedItem] = useState<boolean>(false)
    const total = invoiceService.calculateTotal(itemList);

    const handleCreateInvoice = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoadingSpinner(true)
        try {
            let currentDateInvoice = combineDateWithCurrentTime(invoiceData.createdDate)

            const invoice: Invoice = {
                ...invoiceData,
                items: itemList,
                saleprice: total,
                createdDate: currentDateInvoice
            };
            if (!invoice.items.length) {
                toast.info("Debes agregar al menos una venta")
                return
            }
            if (!invoiceService.isVerifyHeader(invoice)) {
                toast.error("Complete los datos de la cabecera")
                setTouchedHeader(true)
                return
            }
            const response = await createInvoiceRequest(invoice)
            if (response && response.status === 201) {
                setItemList([]);
                setInvoiceData(invoiceService.getEmptyInvoice());
                invoiceService.deletedInvoice()
                toast.success(response?.data.message)
                router.push("/home")
            }
        } catch (error: any) {
            if (error.response) {
                const message = error.response?.data?.error.message
                toast.error(message)
            }
            else {
                console.log("Error:", error);
            }
        }
        finally {
            setLoadingSpinner(false)
        }
    };

    const handleAddItem = (e: React.FormEvent) => {
        e.preventDefault();

        const newItem = invoiceService.createItem(itemInvoice);
        if (!invoiceService.isVerifySale(newItem)) {
            setTouchedItem(true)
            return
        }
        const updatedItems = [...itemList, newItem];
        const newTotal = invoiceService.calculateTotal(updatedItems)

        setItemList(updatedItems);
        setItemInvoice(invoiceService.getEmptyItem());
        const updatedInvoice: Invoice = { ...invoiceData, items: updatedItems, saleprice: newTotal };
        invoiceService.saveInvoice(updatedInvoice);
        setTouchedItem(false)

    };

    const handleDeleteItem = (id: string) => {
        const updatedItems = itemList.filter((item) => item.id !== id);
        const newTotal = invoiceService.calculateTotal(updatedItems)
        setItemList(updatedItems);
        const updatedInvoice: Invoice = { ...invoiceData, items: updatedItems, saleprice: newTotal };
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

    const onChange: DatePickerProps['onChange'] = (date, dateString) => {
        const isoDate = date ? date.toISOString().split('T')[0] : '';
        setInvoiceData({ ...invoiceData, createdDate: isoDate });
    };


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
                    <div className="col-md-4 ">
                        <div className="input-group">
                            <span className="input-group-text select-number" id="basic-addon1">+51</span>
                            <input
                                className={`form-control input-form ${invoiceData.phone.length > 9 ? "is-invalid" : ""}`}
                                type="text"
                                placeholder="TELEFONO"
                                value={invoiceData.phone}
                                onChange={(e) => setInvoiceData({ ...invoiceData, phone: e.target.value })}
                                required
                            />
                        </div>

                    </div>
                    <div className="col-md-4">
                        <input
                            className={`form-control input-form ${touchedHeader && invoiceData.validate.trim() === "" ? "is-invalid" : ""}`}
                            type="text"
                            placeholder="VALIDO POR"
                            value={invoiceData.validate}
                            onChange={(e) => setInvoiceData({ ...invoiceData, validate: e.target.value })}
                        />
                    </div>
                    <div className="col-md-4">
                        <DatePicker
                            className={`form-control input-form ${touchedHeader && invoiceData.createdDate.trim() === "" ? "is-invalid" : ""}`}
                            onChange={onChange}
                            placeholder="Selecciona fecha"
                        />
                    </div>
                    <div className="col-md-8">
                        <input
                            className={`form-control input-form ${touchedHeader && invoiceData.client.trim() === '' ? "is-invalid" : ""}`}
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
                            value={`N° ${invoiceData.number}`}
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
                            className={`form-control input-form ${touchedItem && itemInvoice.quantity.trim() === '' ? "is-invalid" : ""}`}
                            type="number"
                            placeholder="Cantidad"
                            value={itemInvoice.quantity}
                            onChange={(e) => setItemInvoice({ ...itemInvoice, quantity: e.target.value })}
                            required
                        />
                        <input
                            className={`form-control input-form ${touchedItem && itemInvoice.price.trim() === '' ? "is-invalid" : ""}`}
                            type="number"
                            placeholder="Precio"
                            value={itemInvoice.price}
                            onChange={(e) => setItemInvoice({ ...itemInvoice, price: e.target.value })}
                            required
                        />
                        <textarea
                            className={`form-control input-form h-25 ${touchedItem && itemInvoice.description.trim() === '' ? "is-invalid" : ""}`}
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
                            <table className="table table-hover">
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
                                                    className="btn btn-second button-small btn-deleted-sales"
                                                >
                                                    <i className="bi bi-trash-fill icon-deleted"></i>
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
                    <div className="float-end d-flex gap-2">
                        <button className="btn btn-danger btn-finish mt-3 d-flex justify-content-center align-items-center"
                            onClick={handleCreateInvoice}
                            disabled={loadingSpinner}
                        >
                            {loadingSpinner && (
                                <Spin
                                    indicator={<LoadingOutlined style={{ fontSize: 20, color: "white" }} spin />}
                                />
                            )}
                            <span className={`${loadingSpinner ? 'd-none' : 'd-block'}`}>FINALIZAR</span>
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
