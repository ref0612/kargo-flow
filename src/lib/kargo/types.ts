export type OTEstado =
  | "creada"
  | "asignada"
  | "recolectada"
  | "wh1"
  | "en-transito"
  | "finalizada"
  | "incidencia";

export interface OT {
  id: string;
  merchant: string;
  origen: string;
  destino: string;
  bultos: number;
  estado: OTEstado;
  creada: string;
  driver1: string | null;
  driver2: string | null;
  bus: string | null;
  progreso: number;
  operador?: string | null;
  manifiestoGenerado?: boolean;
  bultosEscaneadosD1?: number;
  bultosEscaneadosLoader?: number;
  firmaPOD?: string | null;
}

export interface LogEntry {
  time: string;
  msg: string;
  otId?: string;
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
  tipo: "D1" | "D2";
  zona: string;
  telefono: string;
  licencia: string;
  estado: "disponible" | "ocupado" | "inactivo";
}

export interface Bus {
  id: string;
  patente: string;
  modelo: string;
  capacidad: number;
  zona: string;
  estado: "disponible" | "en-ruta" | "mantenimiento";
}

export type IncidenciaTipo = "retraso" | "daño" | "rechazo" | "extravio" | "otro";
export type IncidenciaSeveridad = "baja" | "media" | "alta" | "critica";

export interface Incidencia {
  id: string;
  otId: string;
  tipo: IncidenciaTipo;
  severidad: IncidenciaSeveridad;
  descripcion: string;
  reportadoPor: string;
  fecha: string;
  estado: "abierta" | "en-revision" | "resuelta";
}

export type DevolucionEstado = "solicitada" | "aprobada" | "en-tránsito" | "recibida" | "rechazada";

export interface Devolucion {
  id: string;
  otId: string;
  motivo: string;
  bultos: number;
  fecha: string;
  estado: DevolucionEstado;
}

export type DocumentoTipo = "POD" | "Manifiesto" | "Factura" | "Guía";

export interface Documento {
  id: string;
  otId: string;
  tipo: DocumentoTipo;
  nombre: string;
  fecha: string;
  url?: string;
}

export const ESTADO_LABEL: Record<OTEstado, string> = {
  creada: "Creada",
  asignada: "Asignada",
  recolectada: "En recolección",
  wh1: "En WH1",
  "en-transito": "En tránsito",
  finalizada: "Entregada",
  incidencia: "Con incidencia",
};

export const ESTADO_ORDER: OTEstado[] = [
  "creada",
  "asignada",
  "recolectada",
  "wh1",
  "en-transito",
  "finalizada",
];
