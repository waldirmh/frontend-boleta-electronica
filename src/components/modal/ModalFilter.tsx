import "./ModalFilter.css";

interface ModalFilterProps {
    onClose: () => void;
}

export default function ModalFilter({ onClose }: ModalFilterProps) {
    return (
        <div
            className="modal fade show d-block custom-modal-overlay"
            tabIndex={-1}
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
        >
            <div className="modal-dialog modal-dialog-centered"> {/* centrado vertical */}
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="exampleModalLabel">
                            Filtrar Reporte
                        </h1>
                        <button
                            type="button"
                            className="btn-close"
                            onClick={onClose}
                            aria-label="Close"
                        ></button>
                    </div>

                    <div className="modal-body d-flex gap-2 align-items-center justify-content-between">
                        <div className="">
                            <label className="form-label">Inicio de fecha</label>
                            <input
                                type="date"
                                className="form-control"
                                name="dateStart"
                                required
                            />
                        </div>
                        <div className="">
                            <label className="form-label">Fin de fecha</label>
                            <input
                                type="date"
                                className="form-control"
                                name="dateEnd"
                                required
                            />
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={onClose}
                        >
                            CERRAR
                        </button>
                        <button type="button" className="btn btn-primary">
                            FILTRAR
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
