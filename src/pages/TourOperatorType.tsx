import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
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
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Briefcase,
  AlertCircle,
  Building,
  Users,
} from "lucide-react";
import { toast } from "sonner";

interface TOType {
  id: string;
  name: string;
  code: string;
  category: "in-house" | "external";
  description: string;
  permissions: string[];
  status: "active" | "inactive";
}

export const TourOperatorType = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const [toTypes, setToTypes] = useState<TOType[]>([
    {
      id: "1",
      name: "Faiz-e-Husseini Office",
      code: "FH_INHOUSE",
      category: "in-house",
      description:
        "In-house tour operator managed directly by Faiz-e-Husseini organization with full access and extended privileges",
      permissions: [
        "Full Access",
        "Venue Management",
        "Staff Management",
        "Advanced Reports",
      ],
      status: "active",
    },
    {
      id: "2",
      name: "Tour Operator",
      code: "EXT_TO",
      category: "external",
      description:
        "External tour operators with standard access to manage tours, bookings, and participants",
      permissions: [
        "Booking Management",
        "Participant Management",
        "Basic Reports",
      ],
      status: "active",
    },
  ]);

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    category: "external" as "in-house" | "external",
    description: "",
    permissions: [] as string[],
    status: "active" as "active" | "inactive",
  });

  const filteredToTypes = toTypes.filter(
    (type) =>
      type.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      type.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      type.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddTOType = () => {
    const newTOType: TOType = {
      id: Date.now().toString(),
      ...formData,
    };

    setToTypes([...toTypes, newTOType]);
    setIsAddDialogOpen(false);
    setFormData({
      name: "",
      code: "",
      category: "external",
      description: "",
      permissions: [],
      status: "active",
    });
    toast.success("Tour Operator Type added successfully");
  };

  const getCategoryBadge = (category: string) => {
    return category === "in-house" ? (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">
        <Building className="w-3 h-3 mr-1" />
        In-House
      </span>
    ) : (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
        <Users className="w-3 h-3 mr-1" />
        External
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-gray-900 flex items-center gap-2">
            <Briefcase className="w-6 h-6" style={{ color: "#5B9BD5" }} />
            Tour Operator Type Master
          </h1>
          <p className="text-gray-600 mt-1">
            Two-level distinction: Faiz-e-Husseini Office (In-house) and Tour
            Operator (External)
          </p>
        </div>
        <Button
          onClick={() => setIsAddDialogOpen(true)}
          className="text-white shadow-md hover:opacity-90 transition-opacity rounded-xl"
          style={{ backgroundColor: "#5B9BD5" }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add TO Type
        </Button>
      </div>

      <Card className="bg-white border-[#5B9BD5]/20 shadow-md">
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search tour operator types..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-gray-300 rounded-xl"
            />
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow
                className="border-gray-200"
                style={{ backgroundColor: "rgba(91, 155, 213, 0.1)" }}
              >
                <TableHead className="text-gray-900">Type Name</TableHead>
                <TableHead className="text-gray-900">Code</TableHead>
                <TableHead className="text-gray-900">Category</TableHead>
                <TableHead className="text-gray-900">Description</TableHead>
                <TableHead className="text-gray-900">Permissions</TableHead>
                <TableHead className="text-gray-900">Status</TableHead>
                <TableHead className="text-gray-900 text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredToTypes.map((type) => (
                <TableRow key={type.id} className="border-gray-200">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Briefcase
                        className="w-4 h-4"
                        style={{ color: "#5B9BD5" }}
                      />
                      <span className="text-gray-900">{type.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="border-gray-300 text-gray-700 font-mono text-xs"
                    >
                      {type.code}
                    </Badge>
                  </TableCell>
                  <TableCell>{getCategoryBadge(type.category)}</TableCell>
                  <TableCell>
                    <p className="text-sm text-gray-700 max-w-xs line-clamp-2">
                      {type.description}
                    </p>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {type.permissions.slice(0, 3).map((perm, idx) => (
                        <Badge
                          key={idx}
                          variant="outline"
                          className="text-xs border-[#5B9BD5]/30 text-gray-700"
                        >
                          {perm}
                        </Badge>
                      ))}
                      {type.permissions.length > 3 && (
                        <Badge
                          variant="outline"
                          className="text-xs border-[#5B9BD5]/30 text-gray-700"
                        >
                          +{type.permissions.length - 3}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        type.status === "active"
                          ? "bg-green-100 text-green-700 border-green-200"
                          : "bg-gray-100 text-gray-700 border-gray-200"
                      }
                    >
                      {type.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="hover:bg-gray-100 rounded-xl"
                      >
                        <Edit2
                          className="w-4 h-4"
                          style={{ color: "#5B9BD5" }}
                        />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-red-600 hover:bg-red-50 rounded-xl"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Card View */}
        <div className="lg:hidden p-4 space-y-4">
          {filteredToTypes.map((type) => (
            <Card
              key={type.id}
              className="border-[#5B9BD5]/30 bg-gradient-to-br from-white to-sky-50/30"
            >
              <div className="p-4">
                <div className="space-y-3">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2 flex-1">
                      <Briefcase
                        className="w-5 h-5 mt-0.5"
                        style={{ color: "#5B9BD5" }}
                      />
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {type.name}
                        </h3>
                        <Badge
                          variant="outline"
                          className="border-gray-300 text-gray-700 font-mono text-xs mt-1"
                        >
                          {type.code}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                      {getCategoryBadge(type.category)}
                      <Badge
                        variant="outline"
                        className={
                          type.status === "active"
                            ? "bg-green-100 text-green-700 border-green-200"
                            : "bg-gray-100 text-gray-700 border-gray-200"
                        }
                      >
                        {type.status}
                      </Badge>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-700">{type.description}</p>

                  {/* Permissions */}
                  <div>
                    <span className="text-xs text-gray-600">Permissions:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {type.permissions.map((perm, idx) => (
                        <Badge
                          key={idx}
                          variant="outline"
                          className="text-xs border-[#5B9BD5]/30 text-gray-700"
                        >
                          {perm}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2 border-t border-gray-200">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      style={{ borderColor: "#5B9BD5", color: "#5B9BD5" }}
                    >
                      <Edit2 className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Card>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle style={{ color: "#5B9BD5" }}>
              Add Tour Operator Type
            </DialogTitle>
            <DialogDescription>
              Define a new tour operator type with specific permissions and
              access levels.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-900">
                Type Name
              </Label>
              <Input
                id="name"
                placeholder="e.g., Tour Operator"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="h-11 bg-white border-gray-300 rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="code" className="text-gray-900">
                Type Code
              </Label>
              <Input
                id="code"
                placeholder="e.g., EXT_TO"
                value={formData.code}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    code: e.target.value.toUpperCase().replace(/\s/g, "_"),
                  })
                }
                className="h-11 bg-white border-gray-300 rounded-xl font-mono"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category" className="text-gray-900">
                Category
              </Label>
              <Select
                value={formData.category}
                onValueChange={(value: any) =>
                  setFormData({ ...formData, category: value })
                }
              >
                <SelectTrigger className="h-11 bg-white border-gray-300 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="in-house">
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4" />
                      In-House (Faiz-e-Husseini Office)
                    </div>
                  </SelectItem>
                  <SelectItem value="external">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      External (Tour Operator)
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description" className="text-gray-900">
                Description
              </Label>
              <Textarea
                id="description"
                placeholder="Describe the type of tour operator and their scope..."
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="bg-white border-gray-300 rounded-xl min-h-[80px] resize-none"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="permissions" className="text-gray-900">
                Permissions (comma-separated)
              </Label>
              <Textarea
                id="permissions"
                placeholder="e.g., Booking Management, Reports, Participant Management"
                value={formData.permissions.join(", ")}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    permissions: e.target.value
                      .split(",")
                      .map((p) => p.trim())
                      .filter((p) => p),
                  })
                }
                className="bg-white border-gray-300 rounded-xl min-h-[60px] resize-none"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status" className="text-gray-900">
                Status
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value: any) =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger className="h-11 bg-white border-gray-300 rounded-xl">
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
              onClick={() => setIsAddDialogOpen(false)}
              className="border-gray-300 rounded-xl"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddTOType}
              disabled={
                !formData.name || !formData.code || !formData.description
              }
              className="text-white shadow-md hover:opacity-90 transition-opacity rounded-xl"
              style={{ backgroundColor: "#5B9BD5" }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Type
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
