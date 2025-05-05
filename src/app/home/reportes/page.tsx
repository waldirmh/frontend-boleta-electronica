"use client"
import Link from "next/link";
import React, { useEffect, useState } from "react";
import "./Report.css"
import ModalFilter from "@/components/modal/ModalFilter";
import { paginateInvoiceRequest } from "@/api/invoice";
import { PaginateInvoiceParams } from "@/interface/invoice-interface";
import ReactPaginate from 'react-paginate';
import { formatDateTime } from "@/utils/dateUtils";


export default function Reporte() {

    const [showModal, setShowModal] = useState<boolean>(false)
    const [loadingPaginateInvoice, setLoadingPaginateInvoice] = useState<boolean>(false)
    const [page, setPage] = useState<number>(1)
    const [perPage, setPerPage] = useState<number>(7)
    const [query, setQuery] = useState<string>("")
    const [sort, setSort] = useState<string>("DESC")


    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");


    const [dataInvoice, setDataInvoice] = useState([])
    const [pages, setPages] = useState<number>(1)


    const openModalFilter = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setShowModal(true);
    };


    const onCloseModalFilter = () => {
        setShowModal(false)
    }


    const fetchPaginateInvoices = async () => {
        setLoadingPaginateInvoice(true)
        try {
            const payload: PaginateInvoiceParams = {
                page,
                perPage,
                query,
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
            console.log("> Error:", error);
        }
        finally {
            setLoadingPaginateInvoice(false)
        }
    }

    const handlePageClick = (event: { selected: number }) => {
        setPage(event.selected + 1) // react paginate usa 0-index
    };
    const handleFilter = (filters: { startDate?: string; endDate?: string }) => {
        console.log("Filtros recibidos en el padre:", filters);
        setStartDate(filters.startDate || "")
        setEndDate(filters.endDate || "")
        setPage(1)
        setShowModal(false)
        console.log("start date :", startDate);
        console.log("end date :", endDate);
        fetchPaginateInvoices()

    }

    const skeletonRows = Array.from({ length: perPage }, (_, index) => index)

    useEffect(() => {
        fetchPaginateInvoices()
    }, [page, perPage, query, sort])


    return (
        <>
            <div className="card-report mb-0 px-sm-2 px-md-2 py-0 py-sm-0 py-md-1 py-lg-1">
                <form method="POST" action="/filterOrderByDate">
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
                                placeholder="BUSCAR"
                            />
                        </div>
                    </div>
                </form>
            </div>

            <div className="card-report mb-2">
                <div className="table-responsive">
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th>DOCUMENTO</th>
                                <th>CLIENTE</th>
                                <th>FECHA</th>
                                <th>TELEFONO</th>
                                <th>DIRECCION</th>
                                <th>PRECIO VENTA</th>
                                <th>ACCIÓN</th>
                            </tr>
                        </thead>
                        <tbody className="t-body">{
                            loadingPaginateInvoice ? (
                                skeletonRows.map((_, index) => (
                                    <tr key={`skeleton-${index}`}>
                                        <td><div className="skeleton skeleton-text"></div></td>
                                        <td><div className="skeleton skeleton-text"></div></td>
                                        <td>
                                            <div className="d-block skeleton skeleton-text"></div>
                                        </td>
                                        <td><div className="skeleton skeleton-text"></div></td>
                                        <td><div className="skeleton skeleton-text"></div></td>
                                        <td className="text-center"><div className="skeleton skeleton-text"></div></td>
                                        <td className="text-center">
                                            <div className="content-action d-flex justify-content-center align-items-center">
                                                <div className="btn btn-sm btn-pdf skeleton skeleton-btn"></div>
                                                <div className="btn btn-sm btn-deleted skeleton skeleton-btn"></div>
                                            </div>
                                        </td>
                                    </tr>
                                ))

                            ) : (
                                dataInvoice.map((item: any, index: number) => (
                                    <tr key={index}>
                                        <td>{item.number}</td>
                                        <td>{item.client}</td>
                                        <td>
                                            <span className="d-block txt-date">
                                                {formatDateTime(item.date).date}
                                            </span>
                                            <span className="d-block txt-time">
                                                {formatDateTime(item.date).time}
                                            </span>

                                        </td>
                                        <td>{item.phone}</td>
                                        <td>{item.address}</td>
                                        <td className="text-center">S/ {item.saleprice}</td>

                                        <td className="text-center">
                                            <div className="content-action d-flex justify-content-center align-items-center">
                                                <button className="btn btn-sm btn-pdf">
                                                    <i className="bi bi-file-earmark-pdf-fill icon-pdf"></i>
                                                </button>

                                                <button className="btn  btn-sm btn-deleted">
                                                    <i className="bi bi-trash-fill icon-deleted"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )
                        }
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
                />
            }
        </>

    );
}
