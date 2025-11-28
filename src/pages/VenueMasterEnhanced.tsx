import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";
import { VenueMasterFormPage } from "./VenueMasterFormPage";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Building2,
  MapPin,
  Clock,
  AlertCircle,
  Ban,
  Calendar,
  Mail,
  Phone,
  Globe,
  Save,
  X,
  CalendarX,
  CalendarDays,
} from "lucide-react";
import { toast } from "sonner";
import { Switch } from "../ui/switch";

interface VenueBlock {
  id: string;
  blockType: "absolute" | "festival";
  fromDate: string;
  toDate: string;
  arrivalBlockTime?: string;
  departureBlockTime?: string;
  remark: string;
}

interface Venue {
  id: string;
  name: string;
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
  { value: "Asia/Baghdad", label: "Asia/Baghdad (GMT+3)" },
  { value: "Asia/Kuwait", label: "Asia/Kuwait (GMT+3)" },
  { value: "Asia/Riyadh", label: "Asia/Riyadh (GMT+3)" },
  { value: "Asia/Dubai", label: "Asia/Dubai (GMT+4)" },
  { value: "Asia/Tehran", label: "Asia/Tehran (GMT+3:30)" },
  { value: "Asia/Karachi", label: "Asia/Karachi (GMT+5)" },
  { value: "Asia/Kolkata", label: "Asia/Kolkata (GMT+5:30)" },
];

