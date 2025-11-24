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
  Check
} from 'lucide-react';
import { toast } from 'sonner';

interface Document {
  id: string;
  name: string;
  code: string;
  modules: string[]; // Changed from module to modules (array)
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
  const [editingDocument, setEditingDocument] = useState<Document | null>(null);

  const [documents, setDocuments] = useState<Document[]>([
    {
      id: '1',
      name: 'Passport Copy',
      code: 'DOC_PASSPORT',
      modules: ['registration', 'visa', 'tours'],
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
    mandatory: true,
    acceptedFormats: ['PDF'],
    maxSize: 5,
    status: 'active' as 'active' | 'inactive',
  });

  const [editFormData, setEditFormData] = useState({
    name: '',
    code: '',
    modules: [] as string[],
    mandatory: true,
    acceptedFormats: ['PDF'],
    maxSize: 5,
    status: 'active' as 'active' | 'inactive',
  });

  const filteredDocuments = documents.filter(doc =>
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.modules.some(m => m.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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

//   const handleDeleteDocument = (id: string) => {
//     if (confirm('Are you sure you want to delete this document type?')) {
//       setDocuments(documents.filter(doc => doc.id !== id));
//       toast.success('Document type deleted successfully');
//     }
//   };

  const resetForm = () => {
    setFormData({
      name: '',
      code: '',
      modules: [],
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
          : [...prev.modules, moduleValue]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        modules: prev.modules.includes(moduleValue)
          ? prev.modules.filter(m => m !== moduleValue)
          : [...prev.modules, moduleValue]
      }));
    }
  };

  const getModuleLabel = (moduleValue: string) => {
    return AVAILABLE_MODULES.find(m => m.value === moduleValue)?.label || moduleValue;
  };

  const getModuleColor = (moduleValue: string) => {
    const colors: Record<string, string> = {
      'registration': 'bg-blue-100 text-blue-700 border-blue-300',
      'visa': 'bg-purple-100 text-purple-700 border-purple-300',
      'accommodation': 'bg-green-100 text-green-700 border-green-300',
      'transport': 'bg-orange-100 text-orange-700 border-orange-300',
      'tours': 'bg-pink-100 text-pink-700 border-pink-300',
      'add_renewal': 'bg-cyan-100 text-cyan-700 border-cyan-300',
      'tours_document': 'bg-indigo-100 text-indigo-700 border-indigo-300',
      'tours_tickets_upload': 'bg-amber-100 text-amber-700 border-amber-300',
      'registration_approval': 'bg-emerald-100 text-emerald-700 border-emerald-300',
    };
    return colors[moduleValue] || 'bg-gray-100 text-gray-700 border-gray-300';
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
      <div className="grid grid-cols-4 gap-4">
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

      {/* Search */}
      <Card className="border-[#5B9BD5]/30">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search document types, codes, or modules..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Documents Table */}
      <Card className="border-[#5B9BD5]/30">
        <CardHeader className="border-b bg-gradient-to-r from-sky-50 to-blue-50">
          <CardTitle style={{ color: '#5B9BD5' }}>Document Types</CardTitle>
          <CardDescription>
            {filteredDocuments.length} document type{filteredDocuments.length !== 1 ? 's' : ''} found
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gradient-to-r from-sky-50 to-blue-50">
                  <TableHead style={{ color: '#5B9BD5' }} className="px-6 py-4">Document Name</TableHead>
                  <TableHead style={{ color: '#5B9BD5' }} className="px-6 py-4">Code</TableHead>
                  <TableHead style={{ color: '#5B9BD5' }} className="px-6 py-4">Modules</TableHead>
                  <TableHead style={{ color: '#5B9BD5' }} className="px-6 py-4">Mandatory</TableHead>
                  <TableHead style={{ color: '#5B9BD5' }} className="px-6 py-4">Formats</TableHead>
                  <TableHead style={{ color: '#5B9BD5' }} className="px-6 py-4">Max Size</TableHead>
                  <TableHead style={{ color: '#5B9BD5' }} className="px-6 py-4">Status</TableHead>
                  <TableHead style={{ color: '#5B9BD5' }} className="px-6 py-4 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDocuments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 px-6 text-gray-500">
                      No document types found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredDocuments.map((doc) => (
                    <TableRow key={doc.id} className="hover:bg-sky-50/30">
                      <TableCell className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-100 to-blue-100 flex items-center justify-center flex-shrink-0">
                            <FileText className="w-5 h-5 text-[#5B9BD5]" />
                          </div>
                          <span className="text-gray-900 font-medium">{doc.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <Badge variant="outline" className="border-[#5B9BD5]/30 text-[#5B9BD5] font-mono text-xs">
                          {doc.code}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {doc.modules.map(module => (
                            <Badge key={module} className={getModuleColor(module)}>
                              {getModuleLabel(module)}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <Badge className={doc.mandatory ? 'bg-red-100 text-red-700 border-red-300' : 'bg-gray-100 text-gray-700 border-gray-300'}>
                          {doc.mandatory ? 'Required' : 'Optional'}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {doc.acceptedFormats.map(format => (
                            <Badge key={format} variant="outline" className="text-xs border-[#5B9BD5]/30 text-[#5B9BD5]">
                              {format}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <span className="text-sm text-gray-700 font-medium">{doc.maxSize} MB</span>
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <Badge className={doc.status === 'active' ? 'bg-green-100 text-green-700 border-green-300' : 'bg-gray-100 text-gray-700 border-gray-300'}>
                          {doc.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEditDocument(doc)}
                            className="text-[#5B9BD5] hover:bg-sky-50"
                            title="Edit document"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            // onClick={() => handleDeleteDocument(doc.id)}
                            className="text-red-600 hover:bg-red-50"
                            title="Delete document"
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
          <div className="space-y-4 py-4">
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
              <div className="grid grid-cols-2 gap-3 p-4 border rounded-lg bg-gray-50">
                {AVAILABLE_MODULES.map(module => (
                  <div key={module.value} className="flex items-center gap-2">
                    <Checkbox
                      id={`module-${module.value}`}
                      checked={formData.modules.includes(module.value)}
                      onCheckedChange={() => toggleModuleSelection(module.value)}
                    />
                    <Label htmlFor={`module-${module.value}`} className="cursor-pointer text-sm">
                      {module.label}
                    </Label>
                  </div>
                ))}
              </div>
              {formData.modules.length > 0 && (
                <div className="flex flex-wrap gap-1 p-2 border rounded-lg bg-blue-50">
                  {formData.modules.map(module => (
                    <Badge key={module} className={getModuleColor(module)}>
                      {getModuleLabel(module)}
                      <button
                        onClick={() => toggleModuleSelection(module)}
                        className="ml-1 hover:bg-black/10 rounded-full p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-3">
              <Label>
                Accepted File Formats <span className="text-red-500">*</span>
              </Label>
              <div className="flex flex-wrap gap-4 p-4 border rounded-lg bg-gray-50">
                {['PDF', 'JPG', 'PNG', 'JPEG', 'DOC', 'DOCX'].map(format => (
                  <div key={format} className="flex items-center gap-2">
                    <Checkbox
                      id={`format-${format}`}
                      checked={formData.acceptedFormats.includes(format)}
                      onCheckedChange={() => toggleFormatSelection(format)}
                    />
                    <Label htmlFor={`format-${format}`} className="cursor-pointer text-sm">
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

            <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 bg-gray-50">
              <div>
                <Label className="text-base">Mandatory Document</Label>
                <p className="text-sm text-gray-600">Make this document required for upload</p>
              </div>
              <Checkbox
                id="mandatory"
                checked={formData.mandatory}
                onCheckedChange={(checked) => setFormData({ ...formData, mandatory: checked as boolean })}
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
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsAddDialogOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddDocument}
              disabled={!formData.name || !formData.code || formData.modules.length === 0 || formData.acceptedFormats.length === 0}
              style={{ background: '#5B9BD5' }}
              className="text-white"
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
          <div className="space-y-4 py-4">
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
              <div className="grid grid-cols-2 gap-3 p-4 border rounded-lg bg-gray-50">
                {AVAILABLE_MODULES.map(module => (
                  <div key={module.value} className="flex items-center gap-2">
                    <Checkbox
                      id={`edit-module-${module.value}`}
                      checked={editFormData.modules.includes(module.value)}
                      onCheckedChange={() => toggleModuleSelection(module.value, true)}
                    />
                    <Label htmlFor={`edit-module-${module.value}`} className="cursor-pointer text-sm">
                      {module.label}
                    </Label>
                  </div>
                ))}
              </div>
              {editFormData.modules.length > 0 && (
                <div className="flex flex-wrap gap-1 p-2 border rounded-lg bg-blue-50">
                  {editFormData.modules.map(module => (
                    <Badge key={module} className={getModuleColor(module)}>
                      {getModuleLabel(module)}
                      <button
                        onClick={() => toggleModuleSelection(module, true)}
                        className="ml-1 hover:bg-black/10 rounded-full p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-3">
              <Label>
                Accepted File Formats <span className="text-red-500">*</span>
              </Label>
              <div className="flex flex-wrap gap-4 p-4 border rounded-lg bg-gray-50">
                {['PDF', 'JPG', 'PNG', 'JPEG', 'DOC', 'DOCX'].map(format => (
                  <div key={format} className="flex items-center gap-2">
                    <Checkbox
                      id={`edit-format-${format}`}
                      checked={editFormData.acceptedFormats.includes(format)}
                      onCheckedChange={() => toggleFormatSelection(format, true)}
                    />
                    <Label htmlFor={`edit-format-${format}`} className="cursor-pointer text-sm">
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

            <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 bg-gray-50">
              <div>
                <Label className="text-base">Mandatory Document</Label>
                <p className="text-sm text-gray-600">Make this document required for upload</p>
              </div>
              <Checkbox
                id="edit-mandatory"
                checked={editFormData.mandatory}
                onCheckedChange={(checked) => setEditFormData({ ...editFormData, mandatory: checked as boolean })}
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
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditDialogOpen(false);
                setEditingDocument(null);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateDocument}
              disabled={!editFormData.name || !editFormData.code || editFormData.modules.length === 0 || editFormData.acceptedFormats.length === 0}
              style={{ background: '#5B9BD5' }}
              className="text-white"
            >
              Update Document Type
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
