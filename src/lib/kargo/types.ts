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