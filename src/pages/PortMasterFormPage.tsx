import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { ArrowLeft, Plus, Upload, Trash2, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Alert, AlertDescription } from '../ui/alert';

interface BlockedDate {
  id: string;
  fromDate: string;
  toDate: string;
  fromTime: string;
  toTime: string;
  reason: string;
}

interface Port {
  id: string;
  venueId: string;
  portName: string;
  portNameArabic: string;
  portShortName: string;
  arrivalShortName: string;
  departureShortName: string;
  arrivalSeniorCharges: number;
  departureSeniorCharges: number;
  arrivalAdultCharges: number;
  departureAdultCharges: number;
  arrivalChildCharges: number;
  departureChildCharges: number;
  arrivalInfantCharges: number;
  departureInfantCharges: number;
  visaLetterText: string;
  visaLetterImageName: string;
  blockIndefinitely: boolean;
  isActive: boolean;
  blockedDates: BlockedDate[];
}

const mockVenues = [
  { id: '1', name: 'Iraq' },
  { id: '2', name: 'Iran' },
  { id: '3', name: 'Syria' },
];

interface PortMasterFormPageProps {
  mode: 'add' | 'edit' | 'view';
  portId?: string;
  onBack: () => void;
}

export const PortMasterFormPage = ({ mode, portId, onBack }: PortMasterFormPageProps) => {
  const [showBlockDateDialog, setShowBlockDateDialog] = useState(false);
  const [newBlockDate, setNewBlockDate] = useState({ fromDate: '', toDate: '', fromTime: '', toTime: '', reason: '' });
  const isViewMode = mode === 'view';

  const [formData, setFormData] = useState<Port>({
    id: '',
    venueId: '',
    portName: '',
    portNameArabic: '',
    portShortName: '',
    arrivalShortName: '',
    departureShortName: '',
    arrivalSeniorCharges: 0,
    departureSeniorCharges: 0,
    arrivalAdultCharges: 0,
    departureAdultCharges: 0,
    arrivalChildCharges: 0,
    departureChildCharges: 0,
    arrivalInfantCharges: 0,
    departureInfantCharges: 0,
    visaLetterText: '',
    visaLetterImageName: '',
    blockIndefinitely: false,
    isActive: true,
    blockedDates: []
  });

  useEffect(() => {
    if (mode === 'edit' || mode === 'view') {
      // Load port data for editing/viewing
      // In real implementation, fetch from API
      const mockData: Port = {
        id: portId || '1',
        venueId: '1',
        portName: 'Baghdad Airport',
        portNameArabic: 'مطار بغداد الدولي',
        portShortName: 'B',
        arrivalShortName: 'ARR-B',
        departureShortName: 'DEP-B',
        arrivalSeniorCharges: 35,
        departureSeniorCharges: 35,
        arrivalAdultCharges: 35,
        departureAdultCharges: 35,
        arrivalChildCharges: 35,
        departureChildCharges: 35,
        arrivalInfantCharges: 0,
        departureInfantCharges: 0,
        visaLetterText: 'Visa Letter Text',
        visaLetterImageName: 'visa_letter.png',
        blockIndefinitely: false,
        isActive: true,
        blockedDates: [
          { id: '1', fromDate: '2025-01-15', toDate: '2025-01-20', fromTime: '00:00', toTime: '23:59', reason: 'Maintenance' }
        ]
      };
      setFormData(mockData);
    }
  }, [mode, portId]);

  const handleInputChange = (field: keyof Port, value: any) => {
    if (isViewMode) return;
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (!formData.venueId || !formData.portName) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (mode === 'edit') {
      toast.success('Port updated successfully');
    } else {
      toast.success('Port created successfully');
    }
    
    setTimeout(() => {
      onBack();
    }, 1000);
  };

  const handleAddBlockDate = () => {
    if (!newBlockDate.fromDate || !newBlockDate.toDate || !newBlockDate.reason) {
      toast.error('Please fill in all block date fields');
      return;
    }

    const blockDate: BlockedDate = {
      id: Date.now().toString(),
      ...newBlockDate
    };

    setFormData(prev => ({
      ...prev,
      blockedDates: [...prev.blockedDates, blockDate]
    }));

    setNewBlockDate({ fromDate: '', toDate: '', fromTime: '', toTime: '', reason: '' });
    setShowBlockDateDialog(false);
    toast.success('Block date added successfully');
  };

  const handleRemoveBlockDate = (id: string) => {
    if (isViewMode) return;
    setFormData(prev => ({
      ...prev,
      blockedDates: prev.blockedDates.filter(bd => bd.id !== id)
    }));
    toast.success('Block date removed successfully');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isViewMode) return;
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        toast.error('File size should not be more than 3 MB');
        return;
      }
      setFormData(prev => ({ ...prev, visaLetterImageName: file.name }));
      toast.success('File uploaded successfully');
    }
  };

  const getTitle = () => {
    switch (mode) {
      case 'add':
        return 'Add New Port';
      case 'edit':
        return 'Edit Port';
      case 'view':
        return 'View Port Details';
      default:
        return 'Port Form';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={onBack}
            className="border-purple-200 text-purple-600 hover:bg-purple-50"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-purple-900">{getTitle()}</h1>
            <p className="text-sm text-purple-600 mt-1">
              {isViewMode ? 'Review port information' : 'Fill in the port details below'}
            </p>
          </div>
        </div>
      </div>

      {/* View Mode Alert */}
      {isViewMode && (
        <Alert className="bg-purple-100 border-purple-200">
          <AlertDescription className="text-purple-900">
            You are in view-only mode. Click the "Back to List" button to return or use Edit to make changes.
          </AlertDescription>
        </Alert>
      )}

      {/* Form */}
      <Card className="border-purple-200" style={{gap: "0px"}}>
        <CardHeader className="bg-purple-50">
          <CardTitle className="text-purple-900">Port Information</CardTitle>
        </CardHeader>
        <CardContent className="rounded-b-2xl bg-white p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Venue */}
            <div className="space-y-2">
              <Label htmlFor="venue" className="text-purple-900">
                Venue <span className="text-red-500">*</span>
              </Label>
              <Select 
                value={formData.venueId} 
                onValueChange={(value) => handleInputChange('venueId', value)}
                disabled={isViewMode}
              >
                <SelectTrigger className="border-purple-200">
                  <SelectValue placeholder="Select Venue" />
                </SelectTrigger>
                <SelectContent>
                  {mockVenues.map(venue => (
                    <SelectItem key={venue.id} value={venue.id}>{venue.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Port Name */}
            <div className="space-y-2">
              <Label htmlFor="portName" className="text-purple-900">
                Port Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="portName"
                value={formData.portName}
                onChange={(e) => handleInputChange('portName', e.target.value)}
                placeholder="Enter port name"
                className="border-purple-200"
                disabled={isViewMode}
              />
            </div>

            {/* Port Name (Arabic) */}
            <div className="space-y-2">
              <Label htmlFor="portNameArabic" className="text-purple-900">
                Port Name (Arabic)
              </Label>
              <Input
                id="portNameArabic"
                value={formData.portNameArabic}
                onChange={(e) => handleInputChange('portNameArabic', e.target.value)}
                placeholder="اسم المنفذ بالعربي"
                className="text-right border-purple-200"
                dir="rtl"
                disabled={isViewMode}
              />
            </div>

            {/* Port Short Name */}
            <div className="space-y-2">
              <Label htmlFor="portShortName" className="text-purple-900">
                Port Short Name
              </Label>
              <Input
                id="portShortName"
                value={formData.portShortName}
                onChange={(e) => handleInputChange('portShortName', e.target.value)}
                placeholder="Enter short name"
                className="border-purple-200"
                disabled={isViewMode}
              />
            </div>

            {/* Arrival Short Name */}
            <div className="space-y-2">
              <Label htmlFor="arrivalShortName" className="text-purple-900">
                Arrival Short Name
              </Label>
              <Input
                id="arrivalShortName"
                value={formData.arrivalShortName}
                onChange={(e) => handleInputChange('arrivalShortName', e.target.value)}
                placeholder="Enter arrival short name"
                className="border-purple-200"
                disabled={isViewMode}
              />
            </div>

            {/* Departure Short Name */}
            <div className="space-y-2">
              <Label htmlFor="departureShortName" className="text-purple-900">
                Departure Short Name
              </Label>
              <Input
                id="departureShortName"
                value={formData.departureShortName}
                onChange={(e) => handleInputChange('departureShortName', e.target.value)}
                placeholder="Enter departure short name"
                className="border-purple-200"
                disabled={isViewMode}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charges Section */}
      <Card className="border-purple-200" style={{ gap: "0px" }}>
        <CardHeader className="bg-purple-50">
          <CardTitle className="text-purple-900">Port Charges</CardTitle>
        </CardHeader>
        <CardContent className="rounded-b-2xl bg-white p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Arrival Senior Charges */}
            <div className="space-y-2">
              <Label htmlFor="arrivalSeniorCharges" className="text-purple-900">
                Arrival Senior Charges
              </Label>
              <Input
                id="arrivalSeniorCharges"
                type="number"
                value={formData.arrivalSeniorCharges}
                onChange={(e) => handleInputChange('arrivalSeniorCharges', Number(e.target.value))}
                placeholder="0"
                className="border-purple-200"
                disabled={isViewMode}
              />
            </div>

            {/* Departure Senior Charges */}
            <div className="space-y-2">
              <Label htmlFor="departureSeniorCharges" className="text-purple-900">
                Departure Senior Charges
              </Label>
              <Input
                id="departureSeniorCharges"
                type="number"
                value={formData.departureSeniorCharges}
                onChange={(e) => handleInputChange('departureSeniorCharges', Number(e.target.value))}
                placeholder="0"
                className="border-purple-200"
                disabled={isViewMode}
              />
            </div>

            {/* Arrival Adult Charges */}
            <div className="space-y-2">
              <Label htmlFor="arrivalAdultCharges" className="text-purple-900">
                Arrival Adult Charges
              </Label>
              <Input
                id="arrivalAdultCharges"
                type="number"
                value={formData.arrivalAdultCharges}
                onChange={(e) => handleInputChange('arrivalAdultCharges', Number(e.target.value))}
                placeholder="0"
                className="border-purple-200"
                disabled={isViewMode}
              />
            </div>

            {/* Departure Adult Charges */}
            <div className="space-y-2">
              <Label htmlFor="departureAdultCharges" className="text-purple-900">
                Departure Adult Charges
              </Label>
              <Input
                id="departureAdultCharges"
                type="number"
                value={formData.departureAdultCharges}
                onChange={(e) => handleInputChange('departureAdultCharges', Number(e.target.value))}
                placeholder="0"
                className="border-purple-200"
                disabled={isViewMode}
              />
            </div>

            {/* Arrival Child Charges */}
            <div className="space-y-2">
              <Label htmlFor="arrivalChildCharges" className="text-purple-900">
                Arrival Child Charges
              </Label>
              <Input
                id="arrivalChildCharges"
                type="number"
                value={formData.arrivalChildCharges}
                onChange={(e) => handleInputChange('arrivalChildCharges', Number(e.target.value))}
                placeholder="0"
                className="border-purple-200"
                disabled={isViewMode}
              />
            </div>

            {/* Departure Child Charges */}
            <div className="space-y-2">
              <Label htmlFor="departureChildCharges" className="text-purple-900">
                Departure Child Charges
              </Label>
              <Input
                id="departureChildCharges"
                type="number"
                value={formData.departureChildCharges}
                onChange={(e) => handleInputChange('departureChildCharges', Number(e.target.value))}
                placeholder="0"
                className="border-purple-200"
                disabled={isViewMode}
              />
            </div>

            {/* Arrival Infant Charges */}
            <div className="space-y-2">
              <Label htmlFor="arrivalInfantCharges" className="text-purple-900">
                Arrival Infant Charges
              </Label>
              <Input
                id="arrivalInfantCharges"
                type="number"
                value={formData.arrivalInfantCharges}
                onChange={(e) => handleInputChange('arrivalInfantCharges', Number(e.target.value))}
                placeholder="0"
                className="border-purple-200"
                disabled={isViewMode}
              />
            </div>

            {/* Departure Infant Charges */}
            <div className="space-y-2">
              <Label htmlFor="departureInfantCharges" className="text-purple-900">
                Departure Infant Charges
              </Label>
              <Input
                id="departureInfantCharges"
                type="number"
                value={formData.departureInfantCharges}
                onChange={(e) => handleInputChange('departureInfantCharges', Number(e.target.value))}
                placeholder="0"
                className="border-purple-200"
                disabled={isViewMode}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Visa Letter Section */}
      <Card className="border-purple-200" style={{ gap: "0px" }}>
        <CardHeader className="bg-purple-50">
          <CardTitle className="text-purple-900">Visa Letter Information</CardTitle>
        </CardHeader>
        <CardContent className="rounded-b-2xl bg-white p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Visa Letter Text */}
            <div className="space-y-2">
              <Label htmlFor="visaLetterText" className="text-purple-900">
                Visa Letter Text
              </Label>
              <Input
                id="visaLetterText"
                value={formData.visaLetterText}
                onChange={(e) => handleInputChange('visaLetterText', e.target.value)}
                placeholder="Enter visa letter text"
                className="border-purple-200"
                disabled={isViewMode}
              />
            </div>

            {/* Visa Letter Image Upload */}
            <div className="space-y-2">
              <Label htmlFor="visaLetterImage" className="text-purple-900">
                Visa Letter Image
              </Label>
              <div className="flex gap-2">
                <Input
                  id="visaLetterImageName"
                  value={formData.visaLetterImageName}
                  placeholder="Please add name with image extension"
                  readOnly
                  className="flex-1 border-purple-200"
                />
                {!isViewMode && (
                  <Button
                    type="button"
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                    onClick={() => document.getElementById('fileInput')?.click()}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload
                  </Button>
                )}
                <input
                  id="fileInput"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </div>
              <p className="text-xs text-purple-600">
                Upload Visa Letter Image. File size should not be more than 3 MB.
              </p>
            </div>
          </div>

          {/* Checkboxes */}
          <div className="flex items-center gap-8 mt-6">
            <div className="flex items-center gap-2">
              <Checkbox
                id="blockIndefinitely"
                checked={formData.blockIndefinitely}
                onCheckedChange={(checked) => handleInputChange('blockIndefinitely', checked)}
                disabled={isViewMode}
              />
              <Label htmlFor="blockIndefinitely" className="cursor-pointer text-purple-900">
                Block Indefinitely
              </Label>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => handleInputChange('isActive', checked)}
                disabled={isViewMode}
              />
              <Label htmlFor="isActive" className="cursor-pointer text-purple-900">
                Is Active ?
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Block Dates Section */}
      <Card className="border-purple-200" style={{ gap: "0px" }}>
        <CardHeader className="bg-purple-50">
          <div className="flex items-center justify-between">
            <CardTitle className="text-purple-900">Block Dates</CardTitle>
            {!isViewMode && (
              <Button
                type="button"
                size="sm"
                className="bg-purple-600 hover:bg-purple-700 text-white"
                onClick={() => setShowBlockDateDialog(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Block Dates
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="rounded-b-2xl bg-white p-6">
          {formData.blockedDates.length > 0 ? (
            <div className="border border-purple-200 rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-purple-50">
                    <TableHead className="text-purple-900">From Date</TableHead>
                    <TableHead className="text-purple-900">From Time</TableHead>
                    <TableHead className="text-purple-900">To Date</TableHead>
                    <TableHead className="text-purple-900">To Time</TableHead>
                    <TableHead className="text-purple-900">Reason</TableHead>
                    {!isViewMode && (
                      <TableHead className="text-purple-900 text-right">Action</TableHead>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {formData.blockedDates.map((blockDate) => (
                    <TableRow key={blockDate.id}>
                      <TableCell className="text-purple-900">{blockDate.fromDate}</TableCell>
                      <TableCell className="text-purple-900">{blockDate.fromTime || 'N/A'}</TableCell>
                      <TableCell className="text-purple-900">{blockDate.toDate}</TableCell>
                      <TableCell className="text-purple-900">{blockDate.toTime || 'N/A'}</TableCell>
                      <TableCell className="text-purple-900">{blockDate.reason}</TableCell>
                      {!isViewMode && (
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveBlockDate(blockDate.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-100"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-center text-purple-400 py-8">No blocked dates configured</p>
          )}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      {!isViewMode && (
        <div className="flex gap-3">
          <Button 
            onClick={handleSave} 
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            {mode === 'edit' ? 'Update Port' : 'Save Port'}
          </Button>
          <Button 
            variant="outline" 
            onClick={onBack}
            className="border-purple-200 text-purple-600 hover:bg-purple-50"
          >
            Cancel
          </Button>
        </div>
      )}

      {/* Add Block Date Dialog */}
      <Dialog open={showBlockDateDialog} onOpenChange={setShowBlockDateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-purple-900">Add Block Date</DialogTitle>
            <DialogDescription>
              Add a date range to block this port
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="fromDate" className="text-purple-900">From Date</Label>
              <Input
                id="fromDate"
                type="date"
                value={newBlockDate.fromDate}
                onChange={(e) => setNewBlockDate(prev => ({ ...prev, fromDate: e.target.value }))}
                className="border-purple-200"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="toDate" className="text-purple-900">To Date</Label>
              <Input
                id="toDate"
                type="date"
                value={newBlockDate.toDate}
                onChange={(e) => setNewBlockDate(prev => ({ ...prev, toDate: e.target.value }))}
                className="border-purple-200"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fromTime" className="text-purple-900">From Time</Label>
              <Input
                id="fromTime"
                type="time"
                value={newBlockDate.fromTime}
                onChange={(e) => setNewBlockDate(prev => ({ ...prev, fromTime: e.target.value }))}
                className="border-purple-200"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="toTime" className="text-purple-900">To Time</Label>
              <Input
                id="toTime"
                type="time"
                value={newBlockDate.toTime}
                onChange={(e) => setNewBlockDate(prev => ({ ...prev, toTime: e.target.value }))}
                className="border-purple-200"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reason" className="text-purple-900">Reason</Label>
              <Input
                id="reason"
                value={newBlockDate.reason}
                onChange={(e) => setNewBlockDate(prev => ({ ...prev, reason: e.target.value }))}
                placeholder="Enter reason for blocking"
                className="border-purple-200"
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowBlockDateDialog(false)}
              className="border-purple-200"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleAddBlockDate} 
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              Add Block Date
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};