import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { useKargo } from "@/lib/kargo/store";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { MapPin, Navigation, Package, PenTool, CheckCircle2, Building2 } from "lucide-react";
import { toast } from "sonner";
import type { OT } from "@/lib/kargo/types";

export const Route = createFileRoute("/_kargo/driver1")({
  head: () => ({ meta: [{ title: "App Driver 1 · KARGO" }] }),
  component: Driver1App,
});

function Driver1App() {
  const ots = useKargo((s) => s.ots);
  const firmarRecoleccion = useKargo((s) => s.firmarRecoleccion);
  const entregarEnWH1 = useKargo((s) => s.entregarEnWH1);
  const addLog = useKargo((s) => s.addLog);

  const miDriverId = "D-001"; 

  // Filtros memoizados: Se actualizan automáticamente cuando 'ots' cambia en el store
  const porRecoger = useMemo(() => 
    ots.filter((o) => o.driver1 === miDriverId && o.estado === "asignada"),
    [ots]
  );
  
  const haciaWH1 = useMemo(() => 
    ots.filter((o) => o.driver1 === miDriverId && o.estado === "recolectada"),
    [ots]
  );

  const [activeTab, setActiveTab] = useState<"recoger" | "entregar">("recoger");
  const [otActiva, setOtActiva] = useState<OT | null>(null);
  const [pasos, setPasos] = useState<Record<string, "idle" | "en-camino" | "llegada">>({});
  const [modalFirma, setModalFirma] = useState(false);

  const handleIrAOrigen = (ot: OT) => {
    setOtActiva(ot);
    setPasos(prev => ({ ...prev, [ot.id]: "en-camino" }));
    addLog(`Driver en camino a origen para OT ${ot.id}`, ot.id);
    toast.info("Navegación iniciada");
  };

  const handleLlegada = (otId: string) => {
    setPasos(prev => ({ ...prev, [otId]: "llegada" }));
    addLog(`Driver llegó al origen de la OT ${otId}`, otId);
    toast.success("Llegada registrada");
  };

  const handleCompletarRecoleccion = () => {
    if (otActiva) {
      firmarRecoleccion(otActiva.id);
      toast.success("Recolección exitosa");
      setModalFirma(false);
      setOtActiva(null);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-slate-50 min-h-screen border-x shadow-sm flex flex-col font-sans">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-4 shadow-md">
        <h1 className="text-lg font-semibold flex items-center gap-2">
          <Package className="w-5 h-5" /> Konnect App
        </h1>
        <p className="text-primary-foreground/80 text-xs">Conductor: Juan Martínez (D-001)</p>
      </div>

      {/* Tabs */}
      <div className="flex bg-white border-b">
        <button className={`flex-1 py-3 text-sm font-semibold border-b-2 ${activeTab === "recoger" ? "border-primary text-primary" : "border-transparent text-slate-500"}`} onClick={() => setActiveTab("recoger")}>
          Por Recoger ({porRecoger.length})
        </button>
        <button className={`flex-1 py-3 text-sm font-semibold border-b-2 ${activeTab === "entregar" ? "border-primary text-primary" : "border-transparent text-slate-500"}`} onClick={() => setActiveTab("entregar")}>
          Hacia Bodega ({haciaWH1.length})
        </button>
      </div>

      {/* Listado */}
      <ScrollArea className="flex-1 p-4">
        {activeTab === "recoger" ? (
          <div className="space-y-4">
            {porRecoger.length === 0 && <p className="text-center text-slate-400 mt-10">No tienes recolecciones pendientes.</p>}
            {porRecoger.map((ot) => (
              <div key={ot.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">{ot.id}</span>
                  <span className="text-xs font-medium text-slate-500">{ot.bultos} Bultos</span>
                </div>
                <h3 className="font-semibold text-slate-800">{ot.merchant}</h3>
                <p className="text-xs text-slate-500">{ot.direccionOrigen}</p>
                
                <div className="pt-2 border-t mt-2">
                  {!pasos[ot.id] || pasos[ot.id] === "idle" ? (
                    <Button className="w-full" onClick={() => handleIrAOrigen(ot)}><Navigation className="mr-2 w-4 h-4"/> Ir a origen</Button>
                  ) : pasos[ot.id] === "en-camino" ? (
                    <Button className="w-full bg-amber-500 hover:bg-amber-600" onClick={() => handleLlegada(ot.id)}><MapPin className="mr-2 w-4 h-4"/> Llegué al origen</Button>
                  ) : (
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700" onClick={() => { setOtActiva(ot); setModalFirma(true); }}><PenTool className="mr-2 w-4 h-4"/> Firmar Recolección</Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {haciaWH1.length === 0 && <p className="text-center text-slate-400 mt-10">No tienes cargas en tránsito.</p>}
            {haciaWH1.map((ot) => (
              <div key={ot.id} className="bg-white p-4 rounded-xl shadow-sm border border-emerald-200">
                <div className="flex items-center gap-2 text-emerald-700 font-bold mb-2">
                  <CheckCircle2 size={16} /> Recolectada
                </div>
                <p className="text-sm text-slate-600 mb-4">Carga de <strong>{ot.merchant}</strong> ({ot.bultos} bultos).</p>
                <Button className="w-full bg-emerald-700" onClick={() => entregarEnWH1(ot.id)}><Building2 className="mr-2"/> Entregar en WH1</Button>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>

      {/* Modal Firma */}
      <Dialog open={modalFirma} onOpenChange={setModalFirma}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Confirmar Recolección</DialogTitle></DialogHeader>
          <div className="py-4 text-sm text-slate-600">
            Confirma la recepción física de los bultos para la orden <strong>{otActiva?.id}</strong>.
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalFirma(false)}>Cancelar</Button>
            <Button onClick={handleCompletarRecoleccion} className="bg-emerald-600">Confirmar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}