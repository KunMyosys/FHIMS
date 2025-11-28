import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Switch } from "../ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { ArrowLeft, Save, Plus, Trash2, Edit2, X } from "lucide-react";
import { toast } from "sonner";

interface VenueBlock {
  id: string;
  blockType: "absolute" | "festival";
  fromDate: string;
  toDate: string;
  arrivalBlockTime?: string;
  departureBlockTime?: string;
  remark: string;
}

interface VenueFormData {
  venueName: string;
  description: string;
  notification: string;
  contactNo: string;
  email: string;
  cutoffDays: number;
  systemTimelineDays: number;
  postCutoffDays: number;
  timeZone: string;
  isActive: boolean;
  blocks: VenueBlock[];
}

const timeZones = [
  { value: "1", label: "GMT+1" },
  { value: "2", label: "GMT+2" },
  { value: "3", label: "GMT+3 (Baghdad, Kuwait, Riyadh)" },
  { value: "3.5", label: "GMT+3:30 (Tehran)" },
  { value: "4", label: "GMT+4 (Dubai)" },
  { value: "5", label: "GMT+5 (Karachi)" },
  { value: "5.5", label: "GMT+5:30 (Kolkata)" },
];

interface VenueMasterFormPageProps {
  onBack: () => void;
  editMode?: boolean;
  initialData?: VenueFormData;
}