export const VenueMasterEnhanced = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [activeTab, setActiveTab] = useState("list");
  const [viewMode, setViewMode] = useState<"list" | "form">("list");

  // Block management
  const [isBlockDialogOpen, setIsBlockDialogOpen] = useState(false);
  const [currentVenueForBlock, setCurrentVenueForBlock] =
    useState<Venue | null>(null);
  const [blockForm, setBlockForm] = useState<Partial<VenueBlock>>({
    blockType: "absolute",
    fromDate: "",
    toDate: "",
    arrivalBlockTime: "",
    departureBlockTime: "",
    remark: "",
  });

  const [venues, setVenues] = useState<Venue[]>([
    {
      id: "1",
      name: "Karbala",
      description: "Holy city of Karbala with Imam Hussain Shrine",
      notification:
        "Peak season from Muharram 1-10. Early booking recommended.",
      contactNo: "+964 32 123 4567",
      email: "karbala@fhims.iq",
      cutoffDays: 10,
      systemTimelineDays: 15,
      postCutoffDays: 5,
      timeZone: "Asia/Baghdad",
      isActive: true,
      blocks: [
        {
          id: "b1",
          blockType: "absolute",
          fromDate: "2025-05-20",
          toDate: "2025-05-23",
          remark: "Arbaeen preparation period - No tours allowed",
        },
        {
          id: "b2",
          blockType: "festival",
          fromDate: "2025-06-15",
          toDate: "2025-06-15",
          arrivalBlockTime: "14:00",
          departureBlockTime: "23:59",
          remark: "Shahadat Imam Ali - Limited flight timings",
        },
      ],
    },
    {
      id: "2",
      name: "Najaf",
      description: "Holy city of Najaf with Imam Ali Shrine",
      notification: "Visa processing takes 10-15 days",
      contactNo: "+964 33 234 5678",
      email: "najaf@fhims.iq",
      cutoffDays: 10,
      systemTimelineDays: 15,
      postCutoffDays: 5,
      timeZone: "Asia/Baghdad",
      isActive: true,
      blocks: [],
    },
  ]);

  const [formData, setFormData] = useState<Partial<Venue>>({
    name: "",
    description: "",
    notification: "",
    contactNo: "",
    email: "",
    cutoffDays: 10,
    systemTimelineDays: 15,
    postCutoffDays: 5,
    timeZone: "Asia/Baghdad",
    isActive: true,
    blocks: [],
  });

  const filteredVenues = venues.filter(
    (venue) =>
      venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      venue.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenForm = (venue?: Venue) => {
    if (venue) {
      setIsEditMode(true);
      setSelectedVenue(venue);
    } else {
      setIsEditMode(false);
      setSelectedVenue(null);
    }
    setViewMode("form");
  };

  const handleBackToList = () => {
    setViewMode("list");
    setIsEditMode(false);
    setSelectedVenue(null);
  };

  const handleSaveVenue = () => {
    if (!formData.name || !formData.email || !formData.contactNo) {
      toast.error("Please fill all required fields");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    // Phone validation (8-15 digits)
    const phoneRegex = /^\+?[0-9]{8,15}$/;
    if (!phoneRegex.test(formData.contactNo.replace(/\s/g, ""))) {
      toast.error("Contact number must be 8-15 digits");
      return;
    }

    if (isEditMode && selectedVenue) {
      setVenues(
        venues.map((v) =>
          v.id === selectedVenue.id ? ({ ...v, ...formData } as Venue) : v
        )
      );
      toast.success("Venue updated successfully");
    } else {
      const newVenue: Venue = {
        // id: Date.now().toString(),
        ...(formData as Venue),
      };
      setVenues([...venues, newVenue]);
      toast.success("Venue added successfully");
    }
    setIsAddDialogOpen(false);
  };

  //   const handleDeleteVenue = (venueId: string) => {
  //     if (confirm('Are you sure you want to delete this venue?')) {
  //       setVenues(venues.filter(v => v.id !== venueId));
  //       toast.success('Venue deleted successfully');
  //     }
  //   };

  const Pill = ({
    color,
    children,
  }: {
    color: string;
    children: React.ReactNode;
  }) => {
    const colors: any = {
      blue: "bg-[#DDEBFF] text-[#1E63C3]", // Cutoff Days
      purple: "bg-[#F4E8FF] text-[#7A3BD3]", // System Timeline
      amber: "bg-[#FFE9C2] text-[#C47E06]", // Post Cutoff
      red: "bg-[#FFE1E1] text-[#D23A3A]", // Absolute block
      orange: "bg-[#FFEACC] text-[#D26A00]", // Festival block
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold ${colors[color]}`}
      >
        {children}
      </span>
    );
  };

  const handleOpenBlockDialog = (venue: Venue) => {
    setCurrentVenueForBlock(venue);
    setBlockForm({
      blockType: "absolute",
      fromDate: "",
      toDate: "",
      arrivalBlockTime: "",
      departureBlockTime: "",
      remark: "",
    });
    setIsBlockDialogOpen(true);
  };

  const handleSaveBlock = () => {
    if (!blockForm.fromDate || !blockForm.toDate || !blockForm.remark) {
      toast.error("Please fill all required fields");
      return;
    }

    if (new Date(blockForm.toDate) < new Date(blockForm.fromDate)) {
      toast.error("To Date must be greater than or equal to From Date");
      return;
    }

    if (
      blockForm.blockType === "festival" &&
      (!blockForm.arrivalBlockTime || !blockForm.departureBlockTime)
    ) {
      toast.error(
        "Please specify arrival and departure block times for festival blocks"
      );
      return;
    }

    if (currentVenueForBlock) {
      const newBlock: VenueBlock = {
        id: `block-${Date.now()}`,
        blockType: blockForm.blockType!,
        fromDate: blockForm.fromDate,
        toDate: blockForm.toDate,
        arrivalBlockTime: blockForm.arrivalBlockTime,
        departureBlockTime: blockForm.departureBlockTime,
        remark: blockForm.remark!,
      };

      setVenues(
        venues.map((v) =>
          v.id === currentVenueForBlock.id
            ? { ...v, blocks: [...v.blocks, newBlock] }
            : v
        )
      );

      toast.success("Block added successfully");
      setIsBlockDialogOpen(false);
    }
  };

  //   const handleDeleteBlock = (venueId: string, blockId: string) => {
  //     if (confirm('Are you sure you want to delete this block?')) {
  //       setVenues(venues.map(v =>
  //         v.id === venueId
  //           ? { ...v, blocks: v.blocks.filter(b => b.id !== blockId) }
  //           : v
  //       ));
  //       toast.success('Block deleted successfully');
  //     }
  //   };

  const StatusPill = ({ active }: { active: boolean }) => (
    <span
      className={
        active
          ? "px-3 py-1 rounded-full text-xs font-semibold bg-[#D9F5D9] text-[#2B7F2B]"
          : "px-3 py-1 rounded-full text-xs font-semibold bg-gray-200 text-gray-700"
      }
    >
      {active ? "Active" : "Inactive"}
    </span>
  );

  const getBlockBadge = (blockType: "absolute" | "festival") => {
    if (blockType === "absolute") {
      return (
        <BlockPill
          bgClass="bg-red-100"
          textClass="text-red-700"
          dotClass="bg-red-600"
        >
          Absolute
        </BlockPill>
      );
    }

    // Festival badge (blue background + orange dot)
    return (
      <BlockPill
        bgClass="bg-orange-100"
        textClass="text-orange-700"
        dotClass="bg-orange-500"
      >
        Festival
      </BlockPill>
    );
  };

  const BlockPill = ({
    bgClass,
    textClass,
    dotClass,
    children,
  }: {
    bgClass: string;
    textClass: string;
    dotClass: string;
    children: React.ReactNode;
  }) => {
    return (
      <span
        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${bgClass} ${textClass}`}
      >
        <span className={`w-2 h-2 rounded-full ${dotClass}`} />
        {children}
      </span>
    );
  };

  // If in form mode, show the form page
  if (viewMode === "form") {
    return (
      <VenueMasterFormPage
        onBack={handleBackToList}
        editMode={isEditMode}
        initialData={
          selectedVenue
            ? {
                venueName: selectedVenue.name,
                description: selectedVenue.description,
                notification: selectedVenue.notification,
                contactNo: selectedVenue.contactNo,
                email: selectedVenue.email,
                cutoffDays: selectedVenue.cutoffDays,
                systemTimelineDays: selectedVenue.systemTimelineDays,
                postCutoffDays: selectedVenue.postCutoffDays,
                timeZone: selectedVenue.timeZone,
                isActive: selectedVenue.isActive,
                blocks: selectedVenue.blocks,
              }
            : undefined
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 style={{ color: "#5B9BD5" }} className="flex items-center gap-2">
            <Building2 className="w-6 h-6" />
            Venue Master
          </h1>
          <p className="text-gray-600 mt-1">
            Manage venues with cutoff days, time zones, and block configurations
          </p>
        </div>
        <Button
          onClick={() => handleOpenForm()}
          style={{ backgroundColor: "#5B9BD5" }}
          className="text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Venue
        </Button>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search venues..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-gray-300"
            />
          </div>
        </CardContent>
      </Card>

      {/* Venues Grid */}
      <div className="grid gap-6">
        {filteredVenues.map((venue) => (
          <Card key={venue.id} className="border-[#5B9BD5]/30">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#5B9BD5] to-purple-600 flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle style={{ color: "#5B9BD5" }}>
                      {venue.name}
                    </CardTitle>
                    <CardDescription>{venue.description}</CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <StatusPill active={venue.isActive} />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleOpenForm(venue)}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-600"
                    // onClick={() => handleDeleteVenue(venue.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pb-6">
              <Tabs defaultValue="info" className="w-full">
                <TabsList className="w-full bg-blue-50 rounded-full p-1">
                  <TabsTrigger
                    value="info"
                    className="rounded-full px-6 py-2 text-gray-500
    data-[state=active]:bg-white data-[state=active]:text-gray-900"
                  >
                    Venue Information
                  </TabsTrigger>

                  <TabsTrigger
                    value="blocks"
                    className="rounded-full px-6 py-2 text-gray-500 
    data-[state=active]:bg-white data-[state=active]:text-gray-900"
                  >
                    Block Management
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="info" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-600">Email:</span>
                        <span className="text-gray-900">{venue.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-600">Contact:</span>
                        <span className="text-gray-900">{venue.contactNo}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Globe className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-600">Time Zone:</span>
                        <span className="text-gray-900">{venue.timeZone}</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-600">Cutoff Days:</span>
                        <Pill color="blue">{venue.cutoffDays} days</Pill>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-600">System Timeline:</span>
                        <Badge className="bg-purple-100 text-purple-700">
                          {venue.systemTimelineDays} days
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CalendarDays className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-600">Post Cutoff:</span>
                        <Pill color="amber">{venue.postCutoffDays} days</Pill>
                      </div>
                    </div>
                  </div>
                  {venue.notification && (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                      <p className="text-sm text-amber-900">
                        <strong>Notification:</strong> {venue.notification}
                      </p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="blocks" className="space-y-4 mt-4">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-600">
                      {venue.blocks.length} block(s) configured
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleOpenBlockDialog(venue)}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Block
                    </Button>
                  </div>

                  {venue.blocks.length > 0 ? (
                    <div className="space-y-3">
                      {venue.blocks.map((block) => (
                        <Card key={block.id} className="border-gray-200">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="space-y-2 flex-1">
                                <div className="flex items-center gap-3">
                                  {getBlockBadge(block.blockType)}
                                  <span className="text-sm text-gray-900">
                                    {new Date(
                                      block.fromDate
                                    ).toLocaleDateString()}{" "}
                                    -{" "}
                                    {new Date(
                                      block.toDate
                                    ).toLocaleDateString()}
                                  </span>
                                </div>
                                {block.blockType === "festival" && (
                                  <div className="flex items-center gap-4 text-sm text-gray-600">
                                    <span>
                                      Arrival: {block.arrivalBlockTime}
                                    </span>
                                    <span>
                                      Departure: {block.departureBlockTime}
                                    </span>
                                  </div>
                                )}
                                <p className="text-sm text-gray-700">
                                  {block.remark}
                                </p>
                              </div>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-red-600"
                                // onClick={() => handleDeleteBlock(venue.id, block.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <CalendarX className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                      <p>No blocks configured</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add/Edit Venue Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle style={{ color: "#5B9BD5" }}>
              {isEditMode ? "Edit Venue" : "Add New Venue"}
            </DialogTitle>
            <DialogDescription>
              Configure venue details, cutoff days, and operational parameters
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>
                Venue Name <span className="text-red-500">*</span>
              </Label>
              <Input
                placeholder="e.g., Karbala"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                placeholder="Brief description of the venue"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label>Notification</Label>
              <Textarea
                placeholder="Special notifications or alerts for this venue"
                value={formData.notification}
                onChange={(e) =>
                  setFormData({ ...formData, notification: e.target.value })
                }
                rows={2}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>
                  Contact Number <span className="text-red-500">*</span>
                </Label>
                <Input
                  placeholder="+964 XX XXX XXXX"
                  value={formData.contactNo}
                  onChange={(e) =>
                    setFormData({ ...formData, contactNo: e.target.value })
                  }
                />
                <p className="text-xs text-gray-500">8-15 digits</p>
              </div>
              <div className="space-y-2">
                <Label>
                  Email Address <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="email"
                  placeholder="venue@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Cutoff Days</Label>
                <Input
                  type="number"
                  min="0"
                  value={formData.cutoffDays}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      cutoffDays: parseInt(e.target.value) || 0,
                    })
                  }
                />
                <p className="text-xs text-gray-500">Days before travel</p>
              </div>
              <div className="space-y-2">
                <Label>System Timeline Days</Label>
                <Input
                  type="number"
                  min="0"
                  value={formData.systemTimelineDays}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      systemTimelineDays: parseInt(e.target.value) || 0,
                    })
                  }
                />
                <p className="text-xs text-gray-500">Auto-notification days</p>
              </div>
              <div className="space-y-2">
                <Label>Post Cutoff Days</Label>
                <Input
                  type="number"
                  min="0"
                  value={formData.postCutoffDays}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      postCutoffDays: parseInt(e.target.value) || 0,
                    })
                  }
                />
                <p className="text-xs text-gray-500">Admin approval needed</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Time Zone</Label>
              <Select
                value={formData.timeZone}
                onValueChange={(value) =>
                  setFormData({ ...formData, timeZone: value })
                }
              >
                <SelectTrigger>
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
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                checked={formData.isActive}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, isActive: checked })
                }
              />
              <Label>Is Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button
              onClick={handleSaveVenue}
              style={{ backgroundColor: "#5B9BD5" }}
              className="text-white"
            >
              <Save className="w-4 h-4 mr-2" />
              {isEditMode ? "Update" : "Create"} Venue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Block Dialog */}
      <Dialog open={isBlockDialogOpen} onOpenChange={setIsBlockDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle style={{ color: "#5B9BD5" }}>
              Add Venue Block
            </DialogTitle>
            <DialogDescription>
              Configure absolute or festival blocks for{" "}
              {currentVenueForBlock?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>
                Block Type <span className="text-red-500">*</span>
              </Label>
              <Select
                value={blockForm.blockType}
                onValueChange={(value: "absolute" | "festival") =>
                  setBlockForm({ ...blockForm, blockType: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="absolute">
                    <Pill color="red">
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-red-600"></span>
                        Absolute Block (Complete restriction)
                      </span>
                    </Pill>
                  </SelectItem>

                  <SelectItem value="festival">
                    <Pill color="blue">
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                        Festival Block (Timing restriction)
                      </span>
                    </Pill>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>
                  From Date <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="date"
                  value={blockForm.fromDate}
                  onChange={(e) =>
                    setBlockForm({ ...blockForm, fromDate: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>
                  To Date <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="date"
                  value={blockForm.toDate}
                  onChange={(e) =>
                    setBlockForm({ ...blockForm, toDate: e.target.value })
                  }
                />
              </div>
            </div>

            {blockForm.blockType === "festival" && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>
                    Arrival Block Time <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="time"
                    value={blockForm.arrivalBlockTime}
                    onChange={(e) =>
                      setBlockForm({
                        ...blockForm,
                        arrivalBlockTime: e.target.value,
                      })
                    }
                  />
                  <p className="text-xs text-gray-500">
                    Start time for restrictions
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>
                    Departure Block Time <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="time"
                    value={blockForm.departureBlockTime}
                    onChange={(e) =>
                      setBlockForm({
                        ...blockForm,
                        departureBlockTime: e.target.value,
                      })
                    }
                  />
                  <p className="text-xs text-gray-500">
                    End time for restrictions
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label>
                Remarks / Reason <span className="text-red-500">*</span>
              </Label>
              <Textarea
                placeholder="Explain the reason for this block..."
                value={blockForm.remark}
                onChange={(e) =>
                  setBlockForm({ ...blockForm, remark: e.target.value })
                }
                rows={3}
              />
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs text-blue-900">
                {blockForm.blockType === "absolute"
                  ? "🔴 Absolute blocks prevent all travel during the specified date range."
                  : "🟠 Festival blocks allow travel but restrict flight timings during the specified hours."}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsBlockDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveBlock}
              style={{ backgroundColor: "#5B9BD5" }}
              className="text-white"
            >
              <Save className="w-4 h-4 mr-2" />
              Add Block
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
