import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { getRepairPay, createPaymentOrder, setRepairInProcess } from '../api/client';

function PagarReparacion() {
    const [searchQuery, setSearchQuery] = useState('');
    const [repairsPay, setRepairsPay] = useState([]);

    const fetchData = async () => {
        try {
            const repairsPayResponse = await getRepairPay();
            console.log('Reparaciones por pagar:', repairsPayResponse);
            setRepairsPay(repairsPayResponse);
        } catch (error) {
            console.error('Error al obtener los datos de reparaciones:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handlePagar = async (r) => {
        const orden = {
            id: r.id,
            servicio: r.servicio,
            totalFinal: r.totalFinal,
        };
        try {
            const { init_point } = await createPaymentOrder(orden);
            window.location.href = init_point;
        } catch (error) {
            console.error('Error al iniciar pago:', error);
        }
    };

    const handlePagoEnTaller = async (r) => {
        const result = await Swal.fire({
            title: '¿Confirmar pago en el taller?',
            text: `¿Deseas registrar el pago para la reparación con ID ${r.id} por $${parseFloat(r.totalFinal).toFixed(2)}?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sí, confirmar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#16a34a',
            cancelButtonColor: '#d33',
        });

        if (!result.isConfirmed) return;

        try {
            await setRepairInProcess(r.id);

            await Swal.fire({
                title: '¡Pago registrado!',
                html: `
                <p>El estado de la reparación se actualizó a <strong>"en proceso"</strong>.</p>
               <p style="margin-top: 1rem;">Muestra este número al personal del taller para que marquen tu reparación como pagada:</p>
                <h2 style="font-size: 2rem; margin-top: 0.5rem; color: #16a34a;">ID Reparación #${r.id}</h2>
            `,
                icon: 'success',
                confirmButtonText: 'Entendido',
                confirmButtonColor: '#3085d6',
            });

            setRepairsPay((prev) => prev.filter((rep) => rep.id !== r.id));
        } catch (error) {
            console.error('Error al actualizar el estado de la reparación:', error);
        }
    };


    const filtradas = repairsPay.filter((r) => {
        if (!searchQuery) return true;
        return (
            r.comentario?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            r.servicio?.join(', ').toLowerCase().includes(searchQuery.toLowerCase())
        );
    });

    return (
        <div className="pt-20">
            <div className="citasContainer mt-6">
                <form className="flex flex-col">
                    <h1 className="services-title text-center">Reparaciones Pendientes de Pago</h1>

                    <div className="divFiltros">
                        <input
                            type="text"
                            placeholder="Buscar por comentario o servicio..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="form-input w-64"
                        />
                    </div>

                    <div className="mt-6">
                        {filtradas.length > 0 ? (
                            <div className="cardCitas grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filtradas.map((r) => (
                                    <div
                                        key={r.id}
                                        className="reparacion-card card-transition p-10 rounded-xl shadow-2xl w-full max-w-sm"
                                    >
                                        <div className="mb-4">
                                            <span className="detalle-label">Servicios:</span>{' '}
                                            <span className="detalle-costo block whitespace-normal break-words">
                                                {r.servicio.join(', ')}
                                            </span>
                                        </div>
                                        <div className="mb-4">
                                            <span className="detalle-label">Fecha y Hora Atención:</span>{' '}
                                            <span className="detalle-costo">{new Date(r.fechaHoraAtencion).toLocaleString()}</span>
                                        </div>
                                        <div className="mb-4">
                                            <span className="detalle-label">Comentario:</span>{' '}
                                            <span className="detalle-costo block whitespace-normal break-words">
                                                {r.comentario || 'Sin comentarios'}
                                            </span>
                                        </div>
                                        <div className="mb-4">
                                            <span className="detalle-label">Total a Pagar:</span>{' '}
                                            <span className="detalle-costo">${parseFloat(r.totalFinal).toFixed(2)}</span>
                                        </div>
                                        <div className="text-center mt-4 grid grid-cols-1 gap-2">
                                            <button
                                                onClick={() => handlePagoEnTaller(r)}
                                                className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 w-full"
                                                type="button"
                                            >
                                                Pagar en el Taller
                                            </button>
                                            <button
                                                onClick={() => handlePagar(r)}
                                                className="button-yellow w-full"
                                                type="button"
                                            >
                                                Pagar con Mercado Pago
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="advertencia text-center">
                                No se encontraron reparaciones pendientes.
                            </p>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}

export default PagarReparacion;
