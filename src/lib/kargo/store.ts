import { create } from "zustand";
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

const seed: OT[] = [
  { id: "OT-00123", merchant: "Falabella", origen: "CD Pudahuel", destino: "Temuco", bultos: 25, estado: "en-transito", creada: "15/05 09:15", driver1: "Carlos González", driver2: "Pedro López", bus: "AB-CD-12", progreso: 62, operador: "Op. RM Centro", manifiestoGenerado: true },
  { id: "OT-00124", merchant: "Falabella", origen: "Las Condes", destino: "Concepción", bultos: 18, estado: "recolectada", creada: "15/05 08:45", driver1: "Luis G.", driver2: null, bus: null, progreso: 0, operador: "Op. RM Centro" },
  { id: "OT-00125", merchant: "Ripley", origen: "Vitacura", destino: "Valparaíso", bultos: 22, estado: "creada", creada: "15/05 10:30", driver1: null, driver2: null, bus: null, progreso: 0 },
  { id: "OT-00126", merchant: "Paris", origen: "Providencia", destino: "Arica", bultos: 40, estado: "wh1", creada: "15/05 11:00", driver1: "Juan Martínez", driver2: null, bus: null, progreso: 0, operador: "Op. RM Centro" },
  { id: "OT-00127", merchant: "Sodimac", origen: "Maipú", destino: "Puerto Montt", bultos: 12, estado: "finalizada", creada: "14/05 16:00", driver1: "Carlos González", driver2: "Roberto Vera", bus: "KL-MN-45", progreso: 100, operador: "Op. RM Centro", manifiestoGenerado: true },
  { id: "OT-00128", merchant: "Ripley", origen: "Ñuñoa", destino: "La Serena", bultos: 8, estado: "creada", creada: "15/05 12:10", driver1: null, driver2: null, bus: null, progreso: 0 },
];

const seedOperadores: Operador[] = [
  { id: "OP-01", nombre: "Op. RM Centro", zona: "Región Metropolitana", contacto: "María Fernández", telefono: "+56 9 1234 5678", flota: 12, drivers: 28, estado: "activo", sla: 96 },
  { id: "OP-02", nombre: "Op. Valparaíso", zona: "V Región", contacto: "Pedro Núñez", telefono: "+56 9 8765 4321", flota: 8, drivers: 18, estado: "activo", sla: 92 },
  { id: "OP-03", nombre: "Op. Bío-Bío", zona: "VIII Región", contacto: "Andrea Salinas", telefono: "+56 9 5555 1212", flota: 10, drivers: 22, estado: "activo", sla: 94 },
  { id: "OP-04", nombre: "Op. Sur Austral", zona: "X-XII Región", contacto: "Cristián Vidal", telefono: "+56 9 4444 8989", flota: 6, drivers: 14, estado: "activo", sla: 89 },
];

const seedDrivers: Driver[] = [
  { id: "D-001", nombre: "Juan Martínez", rut: "12.345.678-9", tipo: "D1", zona: "RM Centro", telefono: "+56 9 1111 2222", licencia: "A4", estado: "disponible" },
  { id: "D-002", nombre: "Carlos González", rut: "13.456.789-0", tipo: "D1", zona: "RM Centro", telefono: "+56 9 1111 3333", licencia: "A4", estado: "ocupado" },
  { id: "D-003", nombre: "Luis Gómez", rut: "14.567.890-1", tipo: "D1", zona: "RM Centro", telefono: "+56 9 1111 4444", licencia: "A4", estado: "disponible" },
  { id: "D-004", nombre: "María Rojas", rut: "15.678.901-2", tipo: "D1", zona: "RM Centro", telefono: "+56 9 1111 5555", licencia: "A4", estado: "disponible" },
  { id: "D-005", nombre: "Pedro López", rut: "16.789.012-3", tipo: "D2", zona: "Interurbano", telefono: "+56 9 2222 3333", licencia: "A5", estado: "ocupado" },
  { id: "D-006", nombre: "Roberto Vera", rut: "17.890.123-4", tipo: "D2", zona: "Interurbano", telefono: "+56 9 2222 4444", licencia: "A5", estado: "disponible" },
  { id: "D-007", nombre: "Andrés Soto", rut: "18.901.234-5", tipo: "D2", zona: "Interurbano", telefono: "+56 9 2222 5555", licencia: "A5", estado: "disponible" },
];

