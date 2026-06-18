import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  OT,
  OTEstado,
  LogEntry,
  Operador,
  Driver,
  Bus,
  Incidencia,
  IncidenciaTipo,
  IncidenciaSeveridad,
  Devolucion,
  Documento,
} from "./types";

const seedOperadores: Operador[] = [
  { id: "OP-01", nombre: "Op. RM Centro", zona: "Región Metropolitana", contacto: "María Fernández", telefono: "+56 9 1234 5678", flota: 12, drivers: 28, estado: "activo", sla: 96 },
  { id: "OP-02", nombre: "Op. Valparaíso", zona: "V Región", contacto: "Pedro Núñez", telefono: "+56 9 8765 4321", flota: 8, drivers: 18, estado: "activo", sla: 92 },
  { id: "OP-03", nombre: "Op. Bío-Bío", zona: "VIII Región", contacto: "Andrea Salinas", telefono: "+56 9 5555 1212", flota: 10, drivers: 22, estado: "activo", sla: 94 },
  { id: "OP-04", nombre: "Op. Sur Austral", zona: "X-XII Región", contacto: "Cristián Vidal", telefono: "+56 9 4444 8989", flota: 6, drivers: 14, estado: "activo", sla: 89 },
];

const seedDrivers: Driver[] = [
  { id: "D-001", nombre: "Juan Martínez", rut: "12.345.678-9", tipo: "D1", zona: "RM Centro", telefono: "+56 9 1111 2222", licencia: "A4", estado: "disponible" },
  { id: "D-002", nombre: "Carlos González", rut: "13.456.789-0", tipo: "D1", zona: "RM Centro", telefono: "+56 9 1111 3333", licencia: "A4", estado: "ocupado" },
  { id: "D-005", nombre: "Pedro López", rut: "16.789.012-3", tipo: "D2", zona: "Interurbano", telefono: "+56 9 2222 3333", licencia: "A5", estado: "ocupado" },
];

const seedBuses: Bus[] = [
  { id: "B-01", patente: "AB-CD-12", modelo: "Mercedes O500", capacidad: 50, zona: "Norte", estado: "en-ruta" },
];

