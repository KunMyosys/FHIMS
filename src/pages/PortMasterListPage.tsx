import { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Input } from '../ui/input';
import { Plus, Search, Eye, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';

interface Port {
  id: string;
  venueId: string;
  venueName: string;
  portName: string;
  portNameArabic: string;
  portShortName: string;
  arrivalAdultCharges: number;
  departureAdultCharges: number;
  isActive: boolean;
  blockIndefinitely: boolean;
}

const mockPorts: Port[] = [
  {
    id: '1',
    venueId: '1',
    venueName: 'Iraq',
    portName: 'Baghdad Airport',
    portNameArabic: 'مطار بغداد الدولي',
    portShortName: 'B',
    arrivalAdultCharges: 35,
    departureAdultCharges: 35,
    isActive: true,
    blockIndefinitely: false
  },
  {
    id: '2',
    venueId: '1',
    venueName: 'Iraq',
    portName: 'Najaf Airport',
    portNameArabic: 'مطار النجف الدولي',
    portShortName: 'N',
    arrivalAdultCharges: 40,
    departureAdultCharges: 40,
    isActive: true,
    blockIndefinitely: false
  },
  {
    id: '3',
    venueId: '2',
    venueName: 'Iran',
    portName: 'Tehran Airport',
    portNameArabic: 'مطار طهران الدولي',
    portShortName: 'T',
    arrivalAdultCharges: 45,
    departureAdultCharges: 45,
    isActive: true,
    blockIndefinitely: false
  }
];

interface PortMasterListPageProps {
  onNavigateToForm: (mode: 'add' | 'edit' | 'view', portId?: string) => void;
}

export const PortMasterListPage = ({ onNavigateToForm }: PortMasterListPageProps) => {
  const [ports, setPorts] = useState<Port[]>(mockPorts);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [portToDelete, setPortToDelete] = useState<string | null>(null);

  const filteredPorts = ports.filter(port =>
    port.portName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    port.portNameArabic.includes(searchTerm) ||
    port.venueName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    port.portShortName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: string) => {
    setPortToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (portToDelete) {
      setPorts(prev => prev.filter(p => p.id !== portToDelete));
      toast.success('Port deleted successfully');
      setDeleteDialogOpen(false);
      setPortToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="bg-gradient-to-r from-[#5B9BD5] to-blue-600 bg-clip-text text-transparent">Port Master</h1>
          <p className="text-sm text-gray-600 mt-1">Manage port information and charges</p>
        </div>
        <Button 
          onClick={() => onNavigateToForm('add')}
          className="bg-[#5B9BD5] hover:bg-[#4A8BC2] text-white w-full sm:w-auto"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Port
        </Button>
      </div>

      {/* Search and Filter */}
      <Card className="bg-white border-[#5B9BD5]/30 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-sky-50 to-blue-50">
          <CardTitle style={{ color: '#5B9BD5' }}>Search Ports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#5B9BD5' }} />
              <Input
                placeholder="Search by port name, venue, or short name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-[#5B9BD5]/30"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ports List */}
      <Card className="bg-white border-[#5B9BD5]/30 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-sky-50 to-blue-50">
          <CardTitle style={{ color: '#5B9BD5' }}>All Ports ({filteredPorts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Desktop Table View */}
          <div className="hidden lg:block border border-[#5B9BD5]/30 rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-[#5B9BD5]/10">
                  <TableHead style={{ color: '#5B9BD5' }}>Venue</TableHead>
                  <TableHead style={{ color: '#5B9BD5' }}>Port Name</TableHead>
                  <TableHead style={{ color: '#5B9BD5' }}>Port Name (Arabic)</TableHead>
                  <TableHead style={{ color: '#5B9BD5' }}>Short Name</TableHead>
                  <TableHead style={{ color: '#5B9BD5' }}>Arrival Adult</TableHead>
                  <TableHead style={{ color: '#5B9BD5' }}>Departure Adult</TableHead>
                  <TableHead style={{ color: '#5B9BD5' }}>Status</TableHead>
                  <TableHead style={{ color: '#5B9BD5' }} className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPorts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-gray-400">
                      No ports found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPorts.map((port) => (
                    <TableRow key={port.id} className="hover:bg-[#5B9BD5]/5">
                      <TableCell className="text-gray-900">{port.venueName}</TableCell>
                      <TableCell className="text-gray-900">{port.portName}</TableCell>
                      <TableCell className="text-right text-gray-900" dir="rtl">{port.portNameArabic}</TableCell>
                      <TableCell className="text-gray-900">{port.portShortName}</TableCell>
                      <TableCell className="text-gray-900">${port.arrivalAdultCharges}</TableCell>
                      <TableCell className="text-gray-900">${port.departureAdultCharges}</TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <span className={`px-2 py-0.5 rounded-full text-xs inline-block w-fit ${
                            port.isActive 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {port.isActive ? 'Active' : 'Inactive'}
                          </span>
                          {port.blockIndefinitely && (
                            <span className="px-2 py-0.5 rounded-full text-xs inline-block w-fit bg-orange-100 text-orange-800">
                              Blocked
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onNavigateToForm('view', port.id)}
                            className="hover:bg-[#5B9BD5]/10"
                            style={{ color: '#5B9BD5' }}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onNavigateToForm('edit', port.id)}
                            className="hover:bg-[#5B9BD5]/10"
                            style={{ color: '#5B9BD5' }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(port.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-100"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden space-y-4">
            {filteredPorts.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                No ports found
              </div>
            ) : (
              filteredPorts.map((port) => (
                <Card key={port.id} className="border-[#5B9BD5]/30 bg-gradient-to-br from-white to-sky-50/30">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{port.portName}</h3>
                          <p className="text-sm text-gray-600 mt-0.5" dir="rtl">{port.portNameArabic}</p>
                        </div>
                        <div className="flex gap-1">
                          <span className={`px-2 py-0.5 rounded-full text-xs ${
                            port.isActive 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {port.isActive ? 'Active' : 'Inactive'}
                          </span>
                          {port.blockIndefinitely && (
                            <span className="px-2 py-0.5 rounded-full text-xs bg-orange-100 text-orange-800">
                              Blocked
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Details */}
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-gray-600">Venue:</span>
                          <p className="text-gray-900 font-medium">{port.venueName}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Short Name:</span>
                          <p className="text-gray-900 font-medium">{port.portShortName}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Arrival Charges:</span>
                          <p className="text-gray-900 font-medium">${port.arrivalAdultCharges}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Departure Charges:</span>
                          <p className="text-gray-900 font-medium">${port.departureAdultCharges}</p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 pt-2 border-t border-gray-200">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onNavigateToForm('view', port.id)}
                          className="flex-1"
                          style={{ borderColor: '#5B9BD5', color: '#5B9BD5' }}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onNavigateToForm('edit', port.id)}
                          className="flex-1"
                          style={{ borderColor: '#5B9BD5', color: '#5B9BD5' }}
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(port.id)}
                          className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle style={{ color: '#5B9BD5' }}>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the port and all its associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};