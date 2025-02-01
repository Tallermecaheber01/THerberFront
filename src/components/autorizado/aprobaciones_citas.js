import React, { useState } from 'react';

function AprobacionesCitas() {
  const [citas, setCitas] = useState([
    { id: 1, referencia: 'CITA001', estado: 'pendiente', razonRechazo: '', modelo: 'Toyota Corolla 2020', serviciosSolicitados: ['Cambio de aceite', 'Revisión de frenos'], cliente: 'Juan Pérez', total: 150 },
    { id: 2, referencia: 'CITA002', estado: 'pendiente', razonRechazo: '', modelo: 'Ford F-150 2021', serviciosSolicitados: ['Cambio de batería', 'Revisión de suspensión'], cliente: 'María Gómez', total: 180 },
    { id: 3, referencia: 'CITA003', estado: 'pendiente', razonRechazo: '', modelo: 'Honda Civic 2022', serviciosSolicitados: ['Reparación de aire acondicionado'], cliente: 'Carlos López', total: 200 },
    { id: 4, referencia: 'CITA004', estado: 'pendiente', razonRechazo: '', modelo: 'Chevrolet Silverado 2020', serviciosSolicitados: ['Revisión de frenos'], cliente: 'Ana Martínez', total: 120 },
    { id: 5, referencia: 'CITA005', estado: 'pendiente', razonRechazo: '', modelo: 'Nissan Altima 2021', serviciosSolicitados: ['Cambio de aceite', 'Revisión de frenos'], cliente: 'Luis Rodríguez', total: 130 },
    { id: 6, referencia: 'CITA006', estado: 'pendiente', razonRechazo: '', modelo: 'BMW X5 2022', serviciosSolicitados: ['Revisión de suspensión'], cliente: 'Sofía García', total: 160 },
    { id: 7, referencia: 'CITA007', estado: 'pendiente', razonRechazo: '', modelo: 'Audi A3 2023', serviciosSolicitados: ['Reparación de aire acondicionado'], cliente: 'David Pérez', total: 210 },
    { id: 8, referencia: 'CITA008', estado: 'pendiente', razonRechazo: '', modelo: 'Volkswagen Golf 2022', serviciosSolicitados: ['Cambio de batería'], cliente: 'Laura Rodríguez', total: 140 },
    { id: 9, referencia: 'CITA009', estado: 'pendiente', razonRechazo: '', modelo: 'Hyundai Tucson 2021', serviciosSolicitados: ['Revisión de frenos'], cliente: 'Pedro Gómez', total: 110 },
    { id: 10, referencia: 'CITA010', estado: 'pendiente', razonRechazo: '', modelo: 'Mazda CX-5 2020', serviciosSolicitados: ['Cambio de aceite'], cliente: 'Marta López', total: 125 },
    { id: 11, referencia: 'CITA011', estado: 'pendiente', razonRechazo: '', modelo: 'Kia Sorento 2022', serviciosSolicitados: ['Reparación de suspensión'], cliente: 'Felipe Martínez', total: 170 },
    { id: 12, referencia: 'CITA012', estado: 'pendiente', razonRechazo: '', modelo: 'Jeep Cherokee 2021', serviciosSolicitados: ['Cambio de batería'], cliente: 'Ricardo Hernández', total: 140 },
    { id: 13, referencia: 'CITA013', estado: 'pendiente', razonRechazo: '', modelo: 'Subaru Outback 2020', serviciosSolicitados: ['Revisión de suspensión'], cliente: 'Isabel Sánchez', total: 160 },
    { id: 14, referencia: 'CITA014', estado: 'pendiente', razonRechazo: '', modelo: 'Chrysler Pacifica 2021', serviciosSolicitados: ['Cambio de aceite', 'Revisión de frenos'], cliente: 'Raúl Martínez', total: 175 },
    { id: 15, referencia: 'CITA015', estado: 'pendiente', razonRechazo: '', modelo: 'Ford Mustang 2022', serviciosSolicitados: ['Reparación de aire acondicionado'], cliente: 'José Álvarez', total: 220 },
  ]);

  const [selectedCita, setSelectedCita] = useState(null);
  const [razonRechazo, setRazonRechazo] = useState('');

  const handleSelectCita = (id) => {
    const cita = citas.find((c) => c.id === id);
    setSelectedCita(cita);
    setRazonRechazo(cita.razonRechazo); // Resetea la razón cuando se selecciona una cita
  };

  const handleApprove = () => {
    if (selectedCita) {
      setCitas((prevCitas) =>
        prevCitas.map((cita) =>
          cita.id === selectedCita.id
            ? { ...cita, estado: 'aprobada', razonRechazo: '' }
            : cita
        )
      );
      alert(`Cita ${selectedCita.referencia} aprobada.`);
      setSelectedCita(null);
    }
  };

  const handleReject = () => {
    if (selectedCita && razonRechazo.trim() !== '') {
      setCitas((prevCitas) =>
        prevCitas.map((cita) =>
          cita.id === selectedCita.id
            ? { ...cita, estado: 'rechazada', razonRechazo }
            : cita
        )
      );
      alert(`Cita ${selectedCita.referencia} rechazada por la razón: ${razonRechazo}`);
      setSelectedCita(null);
      setRazonRechazo('');
    } else {
      alert('Por favor, ingrese una razón para rechazar la cita.');
    }
  };

  return (
    <div className="form-container">
      <h1 className="form-title">Aprobación/Rechazo de Citas</h1>

      {/* Lista de citas pendientes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {citas
          .filter((cita) => cita.estado === 'pendiente')
          .map((cita) => (
            <div
              key={cita.id}
              className={`reparacion-card cursor-pointer ${selectedCita && selectedCita.id === cita.id ? '' : ''}`}
              onClick={() => handleSelectCita(cita.id)}
            >
              <h2 className="cita-title">{cita.referencia}</h2>
              <p className="cita-subtitle">Modelo: {cita.modelo}</p>
              <p className="cita-subtitle">Cliente: {cita.cliente}</p>
              <p className="cita-subtitle">Servicios solicitados: {cita.serviciosSolicitados.join(', ')}</p>

              {/* Detalles de la cita seleccionada (dentro del card) */}
              {selectedCita && selectedCita.id === cita.id && (
                <div className="detalle-descripcion mt-4">
                  <div className="form-group">
                    <p><strong>Referencia:</strong> {cita.referencia}</p>
                    <p><strong>Modelo:</strong> {cita.modelo}</p>
                    <p><strong>Cliente:</strong> {cita.cliente}</p>
                    <p><strong>Servicios solicitados:</strong> {cita.serviciosSolicitados.join(', ')}</p>
                    <p><strong>Total:</strong> ${cita.total}</p>
                  </div>

                  {/* Razón de rechazo */}
                  <div className="form-group">
                    <label htmlFor="razon" className="form-label">Razón de rechazo (si aplica)</label>
                    <textarea
                      id="razon"
                      className="form-input"
                      value={razonRechazo}
                      onChange={(e) => setRazonRechazo(e.target.value)}
                      placeholder="Escribe la razón del rechazo"
                      rows="4"
                    />
                  </div>

                  {/* Botones de acción */}
                  <div className="flex gap-4 mt-4">
                    <button type="button" className="btn-aceptar" onClick={handleApprove}>
                      Aprobar Cita
                    </button>
                    <button type="button" className="btn-cancelar" onClick={handleReject}>
                      Rechazar Cita
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
}

export default AprobacionesCitas;
