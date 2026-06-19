export type OTEstado =
  | "creada"             // 100: CREADA_POR_ASIGNAR
  | "asignada"           // 200: ASIGNADA
  | "reasignada"         // 150: REASIGNADA
  | "recolectada"        // 300: RECOLECTADA
  | "recibida_wh1"       // 400: RECIBIDA_WAREHOUSE_1
  | "pendiente_bus"      // 450: PENDIENTE_ASIGNACION_BUS
  | "en-transito"        // 500: EN TRANSITO
  | "recibida_wh2"       // 600: RECIBIDA WAREHOUSE_2
  | "disponible_retiro"  // 700A: DISPONIBLE_PARA_RETIRO
  | "en_distribucion"    // 700B: EN DISTRIBUCION_LOCAL
  | "finalizada"         // 800: FINALIZADA
  | "cancelada"          // 900: CANCELADA
  | "suspendida"         // 950: SUSPENDIDA
  | "incidencia";

// 1. Maquina de Estados Estricta (evita perder OTs por estados no mapeados)
export type OTState =
  | "100_CREADA_POR_ASIGNAR"
  | "200_ASIGNADA"
  | "150_REASIGNADA"
  | "300_RECOLECTADA"
  | "400_RECIBIDA_WAREHOUSE_1"
  | "450_PENDIENTE_ASIGNACION_BUS"
  | "500_EN_TRANSITO"
  | "600_RECIBIDA_WAREHOUSE_2"
  | "700A_DISPONIBLE_PARA_RETIRO"
  | "700B_EN_DISTRIBUCION_LOCAL"
  | "800_FINALIZADA"
  | "900_CANCELADA"
  | "950_SUSPENDIDA";

// 2. Opciones de modalidad de entrega
export type ModalidadEntrega = "A_RETIRO_EN_BODEGA" | "B_ENTREGA_CLIENTE_FINAL";

