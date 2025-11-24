// ARCHIVO DE DATOS DE PRUEBA PARA LAS VISTAS AUTOMATIZADAS//

export const testData = {

  autodiagnostico: {
    //CP_AUTO_002: Consulta de cliente por ID DEAL
    defaultIdDeal: '28007421529', // Consulta usuario por id deal
    //CP_AUTO_005: Creación de órdenes
    defaultTipoOrden: "ORDEN - MANTENIMIENTO"
  },

  //**PENDIENTE POR AJUSTAR**//
  contenidoClasesNegocio: {
  //CP_CONTCLANEG_003: Crear un modelo
  //Diligenciar modal {Crear cls_model}
  Fabricante : "1",
  Nombre: '',
  Cantidad_de_slots: '',
  Tipo: '',
  Descripción: '',
  Icono: '',
  Localidad: ''
  },

  //**PENDIENTE POR AJUSTAR**//
  exploradorEntidades: {
  // Dilgenciar modal {Agregar elemento a entidad elemento secundario}
  // SERIALCELSIA: '',
  // FACTORYSERIAL: '',
  // Categoria: 'ONT',
  },

  GestionCambioNapPuerto: {
    
    //CP_GESCAMNAPPUER_002: Seleccionar una nap
    //Seleccione Nap
    defaultNapSerialCelsia: '3240754', // Filtra por serial Nap

    //CP_GESCAMNAPPUER_003: Seleccionar un puerto y realizar el cambio
    //Puertos disponibles
    defaultIdDeal: '28007172679', // Filtra por idDeal
    puertoSeleccion: "first",   // "first" | "last" | "random" | número (índice)
    defaultComentario: "test cambio puerto Nap" // comentario para cambio de puerto
  },
  
  gestionClientesServiciosDomiciliarios: {
    
    //CP_GESCLSERDOM_002: Filtro de búsqueda por ID_DEAL
    //Opcion más filtro
    defaultIdDeal: '28007421529', // Filtra y selecciona el cliente por id Deal
  },

  visorInformacionTecnicaRed: {
    //CP_INFTECRED_002: Filtro de búsqueda
    filtroBusqueda: "CENTRO POBLADO",
    valorBusquedaTexto: "PALMIRA",
    

    //CP_INFTECRED_00X: Segundo filtro de búsqueda (opcional)
    valorBusquedaTextoSegundo: "NAP SERIAL CELSIA",
    defaultNapSerialCelsia: '3271341', // Filtra por Nap serial celsia


    //CP_INFTECRED_003: Ver dispositivos
    defaultSerialONT: '485754435A3CE4A6', // Filtra y selecciona el cliente por serial ont

    //CP_INFTECRED_004: Editar estado
    defaultEstadoTecnico: "ACTIVO"  // Valores posibles: ACTIVO | INACTIVO | SUSPENDIDO
  },

  gestorOrdenes: {
    //CP_GESORD_002 – Primer Filtro de búsqueda por ID ORDEN
    //Opcion más filtro
    defaultIdOrden: '572901', // Filtra y selecciona el cliente por id Orden 

    //caso de prueba CP_GESORD_007 Ejecutar orden venta e instalación (cliente simulado)
    //Modal Ejecutar orden
    defaultPotenciaNAP: "17", //dilencia la potencia nap en validación física
    defaultSerialONT: '485754435A3CE4A6', // digita el serial ont a aprovisionar
    defaultVelocidadSubida: '800', // digita la velocidad de internet subida 
    defaultVelocidadBajada: '800', // digita la velocidad de internet subida
    defaultWifiSSID: "test wifi", // digita el SSID
    defaultWifiPassword: "wifiTest123", // digita la contraseña
    marcarCompartirContrasena: true
  },

  ocupacionPuertos: {
    defaultNapSerialCelsia: "3240754",
    defaultCeo: "1008951"
  }
  
  
  
};
