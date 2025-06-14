import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge"; // Removed duplicate import
import { PlusCircle, MinusCircle, Trash2, CalendarIcon, PackageSearch, DollarSign, ListOrdered, Search, } from "lucide-react";
import { format } from "date-fns";

// Drug interface
interface Drug {
  id: string;
  name: string;
  category: string;
  inStock: number;
  costPerUnit: number;
  expiryDate: Date;
  lastUpdated: Date;
  supplier?: string;
}

// Initial mock data
const initialInventory: Drug[] = [
  { id: '1', name: 'Amoxicillin 250mg', category: 'Antibiotic', inStock: 150, costPerUnit: 0.5, expiryDate: new Date('2027-12-31'), lastUpdated: new Date(), supplier: 'PharmaCo' },
  { id: '2', name: 'Paracetamol 500mg', category: 'Analgesic', inStock: 300, costPerUnit: 0.1, expiryDate: new Date('2026-06-30'), lastUpdated: new Date(), supplier: 'MediSupply' },
  { id: '3', name: 'Lisinopril 10mg', category: 'Antihypertensive', inStock: 75, costPerUnit: 0.8, expiryDate: new Date('2028-03-31'), lastUpdated: new Date(), supplier: 'HealthInc' },
  { id: '4', name: 'Salbutamol Inhaler', category: 'Bronchodilator', inStock: 50, costPerUnit: 5.0, expiryDate: new Date('2027-11-30'), lastUpdated: new Date(), supplier: 'PharmaCo' },
];

import { useState, useMemo } from 'react';
const newDrugInitialState: Omit<Drug, 'id' | 'lastUpdated'> = {
  name: '',
  category: '',
  inStock: 0,
  costPerUnit: 0,
  expiryDate: new Date(),
  supplier: '',
};


