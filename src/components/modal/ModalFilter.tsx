"use client";
import { useMemo, useState } from "react";
import "./ModalFilter.css";
import { toast } from "react-toastify";

interface ModalFilterProps {
    onClose: () => void;
    onFilter: (filters: { startDate?: string; endDate?: string }) => void;
    onClear: () => void;
}

export default function ModalFilter({ onClose, onFilter, onClear }: ModalFilterProps) {
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");

    const isValidRange = useMemo(() => {
        if (!startDate || !endDate) return false;
        return new Date(startDate) <= new Date(endDate);
    }, [startDate, endDate]);

    const handleApplyFilter = () => {
        if (!startDate || !endDate) {
            toast.info("Debe seleccionar ambas fechas.")
            return;
        }
        if (!isValidRange) {
            toast.info("La fecha de inicio no puede ser mayor que la fecha fin.")
            return;
        }
        onFilter({ startDate, endDate });
    };

    const handleClearFilter = () => {
        setStartDate("");
        setEndDate("");
        onClear();
        onClose();
    };
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
                        <button
                            type="button"
                            className="btn btn-secondary me-auto"
                            onClick={handleClearFilter}
                            title="Quitar fechas y mostrar todos"
                        >
                            LIMPIAR
                        </button>
                        <button type="button" className="btn btn-danger" onClick={onClose}>
                            CERRAR
                        </button>
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={handleApplyFilter}
                            disabled={!isValidRange}
                        >
                            FILTRAR
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