export const VenueMasterFormPage = ({
  onBack,
  editMode = false,
  initialData,
}: VenueMasterFormPageProps) => {
  // Initialize with example data
  const [formData, setFormData] = useState<VenueFormData>(
    initialData || {
      venueName: "IRAQ",
      description: "",
      notification: "",
      contactNo: "0",
      email: "support@najafkarbala.com",
      cutoffDays: 10,
      systemTimelineDays: 183,
      postCutoffDays: 11,
      timeZone: "3",
      isActive: true,
      blocks: [
        {
          id: "block-1",
          blockType: "absolute",
          fromDate: "2016-05-20",
          toDate: "2016-05-23",
          arrivalBlockTime: "",
          departureBlockTime: "",
          remark: "Shabaniya",
        },
        {
          id: "block-2",
          blockType: "absolute",
          fromDate: "2016-06-02",
          toDate: "2016-07-09",
          arrivalBlockTime: "",
          departureBlockTime: "",
          remark: "Ramazan",
        },
        {
          id: "block-3",
          blockType: "absolute",
          fromDate: "2016-09-29",
          toDate: "2016-10-13",
          arrivalBlockTime: "",
          departureBlockTime: "",
          remark: "Ashara",
        },
        {
          id: "block-4",
          blockType: "absolute",
          fromDate: "2016-11-15",
          toDate: "2016-11-24",
          arrivalBlockTime: "",
          departureBlockTime: "",
          remark: "Chellum",
        },
        {
          id: "block-5",
          blockType: "festival",
          fromDate: "2016-02-16",
          toDate: "2016-02-16",
          arrivalBlockTime: "14:00",
          departureBlockTime: "23:59",
          remark: "Shahadat - Moulatena Fatema",
        },
      ],
    }
  );

  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [editingBlockId, setEditingBlockId] = useState<string | null>(null);

  // Update form field
  const updateField = (field: keyof VenueFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Add new block
  const handleAddBlock = () => {
    const newBlock: VenueBlock = {
      id: `block-${Date.now()}`,
      blockType: "absolute",
      fromDate: "",
      toDate: "",
      arrivalBlockTime: "",
      departureBlockTime: "",
      remark: "",
    };
    setFormData((prev) => ({
      ...prev,
      blocks: [...prev.blocks, newBlock],
    }));
    setEditingBlockId(newBlock.id);
  };

  // Update block
  const handleUpdateBlock = (
    blockId: string,
    field: keyof VenueBlock,
    value: any
  ) => {
    setFormData((prev) => ({
      ...prev,
      blocks: prev.blocks.map((block) =>
        block.id === blockId ? { ...block, [field]: value } : block
      ),
    }));
  };

  // Delete block
  //   const handleDeleteBlock = (blockId: string) => {
  //     if (confirm('Are you sure you want to delete this block?')) {
  //       setFormData(prev => ({
  //         ...prev,
  //         blocks: prev.blocks.filter(block => block.id !== blockId)
  //       }));
  //       toast.success('Block deleted successfully');
  //     }
  //   };

  // Format date for display (DD-MM-YYYY)
  const formatDateDisplay = (dateString: string): string => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Format time for display (HH:MM AM/PM)
  const formatTimeDisplay = (time: string): string => {
    if (!time) return "-";
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${String(displayHour).padStart(2, "0")}:${minutes} ${ampm}`;
  };

  // Validate form
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    // Venue Name
    if (!formData.venueName.trim()) {
      errors.venueName = "Venue name is required";
    }

    // Email
    if (!formData.email.trim()) {
      errors.email = "Email address is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        errors.email = "Please enter a valid email address";
      }
    }

    // Cutoff Days
    if (formData.cutoffDays < 0) {
      errors.cutoffDays = "Cutoff days cannot be negative";
    }

    // System Timeline Days
    if (formData.systemTimelineDays < 0) {
      errors.systemTimelineDays = "System timeline days cannot be negative";
    }

    // Post Cutoff Days
    if (formData.postCutoffDays < 0) {
      errors.postCutoffDays = "Post cutoff days cannot be negative";
    }

    // Time Zone
    if (!formData.timeZone) {
      errors.timeZone = "Time zone is required";
    }

    // Validate blocks
    formData.blocks.forEach((block, index) => {
      if (!block.fromDate) {
        errors[`block_${block.id}_fromDate`] =
          `Block ${index + 1}: From Date is required`;
      }
      if (!block.toDate) {
        errors[`block_${block.id}_toDate`] =
          `Block ${index + 1}: To Date is required`;
      }
      if (
        block.fromDate &&
        block.toDate &&
        new Date(block.toDate) < new Date(block.fromDate)
      ) {
        errors[`block_${block.id}_toDate`] =
          `Block ${index + 1}: To Date must be after From Date`;
      }
      if (block.blockType === "festival") {
        if (!block.arrivalBlockTime) {
          errors[`block_${block.id}_arrivalTime`] =
            `Block ${index + 1}: Arrival time required for festival blocks`;
        }
        if (!block.departureBlockTime) {
          errors[`block_${block.id}_departureTime`] =
            `Block ${index + 1}: Departure time required for festival blocks`;
        }
      }
      if (!block.remark.trim()) {
        errors[`block_${block.id}_remark`] =
          `Block ${index + 1}: Remark is required`;
      }
    });

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Save venue
  const handleSave = () => {
    if (!validateForm()) {
      toast.error("Please fix validation errors before saving");
      return;
    }

    // Here you would normally save to backend
    console.log("Saving venue:", formData);
    toast.success(
      editMode ? "Venue updated successfully" : "Venue created successfully"
    );

    // Navigate back to list
    setTimeout(() => {
      onBack();
    }, 1000);
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={onBack}
            className="hover:bg-[#5B9BD5]/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" style={{ color: "#5B9BD5" }} />
            <span style={{ color: "#5B9BD5" }}>Back to Venue Master</span>
          </Button>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onBack}
            className="border-gray-300"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            style={{ backgroundColor: "#5B9BD5" }}
            className="text-white"
          >
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
        </div>
      </div>

      {/* Form Card */}
      <Card className="border-[#5B9BD5]/30">
        <CardContent className="pt-6">
          <div className="space-y-6">
            {/* Row 1: Venue Name, Notification, Contact No */}
            <div className="grid grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label>
                  Venue Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  placeholder="IRAQ"
                  value={formData.venueName}
                  onChange={(e) => updateField("venueName", e.target.value)}
                  className={
                    validationErrors.venueName
                      ? "border-red-500"
                      : "border-gray-300"
                  }
                />
                {validationErrors.venueName && (
                  <p className="text-xs text-red-600">
                    {validationErrors.venueName}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Notification</Label>
                <Textarea
                  placeholder="Enter notification..."
                  value={formData.notification}
                  onChange={(e) => updateField("notification", e.target.value)}
                  className="border-gray-300"
                  rows={1}
                />
              </div>

              <div className="space-y-2">
                <Label>Contact No</Label>
                <Input
                  placeholder="0"
                  value={formData.contactNo}
                  onChange={(e) => updateField("contactNo", e.target.value)}
                  className="border-gray-300"
                />
              </div>
            </div>

            {/* Row 2: Email, Cutoff Days, System Timeline Days, Post Cutoff Days */}
            <div className="grid grid-cols-4 gap-6">
              <div className="space-y-2">
                <Label>
                  Email Address <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="email"
                  placeholder="support@najafkarbala.com"
                  value={formData.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  className={
                    validationErrors.email
                      ? "border-red-500"
                      : "border-gray-300"
                  }
                />
                {validationErrors.email && (
                  <p className="text-xs text-red-600">
                    {validationErrors.email}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>
                  Cut Off Days <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="number"
                  min="0"
                  placeholder="10"
                  value={formData.cutoffDays}
                  onChange={(e) =>
                    updateField("cutoffDays", parseInt(e.target.value) || 0)
                  }
                  className={
                    validationErrors.cutoffDays
                      ? "border-red-500"
                      : "border-gray-300"
                  }
                />
                {validationErrors.cutoffDays && (
                  <p className="text-xs text-red-600">
                    {validationErrors.cutoffDays}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>
                  System Time Line Days <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="number"
                  min="0"
                  placeholder="183"
                  value={formData.systemTimelineDays}
                  onChange={(e) =>
                    updateField(
                      "systemTimelineDays",
                      parseInt(e.target.value) || 0
                    )
                  }
                  className={
                    validationErrors.systemTimelineDays
                      ? "border-red-500"
                      : "border-gray-300"
                  }
                />
                {validationErrors.systemTimelineDays && (
                  <p className="text-xs text-red-600">
                    {validationErrors.systemTimelineDays}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>
                  Post Cut Off Days <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="number"
                  min="0"
                  placeholder="11"
                  value={formData.postCutoffDays}
                  onChange={(e) =>
                    updateField("postCutoffDays", parseInt(e.target.value) || 0)
                  }
                  className={
                    validationErrors.postCutoffDays
                      ? "border-red-500"
                      : "border-gray-300"
                  }
                />
                {validationErrors.postCutoffDays && (
                  <p className="text-xs text-red-600">
                    {validationErrors.postCutoffDays}
                  </p>
                )}
              </div>
            </div>

            {/* Row 3: Time Zone, Is Active */}
            <div className="grid grid-cols-4 gap-6">
              <div className="space-y-2">
                <Label>Time Zone</Label>
                <Select
                  value={formData.timeZone}
                  onValueChange={(value) => updateField("timeZone", value)}
                >
                  <SelectTrigger
                    className={
                      validationErrors.timeZone
                        ? "border-red-500"
                        : "border-gray-300"
                    }
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {timeZones.map((tz) => (
                      <SelectItem key={tz.value} value={tz.value}>
                        {tz.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {validationErrors.timeZone && (
                  <p className="text-xs text-red-600">
                    {validationErrors.timeZone}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Is Active ?</Label>
                <div className="flex items-center h-10">
                  <Switch
                    checked={formData.isActive}
                    onCheckedChange={(checked) =>
                      updateField("isActive", checked)
                    }
                  />
                  <span className="ml-2 text-sm text-gray-600">
                    {formData.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Block Management Section */}
      <Card className="border-[#5B9BD5]/30">
        <CardContent className="pt-6">
          <div className="space-y-4">
            {/* Add Block Button */}
            <div className="flex justify-end">
              <Button
                onClick={handleAddBlock}
                style={{ backgroundColor: "#5B9BD5" }}
                className="text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add New Block
              </Button>
            </div>

            {/* Blocks Table */}
            {formData.blocks.length > 0 ? (
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow style={{ backgroundColor: "#1e3a5f" }}>
                        <TableHead className="text-white">Block Type</TableHead>
                        <TableHead className="text-white">From Date</TableHead>
                        <TableHead className="text-white">To Date</TableHead>
                        <TableHead className="text-white">
                          Arrival Block
                        </TableHead>
                        <TableHead className="text-white">
                          Departure Block
                        </TableHead>
                        <TableHead className="text-white">Remark</TableHead>
                        <TableHead className="text-white text-center">
                          Action
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {formData.blocks.map((block) => (
                        <TableRow key={block.id} className="hover:bg-gray-50">
                          {editingBlockId === block.id ? (
                            // Edit Mode
                            <>
                              <TableCell>
                                <Select
                                  value={block.blockType}
                                  onValueChange={(
                                    value: "absolute" | "festival"
                                  ) =>
                                    handleUpdateBlock(
                                      block.id,
                                      "blockType",
                                      value
                                    )
                                  }
                                >
                                  <SelectTrigger className="w-[150px]">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="absolute">
                                      Absolute Block
                                    </SelectItem>
                                    <SelectItem value="festival">
                                      Festival Block
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </TableCell>
                              <TableCell>
                                <Input
                                  type="date"
                                  value={block.fromDate}
                                  onChange={(e) =>
                                    handleUpdateBlock(
                                      block.id,
                                      "fromDate",
                                      e.target.value
                                    )
                                  }
                                  className="w-[150px]"
                                />
                              </TableCell>
                              <TableCell>
                                <Input
                                  type="date"
                                  value={block.toDate}
                                  onChange={(e) =>
                                    handleUpdateBlock(
                                      block.id,
                                      "toDate",
                                      e.target.value
                                    )
                                  }
                                  className="w-[150px]"
                                />
                              </TableCell>
                              <TableCell>
                                <Input
                                  type="time"
                                  value={block.arrivalBlockTime}
                                  onChange={(e) =>
                                    handleUpdateBlock(
                                      block.id,
                                      "arrivalBlockTime",
                                      e.target.value
                                    )
                                  }
                                  disabled={block.blockType === "absolute"}
                                  className="w-[120px]"
                                />
                              </TableCell>
                              <TableCell>
                                <Input
                                  type="time"
                                  value={block.departureBlockTime}
                                  onChange={(e) =>
                                    handleUpdateBlock(
                                      block.id,
                                      "departureBlockTime",
                                      e.target.value
                                    )
                                  }
                                  disabled={block.blockType === "absolute"}
                                  className="w-[120px]"
                                />
                              </TableCell>
                              <TableCell>
                                <Input
                                  placeholder="Remark..."
                                  value={block.remark}
                                  onChange={(e) =>
                                    handleUpdateBlock(
                                      block.id,
                                      "remark",
                                      e.target.value
                                    )
                                  }
                                  className="w-[200px]"
                                />
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center justify-center gap-2">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => setEditingBlockId(null)}
                                    className="text-gray-600 hover:text-gray-900"
                                  >
                                    <X className="w-4 h-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </>
                          ) : (
                            // View Mode
                            <>
                              <TableCell>
                                <span
                                  className={
                                    block.blockType === "absolute"
                                      ? "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700"
                                      : "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700"
                                  }
                                >
                                  {block.blockType === "absolute"
                                    ? "Absolute Block"
                                    : "Festival Block"}
                                </span>
                              </TableCell>
                              <TableCell className="text-gray-900">
                                {formatDateDisplay(block.fromDate)}
                              </TableCell>
                              <TableCell className="text-gray-900">
                                {formatDateDisplay(block.toDate)}
                              </TableCell>
                              <TableCell className="text-gray-700">
                                {block.blockType === "festival" &&
                                block.arrivalBlockTime
                                  ? formatTimeDisplay(block.arrivalBlockTime)
                                  : "-"}
                              </TableCell>
                              <TableCell className="text-gray-700">
                                {block.blockType === "festival" &&
                                block.departureBlockTime
                                  ? formatTimeDisplay(block.departureBlockTime)
                                  : "-"}
                              </TableCell>
                              <TableCell className="text-gray-900">
                                {block.remark}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center justify-center gap-2">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => setEditingBlockId(block.id)}
                                    style={{ color: "#5B9BD5" }}
                                    className="hover:bg-blue-50"
                                  >
                                    <Edit2 className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    // onClick={() => handleDeleteBlock(block.id)}
                                    className="text-red-600 hover:bg-red-50"
                                  >
                                    <X className="w-4 h-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </>
                          )}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg">
                <p className="text-gray-600 mb-2">No blocks configured</p>
                <p className="text-sm text-gray-500">
                  Click "Add New Block" to create your first block
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Bottom Action Bar */}
      <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <div className="text-sm text-gray-600">
          {Object.keys(validationErrors).length > 0 && (
            <span className="text-red-600">
              ⚠️ Please fix {Object.keys(validationErrors).length} validation
              error(s)
            </span>
          )}
          {Object.keys(validationErrors).length === 0 && (
            <span className="text-green-600">✅ Ready to save</span>
          )}
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onBack}
            className="border-gray-300"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            style={{ backgroundColor: "#5B9BD5" }}
            className="text-white"
          >
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};