const seedBuses: Bus[] = [
  { id: "B-01", patente: "AB-CD-12", modelo: "Mercedes O500", capacidad: 50, zona: "Norte", estado: "en-ruta" },
  { id: "B-02", patente: "EF-GH-23", modelo: "Volvo 9800", capacidad: 45, zona: "Sur", estado: "disponible" },
  { id: "B-03", patente: "IJ-KL-34", modelo: "Scania K410", capacidad: 48, zona: "Centro", estado: "disponible" },
  { id: "B-04", patente: "KL-MN-45", modelo: "Mercedes O500", capacidad: 50, zona: "Sur", estado: "mantenimiento" },
];

const seedIncidencias: Incidencia[] = [
  { id: "INC-001", otId: "OT-00126", tipo: "retraso", severidad: "media", descripcion: "Demora en aduana", reportadoPor: "Driver 2", fecha: "15/05 13:20", estado: "en-revision" },
  { id: "INC-002", otId: "OT-00124", tipo: "daño", severidad: "alta", descripcion: "Bulto dañado en recolección", reportadoPor: "Driver 1", fecha: "15/05 10:05", estado: "abierta" },
];

const seedDevoluciones: Devolucion[] = [
  { id: "DEV-001", otId: "OT-00127", motivo: "Cliente rechazó pedido", bultos: 2, fecha: "14/05 18:00", estado: "solicitada" },
];

const seedDocumentos: Documento[] = [
  { id: "DOC-001", otId: "OT-00127", tipo: "POD", nombre: "POD-OT-00127.pdf", fecha: "14/05 19:30" },
  { id: "DOC-002", otId: "OT-00123", tipo: "Manifiesto", nombre: "MAN-OT-00123.pdf", fecha: "15/05 11:00" },
];

