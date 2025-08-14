"use client"
import Link from "next/link";
import React, { useEffect, useState } from "react";
import "./Report.css"
import ModalFilter from "@/components/modal/ModalFilter";
import { deletedInvoiceByIdRequest, downloadPdfRequest, paginateInvoiceRequest } from "@/api/invoice";
import { PaginateInvoiceParams } from "@/interface/invoice-interface";
import ReactPaginate from 'react-paginate';
import { formatDateTime, toUtcEndOfDay, toUtcStartOfDay } from "@/utils/dateUtils";
import type { PopconfirmProps } from 'antd';
import { Popconfirm } from 'antd';
import { toast } from "react-toastify";
import { getFilenameFromDisposition, saveBlob } from "@/utils/file";

export default function Reporte() {

    const [showModal, setShowModal] = useState<boolean>(false)
    const [loadingPaginateInvoice, setLoadingPaginateInvoice] = useState<boolean>(false)
    const [page, setPage] = useState<number>(1)
    const [perPage, setPerPage] = useState<number>(7)
    const [query, setQuery] = useState<string>("")
    const [debouncedQuery, setDebouncedQuery] = useState<string>("");
    const [sort, setSort] = useState<string>("DESC")
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");
    const [dataInvoice, setDataInvoice] = useState([])
    const [pages, setPages] = useState<number>(1)


    const cancel: PopconfirmProps['onCancel'] = (e) => {
    };

    const openModalFilter = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setShowModal(true);
    };

    const onCloseModalFilter = () => {
        setShowModal(false)
    }

    const handleQuery = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
    };

    const handleDelete = async (item: any) => {
        try {
            const res = await deletedInvoiceByIdRequest(item._id);
            if (res.status === 200) {
                toast.success(`Comprobante ${item.number} eliminado.`);
                await fetchPaginateInvoices();
            } else {
                toast.error("No se pudo eliminar el comprobante.")
            }
        } catch (err: any) {
            toast.error(err?.response?.data?.message ?? "Error al eliminar el comprobante.");
        } finally {
        }
    };

    const handleDownloadPdf = async (item: any) => {
        try {
            const res = await downloadPdfRequest(item?._id);
            const disposition = res.headers["content-disposition"] as string | undefined;
            const fname = getFilenameFromDisposition(disposition) || `Proforma-${item.number}.pdf`;
            saveBlob(res.data, fname);
            toast.success(`PDF descargado: ${fname}`);
        } catch (err: any) {
            toast.error(err?.response?.data?.message ?? "No se pudo descargar el PDF.");
        } finally {
        }
    }

    const fetchPaginateInvoices = async () => {
        setLoadingPaginateInvoice(true)
        try {
            const payload: PaginateInvoiceParams = {
                page,
                perPage,
                query: debouncedQuery,
                sort,
                startDate,
                endDate
            };
            const response = await paginateInvoiceRequest(payload)
            if (response && response.status === 200) {
                setDataInvoice(response?.data.data)
                setPages(response?.data.pages)
            }
        }
        catch (error) {
            console.error("> Error:", error);
        }
        finally {
            setLoadingPaginateInvoice(false)
        }
    }

    const handlePageClick = (event: { selected: number }) => {
        setPage(event.selected + 1)
    };


    const handleFilter = (filters: { startDate?: string; endDate?: string }) => {
        const s = filters.startDate ?? "";
        const e = filters.endDate ?? "";
        if (s && e) {
            setStartDate(toUtcStartOfDay(s));   // "YYYY-MM-DDT00:00:00.000Z"
            setEndDate(toUtcEndOfDay(e));       // "YYYY-MM-DDT23:59:59.999Z"
        } else {
            setStartDate("");
            setEndDate("");
        }
        setPage(1);
        setShowModal(false);
    }

    const handleClear = () => {
        setStartDate("");
        setEndDate("");
        setPage(1)
    };

    const skeletonRows = Array.from({ length: perPage }, (_, index) => index)

    // --- debounce: 400ms, aplica si >4; limpia si vacío ---
    useEffect(() => {
        const txt = query.trim();
        const t = setTimeout(() => {
            if (txt.length === 0) {
                setDebouncedQuery("");
                setPage(1);
            } else if (txt.length > 4) {
                setDebouncedQuery(txt);
                setPage(1);
            }
        }, 400);
        return () => clearTimeout(t);
    }, [query]);

    useEffect(() => {
        fetchPaginateInvoices()
    }, [page, perPage, debouncedQuery, sort, startDate, endDate])

    return (
        <>
            <div className="card-report-header mb-0 px-sm-2 px-md-2 py-0 py-sm-0 py-md-1 py-lg-1">
                <div className="row mb-0 mb-md-3">
                    <div className="col-md-6 col-lg-5 d-flex align-items-center justify-content-center gap-1">
                        <Link href="/home" className="btn btn-home">
                            <i className="bi bi-house-fill icon-home"></i>
                        </Link>
                        <button className="btn btn-danger btn-export">
                            EXPORTAR EN EXCEL
                        </button>
                        <button className="btn btn-danger btn-filter" onClick={openModalFilter}>
                            FILTRAR
                        </button>
                    </div>
                    <div className="col-md-6 col-lg-7">
                        <input
                            type="search"
                            className="form-control input-form"
                            name="textSearch"
                            placeholder="BUSCAR POR: Nro BOLETA-CLIENTE-TELEFONO"
                            value={query}
                            onChange={handleQuery}
                        />
                    </div>
                </div>
            </div>

            <div className="card-report mb-2">
                <div className="table-responsive">
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th>NÚMERO</th>
                                <th>CLIENTE</th>
                                <th>FECHA</th>
                                <th>TELEFONO</th>
                                <th>DIRECCION</th>
                                <th>PRECIO VENTA</th>
                                <th>ACCIÓN</th>
                            </tr>
                        </thead>
                        <tbody className="t-body">
                            {loadingPaginateInvoice ? (
                                skeletonRows.map((_, index) => (
                                    <tr key={`skeleton-${index}`}>
                                        <td><div className="skeleton skeleton-text" /></td>
                                        <td><div className="skeleton skeleton-text" /></td>
                                        <td><div className="d-block skeleton skeleton-text" /></td>
                                        <td><div className="skeleton skeleton-text" /></td>
                                        <td><div className="skeleton skeleton-text" /></td>
                                        <td className="text-center"><div className="skeleton skeleton-text" /></td>
                                        <td className="text-center">
                                            <div className="content-action d-flex justify-content-center align-items-center">
                                                <div className="btn btn-sm btn-pdf skeleton skeleton-btn" />
                                                <div className="btn btn-sm btn-deleted skeleton skeleton-btn" />
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : dataInvoice.length === 0 ? (
                                <tr>
                                    <td colSpan={7}>
                                        <div className="text-center py-4 text-muted">
                                            <i className="bi bi-inbox me-2"></i>
                                            No existen facturas para los filtros/búsqueda aplicados.
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                dataInvoice.map((item: any, index: number) => (
                                    <tr key={index}>
                                        <td>{item.number}</td>
                                        <td>{item.client}</td>
                                        <td>
                                            <span className="d-block txt-date">{formatDateTime(item.createdDate).date}</span>
                                            <span className="d-block txt-time">{formatDateTime(item.createdDate).time}</span>
                                        </td>
                                        <td>{item.phone}</td>
                                        <td>{item.address}</td>
                                        <td className="text-center">S/ {Number(item.saleprice ?? 0).toFixed(2)}</td>
                                        <td className="text-center">
                                            <div className="content-action d-flex justify-content-center align-items-center">
                                                <button className="btn btn-sm btn-pdf" type="button" onClick={() => handleDownloadPdf(item)}>
                                                    <i className="bi bi-file-earmark-pdf-fill icon-pdf"></i>
                                                </button>
                                                <Popconfirm
                                                    title="Eliminar Comprobante"
                                                    description={`¿Está seguro de eliminar el comprobante Nro: ${item.number}?`}
                                                    onConfirm={() => handleDelete(item)}
                                                    onCancel={cancel}
                                                    okText="Yes"
                                                    cancelText="No"
                                                >
                                                    <button className="btn btn-sm btn-deleted" type="button">
                                                        <i className="bi bi-trash-fill icon-deleted"></i>
                                                    </button>
                                                </Popconfirm>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                <ReactPaginate
                    breakLabel="..."
                    nextLabel=">"
                    onPageChange={handlePageClick}
                    pageRangeDisplayed={0}
                    marginPagesDisplayed={1}
                    pageCount={pages}
                    previousLabel="<"
                    containerClassName="pagination"
                    pageClassName="page-item"
                    pageLinkClassName="page-link"
                    previousClassName="page-item"
                    nextClassName="page-item"
                    previousLinkClassName="previousLink"
                    nextLinkClassName="nextLink"
                    activeClassName="active"
                />
            </div>
            {
                showModal && <ModalFilter
                    onClose={onCloseModalFilter}
                    onFilter={handleFilter}
                    onClear={handleClear}
                />
            }
        </>

    );
}