function nowTs() { return new Date().toLocaleString("es-CL", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }); }
function nowClock() { return new Date().toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit", second: "2-digit" }); }

interface KargoState {
  ots: OT[];
  log: LogEntry[];
  nextId: number;
  operadores: Operador[];
  drivers: Driver[];
  buses: Bus[];
  incidencias: Incidencia[];
  devoluciones: Devolucion[];
  documentos: Documento[];
  
  addLog: (msg: string, otId?: string) => void;
  createOT: (data: Partial<OT> & { origen: string; destino: string; bultos: number; merchant?: string }) => OT;
  cargaMasivaOTs: (rows: Array<Partial<OT> & { origen: string; destino: string; bultos: number; merchant?: string }>) => OT[];
  derivarOperador: (otId: string, operador: string) => void;
  asignarDriver1: (otId: string, driver: string) => void;
  scanBultoD1: (otId: string, n?: number) => void;
  firmarRecoleccion: (otId: string, firmaData?: string) => void;
  entregarEnWH1: (otId: string) => void;
  asignarBus: (otId: string, bus: string, driver2: string) => void;
  scanBultoLoader: (otId: string, n?: number) => void;
  confirmarCarga: (otId: string) => void;
  reportarIncidencia: (otId: string, motivo: string, tipo?: string, severidad?: string, reportadoPor?: string) => void;
  setProgreso: (otId: string, p: number) => void;
  moveEstado: (otId: string, estado: OTEstado) => void;
  updateOTEstado: (id: string, estado: OTEstado) => void;
  firmarPOD: (otId: string, firma: string) => void;
  crearOperador: (op: Omit<Operador, "id">) => Operador;
  crearDriver: (d: Omit<Driver, "id">) => Driver;
  crearBus: (b: Omit<Bus, "id">) => Bus;
  crearDevolucion: (d: Omit<Devolucion, "id" | "fecha">) => Devolucion;
  generarFlujoEjemplo: () => void;
  resetDemo: () => void;
}

const updateOT = (ots: OT[], id: string, patch: Partial<OT>) =>
  ots.map((o) => (o.id === id ? { ...o, ...patch } : o));

export const useKargo = create<KargoState>()(
  persist(
    (set, get) => {
      // Simulación de avance GPS para OTs en tránsito
      if (typeof window !== "undefined") {
        setInterval(() => {
          const ots = get().ots;
          let changed = false;
          const next = ots.map((o) => {
            if (o.estado === "en-transito" && o.progreso < 100) {
              changed = true;
              const p = Math.min(100, Math.round(o.progreso + 5));
              if (p >= 100) {
                get().addLog(`OT ${o.id} llegó a destino (100%)`, o.id);
                return { ...o, progreso: 100, estado: "recibida_wh2" as OTEstado };
              }
              return { ...o, progreso: p };
            }
            return o;
          });
          if (changed) set({ ots: next });
        }, 3500);
      }

      return {
        ots: [],
        log: [{ time: nowClock(), msg: "Sistema KARGO iniciado con LocalStorage" }],
        nextId: 1,
        operadores: seedOperadores,
        drivers: seedDrivers,
        buses: seedBuses,
        incidencias: [],
        devoluciones: [],
        documentos: [],

        addLog: (msg, otId) => set((s) => ({ log: [{ time: nowClock(), msg, otId }, ...s.log].slice(0, 80) })),

        createOT: (data) => {
          const id = `OT-00${String(get().nextId).padStart(3, '0')}`;
          const ot: OT = {
            id,
            merchant: data.merchant ?? "Falabella",
            origen: data.origen,
            direccionOrigen: (data as any).direccionOrigen || "",
            destino: data.destino,
            direccionDestino: (data as any).direccionDestino || "",
            responsableEntrega: (data as any).responsableEntrega || "",
            responsableDestino: (data as any).responsableDestino || "",
            bultos: data.bultos,
            pesoTotal: (data as any).pesoTotal || 10,
            estado: "creada",
            creada: nowTs(),
            driver1: null,
            driver2: null,
            bus: null,
            progreso: 0,
          };
          set((s) => ({ ots: [...s.ots, ot], nextId: s.nextId + 1 }));
          get().addLog(`OT ${id} creada por Merchant`, id);
          return ot;
        },

        cargaMasivaOTs: (rows) => {
          const created: OT[] = [];
          rows.forEach((r) => created.push(get().createOT(r)));
          get().addLog(`Carga masiva: ${created.length} OTs creadas`);
          return created;
        },

        derivarOperador: (otId, operador) => {
          set((s) => ({ ots: updateOT(s.ots, otId, { operador, estado: "asignada" }) }));
          get().addLog(`OT ${otId} derivada a ${operador}`, otId);
        },

        asignarDriver1: (otId, driver) => {
          set((s) => ({ ots: updateOT(s.ots, otId, { driver1: driver, estado: "asignada" }) }));
          get().addLog(`OT ${otId} asignada al Driver ${driver}`, otId);
        },

        scanBultoD1: (otId, n = 5) => {
          const ot = get().ots.find((o) => o.id === otId);
          if (!ot) return;
          // Lógica de escaneo (simulada por ahora)
        },

        firmarRecoleccion: (otId, firmaData = "Firma_Digital_Base64") => {
          set((s) => ({
            ots: updateOT(s.ots, otId, {
              estado: "recolectada",
              firmaPOD: firmaData,
            }),
          }));
          get().addLog(`Recolección completada. OT ${otId} en tránsito a Warehouse 1`, otId);
        },

        entregarEnWH1: (otId) => {
          set((s) => ({ ots: updateOT(s.ots, otId, { estado: "recibida_wh1" }) }));
          get().addLog(`Carga de la OT ${otId} ingresada a Warehouse 1 por Driver 1`, otId);
        },

        asignarBus: (otId, bus, driver2) => {
          const ot = get().ots.find((o) => o.id === otId);
          if (!ot) return;
          const estado: OTEstado = (ot as any).manifiestoGenerado ? "en-transito" : "pendiente_bus";
          set((s) => ({ ots: updateOT(s.ots, otId, { bus, driver2, estado, progreso: estado === "en-transito" ? 5 : 0 }) }));
          get().addLog(`OT ${otId} asignada a bus ${bus} con Driver 2: ${driver2}`, otId);
        },

        scanBultoLoader: (otId, n = 5) => {
           // Lógica de loader
        },

        confirmarCarga: (otId) => {
          const ot = get().ots.find((o) => o.id === otId);
          if (!ot) return;
          const estado: OTEstado = ot.bus && ot.driver2 ? "en-transito" : "pendiente_bus";
          set((s) => ({
            ots: updateOT(s.ots, otId, { estado, progreso: estado === "en-transito" ? 5 : 0 }),
          }));
          get().addLog(`Carga confirmada para ${otId}`, otId);
        },

        reportarIncidencia: (otId, motivo, tipo = "otro", severidad = "media", reportadoPor = "Sistema") => {
           // Lógica de incidencias
        },

        setProgreso: (otId, p) => set((s) => ({ ots: updateOT(s.ots, otId, { progreso: p }) })),

        moveEstado: (otId, estado) => {
          set((s) => ({ ots: updateOT(s.ots, otId, { estado }) }));
          get().addLog(`OT ${otId} → ${estado}`, otId);
        },

        updateOTEstado: (id, estado) => {
          set((s) => ({ ots: updateOT(s.ots, id, { estado }) }));
          get().addLog(`OT ${id} cambió a estado: ${estado}`, id);
        },

        firmarPOD: (otId, firma) => {
          // Lógica de POD
        },

        crearOperador: (op) => { return {} as any; },
        crearDriver: (d) => { return {} as any; },
        crearBus: (b) => { return {} as any; },
        crearDevolucion: (d) => { return {} as any; },
        generarFlujoEjemplo: () => {},

        resetDemo: () => set({ 
          ots: [], 
          nextId: 1, 
          log: [{ time: nowClock(), msg: "Local Storage reseteado" }], 
          operadores: seedOperadores, 
          drivers: seedDrivers, 
          buses: seedBuses, 
          incidencias: [],
          devoluciones: [],
          documentos: []
        }),
      };
    },
    { name: "kargo-storage" }
  )
);

export const selectByEstado = (estado: OTEstado | OTEstado[]) => (s: KargoState) => {
  const arr = Array.isArray(estado) ? estado : [estado];
  return s.ots.filter((o) => arr.includes(o.estado));
};