function nowTs() {
  return new Date().toLocaleString("es-CL", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
}
function nowClock() {
  return new Date().toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

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
  // actions
  addLog: (msg: string, otId?: string) => void;
  createOT: (data: Partial<OT> & { origen: string; destino: string; bultos: number; merchant?: string }) => OT;
  cargaMasivaOTs: (rows: Array<{ origen: string; destino: string; bultos: number; merchant?: string }>) => OT[];
  derivarOperador: (otId: string, operador: string) => void;
  asignarDriver1: (otId: string, driver: string) => void;
  scanBultoD1: (otId: string, n?: number) => void;
  firmarRecoleccion: (otId: string) => void;
  asignarBus: (otId: string, bus: string, driver2: string) => void;
  scanBultoLoader: (otId: string, n?: number) => void;
  confirmarCarga: (otId: string) => void;
  reportarIncidencia: (otId: string, motivo: string, tipo?: IncidenciaTipo, severidad?: IncidenciaSeveridad, reportadoPor?: string) => void;
  setProgreso: (otId: string, p: number) => void;
  moveEstado: (otId: string, estado: OTEstado) => void;
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

export const useKargo = create<KargoState>((set, get) => {
  if (typeof window !== "undefined") {
    setInterval(() => {
      const ots = get().ots;
      let changed = false;
      const next = ots.map((o) => {
        if (o.estado === "en-transito" && o.progreso < 100) {
          changed = true;
          const inc = Math.random() * 4 + 1;
          const p = Math.min(100, Math.round(o.progreso + inc));
          if (p >= 100) {
            get().addLog(`OT ${o.id} entregada (100%)`, o.id);
            return { ...o, progreso: 100, estado: "finalizada" as OTEstado };
          }
          return { ...o, progreso: p };
        }
        return o;
      });
      if (changed) set({ ots: next });
    }, 3500);
  }

  return {
    ots: seed,
    log: [{ time: nowClock(), msg: "Sistema KARGO iniciado con datos de ejemplo" }],
    nextId: 129,
    operadores: seedOperadores,
    drivers: seedDrivers,
    buses: seedBuses,
    incidencias: seedIncidencias,
    devoluciones: seedDevoluciones,
    documentos: seedDocumentos,

    addLog: (msg, otId) =>
      set((s) => ({ log: [{ time: nowClock(), msg, otId }, ...s.log].slice(0, 80) })),

    createOT: (data) => {
      const id = `OT-00${get().nextId}`;
      const ot: OT = {
        id,
        merchant: data.merchant ?? "Falabella",
        origen: data.origen,
        destino: data.destino,
        bultos: data.bultos,
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
      set((s) => ({ ots: updateOT(s.ots, otId, { operador }) }));
      get().addLog(`OT ${otId} derivada a ${operador}`, otId);
    },

    asignarDriver1: (otId, driver) => {
      set((s) => ({ ots: updateOT(s.ots, otId, { driver1: driver, estado: "recolectada" }) }));
      get().addLog(`OT ${otId} asignada a Driver 1: ${driver}`, otId);
    },

    scanBultoD1: (otId, n = 5) => {
      const ot = get().ots.find((o) => o.id === otId);
      if (!ot) return;
      const cur = ot.bultosEscaneadosD1 ?? 0;
      const next = Math.min(ot.bultos, cur + n);
      set((s) => ({ ots: updateOT(s.ots, otId, { bultosEscaneadosD1: next }) }));
    },

    firmarRecoleccion: (otId) => {
      set((s) => ({ ots: updateOT(s.ots, otId, { estado: "wh1" }) }));
      get().addLog(`OT ${otId} recolectada → Warehouse 1`, otId);
    },

    asignarBus: (otId, bus, driver2) => {
      const ot = get().ots.find((o) => o.id === otId);
      if (!ot) return;
      const estado: OTEstado = ot.manifiestoGenerado ? "en-transito" : "wh1";
      set((s) => ({ ots: updateOT(s.ots, otId, { bus, driver2, estado, progreso: estado === "en-transito" ? 5 : 0 }) }));
      get().addLog(`OT ${otId} asignada a bus ${bus} con Driver 2: ${driver2}`, otId);
    },

    scanBultoLoader: (otId, n = 5) => {
      const ot = get().ots.find((o) => o.id === otId);
      if (!ot) return;
      const cur = ot.bultosEscaneadosLoader ?? 0;
      const next = Math.min(ot.bultos, cur + n);
      set((s) => ({ ots: updateOT(s.ots, otId, { bultosEscaneadosLoader: next }) }));
    },

    confirmarCarga: (otId) => {
      const ot = get().ots.find((o) => o.id === otId);
      if (!ot) return;
      const estado: OTEstado = ot.bus && ot.driver2 ? "en-transito" : "wh1";
      set((s) => ({
        ots: updateOT(s.ots, otId, {
          manifiestoGenerado: true,
          estado,
          progreso: estado === "en-transito" ? 5 : 0,
        }),
      }));
      get().addLog(
        `Manifiesto generado para ${otId}${estado === "en-transito" ? " → En tránsito" : " (esperando bus)"}`,
        otId
      );
    },

    reportarIncidencia: (otId, motivo, tipo = "otro", severidad = "media", reportadoPor = "Sistema") => {
      const inc: Incidencia = {
        id: `INC-${String(get().incidencias.length + 1).padStart(3, "0")}`,
        otId,
        tipo,
        severidad,
        descripcion: motivo,
        reportadoPor,
        fecha: nowTs(),
        estado: "abierta",
      };
      set((s) => ({
        ots: updateOT(s.ots, otId, { estado: "incidencia" }),
        incidencias: [inc, ...s.incidencias],
      }));
      get().addLog(`Incidencia en ${otId}: ${motivo}`, otId);
    },

    setProgreso: (otId, p) => set((s) => ({ ots: updateOT(s.ots, otId, { progreso: p }) })),

    moveEstado: (otId, estado) => {
      set((s) => ({ ots: updateOT(s.ots, otId, { estado }) }));
      get().addLog(`OT ${otId} → ${estado}`, otId);
    },

    firmarPOD: (otId, firma) => {
      const doc: Documento = {
        id: `DOC-${String(get().documentos.length + 1).padStart(3, "0")}`,
        otId,
        tipo: "POD",
        nombre: `POD-${otId}.pdf`,
        fecha: nowTs(),
      };
      set((s) => ({
        ots: updateOT(s.ots, otId, { firmaPOD: firma, estado: "finalizada", progreso: 100 }),
        documentos: [doc, ...s.documentos],
      }));
      get().addLog(`POD firmado para ${otId}`, otId);
    },

    crearOperador: (op) => {
      const id = `OP-${String(get().operadores.length + 1).padStart(2, "0")}`;
      const nuevo: Operador = { id, ...op };
      set((s) => ({ operadores: [...s.operadores, nuevo] }));
      get().addLog(`Operador ${nuevo.nombre} creado`);
      return nuevo;
    },

    crearDriver: (d) => {
      const id = `D-${String(get().drivers.length + 1).padStart(3, "0")}`;
      const nuevo: Driver = { id, ...d };
      set((s) => ({ drivers: [...s.drivers, nuevo] }));
      get().addLog(`Driver ${nuevo.nombre} (${nuevo.tipo}) creado`);
      return nuevo;
    },

    crearBus: (b) => {
      const id = `B-${String(get().buses.length + 1).padStart(2, "0")}`;
      const nuevo: Bus = { id, ...b };
      set((s) => ({ buses: [...s.buses, nuevo] }));
      get().addLog(`Bus ${nuevo.patente} agregado a la flota`);
      return nuevo;
    },

    crearDevolucion: (d) => {
      const id = `DEV-${String(get().devoluciones.length + 1).padStart(3, "0")}`;
      const nuevo: Devolucion = { id, fecha: nowTs(), ...d };
      set((s) => ({ devoluciones: [nuevo, ...s.devoluciones] }));
      get().addLog(`Devolución solicitada para ${nuevo.otId}`);
      return nuevo;
    },

    generarFlujoEjemplo: () => {
      const ot = get().createOT({ merchant: "Ejemplo S.A.", origen: "Las Condes", destino: "Temuco", bultos: 15 });
      const id = ot.id;
      const steps: Array<[number, () => void]> = [
        [1200, () => get().derivarOperador(id, "Op. RM Centro")],
        [2400, () => get().asignarDriver1(id, "Juan Martínez")],
        [4000, () => {
          const cur = get().ots.find((o) => o.id === id);
          if (cur) set((s) => ({ ots: updateOT(s.ots, id, { bultosEscaneadosD1: cur.bultos }) }));
          get().firmarRecoleccion(id);
        }],
        [5600, () => {
          const cur = get().ots.find((o) => o.id === id);
          if (cur) set((s) => ({ ots: updateOT(s.ots, id, { bultosEscaneadosLoader: cur.bultos }) }));
          get().confirmarCarga(id);
        }],
        [7000, () => get().asignarBus(id, "AB-CD-12", "Pedro López")],
      ];
      steps.forEach(([ms, fn]) => setTimeout(fn, ms));
    },

    resetDemo: () => set({
      ots: seed,
      nextId: 129,
      log: [{ time: nowClock(), msg: "Demo reiniciado" }],
      operadores: seedOperadores,
      drivers: seedDrivers,
      buses: seedBuses,
      incidencias: seedIncidencias,
      devoluciones: seedDevoluciones,
      documentos: seedDocumentos,
    }),
  };
});

export const selectByEstado = (estado: OTEstado | OTEstado[]) => (s: KargoState) => {
  const arr = Array.isArray(estado) ? estado : [estado];
  return s.ots.filter((o) => arr.includes(o.estado));
};
