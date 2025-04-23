"use client"
import Link from "next/link";
import React, { useEffect, useState } from "react";
import "./Report.css"
import ModalFilter from "@/components/modal/ModalFilter";
import { paginateInvoiceRequest } from "@/api/invoice";
import { PaginateInvoiceParams } from "@/interface/invoice-interface";

export default function Reporte() {

    const [showModal, setShowModal] = useState<boolean>(false)
    const [page, setPage] = useState<number>(1)
    const [perPage, setPerPage] = useState<number>(5)
    const [query, setQuery] = useState<string>("")
    const [sort, setSort] = useState<string>("DESC")

    const dataFound = [
        { number: "001-001", client: "Juan Pérez", date: "2025-04-21", phone: "987654321", address: "Av. Siempre Viva 123", saleprice: "150.00" },
        { number: "001-002", client: "Ana Torres", date: "2025-04-20", phone: "912345678", address: "Jr. Los Pinos 456", saleprice: "200.00" },
        { number: "001-003", client: "Luis Ramírez", date: "2025-04-19", phone: "923456789", address: "Calle Falsa 789", saleprice: "175.50" },
        { number: "001-004", client: "María Castillo", date: "2025-04-18", phone: "934567890", address: "Av. Perú 123", saleprice: "80.00" },
        { number: "001-005", client: "Carlos López", date: "2025-04-17", phone: "945678901", address: "Jr. Amazonas 987", saleprice: "320.00" },
        { number: "001-006", client: "Lucía Sánchez", date: "2025-04-16", phone: "956789012", address: "Psje. Huáscar 321", saleprice: "95.00" },
        { number: "001-007", client: "Pedro Jiménez", date: "2025-04-15", phone: "967890123", address: "Av. Grau 654", saleprice: "180.00" },
        { number: "001-008", client: "Sofía Rojas", date: "2025-04-14", phone: "978901234", address: "Jr. Lima 456", saleprice: "210.00" },
        { number: "001-009", client: "Andrés Flores", date: "2025-04-13", phone: "989012345", address: "Calle Ayacucho 101", saleprice: "50.00" },
        { number: "001-010", client: "Elena Vargas", date: "2025-04-12", phone: "900123456", address: "Av. Tupac Amaru 777", saleprice: "300.00" },
        { number: "001-011", client: "Jorge Reyes", date: "2025-04-11", phone: "911234567", address: "Jr. Manco Cápac 808", saleprice: "275.00" },
        { number: "001-012", client: "Diana Navarro", date: "2025-04-10", phone: "922345678", address: "Av. Bolívar 999", saleprice: "140.00" },
        { number: "001-013", client: "Miguel Paredes", date: "2025-04-09", phone: "933456789", address: "Calle Unión 505", saleprice: "130.00" },
        { number: "001-014", client: "Gabriela Salas", date: "2025-04-08", phone: "944567890", address: "Jr. Amazonas 606", saleprice: "165.00" },
        { number: "001-015", client: "Ricardo Díaz", date: "2025-04-07", phone: "955678901", address: "Av. Brasil 112", saleprice: "220.00" },
        { number: "001-016", client: "Fernanda Meza", date: "2025-04-06", phone: "966789012", address: "Jr. San Martín 232", saleprice: "110.00" },
        { number: "001-017", client: "Alonso Huerta", date: "2025-04-05", phone: "977890123", address: "Calle Independencia 455", saleprice: "90.00" },
        { number: "001-018", client: "Tatiana Rivas", date: "2025-04-04", phone: "988901234", address: "Psje. Tacna 212", saleprice: "160.00" },
        { number: "001-019", client: "Roberto Quispe", date: "2025-04-03", phone: "999012345", address: "Av. San Juan 202", saleprice: "280.00" },
        { number: "001-020", client: "Carmen Vilca", date: "2025-04-02", phone: "910123456", address: "Jr. Pachacútec 345", saleprice: "195.00" },
        { number: "001-021", client: "Felipe Guzmán", date: "2025-04-01", phone: "921234567", address: "Av. Colonial 818", saleprice: "105.00" }
    ];

    const dateStart = "";
    const dateEnd = "";
    const textSearch = "";

    const openModalFilter = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setShowModal(true);
    };

    const fetchPaginateInvoices = async () => {
        try {
            const payload: PaginateInvoiceParams = {
                page,
                perPage,
                query,
                sort
            };
            const response = await paginateInvoiceRequest(payload)
            console.log(response);
        }
        catch (error) {
            console.log("> Error:", error);
        }
    }

    useEffect(() => {
        console.log(" pruebas de render ");
        fetchPaginateInvoices()
    }, [page, perPage, query, sort])


    return (
        <div className="container mt-3">
            <div className="card-report p-3 mb-3">
                <form method="POST" action="/filterOrderByDate">
                    <div className="row mb-3">


                        <div className="col-md-5 d-flex align-items-center justify-content-center gap-1">
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
                        <div className="col-md-7">
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

            <div className="card-report p3 mb-2">
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
                        <tbody className="t-body">
                            {dataFound.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.number}</td>
                                    <td>{item.client}</td>
                                    <td>{item.date}</td>
                                    <td>{item.phone}</td>
                                    <td>{item.address}</td>
                                    <td className="text-center">S/ {item.saleprice}</td>

                                    <td className="text-center">
                                        <div className="content-action">
                                            <button className="btn btn-sm btn-pdf">
                                                <i className="bi bi-file-earmark-pdf-fill icon-pdf"></i>
                                            </button>

                                            <button className="btn  btn-sm btn-deleted">
                                                <i className="bi bi-trash-fill icon-deleted"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot className="table-footer">
                            <tr>
                                <td colSpan={7}>
                                    <nav aria-label="Page navigation example">
                                        <ul className="pagination">
                                            <li className="page-item">
                                                <button className="page-link" aria-label="Previous">
                                                    <span aria-hidden="true">&laquo;</span>
                                                </button>
                                            </li>
                                            <li className="page-item">
                                                <button className="page-link">1</button>
                                            </li>
                                            <li className="page-item">
                                                <button className="page-link">2</button>
                                            </li>
                                            <li className="page-item">
                                                <button className="page-link">3</button>
                                            </li>
                                            <li className="page-item">
                                                <button className="page-link" aria-label="Next">
                                                    <span aria-hidden="true">&raquo;</span>
                                                </button>
                                            </li>
                                        </ul>
                                    </nav>
                                </td>
                            </tr>
                        </tfoot>

                    </table>
                </div>
            </div>
            {showModal && <ModalFilter onClose={() => setShowModal(false)} />}
        </div>
    );
}
