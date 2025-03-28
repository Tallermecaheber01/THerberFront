const weeklyData = [
  {
    week: "Semana 1",
    fechas: { inicio: "2023-03-03", fin: "2023-03-07" },
    servicios: [
      // Reparación de frenos: 12 registros
      { cliente: "Ana Martínez", servicio: "Reparación de frenos", fechaIngreso: "2023-03-03", fechaSalida: "2023-03-04", Total: 120 },
      { cliente: "Carlos López", servicio: "Reparación de frenos", fechaIngreso: "2023-03-03", fechaSalida: "2023-03-05", Total: 120 },
      { cliente: "María García", servicio: "Reparación de frenos", fechaIngreso: "2023-03-04", fechaSalida: "2023-03-06", Total: 120 },
      { cliente: "Juan Pérez", servicio: "Reparación de frenos", fechaIngreso: "2023-03-03", fechaSalida: "2023-03-07", Total: 120 },
      { cliente: "Lucía Rodríguez", servicio: "Reparación de frenos", fechaIngreso: "2023-03-05", fechaSalida: "2023-03-06", Total: 120 },
      { cliente: "Miguel Sánchez", servicio: "Reparación de frenos", fechaIngreso: "2023-03-04", fechaSalida: "2023-03-05", Total: 120 },
      { cliente: "Sofía Díaz", servicio: "Reparación de frenos", fechaIngreso: "2023-03-03", fechaSalida: "2023-03-04", Total: 120 },
      { cliente: "Jorge Hernández", servicio: "Reparación de frenos", fechaIngreso: "2023-03-05", fechaSalida: "2023-03-07", Total: 120 },
      { cliente: "Elena Fernández", servicio: "Reparación de frenos", fechaIngreso: "2023-03-04", fechaSalida: "2023-03-06", Total: 120 },
      { cliente: "Diego Romero", servicio: "Reparación de frenos", fechaIngreso: "2023-03-03", fechaSalida: "2023-03-05", Total: 120 },
      { cliente: "Carmen Torres", servicio: "Reparación de frenos", fechaIngreso: "2023-03-04", fechaSalida: "2023-03-07", Total: 120 },
      { cliente: "Luis Mendoza", servicio: "Reparación de frenos", fechaIngreso: "2023-03-05", fechaSalida: "2023-03-07", Total: 120 },

      // Cambio de aceite: 10 registros
      { cliente: "Pedro González", servicio: "Cambio de aceite", fechaIngreso: "2023-03-03", fechaSalida: "2023-03-04", Total: 100 },
      { cliente: "Laura Jiménez", servicio: "Cambio de aceite", fechaIngreso: "2023-03-04", fechaSalida: "2023-03-05", Total: 100 },
      { cliente: "Sergio Castillo", servicio: "Cambio de aceite", fechaIngreso: "2023-03-03", fechaSalida: "2023-03-06", Total: 100 },
      { cliente: "Marta Navarro", servicio: "Cambio de aceite", fechaIngreso: "2023-03-05", fechaSalida: "2023-03-07", Total: 100 },
      { cliente: "Andrés Romero", servicio: "Cambio de aceite", fechaIngreso: "2023-03-04", fechaSalida: "2023-03-06", Total: 100 },
      { cliente: "Paula Ruiz", servicio: "Cambio de aceite", fechaIngreso: "2023-03-03", fechaSalida: "2023-03-05", Total: 100 },
      { cliente: "David Ortiz", servicio: "Cambio de aceite", fechaIngreso: "2023-03-04", fechaSalida: "2023-03-07", Total: 100 },
      { cliente: "Raquel Vega", servicio: "Cambio de aceite", fechaIngreso: "2023-03-05", fechaSalida: "2023-03-06", Total: 100 },
      { cliente: "Alberto Molina", servicio: "Cambio de aceite", fechaIngreso: "2023-03-03", fechaSalida: "2023-03-04", Total: 100 },
      { cliente: "Isabel Serrano", servicio: "Cambio de aceite", fechaIngreso: "2023-03-04", fechaSalida: "2023-03-06", Total: 100 },

      // Cambio de neumáticos: 4 registros
      { cliente: "Roberto Cruz", servicio: "Cambio de neumáticos", fechaIngreso: "2023-03-03", fechaSalida: "2023-03-04", Total: 80 },
      { cliente: "Silvia Ramos", servicio: "Cambio de neumáticos", fechaIngreso: "2023-03-04", fechaSalida: "2023-03-05", Total: 80 },
      { cliente: "Fernando Delgado", servicio: "Cambio de neumáticos", fechaIngreso: "2023-03-05", fechaSalida: "2023-03-07", Total: 80 },
      { cliente: "Teresa Morales", servicio: "Cambio de neumáticos", fechaIngreso: "2023-03-03", fechaSalida: "2023-03-06", Total: 80 },

      // Revisión de motor: 4 registros
      { cliente: "Iván Aguirre", servicio: "Revisión de motor", fechaIngreso: "2023-03-03", fechaSalida: "2023-03-05", Total: 90 },
      { cliente: "Nuria Flores", servicio: "Revisión de motor", fechaIngreso: "2023-03-04", fechaSalida: "2023-03-06", Total: 90 },
      { cliente: "Oscar Moreno", servicio: "Revisión de motor", fechaIngreso: "2023-03-03", fechaSalida: "2023-03-07", Total: 90 },
      { cliente: "Beatriz León", servicio: "Revisión de motor", fechaIngreso: "2023-03-05", fechaSalida: "2023-03-07", Total: 90 },

      // Diagnóstico general: 10 registros
      { cliente: "Manuel Castro", servicio: "Diagnóstico general", fechaIngreso: "2023-03-03", fechaSalida: "2023-03-04", Total: 110 },
      { cliente: "Adriana Herrera", servicio: "Diagnóstico general", fechaIngreso: "2023-03-03", fechaSalida: "2023-03-05", Total: 110 },
      { cliente: "Javier Ortiz", servicio: "Diagnóstico general", fechaIngreso: "2023-03-04", fechaSalida: "2023-03-06", Total: 110 },
      { cliente: "Claudia Vega", servicio: "Diagnóstico general", fechaIngreso: "2023-03-04", fechaSalida: "2023-03-07", Total: 110 },
      { cliente: "Ricardo Soto", servicio: "Diagnóstico general", fechaIngreso: "2023-03-05", fechaSalida: "2023-03-06", Total: 110 },
      { cliente: "Patricia Ramos", servicio: "Diagnóstico general", fechaIngreso: "2023-03-03", fechaSalida: "2023-03-05", Total: 110 },
      { cliente: "Andrés Moreno", servicio: "Diagnóstico general", fechaIngreso: "2023-03-04", fechaSalida: "2023-03-06", Total: 110 },
      { cliente: "Verónica Gil", servicio: "Diagnóstico general", fechaIngreso: "2023-03-05", fechaSalida: "2023-03-07", Total: 110 },
      { cliente: "Francisco Ruiz", servicio: "Diagnóstico general", fechaIngreso: "2023-03-03", fechaSalida: "2023-03-04", Total: 110 },
      { cliente: "Mariana Paredes", servicio: "Diagnóstico general", fechaIngreso: "2023-03-04", fechaSalida: "2023-03-06", Total: 110 }
    ]
  },
  {
    week: "Semana 2",
    fechas: { inicio: "2023-03-10", fin: "2023-03-14" },
    servicios: [
      // Reparación de frenos: 11 registros
      { cliente: "Sergio Ramírez", servicio: "Reparación de frenos", fechaIngreso: "2023-03-10", fechaSalida: "2023-03-11", Total: 120 },
      { cliente: "Lucía Gómez", servicio: "Reparación de frenos", fechaIngreso: "2023-03-10", fechaSalida: "2023-03-12", Total: 120 },
      { cliente: "Fernando Díaz", servicio: "Reparación de frenos", fechaIngreso: "2023-03-11", fechaSalida: "2023-03-13", Total: 120 },
      { cliente: "Elena Morales", servicio: "Reparación de frenos", fechaIngreso: "2023-03-10", fechaSalida: "2023-03-14", Total: 120 },
      { cliente: "Marcos Ruiz", servicio: "Reparación de frenos", fechaIngreso: "2023-03-11", fechaSalida: "2023-03-13", Total: 120 },
      { cliente: "Cecilia Rojas", servicio: "Reparación de frenos", fechaIngreso: "2023-03-10", fechaSalida: "2023-03-12", Total: 120 },
      { cliente: "Gustavo Ponce", servicio: "Reparación de frenos", fechaIngreso: "2023-03-11", fechaSalida: "2023-03-14", Total: 120 },
      { cliente: "Isabel Salinas", servicio: "Reparación de frenos", fechaIngreso: "2023-03-12", fechaSalida: "2023-03-14", Total: 120 },
      { cliente: "Raúl Navarro", servicio: "Reparación de frenos", fechaIngreso: "2023-03-10", fechaSalida: "2023-03-12", Total: 120 },
      { cliente: "Patricia Molina", servicio: "Reparación de frenos", fechaIngreso: "2023-03-11", fechaSalida: "2023-03-13", Total: 120 },
      { cliente: "Diego Castillo", servicio: "Reparación de frenos", fechaIngreso: "2023-03-12", fechaSalida: "2023-03-14", Total: 120 },

      // Cambio de aceite: 13 registros
      { cliente: "Alejandro Torres", servicio: "Cambio de aceite", fechaIngreso: "2023-03-10", fechaSalida: "2023-03-11", Total: 100 },
      { cliente: "Carolina Herrera", servicio: "Cambio de aceite", fechaIngreso: "2023-03-10", fechaSalida: "2023-03-12", Total: 100 },
      { cliente: "Jorge Castillo", servicio: "Cambio de aceite", fechaIngreso: "2023-03-11", fechaSalida: "2023-03-13", Total: 100 },
      { cliente: "Mónica Sánchez", servicio: "Cambio de aceite", fechaIngreso: "2023-03-10", fechaSalida: "2023-03-14", Total: 100 },
      { cliente: "Roberto Fuentes", servicio: "Cambio de aceite", fechaIngreso: "2023-03-11", fechaSalida: "2023-03-13", Total: 100 },
      { cliente: "Diana Vega", servicio: "Cambio de aceite", fechaIngreso: "2023-03-10", fechaSalida: "2023-03-12", Total: 100 },
      { cliente: "Antonio Bravo", servicio: "Cambio de aceite", fechaIngreso: "2023-03-11", fechaSalida: "2023-03-14", Total: 100 },
      { cliente: "Gabriela Carrillo", servicio: "Cambio de aceite", fechaIngreso: "2023-03-12", fechaSalida: "2023-03-14", Total: 100 },
      { cliente: "Eduardo Ortiz", servicio: "Cambio de aceite", fechaIngreso: "2023-03-10", fechaSalida: "2023-03-11", Total: 100 },
      { cliente: "Rosa Delgado", servicio: "Cambio de aceite", fechaIngreso: "2023-03-11", fechaSalida: "2023-03-12", Total: 100 },
      { cliente: "Esteban Molina", servicio: "Cambio de aceite", fechaIngreso: "2023-03-12", fechaSalida: "2023-03-13", Total: 100 },
      { cliente: "Lorena Quintana", servicio: "Cambio de aceite", fechaIngreso: "2023-03-10", fechaSalida: "2023-03-14", Total: 100 },
      { cliente: "Victor Paredes", servicio: "Cambio de aceite", fechaIngreso: "2023-03-11", fechaSalida: "2023-03-13", Total: 100 },

      // Cambio de neumáticos: 5 registros
      { cliente: "Pablo Reyes", servicio: "Cambio de neumáticos", fechaIngreso: "2023-03-10", fechaSalida: "2023-03-11", Total: 80 },
      { cliente: "Claudia Cruz", servicio: "Cambio de neumáticos", fechaIngreso: "2023-03-11", fechaSalida: "2023-03-12", Total: 80 },
      { cliente: "Mauricio Luna", servicio: "Cambio de neumáticos", fechaIngreso: "2023-03-10", fechaSalida: "2023-03-13", Total: 80 },
      { cliente: "Verónica Solís", servicio: "Cambio de neumáticos", fechaIngreso: "2023-03-12", fechaSalida: "2023-03-14", Total: 80 },
      { cliente: "Juanita Campos", servicio: "Cambio de neumáticos", fechaIngreso: "2023-03-11", fechaSalida: "2023-03-13", Total: 80 },

      // Revisión de motor: 5 registros
      { cliente: "Emilio Rivas", servicio: "Revisión de motor", fechaIngreso: "2023-03-10", fechaSalida: "2023-03-12", Total: 90 },
      { cliente: "Gloria Marín", servicio: "Revisión de motor", fechaIngreso: "2023-03-11", fechaSalida: "2023-03-13", Total: 90 },
      { cliente: "Ricardo Estévez", servicio: "Revisión de motor", fechaIngreso: "2023-03-10", fechaSalida: "2023-03-14", Total: 90 },
      { cliente: "Silvia Peña", servicio: "Revisión de motor", fechaIngreso: "2023-03-12", fechaSalida: "2023-03-14", Total: 90 },
      { cliente: "Arturo Domínguez", servicio: "Revisión de motor", fechaIngreso: "2023-03-11", fechaSalida: "2023-03-13", Total: 90 },

      // Diagnóstico general: 11 registros
      { cliente: "Estela Aguirre", servicio: "Diagnóstico general", fechaIngreso: "2023-03-10", fechaSalida: "2023-03-11", Total: 110 },
      { cliente: "Marco Silva", servicio: "Diagnóstico general", fechaIngreso: "2023-03-10", fechaSalida: "2023-03-12", Total: 110 },
      { cliente: "Rafael Cordero", servicio: "Diagnóstico general", fechaIngreso: "2023-03-11", fechaSalida: "2023-03-13", Total: 110 },
      { cliente: "Irene Figueroa", servicio: "Diagnóstico general", fechaIngreso: "2023-03-10", fechaSalida: "2023-03-14", Total: 110 },
      { cliente: "Francisco Lozano", servicio: "Diagnóstico general", fechaIngreso: "2023-03-11", fechaSalida: "2023-03-13", Total: 110 },
      { cliente: "Claudia Navarro", servicio: "Diagnóstico general", fechaIngreso: "2023-03-10", fechaSalida: "2023-03-12", Total: 110 },
      { cliente: "Adrián Vera", servicio: "Diagnóstico general", fechaIngreso: "2023-03-11", fechaSalida: "2023-03-14", Total: 110 },
      { cliente: "Beatriz Ponce", servicio: "Diagnóstico general", fechaIngreso: "2023-03-12", fechaSalida: "2023-03-14", Total: 110 },
      { cliente: "Héctor Castillo", servicio: "Diagnóstico general", fechaIngreso: "2023-03-10", fechaSalida: "2023-03-12", Total: 110 },
      { cliente: "Marina Gil", servicio: "Diagnóstico general", fechaIngreso: "2023-03-11", fechaSalida: "2023-03-13", Total: 110 },
      { cliente: "Oscar Valdez", servicio: "Diagnóstico general", fechaIngreso: "2023-03-12", fechaSalida: "2023-03-14", Total: 110 }
    ]
  },
  {
    week: "Semana 3",
    fechas: { inicio: "2023-03-17", fin: "2023-03-21" },
    servicios: [
      // Reparación de frenos: 13 registros
      { cliente: "Ana Beltrán", servicio: "Reparación de frenos", fechaIngreso: "2023-03-17", fechaSalida: "2023-03-18", Total: 120 },
      { cliente: "Carlos Méndez", servicio: "Reparación de frenos", fechaIngreso: "2023-03-17", fechaSalida: "2023-03-19", Total: 120 },
      { cliente: "María Soler", servicio: "Reparación de frenos", fechaIngreso: "2023-03-18", fechaSalida: "2023-03-20", Total: 120 },
      { cliente: "Juan Vega", servicio: "Reparación de frenos", fechaIngreso: "2023-03-17", fechaSalida: "2023-03-21", Total: 120 },
      { cliente: "Lucía Ortiz", servicio: "Reparación de frenos", fechaIngreso: "2023-03-18", fechaSalida: "2023-03-20", Total: 120 },
      { cliente: "Miguel Herrera", servicio: "Reparación de frenos", fechaIngreso: "2023-03-17", fechaSalida: "2023-03-19", Total: 120 },
      { cliente: "Sofía Pacheco", servicio: "Reparación de frenos", fechaIngreso: "2023-03-17", fechaSalida: "2023-03-18", Total: 120 },
      { cliente: "Jorge Domínguez", servicio: "Reparación de frenos", fechaIngreso: "2023-03-19", fechaSalida: "2023-03-21", Total: 120 },
      { cliente: "Elena Castro", servicio: "Reparación de frenos", fechaIngreso: "2023-03-18", fechaSalida: "2023-03-20", Total: 120 },
      { cliente: "Diego Aguayo", servicio: "Reparación de frenos", fechaIngreso: "2023-03-17", fechaSalida: "2023-03-19", Total: 120 },
      { cliente: "Carmen Serrano", servicio: "Reparación de frenos", fechaIngreso: "2023-03-18", fechaSalida: "2023-03-21", Total: 120 },
      { cliente: "Luis Figueroa", servicio: "Reparación de frenos", fechaIngreso: "2023-03-19", fechaSalida: "2023-03-21", Total: 120 },
      { cliente: "Claudio Roldán", servicio: "Reparación de frenos", fechaIngreso: "2023-03-17", fechaSalida: "2023-03-20", Total: 120 },

      // Cambio de aceite: 12 registros
      { cliente: "Pedro Ríos", servicio: "Cambio de aceite", fechaIngreso: "2023-03-17", fechaSalida: "2023-03-18", Total: 100 },
      { cliente: "Laura Molina", servicio: "Cambio de aceite", fechaIngreso: "2023-03-17", fechaSalida: "2023-03-19", Total: 100 },
      { cliente: "Sergio Escobar", servicio: "Cambio de aceite", fechaIngreso: "2023-03-18", fechaSalida: "2023-03-20", Total: 100 },
      { cliente: "Marta Parra", servicio: "Cambio de aceite", fechaIngreso: "2023-03-17", fechaSalida: "2023-03-21", Total: 100 },
      { cliente: "Andrés Romero", servicio: "Cambio de aceite", fechaIngreso: "2023-03-18", fechaSalida: "2023-03-20", Total: 100 },
      { cliente: "Paula Rivera", servicio: "Cambio de aceite", fechaIngreso: "2023-03-17", fechaSalida: "2023-03-19", Total: 100 },
      { cliente: "David Lozano", servicio: "Cambio de aceite", fechaIngreso: "2023-03-18", fechaSalida: "2023-03-21", Total: 100 },
      { cliente: "Raquel Mena", servicio: "Cambio de aceite", fechaIngreso: "2023-03-19", fechaSalida: "2023-03-21", Total: 100 },
      { cliente: "Alberto Soto", servicio: "Cambio de aceite", fechaIngreso: "2023-03-17", fechaSalida: "2023-03-18", Total: 100 },
      { cliente: "Isabel Muñoz", servicio: "Cambio de aceite", fechaIngreso: "2023-03-18", fechaSalida: "2023-03-20", Total: 100 },
      { cliente: "Rodolfo Carrasco", servicio: "Cambio de aceite", fechaIngreso: "2023-03-19", fechaSalida: "2023-03-21", Total: 100 },
      { cliente: "Natalia Peña", servicio: "Cambio de aceite", fechaIngreso: "2023-03-17", fechaSalida: "2023-03-21", Total: 100 },

      // Cambio de neumáticos: 5 registros
      { cliente: "Roberto Cordero", servicio: "Cambio de neumáticos", fechaIngreso: "2023-03-17", fechaSalida: "2023-03-18", Total: 80 },
      { cliente: "Silvia Ibáñez", servicio: "Cambio de neumáticos", fechaIngreso: "2023-03-18", fechaSalida: "2023-03-19", Total: 80 },
      { cliente: "Fernando Delgado", servicio: "Cambio de neumáticos", fechaIngreso: "2023-03-17", fechaSalida: "2023-03-20", Total: 80 },
      { cliente: "Teresa Orozco", servicio: "Cambio de neumáticos", fechaIngreso: "2023-03-19", fechaSalida: "2023-03-21", Total: 80 },
      { cliente: "Mauricio Galindo", servicio: "Cambio de neumáticos", fechaIngreso: "2023-03-18", fechaSalida: "2023-03-20", Total: 80 },

      // Revisión de motor: 6 registros
      { cliente: "Iván Bravo", servicio: "Revisión de motor", fechaIngreso: "2023-03-17", fechaSalida: "2023-03-19", Total: 90 },
      { cliente: "Nuria Castillo", servicio: "Revisión de motor", fechaIngreso: "2023-03-18", fechaSalida: "2023-03-20", Total: 90 },
      { cliente: "Oscar Delgado", servicio: "Revisión de motor", fechaIngreso: "2023-03-17", fechaSalida: "2023-03-21", Total: 90 },
      { cliente: "Beatriz Santos", servicio: "Revisión de motor", fechaIngreso: "2023-03-18", fechaSalida: "2023-03-21", Total: 90 },
      { cliente: "Mariano Guzmán", servicio: "Revisión de motor", fechaIngreso: "2023-03-19", fechaSalida: "2023-03-21", Total: 90 },
      { cliente: "Claudia Fuentes", servicio: "Revisión de motor", fechaIngreso: "2023-03-17", fechaSalida: "2023-03-20", Total: 90 },

      // Diagnóstico general: 12 registros
      { cliente: "Manuel Serrano", servicio: "Diagnóstico general", fechaIngreso: "2023-03-17", fechaSalida: "2023-03-18", Total: 110 },
      { cliente: "Adriana Jiménez", servicio: "Diagnóstico general", fechaIngreso: "2023-03-17", fechaSalida: "2023-03-19", Total: 110 },
      { cliente: "Javier Robles", servicio: "Diagnóstico general", fechaIngreso: "2023-03-18", fechaSalida: "2023-03-20", Total: 110 },
      { cliente: "Claudia Vargas", servicio: "Diagnóstico general", fechaIngreso: "2023-03-17", fechaSalida: "2023-03-21", Total: 110 },
      { cliente: "Ricardo Domínguez", servicio: "Diagnóstico general", fechaIngreso: "2023-03-18", fechaSalida: "2023-03-20", Total: 110 },
      { cliente: "Patricia Quintana", servicio: "Diagnóstico general", fechaIngreso: "2023-03-17", fechaSalida: "2023-03-19", Total: 110 },
      { cliente: "Andrés Carmona", servicio: "Diagnóstico general", fechaIngreso: "2023-03-18", fechaSalida: "2023-03-21", Total: 110 },
      { cliente: "Verónica Ríos", servicio: "Diagnóstico general", fechaIngreso: "2023-03-19", fechaSalida: "2023-03-21", Total: 110 },
      { cliente: "Francisco Ponce", servicio: "Diagnóstico general", fechaIngreso: "2023-03-17", fechaSalida: "2023-03-18", Total: 110 },
      { cliente: "Mariana Ortega", servicio: "Diagnóstico general", fechaIngreso: "2023-03-18", fechaSalida: "2023-03-20", Total: 110 },
      { cliente: "Esteban Molina", servicio: "Diagnóstico general", fechaIngreso: "2023-03-19", fechaSalida: "2023-03-21", Total: 110 },
      { cliente: "Catalina León", servicio: "Diagnóstico general", fechaIngreso: "2023-03-17", fechaSalida: "2023-03-21", Total: 110 }
    ]
  },
  {
    week: "Semana 4",
    fechas: { inicio: "2023-03-24", fin: "2023-03-28" },
    servicios: [
      // Reparación de frenos: 10 registros
      { cliente: "Santiago Vargas", servicio: "Reparación de frenos", fechaIngreso: "2023-03-24", fechaSalida: "2023-03-25", Total: 120 },
      { cliente: "Valeria Prieto", servicio: "Reparación de frenos", fechaIngreso: "2023-03-24", fechaSalida: "2023-03-26", Total: 120 },
      { cliente: "Diego Muñoz", servicio: "Reparación de frenos", fechaIngreso: "2023-03-25", fechaSalida: "2023-03-27", Total: 120 },
      { cliente: "Camila Torres", servicio: "Reparación de frenos", fechaIngreso: "2023-03-24", fechaSalida: "2023-03-28", Total: 120 },
      { cliente: "Julio Delgado", servicio: "Reparación de frenos", fechaIngreso: "2023-03-25", fechaSalida: "2023-03-27", Total: 120 },
      { cliente: "Andrea Cortés", servicio: "Reparación de frenos", fechaIngreso: "2023-03-24", fechaSalida: "2023-03-26", Total: 120 },
      { cliente: "Martín Rojas", servicio: "Reparación de frenos", fechaIngreso: "2023-03-25", fechaSalida: "2023-03-28", Total: 120 },
      { cliente: "Elisa García", servicio: "Reparación de frenos", fechaIngreso: "2023-03-26", fechaSalida: "2023-03-28", Total: 120 },
      { cliente: "Esteban Navarro", servicio: "Reparación de frenos", fechaIngreso: "2023-03-24", fechaSalida: "2023-03-26", Total: 120 },
      { cliente: "Clara Fuentes", servicio: "Reparación de frenos", fechaIngreso: "2023-03-25", fechaSalida: "2023-03-27", Total: 120 },

      // Cambio de aceite: 12 registros
      { cliente: "Alejandro Marín", servicio: "Cambio de aceite", fechaIngreso: "2023-03-24", fechaSalida: "2023-03-25", Total: 100 },
      { cliente: "Carolina Bravo", servicio: "Cambio de aceite", fechaIngreso: "2023-03-24", fechaSalida: "2023-03-26", Total: 100 },
      { cliente: "Jorge Carrasco", servicio: "Cambio de aceite", fechaIngreso: "2023-03-25", fechaSalida: "2023-03-27", Total: 100 },
      { cliente: "Mónica Soto", servicio: "Cambio de aceite", fechaIngreso: "2023-03-24", fechaSalida: "2023-03-28", Total: 100 },
      { cliente: "Roberto Navarro", servicio: "Cambio de aceite", fechaIngreso: "2023-03-25", fechaSalida: "2023-03-27", Total: 100 },
      { cliente: "Diana Molina", servicio: "Cambio de aceite", fechaIngreso: "2023-03-24", fechaSalida: "2023-03-26", Total: 100 },
      { cliente: "Antonio Figueroa", servicio: "Cambio de aceite", fechaIngreso: "2023-03-25", fechaSalida: "2023-03-28", Total: 100 },
      { cliente: "Gabriela Ruiz", servicio: "Cambio de aceite", fechaIngreso: "2023-03-26", fechaSalida: "2023-03-28", Total: 100 },
      { cliente: "Eduardo Pérez", servicio: "Cambio de aceite", fechaIngreso: "2023-03-24", fechaSalida: "2023-03-25", Total: 100 },
      { cliente: "Rosa Aguirre", servicio: "Cambio de aceite", fechaIngreso: "2023-03-25", fechaSalida: "2023-03-26", Total: 100 },
      { cliente: "Esteban Quintana", servicio: "Cambio de aceite", fechaIngreso: "2023-03-26", fechaSalida: "2023-03-27", Total: 100 },
      { cliente: "Lorena Vargas", servicio: "Cambio de aceite", fechaIngreso: "2023-03-24", fechaSalida: "2023-03-28", Total: 100 },

      // Cambio de neumáticos: 6 registros
      { cliente: "Pablo Romero", servicio: "Cambio de neumáticos", fechaIngreso: "2023-03-24", fechaSalida: "2023-03-25", Total: 80 },
      { cliente: "Claudia Herrera", servicio: "Cambio de neumáticos", fechaIngreso: "2023-03-25", fechaSalida: "2023-03-26", Total: 80 },
      { cliente: "Mauricio Soto", servicio: "Cambio de neumáticos", fechaIngreso: "2023-03-24", fechaSalida: "2023-03-27", Total: 80 },
      { cliente: "Verónica Gómez", servicio: "Cambio de neumáticos", fechaIngreso: "2023-03-26", fechaSalida: "2023-03-28", Total: 80 },
      { cliente: "Juan Delgado", servicio: "Cambio de neumáticos", fechaIngreso: "2023-03-25", fechaSalida: "2023-03-27", Total: 80 },
      { cliente: "Cecilia López", servicio: "Cambio de neumáticos", fechaIngreso: "2023-03-24", fechaSalida: "2023-03-26", Total: 80 },

      // Revisión de motor: 6 registros
      { cliente: "Emilio Castro", servicio: "Revisión de motor", fechaIngreso: "2023-03-24", fechaSalida: "2023-03-26", Total: 90 },
      { cliente: "Gloria Ramírez", servicio: "Revisión de motor", fechaIngreso: "2023-03-25", fechaSalida: "2023-03-27", Total: 90 },
      { cliente: "Ricardo Méndez", servicio: "Revisión de motor", fechaIngreso: "2023-03-24", fechaSalida: "2023-03-28", Total: 90 },
      { cliente: "Silvia Rojas", servicio: "Revisión de motor", fechaIngreso: "2023-03-26", fechaSalida: "2023-03-28", Total: 90 },
      { cliente: "Arturo Díaz", servicio: "Revisión de motor", fechaIngreso: "2023-03-25", fechaSalida: "2023-03-27", Total: 90 },
      { cliente: "Mariana Vargas", servicio: "Revisión de motor", fechaIngreso: "2023-03-24", fechaSalida: "2023-03-27", Total: 90 },

      // Diagnóstico general: 13 registros
      { cliente: "Estela Domínguez", servicio: "Diagnóstico general", fechaIngreso: "2023-03-24", fechaSalida: "2023-03-25", Total: 110 },
      { cliente: "Marco Silva", servicio: "Diagnóstico general", fechaIngreso: "2023-03-24", fechaSalida: "2023-03-26", Total: 110 },
      { cliente: "Rafael Sánchez", servicio: "Diagnóstico general", fechaIngreso: "2023-03-25", fechaSalida: "2023-03-27", Total: 110 },
      { cliente: "Irene Morales", servicio: "Diagnóstico general", fechaIngreso: "2023-03-24", fechaSalida: "2023-03-28", Total: 110 },
      { cliente: "Francisco Herrera", servicio: "Diagnóstico general", fechaIngreso: "2023-03-25", fechaSalida: "2023-03-27", Total: 110 },
      { cliente: "Claudia Ortega", servicio: "Diagnóstico general", fechaIngreso: "2023-03-24", fechaSalida: "2023-03-26", Total: 110 },
      { cliente: "Adrián Pérez", servicio: "Diagnóstico general", fechaIngreso: "2023-03-25", fechaSalida: "2023-03-28", Total: 110 },
      { cliente: "Beatriz Gómez", servicio: "Diagnóstico general", fechaIngreso: "2023-03-26", fechaSalida: "2023-03-28", Total: 110 },
      { cliente: "Héctor Vargas", servicio: "Diagnóstico general", fechaIngreso: "2023-03-24", fechaSalida: "2023-03-25", Total: 110 },
      { cliente: "Marina López", servicio: "Diagnóstico general", fechaIngreso: "2023-03-25", fechaSalida: "2023-03-27", Total: 110 },
      { cliente: "Oscar Jiménez", servicio: "Diagnóstico general", fechaIngreso: "2023-03-26", fechaSalida: "2023-03-28", Total: 110 },
      { cliente: "Daniela Rincón", servicio: "Diagnóstico general", fechaIngreso: "2023-03-24", fechaSalida: "2023-03-28", Total: 110 },
      { cliente: "Natalia Ponce", servicio: "Diagnóstico general", fechaIngreso: "2023-03-25", fechaSalida: "2023-03-27", Total: 110 }
    ]
  }
];
