"use client";
import { useEffect, useMemo, useState } from "react";
import "./ModalFilter.css";
import { toast } from "react-toastify";
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

interface ModalFilterProps {
    value: { startDate: string, endDate: string };
    onClose: () => void;
    onFilter: (filters: { startDate?: string; endDate?: string }) => void;
    onReportExcel: (filters: { startDate?: string; endDate?: string }) => void;
    onClear: () => void;
    loading: boolean
}

export default function ModalFilter({ value, onClose, onFilter, onReportExcel, onClear, loading }: ModalFilterProps) {
    const [startDate, setStartDate] = useState<string>(value.startDate ?? "");
    const [endDate, setEndDate] = useState<string>(value.endDate ?? "");

    const isValidRange = useMemo(() => {
        if (!startDate || !endDate) return false;
        return startDate <= endDate;
    }, [startDate, endDate]);

    const guard = (fn: () => void) => {
        if (!startDate || !endDate) return toast.info("Debe seleccionar ambas fechas.");
        if (!isValidRange) return toast.info("La fecha de inicio no puede ser mayor que la fecha fin.");
        fn();
    };

    const handleApplyFilter = () => guard(() => {
        onFilter({ startDate, endDate });
        onClose();
    });

    const handleExportExcel = () => guard(() => {
        onReportExcel({ startDate, endDate });
    });

    const handleClearFilter = () => {
        setStartDate("");
        setEndDate("");
        onClear();
        onClose();
    };


    useEffect(() => {
        setStartDate(value.startDate ?? "")
        setEndDate(value.endDate ?? "")
    }, [value.startDate, value.endDate])

    return (
        <div
            className="modal fade show d-block custom-modal-overlay"
            tabIndex={-1}
            aria-labelledby="modalFilterLabel"
            aria-modal="true"
            role="dialog"
        >
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="modalFilterLabel">
                            Filtrar Reporte
                        </h1>
                        <button
                            type="button"
                            className="btn-close"
                            onClick={onClose}
                            aria-label="Close"
                        />
                    </div>

                    <div className="modal-body d-flex gap-2 align-items-center justify-content-between">
                        <div>
                            <label className="form-label">Inicio de fecha</label>
                            <input
                                type="date"
                                className="form-control"
                                name="dateStart"
                                required
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                max={endDate || undefined}
                            />
                        </div>
                        <div>
                            <label className="form-label">Fin de fecha</label>
                            <input
                                type="date"
                                className="form-control"
                                name="dateEnd"
                                required
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                min={startDate || undefined}
                            />
                        </div>
                    </div>
                    <div className="modal-footer">
                        <div className="w-100 d-flex justify-content-center">
                            <button
                                type="button"
                                className="btn btn-sky-blue"
                                onClick={handleExportExcel}
                                title="Exportar a Excel"
                                disabled={!isValidRange}
                            >
                                {loading ? (
                                    <>
                                        <Spin indicator={<LoadingOutlined className="spin" spin />} />
                                        <span> EXPORTANDO...</span>
                                    </>)
                                    : (
                                        <span>EXPORTAR EXCEL</span>
                                    )}

                            </button>
                        </div>

                    </div>
                    <div className="modal-footer flex-column align-items-center gap-3">
                        <div className="w-100 d-flex justify-content-center gap-2">
                            <button
                                type="button"
                                className="btn btn-red"
                                onClick={handleClearFilter}
                                title="Quitar fechas y mostrar todos"
                            >
                                LIMPIAR
                            </button>

                            <button
                                type="button"
                                className="btn btn-green"
                                onClick={handleApplyFilter}
                                disabled={!isValidRange}
                            >
                                FILTRAR
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
