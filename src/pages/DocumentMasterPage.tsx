import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Badge } from '../ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  FileStack,
  AlertCircle,
  FileText,
  X,
  Check,
  Filter
} from 'lucide-react';
import { toast } from 'sonner';

interface Document {
  id: string;
  name: string;
  code: string;
  modules: string[]; // Changed from module to modules (array)
  moduleLocations: Record<string, string>; // Storage path for each module
  mandatory: boolean;
  acceptedFormats: string[];
  maxSize: number; // in MB
  status: 'active' | 'inactive';
}

// Available modules list
const AVAILABLE_MODULES = [
  { value: 'registration', label: 'Registration' },
  { value: 'visa', label: 'Visa' },
  { value: 'accommodation', label: 'Accommodation' },
  { value: 'transport', label: 'Transport' },
  { value: 'tours', label: 'Tours' },
  { value: 'add_renewal', label: 'Add Renewal' },
  { value: 'tours_document', label: 'Tours (Document)' },
  { value: 'tours_tickets_upload', label: 'Tours (Tickets Upload)' },
  { value: 'registration_approval', label: 'Registration Approval' },
];

export const DocumentMasterPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [editingDocument, setEditingDocument] = useState<Document | null>(null);

  // Filter states
  const [filters, setFilters] = useState({
    name: '',
    code: '',
    module: 'all',
    mandatory: 'all',
    format: 'all',
    status: 'all'
  });

  const [documents, setDocuments] = useState<Document[]>([
    {
      id: '1',
      name: 'Passport Copy',
      code: 'DOC_PASSPORT',
      modules: ['registration', 'visa', 'tours'],
      moduleLocations: {
        registration: 'uploads/registration/passport',
        visa: 'uploads/visa/passport',
        tours: 'uploads/tours/passport'
      },
      mandatory: true,
      acceptedFormats: ['PDF', 'JPG', 'PNG'],
      maxSize: 5,
      status: 'active',
    },
    {
      id: '2',
      name: 'National ID Card',
      code: 'DOC_NID',
      modules: ['registration', 'registration_approval'],
      moduleLocations: {
        registration: 'uploads/registration/nid',
        registration_approval: 'uploads/registration_approval/nid'
      },
      mandatory: true,
      acceptedFormats: ['PDF', 'JPG', 'PNG'],
      maxSize: 5,
      status: 'active',
    },
    {
      id: '3',
      name: 'Visa Application Form',
      code: 'DOC_VISA_FORM',
      modules: ['visa'],
      moduleLocations: {
        visa: 'uploads/visa/application_form'
      },
      mandatory: true,
      acceptedFormats: ['PDF'],
      maxSize: 10,
      status: 'active',
    },
    {
      id: '4',
      name: 'Medical Certificate',
      code: 'DOC_MEDICAL',
      modules: ['registration', 'add_renewal'],
      moduleLocations: {
        registration: 'uploads/registration/medical_certificate',
        add_renewal: 'uploads/add_renewal/medical_certificate'
      },
      mandatory: false,
      acceptedFormats: ['PDF', 'JPG'],
      maxSize: 5,
      status: 'active',
    },
    {
      id: '5',
      name: 'Hotel Booking Confirmation',
      code: 'DOC_HOTEL',
      modules: ['accommodation', 'tours_document'],
      moduleLocations: {
        accommodation: 'uploads/accommodation/hotel_booking',
        tours_document: 'uploads/tours_document/hotel_booking'
      },
      mandatory: true,
      acceptedFormats: ['PDF', 'JPG', 'PNG'],
      maxSize: 3,
      status: 'active',
    },
    {
      id: '6',
      name: 'Flight Tickets',
      code: 'DOC_TICKETS',
      modules: ['tours_tickets_upload', 'transport'],
      moduleLocations: {
        tours_tickets_upload: 'uploads/tours_tickets_upload/flight_tickets',
        transport: 'uploads/transport/flight_tickets'
      },
      mandatory: true,
      acceptedFormats: ['PDF', 'JPG', 'PNG'],
      maxSize: 5,
      status: 'active',
    },
  ]);

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    modules: [] as string[],
    moduleLocations: {} as Record<string, string>,
    mandatory: true,
    acceptedFormats: ['PDF'],
    maxSize: 5,
    status: 'active' as 'active' | 'inactive',
  });

  const [editFormData, setEditFormData] = useState({
    name: '',
    code: '',
    modules: [] as string[],
    moduleLocations: {} as Record<string, string>,
    mandatory: true,
    acceptedFormats: ['PDF'],
    maxSize: 5,
    status: 'active' as 'active' | 'inactive',
  });

  const filteredDocuments = documents.filter(doc => {
    // Search term filter
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.modules.some(m => m.toLowerCase().includes(searchTerm.toLowerCase()));

    // Advanced filters
    const matchesName = !filters.name || doc.name.toLowerCase().includes(filters.name.toLowerCase());
    const matchesCode = !filters.code || doc.code.toLowerCase().includes(filters.code.toLowerCase());
    const matchesModule = filters.module === 'all' || doc.modules.includes(filters.module);
    const matchesMandatory = filters.mandatory === 'all' || 
      (filters.mandatory === 'required' && doc.mandatory) ||
      (filters.mandatory === 'optional' && !doc.mandatory);
    const matchesFormat = filters.format === 'all' || doc.acceptedFormats.includes(filters.format);
    const matchesStatus = filters.status === 'all' || doc.status === filters.status;

    return matchesSearch && matchesName && matchesCode && matchesModule && matchesMandatory && matchesFormat && matchesStatus;
  });

  const handleAddDocument = () => {
    if (!formData.name || !formData.code || formData.modules.length === 0 || formData.acceptedFormats.length === 0) {
      toast.error('Please fill all required fields');
      return;
    }

    const newDocument: Document = {
      id: Date.now().toString(),
      ...formData,
    };

    setDocuments([...documents, newDocument]);
    setIsAddDialogOpen(false);
    resetForm();
    toast.success('Document type added successfully');
  };

  const handleEditDocument = (doc: Document) => {
    setEditingDocument(doc);
    setEditFormData({
      name: doc.name,
      code: doc.code,
      modules: doc.modules,
      moduleLocations: doc.moduleLocations,
      mandatory: doc.mandatory,
      acceptedFormats: doc.acceptedFormats,
      maxSize: doc.maxSize,
      status: doc.status,
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateDocument = () => {
    if (!editingDocument) return;

    if (!editFormData.name || !editFormData.code || editFormData.modules.length === 0 || editFormData.acceptedFormats.length === 0) {
      toast.error('Please fill all required fields');
      return;
    }

    setDocuments(documents.map(doc =>
      doc.id === editingDocument.id
        ? { ...doc, ...editFormData }
        : doc
    ));

    setIsEditDialogOpen(false);
    setEditingDocument(null);
    toast.success('Document type updated successfully');
  };

  // const handleDeleteDocument = (id: string) => {
  //   if (confirm('Are you sure you want to delete this document type?')) {
  //     setDocuments(documents.filter(doc => doc.id !== id));
  //     toast.success('Document type deleted successfully');
  //   }
  // };

  const resetForm = () => {
    setFormData({
      name: '',
      code: '',
      modules: [],
      moduleLocations: {},
      mandatory: true,
      acceptedFormats: ['PDF'],
      maxSize: 5,
      status: 'active',
    });
  };

  const toggleFormatSelection = (format: string, isEdit = false) => {
    if (isEdit) {
      setEditFormData(prev => ({
        ...prev,
        acceptedFormats: prev.acceptedFormats.includes(format)
          ? prev.acceptedFormats.filter(f => f !== format)
          : [...prev.acceptedFormats, format]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        acceptedFormats: prev.acceptedFormats.includes(format)
          ? prev.acceptedFormats.filter(f => f !== format)
          : [...prev.acceptedFormats, format]
      }));
    }
  };

  const toggleModuleSelection = (moduleValue: string, isEdit = false) => {
    if (isEdit) {
      setEditFormData(prev => ({
        ...prev,
        modules: prev.modules.includes(moduleValue)
          ? prev.modules.filter(m => m !== moduleValue)
          : [...prev.modules, moduleValue],
        moduleLocations: {
          ...prev.moduleLocations,
          [moduleValue]: `uploads/${moduleValue}/${prev.code.toLowerCase().replace(/_/g, '-')}`
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        modules: prev.modules.includes(moduleValue)
          ? prev.modules.filter(m => m !== moduleValue)
          : [...prev.modules, moduleValue],
        moduleLocations: {
          ...prev.moduleLocations,
          [moduleValue]: `uploads/${moduleValue}/${prev.code.toLowerCase().replace(/_/g, '-')}`
        }
      }));
    }
  };

  const getModuleLabel = (moduleValue: string) => {
    return AVAILABLE_MODULES.find(m => m.value === moduleValue)?.label || moduleValue;
  };

  const getModuleColor = (moduleValue: string): string => {
  const COLORS: Record<string, string> = {
    registration: "bg-blue-100 text-blue-700 border-blue-300",
    visa: "bg-purple-100 text-purple-700 border-purple-300",
    accommodation: "bg-green-100 text-green-700 border-green-300",
    transport: "bg-orange-100 text-orange-700 border-orange-300",
    tours: "bg-pink-100 text-pink-700 border-pink-300",
    add_renewal: "bg-cyan-100 text-cyan-700 border-cyan-300",
    tours_document: "bg-indigo-100 text-indigo-700 border-indigo-300",
    tours_tickets_upload: "bg-amber-100 text-amber-700 border-amber-300",
    registration_approval: "bg-emerald-100 text-emerald-700 border-emerald-300",
  };

  return COLORS[moduleValue] ?? "bg-gray-100 text-gray-700 border-gray-300";
};


  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 style={{ color: '#5B9BD5' }} className="flex items-center gap-2">
            <FileStack className="w-6 h-6" />
            Document Master
          </h1>
          <p className="text-gray-600 mt-1">
            Manage document types and upload requirements across all modules
          </p>
        </div>
        <Button
          onClick={() => setIsAddDialogOpen(true)}
          style={{ background: '#5B9BD5' }}
          className="text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Document Type
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-blue-200 bg-blue-50/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600">Total Documents</p>
                <p className="text-2xl font-bold text-blue-900">{documents.length}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600">Active Documents</p>
                <p className="text-2xl font-bold text-green-900">
                  {documents.filter(d => d.status === 'active').length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <Check className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-red-200 bg-red-50/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-600">Mandatory</p>
                <p className="text-2xl font-bold text-red-900">
                  {documents.filter(d => d.mandatory).length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <FileStack className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-200 bg-amber-50/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-amber-600">Modules</p>
                <p className="text-2xl font-bold text-amber-900">{AVAILABLE_MODULES.length}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                <FileStack className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card> 
      </div>

      {/* Search and Filter Toggle */}
      <Card className="bg-white border-[#5B9BD5]/30">
        <CardContent className="p-6">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search document types, codes, or modules..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant={showFilters ? "default" : "outline"}
              size="icon"
              onClick={() => setShowFilters(!showFilters)}
              style={showFilters ? { background: '#5B9BD5' } : {}}
              className={showFilters ? "text-white" : "border-[#5B9BD5] text-[#5B9BD5] hover:bg-sky-50"}
              title="Toggle Advanced Filters"
            >
              <Filter className="w-5 h-5" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Advanced Filters Section */}
      {showFilters && (
        <Card className="border-[#5B9BD5]/30 bg-gradient-to-br from-sky-50/50 to-blue-50/50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle style={{ color: '#5B9BD5' }} className="flex items-center gap-2 text-lg">
                  <Filter className="w-5 h-5" />
                  Advanced Filters
                </CardTitle>
                <CardDescription className="mt-1">
                  Filter documents by multiple criteria
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFilters(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Document Name Filter */}
              <div className="space-y-2">
                <Label htmlFor="filter-name" className="text-sm">Document Name</Label>
                <Input
                  id="filter-name"
                  placeholder="Search by name..."
                  value={filters.name}
                  onChange={(e) => setFilters({ ...filters, name: e.target.value })}
                  className="h-9 text-sm"
                />
              </div>

              {/* Document Code Filter */}
              <div className="space-y-2">
                <Label htmlFor="filter-code" className="text-sm">Document Code</Label>
                <Input
                  id="filter-code"
                  placeholder="Search by code..."
                  value={filters.code}
                  onChange={(e) => setFilters({ ...filters, code: e.target.value })}
                  className="font-mono h-9 text-sm"
                />
              </div>

              {/* Module Filter */}
              <div className="space-y-2">
                <Label htmlFor="filter-module" className="text-sm">Module</Label>
                <Select value={filters.module} onValueChange={(value) => setFilters({ ...filters, module: value })}>
                  <SelectTrigger id="filter-module" className="h-9 text-sm">
                    <SelectValue placeholder="All modules" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All modules</SelectItem>
                    {AVAILABLE_MODULES.map(module => (
                      <SelectItem key={module.value} value={module.value}>
                        {module.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Mandatory Filter */}
              <div className="space-y-2">
                <Label htmlFor="filter-mandatory" className="text-sm">Requirement</Label>
                <Select value={filters.mandatory} onValueChange={(value) => setFilters({ ...filters, mandatory: value })}>
                  <SelectTrigger id="filter-mandatory" className="h-9 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Documents</SelectItem>
                    <SelectItem value="required">Mandatory Only</SelectItem>
                    <SelectItem value="optional">Optional Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Format Filter */}
              <div className="space-y-2">
                <Label htmlFor="filter-format" className="text-sm">File Format</Label>
                <Select value={filters.format} onValueChange={(value) => setFilters({ ...filters, format: value })}>
                  <SelectTrigger id="filter-format" className="h-9 text-sm">
                    <SelectValue placeholder="All formats" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All formats</SelectItem>
                    <SelectItem value="PDF">PDF</SelectItem>
                    <SelectItem value="JPG">JPG</SelectItem>
                    <SelectItem value="PNG">PNG</SelectItem>
                    <SelectItem value="JPEG">JPEG</SelectItem>
                    <SelectItem value="DOC">DOC</SelectItem>
                    <SelectItem value="DOCX">DOCX</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Status Filter */}
              <div className="space-y-2">
                <Label htmlFor="filter-status" className="text-sm">Status</Label>
                <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
                  <SelectTrigger id="filter-status" className="h-9 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active Only</SelectItem>
                    <SelectItem value="inactive">Inactive Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Active Filters Summary & Clear Button */}
            {(filters.name || filters.code || filters.module !== 'all' || filters.mandatory !== 'all' || filters.format !== 'all' || filters.status !== 'all') && (
              <div className="flex items-center justify-between gap-3 p-3 bg-white border border-[#5B9BD5]/30 rounded-lg">
                <div className="flex-1">
                  <p className="text-sm font-medium text-[#5B9BD5] mb-2">Active Filters:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {filters.name && (
                      <Badge variant="outline" className="border-[#5B9BD5]/30 text-[#5B9BD5] text-xs">
                        Name: {filters.name}
                      </Badge>
                    )}
                    {filters.code && (
                      <Badge variant="outline" className="border-[#5B9BD5]/30 text-[#5B9BD5] text-xs">
                        Code: {filters.code}
                      </Badge>
                    )}
                    {filters.module !== 'all' && (
                      <Badge variant="outline" className="border-[#5B9BD5]/30 text-[#5B9BD5] text-xs">
                        Module: {getModuleLabel(filters.module)}
                      </Badge>
                    )}
                    {filters.mandatory !== 'all' && (
                      <Badge variant="outline" className="border-[#5B9BD5]/30 text-[#5B9BD5] text-xs">
                        {filters.mandatory === 'required' ? 'Mandatory' : 'Optional'}
                      </Badge>
                    )}
                    {filters.format !== 'all' && (
                      <Badge variant="outline" className="border-[#5B9BD5]/30 text-[#5B9BD5] text-xs">
                        Format: {filters.format}
                      </Badge>
                    )}
                    {filters.status !== 'all' && (
                      <Badge variant="outline" className="border-[#5B9BD5]/30 text-[#5B9BD5] text-xs">
                        Status: {filters.status}
                      </Badge>
                    )}
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setFilters({
                      name: '',
                      code: '',
                      module: 'all',
                      mandatory: 'all',
                      format: 'all',
                      status: 'all'
                    });
                  }}
                  className="text-red-600 border-red-300 hover:bg-red-50 flex-shrink-0"
                >
                  <X className="w-4 h-4 mr-1" />
                  Clear All
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Documents Table */}
      <Card className="bg-white border-[#5B9BD5]/30" style={{gap: "0px"}}>
        <CardHeader className="border-b bg-gradient-to-r from-sky-50 to-blue-50" style={{ paddingBottom: "24px"}}>
          <CardTitle style={{ color: '#5B9BD5' }}>Document Types</CardTitle>
          <CardDescription>
            {filteredDocuments.length} document type{filteredDocuments.length !== 1 ? 's' : ''} found
          </CardDescription>
        </CardHeader>
        <CardContent style={{ padding: "0px" }}>
          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gradient-to-r from-sky-50 to-blue-50">
                  <TableHead style={{ color: '#5B9BD5' }} className="px-4 py-3 text-xs">Document Name</TableHead>
                  <TableHead style={{ color: '#5B9BD5' }} className="px-4 py-3 text-xs">Code</TableHead>
                  <TableHead style={{ color: '#5B9BD5' }} className="px-4 py-3 text-xs">Modules</TableHead>
                  <TableHead style={{ color: '#5B9BD5' }} className="px-4 py-3 text-xs">Mandatory</TableHead>
                  <TableHead style={{ color: '#5B9BD5' }} className="px-4 py-3 text-xs">Formats</TableHead>
                  <TableHead style={{ color: '#5B9BD5' }} className="px-4 py-3 text-xs">Max Size</TableHead>
                  <TableHead style={{ color: '#5B9BD5' }} className="px-4 py-3 text-xs">Status</TableHead>
                  <TableHead style={{ color: '#5B9BD5' }} className="px-4 py-3 text-xs text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDocuments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 px-4 text-gray-500 text-sm">
                      No document types found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredDocuments.map((doc) => (
                    <TableRow key={doc.id} className="hover:bg-sky-50/30">
                      <TableCell className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-100 to-blue-100 flex items-center justify-center flex-shrink-0">
                            <FileText className="w-4 h-4 text-[#5B9BD5]" />
                          </div>
                          <span className="text-gray-900" style={{fontSize: "12px"}}>{doc.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <Badge variant="outline" className="border-[#5B9BD5]/30 text-[#5B9BD5] font-mono text-[10px] px-1.5 py-0.5">
                          {doc.code}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {doc.modules.map(module => (
                            <Badge variant="outline" className={`${getModuleColor(module)} text-[10px] px-1.5 py-0.5`} >
                              {getModuleLabel(module)}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <Badge variant="outline"
                          className={`${doc.mandatory 
                            ? 'bg-red-100 text-red-700 border-red-300' 
                            : 'bg-gray-100 text-gray-700 border-gray-300'
                          } text-[10px] px-1.5 py-0.5`}
                        >
                          {doc.mandatory ? 'Required' : 'Optional'}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {doc.acceptedFormats.map(format => (
                            <Badge key={format} variant="outline" className="text-[10px] border-[#5B9BD5]/30 text-[#5B9BD5] px-1.5 py-0.5">
                              {format}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <span className="text-xs text-gray-700">{doc.maxSize} MB</span>
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <Badge variant="outline" 
                          className={`${doc.status === 'active' 
                            ? 'bg-green-100 text-green-700 border-green-300' 
                            : 'bg-gray-100 text-gray-700 border-gray-300'
                          } text-[10px] px-1.5 py-0.5`}
                        >
                          {doc.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEditDocument(doc)}
                            className="text-[#5B9BD5] hover:bg-sky-50 h-7 w-7 p-0"
                            title="Edit document"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            // onClick={() => handleDeleteDocument(doc.id)}
                            className="text-red-600 hover:bg-red-50 h-7 w-7 p-0"
                            title="Delete document"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
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
          <div className="lg:hidden space-y-3 p-4">
            {filteredDocuments.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No document types found</p>
              </div>
            ) : (
              filteredDocuments.map((doc) => (
                <Card key={doc.id} className="border-[#5B9BD5]/30 hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="space-y-3">

                      {/* Header */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3 flex-1">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-100 to-blue-100 flex items-center justify-center flex-shrink-0">
                            <FileText className="w-5 h-5 text-[#5B9BD5]" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-gray-900 truncate">{doc.name}</h3>
                            <Badge
                              variant="outline"
                              className="border-[#5B9BD5]/30 text-[#5B9BD5] font-mono text-xs mt-1"
                            >
                              {doc.code}
                            </Badge>
                          </div>
                        </div>

                        {/* Status Badge */}
                        <Badge
                          variant="outline"
                          className={
                            doc.status === 'active'
                              ? 'bg-green-100 text-green-700 border-green-300'
                              : 'bg-gray-100 text-gray-700 border-gray-300'
                          }
                        >
                          {doc.status}
                        </Badge>
                      </div>

                      {/* Details */}
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Mandatory:</span>

                          <Badge
                            variant="outline"
                            className={
                              doc.mandatory
                                ? 'bg-red-100 text-red-700 border-red-300'
                                : 'bg-gray-100 text-gray-700 border-gray-300'
                            }
                          >
                            {doc.mandatory ? 'Required' : 'Optional'}
                          </Badge>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Max Size:</span>
                          <span className="font-medium text-gray-900">{doc.maxSize} MB</span>
                        </div>

                        {/* Modules */}
                        <div>
                          <span className="text-gray-600 block mb-1">Modules:</span>
                          <div className="flex flex-wrap gap-1">
                            {doc.modules.map((module) => (
                              <Badge
                                key={module}
                                variant="outline"
                                className={`${getModuleColor(module)} text-[10px] px-1.5 py-0.5`}
                              >
                                {getModuleLabel(module)}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Formats */}
                        <div>
                          <span className="text-gray-600 block mb-1">Formats:</span>
                          <div className="flex flex-wrap gap-1">
                            {doc.acceptedFormats.map((format) => (
                              <Badge
                                key={format}
                                variant="outline"
                                className="text-xs border-[#5B9BD5]/30 text-[#5B9BD5]"
                              >
                                {format}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 pt-3 border-t">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditDocument(doc)}
                          className="flex-1 text-[#5B9BD5] border-[#5B9BD5] hover:bg-sky-50"
                        >
                          <Edit2 className="w-4 h-4 mr-2" /> Edit
                        </Button>

                        <Button
                          size="sm"
                          variant="outline"
                          // onClick={() => handleDeleteDocument(doc.id)}
                          className="flex-1 text-red-600 border-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4 mr-2" /> Delete
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

      {/* Add Document Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle style={{ color: '#5B9BD5' }}>Add New Document Type</DialogTitle>
            <DialogDescription>
              Define a new document type that can be used across multiple modules
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4 px-1">
            <div className="space-y-2">
              <Label htmlFor="name">
                Document Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                placeholder="e.g., Passport Copy"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="code">
                Document Code <span className="text-red-500">*</span>
              </Label>
              <Input
                id="code"
                placeholder="e.g., DOC_PASSPORT"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase().replace(/\s/g, '_') })}
                className="font-mono"
              />
              <p className="text-xs text-gray-500">Auto-formatted to uppercase with underscores</p>
            </div>

            <div className="space-y-3">
              <Label>
                Modules <span className="text-red-500">*</span>
              </Label>
              <p className="text-xs text-gray-500">Select one or more modules where this document can be uploaded</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-3 border rounded-lg bg-gray-50">
                {AVAILABLE_MODULES.map(module => (
                  <div key={module.value} className="flex items-center gap-2">
                    <Checkbox
                      id={`module-${module.value}`}
                      checked={formData.modules.includes(module.value)}
                      onCheckedChange={() => toggleModuleSelection(module.value)}
                      className="h-4 w-4"
                    />
                    <Label htmlFor={`module-${module.value}`} className="cursor-pointer text-sm font-normal">
                      {module.label}
                    </Label>
                  </div>
                ))}
              </div>
              {formData.modules.length > 0 && (
                <div className="flex flex-wrap gap-1.5 p-3 border rounded-lg bg-gradient-to-br from-blue-50 to-sky-50">
                  {formData.modules.map(module => (
                    <Badge variant="outline" key={module} className={`${getModuleColor(module)} text-[10px] px-1.5 py-0.5`}>
                      {getModuleLabel(module)}
                      <button
                        onClick={() => toggleModuleSelection(module)}
                        className="ml-1.5 hover:bg-black/10 rounded-full p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Storage Locations for Selected Modules */}
            {formData.modules.length > 0 && (
              <div className="space-y-3">
                <Label>
                  Storage Locations <span className="text-red-500">*</span>
                </Label>
                <p className="text-xs text-gray-500">
                  Specify the folder path where each module should store this document
                </p>
                <div className="space-y-3 p-3 border rounded-lg bg-gradient-to-br from-gray-50 to-slate-50">
                  {formData.modules.map(module => (
                    <div key={module} className="space-y-1.5">
                      <Label htmlFor={`location-${module}`} className="text-xs font-medium text-gray-700">
                        {getModuleLabel(module)} Path
                      </Label>
                      <Input
                        id={`location-${module}`}
                        placeholder={`e.g., uploads/${module}/document-name`}
                        value={formData.moduleLocations[module] || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          moduleLocations: {
                            ...formData.moduleLocations,
                            [module]: e.target.value
                          }
                        })}
                        className="font-mono text-xs h-9"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-3">
              <Label>
                Accepted File Formats <span className="text-red-500">*</span>
              </Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-3 border rounded-lg bg-gray-50">
                {['PDF', 'JPG', 'PNG', 'JPEG', 'DOC', 'DOCX'].map(format => (
                  <div key={format} className="flex items-center gap-2">
                    <Checkbox
                      id={`format-${format}`}
                      checked={formData.acceptedFormats.includes(format)}
                      onCheckedChange={() => toggleFormatSelection(format)}
                      className="h-4 w-4"
                    />
                    <Label htmlFor={`format-${format}`} className="cursor-pointer text-sm font-normal">
                      {format}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxSize">
                Maximum File Size (MB) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="maxSize"
                type="number"
                min="1"
                max="50"
                value={formData.maxSize}
                onChange={(e) => setFormData({ ...formData, maxSize: parseInt(e.target.value) || 5 })}
              />
              <p className="text-xs text-gray-500">Recommended: 5MB for images, 10MB for documents</p>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 bg-gradient-to-br from-gray-50 to-slate-50">
              <div>
                <Label className="text-sm">Mandatory Document</Label>
                <p className="text-xs text-gray-600">Make this document required for upload</p>
              </div>
              <Checkbox
                id="mandatory"
                checked={formData.mandatory}
                onCheckedChange={(checked) => setFormData({ ...formData, mandatory: checked as boolean })}
                className="h-5 w-5"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value: any) => setFormData({ ...formData, status: value })}>
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsAddDialogOpen(false);
                resetForm();
              }}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddDocument}
              disabled={!formData.name || !formData.code || formData.modules.length === 0 || formData.acceptedFormats.length === 0}
              style={{ background: '#5B9BD5' }}
              className="text-white w-full sm:w-auto"
            >
              Add Document Type
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Document Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle style={{ color: '#5B9BD5' }}>Edit Document Type</DialogTitle>
            <DialogDescription>
              Update document type settings and module assignments
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4 px-1">
            <div className="space-y-2">
              <Label htmlFor="edit-name">
                Document Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="edit-name"
                placeholder="e.g., Passport Copy"
                value={editFormData.name}
                onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-code">
                Document Code <span className="text-red-500">*</span>
              </Label>
              <Input
                id="edit-code"
                placeholder="e.g., DOC_PASSPORT"
                value={editFormData.code}
                onChange={(e) => setEditFormData({ ...editFormData, code: e.target.value.toUpperCase().replace(/\s/g, '_') })}
                className="font-mono"
              />
            </div>

            <div className="space-y-3">
              <Label>
                Modules <span className="text-red-500">*</span>
              </Label>
              <p className="text-xs text-gray-500">Select one or more modules where this document can be uploaded</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-3 border rounded-lg bg-gray-50">
                {AVAILABLE_MODULES.map(module => (
                  <div key={module.value} className="flex items-center gap-2">
                    <Checkbox
                      id={`edit-module-${module.value}`}
                      checked={editFormData.modules.includes(module.value)}
                      onCheckedChange={() => toggleModuleSelection(module.value, true)}
                      className="h-4 w-4"
                    />
                    <Label htmlFor={`edit-module-${module.value}`} className="cursor-pointer text-sm font-normal">
                      {module.label}
                    </Label>
                  </div>
                ))}
              </div>
              {editFormData.modules.length > 0 && (
                <div className="flex flex-wrap gap-1.5 p-3 border rounded-lg bg-gradient-to-br from-blue-50 to-sky-50">
                  {editFormData.modules.map(module => (
                    <Badge key={module} className={`${getModuleColor(module)} text-xs`}>
                      {getModuleLabel(module)}
                      <button
                        onClick={() => toggleModuleSelection(module, true)}
                        className="ml-1.5 hover:bg-black/10 rounded-full p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Storage Locations for Selected Modules */}
            {editFormData.modules.length > 0 && (
              <div className="space-y-3">
                <Label>
                  Storage Locations <span className="text-red-500">*</span>
                </Label>
                <p className="text-xs text-gray-500">
                  Specify the folder path where each module should store this document
                </p>
                <div className="space-y-3 p-3 border rounded-lg bg-gradient-to-br from-gray-50 to-slate-50">
                  {editFormData.modules.map(module => (
                    <div key={module} className="space-y-1.5">
                      <Label htmlFor={`location-${module}`} className="text-xs font-medium text-gray-700">
                        {getModuleLabel(module)} Path
                      </Label>
                      <Input
                        id={`location-${module}`}
                        placeholder={`e.g., uploads/${module}/document-name`}
                        value={editFormData.moduleLocations[module] || ''}
                        onChange={(e) => setEditFormData({
                          ...editFormData,
                          moduleLocations: {
                            ...editFormData.moduleLocations,
                            [module]: e.target.value
                          }
                        })}
                        className="font-mono text-xs h-9"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-3">
              <Label>
                Accepted File Formats <span className="text-red-500">*</span>
              </Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-3 border rounded-lg bg-gray-50">
                {['PDF', 'JPG', 'PNG', 'JPEG', 'DOC', 'DOCX'].map(format => (
                  <div key={format} className="flex items-center gap-2">
                    <Checkbox
                      id={`edit-format-${format}`}
                      checked={editFormData.acceptedFormats.includes(format)}
                      onCheckedChange={() => toggleFormatSelection(format, true)}
                      className="h-4 w-4"
                    />
                    <Label htmlFor={`edit-format-${format}`} className="cursor-pointer text-sm font-normal">
                      {format}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-maxSize">
                Maximum File Size (MB) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="edit-maxSize"
                type="number"
                min="1"
                max="50"
                value={editFormData.maxSize}
                onChange={(e) => setEditFormData({ ...editFormData, maxSize: parseInt(e.target.value) || 5 })}
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 bg-gradient-to-br from-gray-50 to-slate-50">
              <div>
                <Label className="text-sm">Mandatory Document</Label>
                <p className="text-xs text-gray-600">Make this document required for upload</p>
              </div>
              <Checkbox
                id="edit-mandatory"
                checked={editFormData.mandatory}
                onCheckedChange={(checked) => setEditFormData({ ...editFormData, mandatory: checked as boolean })}
                className="h-5 w-5"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-status">Status</Label>
              <Select value={editFormData.status} onValueChange={(value: any) => setEditFormData({ ...editFormData, status: value })}>
                <SelectTrigger id="edit-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsEditDialogOpen(false);
                setEditingDocument(null);
              }}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateDocument}
              disabled={!editFormData.name || !editFormData.code || editFormData.modules.length === 0 || editFormData.acceptedFormats.length === 0}
              style={{ background: '#5B9BD5' }}
              className="text-white w-full sm:w-auto"
            >
              Update Document Type
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
};