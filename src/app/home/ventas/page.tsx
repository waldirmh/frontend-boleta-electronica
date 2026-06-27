"use client";
import "./Ventas.css";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Invoice, Item } from "@/interface/invoice-interface";
import { InvoiceService } from '@/services/invoice';
import { createInvoiceRequest, getNextNumberRequest } from "@/api/invoice";
import { toast } from "react-toastify";
import { Spin, Modal } from "antd";
import { LoadingOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
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
    const [touchedHeaderFields, setTouchedHeaderFields] = useState<Record<string, boolean>>({});
    const [touchedItemFields, setTouchedItemFields] = useState<Record<string, boolean>>({});
    const total = invoiceService.calculateTotal(itemList);

    const headerFieldError = (field: string): string => {
        if (field === "validate" && invoiceData.validate.trim() === "") return "Campo obligatorio";
        if (field === "client" && invoiceData.client.trim() === "") return "Campo obligatorio";
        if (field === "createdDate" && invoiceData.createdDate.trim() === "") return "Seleccione una fecha";
        return "";
    };

    const itemFieldError = (field: string): string => {
        if (field === "quantity" && itemInvoice.quantity.trim() === "") return "Campo obligatorio";
        if (field === "price" && itemInvoice.price.trim() === "") return "Campo obligatorio";
        if (field === "description" && itemInvoice.description.trim() === "") return "Campo obligatorio";
        return "";
    };

    const handleHeaderBlur = (field: string) => {
        setTouchedHeaderFields((prev) => ({ ...prev, [field]: true }));
    };

    const handleItemBlur = (field: string) => {
        setTouchedItemFields((prev) => ({ ...prev, [field]: true }));
    };

    const handleCreateInvoice = async (e: React.FormEvent) => {
        e.preventDefault();
        const allTouched = { validate: true, client: true, createdDate: true };
        setTouchedHeaderFields(allTouched);
        if (!invoiceData.validate.trim() || !invoiceData.client.trim() || !invoiceData.createdDate.trim()) {
            toast.error("Complete los datos de la cabecera")
            return
        }
        if (!itemList.length) {
            toast.info("Debe agregar al menos un item")
            return
        }
        setLoadingSpinner(true)
        try {
            let currentDateInvoice = combineDateWithCurrentTime(invoiceData.createdDate)

            const invoice: Invoice = {
                ...invoiceData,
                items: itemList,
                saleprice: total,
                createdDate: currentDateInvoice
            };
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
        const allTouched = { quantity: true, price: true, description: true };
        setTouchedItemFields(allTouched);
        if (!itemInvoice.quantity.trim() || !itemInvoice.price.trim() || !itemInvoice.description.trim()) {
            return
        }
        const newItem = invoiceService.createItem(itemInvoice);
        const updatedItems = [...itemList, newItem];
        const newTotal = invoiceService.calculateTotal(updatedItems)

        setItemList(updatedItems);
        setItemInvoice(invoiceService.getEmptyItem());
        setTouchedItemFields({});
        const updatedInvoice: Invoice = { ...invoiceData, items: updatedItems, saleprice: newTotal };
        invoiceService.saveInvoice(updatedInvoice);
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
        Modal.confirm({
            title: "¿Cancelar factura?",
            icon: <ExclamationCircleOutlined />,
            content: "Se perderán todos los datos ingresados. ¿Desea continuar?",
            okText: "Sí, cancelar",
            cancelText: "No, seguir editando",
            okButtonProps: { danger: true },
            onOk: () => {
                setItemList([]);
                setInvoiceData(invoiceService.getEmptyInvoice());
                invoiceService.deletedInvoice()
                router.push("/home")
            }
        });
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

    const hErr = (f: string) => touchedHeaderFields[f] ? headerFieldError(f) : "";
    const iErr = (f: string) => touchedItemFields[f] ? itemFieldError(f) : "";

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
                            className={`form-control input-form ${hErr("validate") ? "is-invalid" : ""}`}
                            type="text"
                            placeholder="VALIDO POR"
                            value={invoiceData.validate}
                            onChange={(e) => setInvoiceData({ ...invoiceData, validate: e.target.value })}
                            onBlur={() => handleHeaderBlur("validate")}
                        />
                        {hErr("validate") && <div className="text-danger text-start small" role="alert">{hErr("validate")}</div>}
                    </div>
                    <div className="col-md-4">
                        <DatePicker
                            className={`form-control input-form ${hErr("createdDate") ? "is-invalid" : ""}`}
                            onChange={onChange}
                            placeholder="SELECCIONA FECHA"
                        />
                        {hErr("createdDate") && <div className="text-danger text-start small" role="alert">{hErr("createdDate")}</div>}
                    </div>
                    <div className="col-md-8">
                        <input
                            className={`form-control input-form ${hErr("client") ? "is-invalid" : ""}`}
                            type="text"
                            placeholder="SEÑOR(A)"
                            value={invoiceData.client}
                            onChange={(e) => setInvoiceData({ ...invoiceData, client: e.target.value })}
                            onBlur={() => handleHeaderBlur("client")}
                        />
                        {hErr("client") && <div className="text-danger text-start small" role="alert">{hErr("client")}</div>}
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
                            className={`form-control input-form ${iErr("quantity") ? "is-invalid" : ""}`}
                            type="number"
                            placeholder="Cantidad"
                            value={itemInvoice.quantity}
                            onChange={(e) => setItemInvoice({ ...itemInvoice, quantity: e.target.value })}
                            onBlur={() => handleItemBlur("quantity")}
                            required
                        />
                        {iErr("quantity") && <div className="text-danger text-start small" role="alert">{iErr("quantity")}</div>}
                        <input
                            className={`form-control input-form ${iErr("price") ? "is-invalid" : ""}`}
                            type="number"
                            placeholder="Precio"
                            value={itemInvoice.price}
                            onChange={(e) => setItemInvoice({ ...itemInvoice, price: e.target.value })}
                            onBlur={() => handleItemBlur("price")}
                            required
                        />
                        {iErr("price") && <div className="text-danger text-start small" role="alert">{iErr("price")}</div>}
                        <textarea
                            className={`form-control input-form h-25 ${iErr("description") ? "is-invalid" : ""}`}
                            placeholder="Descripción"
                            value={itemInvoice.description}
                            onChange={(e) => setItemInvoice({ ...itemInvoice, description: e.target.value })}
                            onBlur={() => handleItemBlur("description")}
                            required
                        />
                        {iErr("description") && <div className="text-danger text-start small" role="alert">{iErr("description")}</div>}
                        <button className="btn btn-green clock w-100 mt-2" onClick={handleAddItem}>
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
                                    {itemList.length === 0 ? (
                                        <tr>
                                            <td colSpan={5}>
                                                <div className="text-center py-4 text-muted">
                                                    <i className="bi bi-cart me-2"></i>
                                                    No hay items agregados
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        itemList.map((item) => (
                                            <tr key={item.id}>
                                                <td className="text-center">{item.quantity}</td>
                                                <td>{item.description}</td>
                                                <td>S/ {Number(item.price).toFixed(2)}</td>
                                                <td>S/ {Number(item.valuetotal).toFixed(2)}</td>
                                                <td className="text-center">
                                                    <button
                                                        onClick={() => handleDeleteItem(item.id)}
                                                        className="btn btn-second button-small btn-deleted-sales"
                                                        aria-label={`Eliminar item ${item.description}`}
                                                    >
                                                        <i className="bi bi-trash-fill icon-deleted"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
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
                        <button className="btn btn-red mt-3" onClick={cancelInvoice}>
                            CANCELAR
                        </button>
                        <button className="btn btn-green mt-3 d-flex justify-content-center align-items-center"
                            onClick={handleCreateInvoice}
                            disabled={loadingSpinner}
                        >
                            {loadingSpinner ? (
                                <>
                                    <Spin indicator={<LoadingOutlined className="spin" spin />} />
                                    <span> CREANDO...</span>
                                </>)
                                : (
                                    <span> CREAR FACTURA</span>
                                )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