export default function HomePage() {
  const [inventory, setInventory] = useState<Drug[]>(initialInventory);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDrugDialogOpen, setIsAddDrugDialogOpen] = useState(false);
  const [newDrug, setNewDrug] = useState<Omit<Drug, 'id' | 'lastUpdated'>>(newDrugInitialState);
  const [stockAction, setStockAction] = useState<{ drug: Drug | null; type: 'add' | 'take'; quantity: number; isOpen: boolean }>({
    drug: null,
    type: 'add',
    quantity: 0,
    isOpen: false,
  });

  const filteredInventory = useMemo(() => {
    return inventory.filter(drug =>
      drug.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      drug.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [inventory, searchTerm]);

  const totalStockValue = useMemo(() => {
    return inventory.reduce((sum, drug) => sum + (drug.inStock * drug.costPerUnit), 0);
  }, [inventory]);

  const handleAddNewDrug = () => {
    if (!newDrug.name || newDrug.inStock < 0 || newDrug.costPerUnit < 0) {
      alert("Please fill in all required fields correctly.");
      return;
    }
    const drugToAdd: Drug = {
      ...newDrug,
      id: String(Date.now()), // Simple ID generation
      lastUpdated: new Date(),
    };
    setInventory(prev => [...prev, drugToAdd]);
    setNewDrug(newDrugInitialState);
    setIsAddDrugDialogOpen(false);
  };

  const handleStockAction = () => {
    if (!stockAction.drug || stockAction.quantity <= 0) {
      alert("Invalid quantity or drug.");
      return;
    }
    setInventory(prev => prev.map(drug => {
      if (drug.id === stockAction.drug!.id) {
        let newStock = drug.inStock;
        if (stockAction.type === 'add') {
          newStock += stockAction.quantity;
        } else {
          if (stockAction.quantity > drug.inStock) {
            alert("Cannot take more than available stock.");
            return drug; // Return original drug if action is invalid
          }
          newStock -= stockAction.quantity;
        }
        return { ...drug, inStock: newStock, lastUpdated: new Date() };
      }
      return drug;
    }));
    setStockAction({ drug: null, type: 'add', quantity: 0, isOpen: false });
  };

  const handleDeleteDrug = (drugId: string) => {
    if (window.confirm("Are you sure you want to delete this drug?")) {
      setInventory(prev => prev.filter(drug => drug.id !== drugId));
    }
  };

  // TODO: Implement Edit functionality
  // const handleEditDrug = (drug: Drug) => { setEditingDrug(drug); /* Open edit dialog */ };

  return (
    <div className="min-h-svh bg-gradient-to-br from-indigo-900 via-indigo-700 to-indigo-0 p-4 md:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Pharmacy Inventory Dashboard</h1>
        <p className="text-gray-600">Manage your drug stock efficiently.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Drug Types</CardTitle>
            <ListOrdered className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inventory.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Stock Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">GH₵{totalStockValue.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
            <PackageSearch className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inventory.filter(d => d.inStock < 20).length}</div>
            <p className="text-xs text-muted-foreground">(Items with stock &lt; 20)</p>
          </CardContent>
        </Card>
      </div>

      <div className="mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="relative w-full md:w-1/3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-black-900" />
          <Input
            type="text"
            placeholder="Search drugs by name or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Dialog open={isAddDrugDialogOpen} onOpenChange={setIsAddDrugDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Drug
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Drug</DialogTitle>
              <DialogDescription>Fill in the details for the new drug.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {/* Form fields for new drug */}
              {(Object.keys(newDrugInitialState) as Array<keyof typeof newDrugInitialState>).map((key) => (
                <div className="grid grid-cols-4 items-center gap-4" key={key}>
                  <Label htmlFor={key} className="text-right capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </Label>
                  {key === 'expiryDate' ? (
                     <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={`w-[280px] justify-start text-left font-normal col-span-3 ${!newDrug[key] && "text-muted-foreground"}`}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {newDrug[key] ? format(newDrug[key] as Date, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={newDrug[key] as Date}
                          onSelect={(date) => setNewDrug(prev => ({ ...prev, [key]: date || new Date() }))}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  ) : (
                    <Input
                      id={key}
                      type={key === 'inStock' || key === 'costPerUnit' ? 'number' : 'text'}
                      value={String(newDrug[key] || '')}
                      onChange={(e) => setNewDrug(prev => ({ ...prev, [key]: key === 'inStock' || key === 'costPerUnit' ? parseFloat(e.target.value) : e.target.value }))}
                      className="col-span-3"
                      min={key === 'inStock' || key === 'costPerUnit' ? 0 : undefined}
                    />
                  )}
                </div>
              ))}
            </div>
            <DialogFooter>
              <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
              <Button type="submit" onClick={handleAddNewDrug}>Add Drug</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stock Action Dialog */}
      <Dialog open={stockAction.isOpen} onOpenChange={(isOpen) => setStockAction(prev => ({ ...prev, isOpen }))}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{stockAction.type === 'add' ? 'Add Stock to' : 'Take Stock from'} {stockAction.drug?.name}</DialogTitle>
            <DialogDescription>Current stock: {stockAction.drug?.inStock}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              value={stockAction.quantity}
              onChange={(e) => setStockAction(prev => ({ ...prev, quantity: parseInt(e.target.value) || 0 }))}
              min="1"
            />
          </div>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
            <Button onClick={handleStockAction}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableCaption>A list of drugs in your inventory. Last updated: {format(new Date(), "PPP p")}</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">In Stock</TableHead>
                <TableHead className="text-right">Cost/Unit</TableHead>
                <TableHead className="text-right">Total Value</TableHead>
                <TableHead>Expiry Date</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInventory.length > 0 ? filteredInventory.map((drug) => (
                <TableRow key={drug.id}>
                  <TableCell className="font-medium">{drug.name}</TableCell>
                  <TableCell>{drug.category}</TableCell>
                  <TableCell className="text-right">
                    {drug.inStock}
                    {drug.inStock < 20 && <Badge variant="destructive" className="ml-2">Low</Badge>}
                  </TableCell>
                  <TableCell className="text-right">GH₵{drug.costPerUnit.toFixed(2)}</TableCell>
                  <TableCell className="text-right">GH₵{(drug.inStock * drug.costPerUnit).toFixed(2)}</TableCell>
                  <TableCell>{format(drug.expiryDate, "PPP")}</TableCell>
                  <TableCell>{format(drug.lastUpdated, "PP p")}</TableCell>
                  <TableCell className="text-center space-x-1">
                    <Button variant="ghost" size="icon" title="Add Stock" onClick={() => setStockAction({ drug, type: 'add', quantity: 0, isOpen: true })}>
                      <PlusCircle className="h-4 w-4 text-green-600" />
                    </Button>
                    <Button variant="ghost" size="icon" title="Take Stock" onClick={() => setStockAction({ drug, type: 'take', quantity: 0, isOpen: true })}>
                      <MinusCircle className="h-4 w-4 text-yellow-600" />
                    </Button>
                    {/* <Button variant="ghost" size="icon" title="Edit Drug" onClick={() => handleEditDrug(drug)}>
                      <Edit className="h-4 w-4 text-blue-600" />
                    </Button> */}
                    <Button variant="ghost" size="icon" title="Delete Drug" onClick={() => handleDeleteDrug(drug.id)}>
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center h-24">No drugs found or inventory is empty.</TableCell>
                </TableRow>
              )}
            </TableBody>
            {filteredInventory.length > 0 && (
               <TableFooter>
                <TableRow>
                  <TableCell colSpan={4}>Total Stock Value</TableCell>
                  <TableCell className="text-right font-bold">GH₵{totalStockValue.toFixed(2)}</TableCell>
                  <TableCell colSpan={3}></TableCell>
                </TableRow>
              </TableFooter>
            )}
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}