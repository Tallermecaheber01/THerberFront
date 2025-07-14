import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import {
    getRepairsInProcess,
    confirmCashPayment,
} from '../api/admin'; // Ajusta el path según tu proyecto

function AceptarPagoEfectivo() {
    const [pagosPendientes, setPagosPendientes] = useState([]);
    const [selectedPago, setSelectedPago] = useState(null);

    const loadPagos = async () => {
        const result = await getRepairsInProcess();
        console.log('Pagos pendientes:', result);
        if (result.success !== false) {
            const reparacionesParseadas = result.map((pago) => ({
                ...pago,
                servicio: JSON.parse(pago.servicio),
            }));
            setPagosPendientes(reparacionesParseadas);
        }
    };

    useEffect(() => {
        loadPagos();
    }, []);

    const handleVerDetalles = (id) => {
        const pagoSeleccionado = pagosPendientes.find((p) => p.idReparacion === id);
        setSelectedPago(pagoSeleccionado);
    };

    const handleCerrarDetalles = () => {
        setSelectedPago(null);
    };

    const confirmarPago = async (pago) => {
        const result = await Swal.fire({
            title: '¿Confirmar pago recibido?',
            text: `¿Confirmas que se recibió el pago en efectivo de $${pago.totalFinal} para la reparación ID ${pago.idReparacion}?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sí, confirmar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#16a34a',
            cancelButtonColor: '#d33',
        });

        if (!result.isConfirmed) return;

        const res = await confirmCashPayment(pago.idReparacion);
        if (res.success !== false) {
            await Swal.fire({
                title: 'Pago confirmado',
                text: `El pago fue registrado correctamente para el cliente: ${pago.nombreCompletoCliente}.`,
                icon: 'success',
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#3085d6',
            });

            setSelectedPago(null);
            loadPagos();
        }
    };

    return (
        <div className="pt-20">
            <div className="services-section">
                <div className="services-container">
                    <h2 className="services-title">Pagos Pendientes en Efectivo</h2>

                    <div className="services-grid">
                        {pagosPendientes.map((pago) => (
                            <div key={pago.id} className="service-card card-transition">
                                <div className="service-card-content">
                                    <h3 className="service-card-title">Cliente: {pago.nombreCompletoCliente}</h3>
                                    <p className="service-card-text">Reparación ID: {pago.idReparacion}</p>
                                    <p className="service-card-text">Monto: ${pago.totalFinal}</p>
                                    <p className="service-card-text">
                                        Fecha: {new Date(pago.fechaCita).toLocaleDateString()}
                                    </p>
                                    <button className="btn-blue" onClick={() => handleVerDetalles(pago.idReparacion)}>
                                        Ver Detalles
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {selectedPago && (
                        <div className="bg-cardClaro dark:bg-cardObscuro rounded-lg p-6 mt-8">
                            <h3 className="detalle-title">Detalles del Pago</h3>
                            <p className="detalle-descripcion">
                                <strong>Cliente:</strong> {selectedPago.nombreCompletoCliente}
                            </p>
                            <p className="detalle-descripcion">
                                <strong>Servicios:</strong> {selectedPago.servicio.join(', ')}
                            </p>
                            <p className="detalle-descripcion">
                                <strong>Monto:</strong> ${selectedPago.totalFinal}
                            </p>
                            <p className="detalle-descripcion">
                                <strong>Fecha Cita:</strong> {new Date(selectedPago.fechaCita).toLocaleDateString()}
                            </p>
                            <p className="detalle-descripcion">
                                <strong>Hora Cita:</strong> {selectedPago.horaCita}
                            </p>

                            <div className="flex gap-4 mt-4">
                                <button className="btn-aceptar" onClick={() => confirmarPago(selectedPago)}>
                                    Confirmar Pago
                                </button>
                                <button className="btn-cancelar" onClick={handleCerrarDetalles}>
                                    Cerrar Detalles
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AceptarPagoEfectivo;
