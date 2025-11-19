export const testData = {

  autodiagnostico: {
    //CP_AUTO_002: Consulta de cliente por ID DEAL
    defaultIdDeal: '28007172679', // Consulta usuario por id deal
  },

  //**PENDIENTE POR AJUSTAR**//
  contenidoClasesNegocio: {
  // Diligenciar modal {Crear cls_model}
  // Fabricante : '',
  // Nombre: '',
  // Cantidad de slots: '',
  // Tipo: '',
  // Descripción: '',
  // Icono: '',
  // Localidad '',
  },

  //**PENDIENTE POR AJUSTAR**//
  exploradorEntidades: {
  // Dilgenciar modal {Agregar elemento a entidad elemento secundario}
  // SERIALCELSIA: '',
  // FACTORYSERIAL: '',
  // Categoria: 'ONT',
  },

  GestionCambioNapPuerto: {
    
    puertoSeleccion: "first",   // "first" | "last" | "random" | número (índice)
    defaultNapSerialCelsia: '3240754',
    defaultIdDeal: '28007172679',
    defaultComentario: "test cambio puerto Nap"
  },
  
  gestionClientesServiciosDomiciliarios: {
    
    defaultIdDeal: '28006757991', // Filtra y selecciona el cliente por id Deal
  },

  visorInformacionTecnicaRed: {
    
    defaultNapSerialCelsia: '3240754', // Filtra por Nap serial celsia
    defaultSerialONT: '48575443CBAD2DA5', // Filtra y selecciona el cliente por serial ont
  },

  gestorOrdenes: {
    //CP_GESORD_002 – Primer Filtro de búsqueda por ID ORDEN
    defaultIdOrden: '572899', // Filtra y selecciona el cliente por id Orden 

    //caso de prueba CP_GESORD_007 Ejecutar orden venta e instalación (cliente simulado)
    defaultPotenciaNAP: "17", //dilencia la potencia nap en validación física
    defaultSerialONT: '485754432CEDB4A6', // digita el serial ont a aprovisionar
    defaultVelocidadSubida: '800', // digita la velocidad de internet subida 
    defaultVelocidadBajada: '800' // digita la velocidad de internet subida
  },
  
  
  
};
