import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useKargo } from "@/lib/kargo/store";
import { DataTable } from "@/components/kargo/DataTable";
import { StateBadge } from "@/components/kargo/StateBadge";
import { ModalCargaMasiva } from "@/components/kargo/ModalCargaMasiva";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Upload, ListOrdered, Plus, ChevronDown, MapPin, User, Package, Send } from "lucide-react";
import { toast } from "sonner";
import type { OT } from "@/lib/kargo/types";

export const Route = createFileRoute("/_kargo/merchant/ordenes")({
  head: () => ({ meta: [{ title: "Órdenes · Merchant · KARGO" }] }),
  component: OrdenesPage,
});

function OrdenesPage() {
  const ots = useKargo((s) => s.ots);
  const createOT = useKargo((s) => s.createOT);
  const [openMasiva, setOpenMasiva] = useState(false);
  const [openIndividual, setOpenIndividual] = useState(false);

  const handleCrearOT = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    // Conectamos el formulario con Zustand
    createOT({
      origen: formData.get("origin-comuna") as string,
      direccionOrigen: formData.get("origin-address") as string,
      destino: formData.get("dest-comuna") as string,
      direccionDestino: formData.get("dest-address") as string,
      responsableEntrega: `${formData.get("sender-name")} ${formData.get("sender-lastname")}`,
      responsableDestino: `${formData.get("receiver-name")} ${formData.get("receiver-lastname")}`,
      bultos: Number(formData.get("bultos") || 1),
      pesoTotal: Number(formData.get("peso") || 10),
    });

    toast.success("Orden de Transporte creada", { description: "La OT individual ha sido generada con éxito." });
    setOpenIndividual(false);
  };

  return (
    <div className="mx-auto max-w-[1440px] space-y-5 p-6">
      <div className="flex items-end justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-primary flex items-center gap-1.5">
            <ListOrdered size={12} /> Merchant
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Todas las órdenes</h1>
          <p className="text-sm text-muted-foreground">Listado completo con búsqueda, filtros y exportación.</p>
        </div>
        
        {/* Menú Desplegable "Crear" */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" className="gap-1.5">
              <Plus size={14} /> Crear <ChevronDown size={14} className="ml-1 opacity-70" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => setOpenIndividual(true)} className="gap-2 cursor-pointer">
              <Plus size={14} className="text-muted-foreground" />
              Nueva Orden
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setOpenMasiva(true)} className="gap-2 cursor-pointer">
              <Upload size={14} className="text-muted-foreground" />
              Carga Masiva
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <DataTable
        rows={ots}
        searchKeys={["id", "destino", "origen", "operador"]}
        searchPlaceholder="Buscar OT, destino, operador…"
        columns={[
          { key: "id", label: "OT", render: (o: OT) => <span className="font-mono text-xs font-semibold text-primary">{o.id}</span> },
          { key: "origen", label: "Origen" },
          { key: "destino", label: "Destino" },
          { key: "operador", label: "Operador (Transportista)", render: (o: OT) => <span className="text-muted-foreground">{o.operador ?? "Buscando asignación..."}</span> },
          { key: "estado", label: "Estado", render: (o: OT) => <StateBadge estado={o.estado} /> },
          { key: "creada", label: "Creada", render: (o: OT) => <span className="text-muted-foreground">{o.creada}</span> },
          { key: "bultos", label: "Bultos", align: "right", render: (o: OT) => <span className="tabular-nums">{o.bultos}</span> },
        ]}
      />

      <ModalCargaMasiva open={openMasiva} onOpenChange={setOpenMasiva} />

      {/* MODAL CREAR ORDEN INDIVIDUAL EXPANDIDO */}
      <Dialog open={openIndividual} onOpenChange={setOpenIndividual}>
        <DialogContent className="w-full max-w-6xl h-[90vh] flex flex-col p-0">
          <DialogHeader className="px-6 py-4 border-b">
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Package className="w-6 h-6 text-primary" />
              Crear Orden de Transporte
            </DialogTitle>
          </DialogHeader>

          <ScrollArea className="flex-1 px-6">
            <form id="crear-ot-form" onSubmit={handleCrearOT} className="py-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* COLUMNA IZQUIERDA: ORIGEN */}
                <div className="space-y-6">
                  <div>
                    <h3 className="flex items-center gap-2 mb-4 text-lg font-semibold text-slate-800">
                      <User className="w-5 h-5 text-blue-600" /> Datos de quien envía
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="sender-name">Nombre</Label>
                        <Input id="sender-name" name="sender-name" placeholder="Ej: Juan" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="sender-lastname">Apellidos</Label>
                        <Input id="sender-lastname" name="sender-lastname" placeholder="Ej: Pérez" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="sender-phone">Teléfono</Label>
                        <Input id="sender-phone" name="sender-phone" type="tel" placeholder="+56 9 1234 5678" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="sender-email">Correo</Label>
                        <Input id="sender-email" name="sender-email" type="email" placeholder="juan@empresa.com" required />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <div className="space-y-4">
                      <h4 className="text-sm font-semibold text-slate-800 flex items-center gap-2 pb-1 border-b border-slate-100">
                        <span className="w-5 h-5 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-bold">1</span>
                        Dirección de origen
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="space-y-1">
                          <label htmlFor="origin-region" className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Región</label>
                          <select
                            id="origin-region"
                            name="origin-region"
                            className="w-full h-10 px-2.5 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:border-blue-500"
                          >
                            <option value="RM">Región Metropolitana</option>
                            <option value="AN">Antofagasta</option>
                            <option value="V">Valparaíso</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label htmlFor="origin-city" className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Ciudad</label>
                          <select
                            id="origin-city"
                            name="origin-city"
                            className="w-full h-10 px-2.5 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:border-blue-500"
                            required
                          >
                            <option value="">Selecciona Ciudad</option>
                            <option value="santiago">Santiago</option>
                            <option value="san_bernardo">San Bernardo</option>
                            <option value="puente_alto">Puente Alto</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label htmlFor="origin-comuna" className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Comuna</label>
                          <select
                            id="origin-comuna"
                            name="origin-comuna"
                            className="w-full h-10 px-2.5 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:border-blue-500"
                            required
                          >
                            <option value="">Selecciona Comuna</option>
                            <option value="Quilicura">Quilicura</option>
                            <option value="Pudahuel">Pudahuel</option>
                            <option value="Maipu">Maipu</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label htmlFor="origin-address" className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Dirección completa</label>
                        <input
                          id="origin-address"
                          name="origin-address"
                          type="text"
                          placeholder="Calle, número, oficina/depto"
                          className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-blue-500"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* COLUMNA DERECHA: DESTINO Y CARGA */}
                <div className="space-y-6">
                  <div>
                    <h3 className="flex items-center gap-2 mb-4 text-lg font-semibold text-slate-800">
                      <User className="w-5 h-5 text-green-600" /> Datos de quien recibe
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="receiver-name">Nombre</Label>
                        <Input id="receiver-name" name="receiver-name" placeholder="Ej: María" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="receiver-lastname">Apellidos</Label>
                        <Input id="receiver-lastname" name="receiver-lastname" placeholder="Ej: González" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="receiver-phone">Teléfono</Label>
                        <Input id="receiver-phone" name="receiver-phone" type="tel" placeholder="+56 9 8765 4321" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="receiver-email">Correo</Label>
                        <Input id="receiver-email" name="receiver-email" type="email" placeholder="maria@cliente.com" required />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <div className="space-y-4">
                      <h4 className="text-sm font-semibold text-slate-800 flex items-center gap-2 pb-1 border-b border-slate-100">
                        <span className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-xs font-bold">2</span>
                        Dirección de destino
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="space-y-1">
                          <label htmlFor="dest-region" className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Región</label>
                          <select
                            id="dest-region"
                            name="dest-region"
                            className="w-full h-10 px-2.5 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:border-blue-500"
                          >
                            <option value="AN">Región de Antofagasta</option>
                            <option value="RM">Región Metropolitana</option>
                            <option value="VIII">Región del Bío Bío</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label htmlFor="dest-city" className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Ciudad</label>
                          <select
                            id="dest-city"
                            name="dest-city"
                            className="w-full h-10 px-2.5 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:border-blue-500"
                            required
                          >
                            <option value="">Selecciona Ciudad</option>
                            <option value="antofagasta">Antofagasta</option>
                            <option value="calama">Calama</option>
                            <option value="taltal">Taltal</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label htmlFor="dest-comuna" className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Comuna</label>
                          <select
                            id="dest-comuna"
                            name="dest-comuna"
                            className="w-full h-10 px-2.5 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:border-blue-500"
                            required
                          >
                            <option value="">Selecciona Comuna</option>
                            <option value="Calama">Calama</option>
                            <option value="Antofagasta">Antofagasta</option>
                            <option value="Concepcion">Concepcion</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label htmlFor="dest-address" className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Dirección completa</label>
                        <input
                          id="dest-address"
                          name="dest-address"
                          type="text"
                          placeholder="Calle, número, oficina/depto"
                          className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-blue-500"
                          required
                        />
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="bultos">N° de Bultos</Label>
                      <Input id="bultos" name="bultos" type="number" min="1" defaultValue="1" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="peso">Peso Total (kg)</Label>
                      <Input id="peso" name="peso" type="number" min="0.1" step="0.1" defaultValue="10.0" />
                    </div>
                  </div>

                </div>
              </div>
            </form>
          </ScrollArea>

          <DialogFooter className="px-6 py-4 border-t bg-muted/20">
            <Button variant="outline" onClick={() => setOpenIndividual(false)}>
              Cancelar
            </Button>
            <Button type="submit" form="crear-ot-form" className="gap-2">
              <Send className="w-4 h-4" />
              Generar Orden
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}