export interface OrderOfTransport {
  id: string;
  trackingNumber: string;
  state: OTState;
  originZone: string;
  destinationZone: string;
  assignedDriverId?: string;
  modalidad: ModalidadEntrega;
  subOts?: string[];
  incidencias?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Operator {
  id: string;
  name: string;
  role: "DRIVER_1" | "DRIVER_2" | "DRIVER_3" | "LOADER_1" | "LOADER_2";
  ciudadesOperacion: string[];
  active: boolean;
}

export const LEGACY_TO_OT_STATE: Record<Exclude<OTEstado, "incidencia">, OTState> = {
  creada: "100_CREADA_POR_ASIGNAR",
  asignada: "200_ASIGNADA",
  reasignada: "150_REASIGNADA",
  recolectada: "300_RECOLECTADA",
  recibida_wh1: "400_RECIBIDA_WAREHOUSE_1",
  pendiente_bus: "450_PENDIENTE_ASIGNACION_BUS",
  "en-transito": "500_EN_TRANSITO",
  recibida_wh2: "600_RECIBIDA_WAREHOUSE_2",
  disponible_retiro: "700A_DISPONIBLE_PARA_RETIRO",
  en_distribucion: "700B_EN_DISTRIBUCION_LOCAL",
  finalizada: "800_FINALIZADA",
  cancelada: "900_CANCELADA",
  suspendida: "950_SUSPENDIDA",
};

export const OT_STATE_TO_LEGACY: Record<OTState, Exclude<OTEstado, "incidencia">> = {
  "100_CREADA_POR_ASIGNAR": "creada",
  "200_ASIGNADA": "asignada",
  "150_REASIGNADA": "reasignada",
  "300_RECOLECTADA": "recolectada",
  "400_RECIBIDA_WAREHOUSE_1": "recibida_wh1",
  "450_PENDIENTE_ASIGNACION_BUS": "pendiente_bus",
  "500_EN_TRANSITO": "en-transito",
  "600_RECIBIDA_WAREHOUSE_2": "recibida_wh2",
  "700A_DISPONIBLE_PARA_RETIRO": "disponible_retiro",
  "700B_EN_DISTRIBUCION_LOCAL": "en_distribucion",
  "800_FINALIZADA": "finalizada",
  "900_CANCELADA": "cancelada",
  "950_SUSPENDIDA": "suspendida",
};

// Normaliza estados entrantes (legacy o estrictos) al formato legacy usado por el store actual.
export const normalizeOTEstado = (state: string): OTEstado => {
  if (state === "incidencia") return "incidencia";

  const compact = state.trim().replace(/\s+/g, "_").toUpperCase();
  const direct = OT_STATE_TO_LEGACY[compact as OTState];
  if (direct) return direct;

  // Acepta codigos con espacio ("200 ASIGNADA") o guion y los convierte a clave estricta.
  const strictCandidate = compact.replace(/-/g, "_") as OTState;
  const fromStrictCandidate = OT_STATE_TO_LEGACY[strictCandidate];
  if (fromStrictCandidate) return fromStrictCandidate;

  const legacy = state.trim().toLowerCase() as OTEstado;
  return legacy;
};

export interface OT {
  id: string;
  merchant: string;
  origen: string;
  direccionOrigen?: string;
  destino: string;
  direccionDestino?: string;
  responsableEntrega?: string;
  responsableDestino?: string;
  bultos: number;
  pesoTotal?: number;
  estado: OTEstado;
  creada: string;
  driver1: string | null;
  driver2: string | null;
  bus: string | null;
  progreso: number;
  operador?: string;
  bultosEscaneadosD1?: number;
  bultosEscaneadosLoader?: number;
  manifiestoGenerado?: boolean;
  firmaPOD?: string;
}

export interface Operador {
  id: string;
  nombre: string;
  zona: string;
  rol?: "DRIVER_1" | "DRIVER_2" | "DRIVER_3" | "LOADER_1" | "LOADER_2";
  ciudadesOperacion?: string[];
  contacto: string;
  telefono: string;
  flota: number;
  drivers: number;
  estado: "activo" | "inactivo";
  sla: number;
}

export interface Driver {
  id: string;
  nombre: string;
  rut: string;
  tipo: "D1" | "D2" | "D3";
  zona: string;
  telefono: string;
  licencia: string;
  // Agregamos "ocupado" para arreglar el error 2322
  estado: "disponible" | "en-ruta" | "descanso" | "ocupado"; 
}

export interface Bus {
  id: string;
  patente: string;
  modelo: string;
  capacidad: number;
  zona: string;
  estado: "disponible" | "en-ruta" | "taller" | "mantenimiento";
}

// Nuevos tipos agregados para la lógica avanzada del Store
export type IncidenciaTipo = "retraso" | "daño" | "extravio" | "otro" | string;
export type IncidenciaSeveridad = "baja" | "media" | "alta" | "critica" | string;

export interface Incidencia {
  id: string;
  otId: string;
  tipo: IncidenciaTipo;
  severidad: IncidenciaSeveridad;
  descripcion: string;
  reportadoPor: string;
  fecha: string;
  estado: "abierta" | "resuelta" | "en-revision";
}

export interface Devolucion {
  id: string;
  otId: string;
  motivo: string;
  bultos: number;
  fecha: string;
  estado: "solicitada" | "en-proceso" | "completada" | string;
}

export interface Documento {
  id: string;
  otId: string;
  tipo: string;
  nombre: string;
  fecha: string;
}

export interface LogEntry {
  time: string;
  msg: string;
  otId?: string;
}

export const ESTADO_LABEL: Record<OTEstado, string> = {
  creada: "Por Asignar",
  asignada: "Asignada",
  reasignada: "Reasignada",
  recolectada: "Recolectada",
  recibida_wh1: "En Bodega (WH1)",
  pendiente_bus: "Esperando Bus",
  "en-transito": "En Tránsito",
  recibida_wh2: "En Destino (WH2)",
  disponible_retiro: "Disp. Retiro",
  en_distribucion: "En Ruta Final",
  finalizada: "Finalizada",
  cancelada: "Cancelada",
  suspendida: "Suspendida",
  incidencia: "Incidencia",
};