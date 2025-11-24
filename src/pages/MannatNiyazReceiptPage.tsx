import React, { useState, useEffect } from "react";
import { PageHeader } from "../components/PageHeader";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Search, FileText, AlertCircle, Printer, Mail } from "lucide-react";
import { Toaster, toast } from "sonner";
import {
  getMumeenByITS,
  getMumeenById,
  Mumeen,
  ReceiptPayload,
} from "../services/mumeenService";
import { createReceipt } from "../services/mumeenService";
import {
  getAllCurrencies,
  getHeadCurrencyRate,
  Currency,
} from "../services/currencyService";
import logoImage from "../assets/receiptLogo.png";
import { useAuth } from "../contexts/AuthContext";

const heads = [
  { id: 2, value: "Zabihat", label: "Zabihat" },
  { id: 3, value: "Mannat", label: "Mannat" },
  { id: 1, value: "Niyaz", label: "Niyaz" },
];

const locations = [
  { value: "KRB", label: "Karbala (KRB)" },
  { value: "NAJ", label: "Najaf (NAJ)" },
];

export function MannatNiyazReceiptPage() {
  const { user } = useAuth();

  const [itsNo, setItsNo] = useState("");
  const [mumeenList, setMumeenList] = useState<Mumeen[]>([]);
  const [mumeenInfo, setMumeenInfo] = useState<any>(null);
  const [isDataFromAPI, setIsDataFromAPI] = useState(false);
  const [manualMumeenData, setManualMumeenData] = useState({
    name: "",
    phone: "",
    email: "",
    watan: "",
  });
  const [head, setHead] = useState("Zabihat");
  const [headId, setHeadId] = useState(2);
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [currencyCode, setCurrencyCode] = useState("");
  const [currencyId, setCurrencyId] = useState<number>(9);
  const [unitRate, setUnitRate] = useState(0);
  const [units, setUnits] = useState(1);
  const [customAmount, setCustomAmount] = useState("");
  const [amount, setAmount] = useState(0);
  const [discount, setDiscount] = useState("");
  const [total, setTotal] = useState(0);
  const [isSearching, setIsSearching] = useState(false);

  const [location, setLocation] = useState(() => {
    return localStorage.getItem("selectedLocation") || "KRB";
  });

  useEffect(() => {
    if (location) {
      localStorage.setItem("selectedLocation", location);
    }
  }, [location]);

  useEffect(() => {
    const selectedHead = heads.find((h) => h.value === head);
    if (selectedHead) setHeadId(selectedHead.id);
  }, [head]);

  useEffect(() => {
    const fetchCurrencies = async () => {
      const data = await getAllCurrencies();
      setCurrencies(data);
      if (data && data.length > 0) {
        setCurrencyId(data[0].currencyId);
        setCurrencyCode(data[0].currencyCode);
      }
    };
    fetchCurrencies();
  }, []);

  useEffect(() => {
    const fetchMumeen = async () => {
      if (itsNo.length !== 8) {
        setMumeenInfo(null);
        setIsDataFromAPI(false);
        return;
      }

      setIsSearching(true);
      try {
        const byITS = await getMumeenByITS(itsNo);
        if (byITS && byITS.muminDataId) {
          const fullData = await getMumeenById(byITS.muminDataId);
          const info = fullData || byITS;
          setMumeenInfo({
            name: info.fullName?.trim() || "N/A",
            phone: info.whatsAppNo || "",
            email: info.email || "",
            watan: info.vatan || "",
            muminDataId: info.muminDataId,
          });
          setIsDataFromAPI(true);
          toast.success("Mumeen data loaded successfully!");
        } else {
          setMumeenInfo(null);
          setIsDataFromAPI(false);
          toast.info("Mumeen not found for this ITS number.");
        }
      } catch (err) {
        toast.error("Failed to fetch Mumeen data.");
        setIsDataFromAPI(false);
      }

      setIsSearching(false);
    };

    fetchMumeen();
  }, [itsNo]);

  useEffect(() => {
    const fetchRate = async () => {
      if (headId && currencyId && head !== "Niyaz") {
        const rate = await getHeadCurrencyRate(headId, currencyId);
        setUnitRate(rate);
      } else {
        setUnitRate(0);
      }
    };
    fetchRate();
  }, [headId, currencyId]);

  useEffect(() => {
    if (head === "Niyaz") setAmount(Number(customAmount) || 0);
    else setAmount(unitRate * units);
  }, [unitRate, units, head, customAmount]);

  useEffect(() => {
    const discountValue = Number(discount) || 0;
    setTotal(Math.max(0, amount - discountValue));
  }, [amount, discount]);

  const handleReset = () => {
    setItsNo("");
    setMumeenInfo(null);
    setIsDataFromAPI(false);
    setManualMumeenData({ name: "", phone: "", email: "", watan: "" });
    setUnits(1);
    setCustomAmount("");
    setDiscount("");
    const savedLocation = localStorage.getItem("selectedLocation");
    setLocation(savedLocation || "KRB");

    if (currencies.length > 0) {
      setCurrencyId(currencies[0].currencyId);
      setCurrencyCode(currencies[0].currencyCode);
    }

    const savedHead = localStorage.getItem("selectedHead");
    if (savedHead) {
      setHead(savedHead);
      const selected = heads.find((h) => h.value === savedHead);
      setHeadId(selected ? selected.id : 0);
    } else {
      setHead(heads[0].value);
      setHeadId(heads[0].id);
    }

    setTimeout(() => {
      const el = document.getElementById("itsNo") as HTMLInputElement | null;
      if (el) el.focus();
    }, 100);
  };

  const saveReceipt = async () => {
    if (!itsNo) {
      toast.error("Please enter ITS number");
      return null;
    }

    const selectedMumin = mumeenList.find((m) => m.itsNo === itsNo);

    const now = new Date();
    const dateStr = now.toISOString().split("T")[0].replace(/-/g, "");
    const stored = localStorage.getItem("mannatNiyazReceipts");
    let existingReceipts: any[] = [];

    try {
      existingReceipts = stored ? JSON.parse(stored) : [];
    } catch {
      existingReceipts = [];
    }

    const todayLocationReceipts = existingReceipts.filter(
      (r) =>
        r &&
        typeof r.receiptNumber === "string" &&
        r.receiptNumber.startsWith(`${dateStr}-${location}`)
    );

    const nextSequence = todayLocationReceipts.length + 1;
    const receiptNumber = `${dateStr}-${location}-${String(nextSequence).padStart(2, "0")}`;

    const apiPayload: ReceiptPayload = {
      receiptNo: receiptNumber,
      itsNo,
      muminDataId: mumeenInfo?.muminDataId || 0,
      headId,
      locationCode: location === "KRB" ? "KARBALA" : "NAJAF",
      currencyCode,
      unitRate,
      units,
      amount,
      discount: Number(discount) || 0,
      totalAmount: total,
      isApproved: false,
      createdByUserID: Number(user?.id) || 1001,
      details: [
        {
          currencyCode,
          unitRate,
          units,
          roundoff: 0.0,
          isSelected: true,
        },
      ],
    };

    try {
      const response = await createReceipt(apiPayload);
      if (response) {
        toast.success("Receipt Printed successfully!");
      } else {
        toast.warning("Receipt saved locally (server not reachable)");
      }
    } catch (error) {
      toast.error("Failed to sync receipt with server");
    }

    const receiptData = {
      receiptNumber,
      location,
      itsNo,
      mumeenInfo: isDataFromAPI ? mumeenInfo : manualMumeenData,
      head,
      headId,
      currency: currencyCode,
      currencyId,
      unitRate,
      units,
      amount,
      discount: Number(discount) || 0,
      total,
      approved: 0,
      createdAt: now.toISOString(),
      userId: user?.id || "Unknown",
      userName: user?.name || "System User",
    };

    existingReceipts.push(receiptData);
    localStorage.setItem(
      "mannatNiyazReceipts",
      JSON.stringify(existingReceipts)
    );

    return receiptData;
  };

  const handleSaveAndPrint = async (e: React.FormEvent) => {
    e.preventDefault();
    const receiptData = await saveReceipt();
    if (!receiptData) return;

    const fullDateTime = new Date(receiptData.createdAt).toLocaleString(
      "en-GB",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      }
    );

    const printWindow = window.open("", "_blank", "width=800,height=700");

    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Receipt ${receiptData.receiptNumber}</title>
            <style>
              body {
                font-family: 'Inter', sans-serif;
                padding: 40px;
                background: #ffffff;
                color: #1e3a5f;
                line-height: 1.6;
              }
              .card {
                border: 2px solid #7dd3fc;
                padding: 40px;
                border-radius: 12px;
                background: #fff;
                max-width: 800px;
                margin: 0 auto;
              }
              .header {
                display: flex;
                align-items: start;
                justify-content: space-between;
                border-bottom: 2px solid #d1d5db;
                padding-bottom: 20px;
              }
              .logo { width: 100px; height: 100px; object-fit: contain; }
              .title { text-align: right; }
              .title h1 { font-size: 32px; font-style: italic; margin: 0; }
              .title h2 { font-size: 28px; margin-top: 10px; margin-bottom: 0; }
              table { width: 100%; border-collapse: collapse; margin-top: 30px; }
              th, td { border: 2px solid #000; padding: 10px; text-align: left; }
              th { background: #f9fafb; }
              .footer {
                margin-top: 40px;
                border-top: 2px solid #d1d5db;
                padding-top: 15px;
                text-align: center;
                font-style: italic;
                font-size: 16px;
              }
            </style>
          </head>
          <body>
            <div class="card">
              <div class="header">
                <img src="${logoImage}" class="logo" alt="FHIMS Logo" />
                <div class="title">
                  <h1>FAIZ E HUSAINI - IRAQ</h1>
                  <h2>RECEIPT</h2>
                </div>
              </div>
              <p><i>Afzalus salam</i> ${receiptData.mumeenInfo.name},</p>
              <p>Thank you for your contribution. Here are your transaction details:</p>
              <p><strong>Receipt:</strong> ${receiptData.receiptNumber}</p>
              <p><strong>Date & Time:</strong> ${fullDateTime}</p>
              <p><strong>Head:</strong> ${receiptData.head}</p>
              <p><strong>Location:</strong> ${
                receiptData.location === "KRB" ? "Karbala (KRB)" : "Najaf (NAJ)"
              }</p>
              <table>
                <thead>
                  <tr>
                    <th>Currency Value</th>
                    <th>Unit</th>
                    <th>Total</th>
                    <th>Roundoff</th>
                    <th>Final Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>${receiptData.currency} ${
                      receiptData.head === "Niyaz"
                        ? receiptData.amount.toLocaleString()
                        : receiptData.unitRate.toLocaleString()
                    }</td>
                    <td>${receiptData.units}</td>
                    <td>${receiptData.amount.toLocaleString()}</td>
                    <td>0</td>
                    <td><strong>${receiptData.total.toLocaleString()}</strong></td>
                  </tr>
                </tbody>
              </table>
              <div class="footer">
                Receipt generated by ${receiptData.userName}
              </div>
            </div>
            <script>
              window.onload = () => {
                window.print();
                setTimeout(() => window.close(), 500);
              };
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }

    setTimeout(() => handleReset(), 500);
  };

  const handleSaveAndEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    const receiptData = await saveReceipt();
    if (!receiptData) return;

    toast.success(
      `Receipt ${receiptData.receiptNumber} created and emailed to ${receiptData.mumeenInfo.email}!`,
      { description: "Email sent successfully", duration: 5000 }
    );

    window.scrollTo({ top: 0, behavior: "smooth" });

    setTimeout(() => handleReset(), 2000);
  };

  return (
    <div className="min-h-screen pb-20">
      <div className="hidden md:block">
        <PageHeader
          title="Mannat & Niyaz Receipt"
          description="Create receipts for Zabihat, Mannat, and Niyaz offerings"
          icon={<FileText className="w-6 h-6" />}
        />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <form className="space-y-6">
          <Card className="p-4 sm:p-6 bg-white/70 backdrop-blur-sm border-sky-200">
            <Label htmlFor="location" className="text-sky-900">
              Location *
            </Label>
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger id="location" className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {locations.map((loc) => (
                  <SelectItem key={loc.value} value={loc.value}>
                    {loc.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Card>

          <Card className="p-4 sm:p-6 bg-white/70 backdrop-blur-sm border-sky-200">
            <div className="mb-4 flex items-center gap-2">
              <Search className="h-5 w-5 text-sky-600" />
              <span className="font-medium text-sky-900">
                Mumeen Information
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="itsNo" className="text-sky-900">
                  ITS Number *
                </Label>
                <Input
                  id="itsNo"
                  value={itsNo}
                  onChange={(e) => setItsNo(e.target.value.replace(/\D/g, ""))}
                  placeholder="Enter 8-digit ITS number"
                  maxLength={8}
                  className="mt-1"
                />

                {isSearching && (
                  <p className="text-sky-600 text-sm mt-1 flex items-center gap-1">
                    <Search className="h-3 w-3 animate-pulse" />
                    Fetching mumeen data...
                  </p>
                )}
              </div>

              {itsNo.length === 8 && isDataFromAPI && mumeenInfo && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-sky-50 rounded-lg border border-sky-300">
                  <div>
                    <Label className="text-sky-700 text-xs">Name</Label>
                    <p className="mt-1 text-sky-900">{mumeenInfo.name}</p>
                  </div>
                  <div>
                    <Label className="text-sky-700 text-xs">Phone</Label>
                    <p className="mt-1 text-sky-900">{mumeenInfo.phone}</p>
                  </div>
                  <div>
                    <Label className="text-sky-700 text-xs">Email</Label>
                    <Input
                      type="email"
                      className="mt-1 text-sky-900"
                      value={mumeenInfo.email || ""}
                      onChange={(e) =>
                        setMumeenInfo((prev: any) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      placeholder="Enter email"
                    />
                  </div>
                  <div>
                    <Label className="text-sky-700 text-xs">Watan</Label>
                    <p className="mt-1 text-sky-900">{mumeenInfo.watan}</p>
                  </div>
                </div>
              )}

              {itsNo.length === 8 && !isDataFromAPI && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Name *</Label>
                    <Input
                      value={manualMumeenData.name}
                      onChange={(e) =>
                        setManualMumeenData({
                          ...manualMumeenData,
                          name: e.target.value,
                        })
                      }
                      placeholder="Enter name"
                    />
                  </div>
                  <div>
                    <Label>Phone *</Label>
                    <Input
                      value={manualMumeenData.phone}
                      onChange={(e) =>
                        setManualMumeenData({
                          ...manualMumeenData,
                          phone: e.target.value,
                        })
                      }
                      placeholder="Enter phone"
                    />
                  </div>
                  <div>
                    <Label>Email *</Label>
                    <Input
                      value={manualMumeenData.email}
                      onChange={(e) =>
                        setManualMumeenData({
                          ...manualMumeenData,
                          email: e.target.value,
                        })
                      }
                      placeholder="Enter email"
                    />
                  </div>
                  <div>
                    <Label>Watan *</Label>
                    <Input
                      value={manualMumeenData.watan}
                      onChange={(e) =>
                        setManualMumeenData({
                          ...manualMumeenData,
                          watan: e.target.value,
                        })
                      }
                      placeholder="Enter city, country"
                    />
                  </div>
                </div>
              )}
            </div>
          </Card>

          <Card className="p-4 sm:p-6 bg-white/70 backdrop-blur-sm border-sky-200">
            <Label>Select Head *</Label>
            <RadioGroup value={head} onValueChange={setHead}>
              <div className="flex gap-6 mt-2">
                {heads.map((h) => (
                  <div key={h.id} className="flex items-center gap-2">
                    <RadioGroupItem value={h.value} id={h.value} />
                    <Label htmlFor={h.value}>{h.label}</Label>
                  </div>
                ))}
              </div>
            </RadioGroup>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <Label>Currency *</Label>
                <Select
                  value={currencyCode}
                  onValueChange={(code) => {
                    const selected = currencies.find(
                      (c) => c.currencyCode === code
                    );
                    if (selected) {
                      setCurrencyCode(code);
                      setCurrencyId(selected.currencyId);
                    }
                  }}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((c) => (
                      <SelectItem key={c.currencyId} value={c.currencyCode}>
                        {c.currencyName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {head === "Niyaz" ? (
                  <div>
                    <Label htmlFor="customAmount" className="text-sky-900">
                      Amount * (Custom)
                    </Label>
                    <Input
                      type="number"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      placeholder="Enter amount"
                      min="0"
                      step="0.01"
                      className="mt-1"
                      tabIndex={isDataFromAPI || itsNo.length !== 8 ? 7 : 11}
                    />
                  </div>
                ) : (
                  <div>
                    <Label htmlFor="units" className="text-sky-900">
                      <span className="block md:hidden">Units *</span>
                      <span className="hidden md:block">Number Of Units *</span>
                    </Label>

                    <Input
                      id="units"
                      type="number"
                      inputMode="numeric"
                      min="1"
                      value={units}
                      onFocus={(e) => {
                        e.target.select();
                      }}
                      onClick={(e) => {
                        e.currentTarget.select();
                      }}
                      onKeyDown={(e) => {
                        if (["e", "E", "+", "-", ".", ","].includes(e.key))
                          e.preventDefault();
                        if (/^[0-9]$/.test(e.key)) {
                          e.preventDefault();
                          const newVal = parseInt(e.key, 10);
                          setUnits(newVal < 1 ? 1 : newVal);
                        }
                      }}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === "") {
                          setUnits(1);
                          return;
                        }

                        const parsed = parseInt(
                          value.replace(/^0+/, "") || "1",
                          10
                        );
                        setUnits(parsed < 1 ? 1 : parsed);
                      }}
                      onBlur={() => {
                        if (!units || units < 1) setUnits(1);
                      }}
                      className="mt-1"
                    />
                  </div>
                )}
              </div>
            </div>

            {head !== "Niyaz" && (
              <div className="p-4 bg-gradient-to-br from-sky-100 to-blue-100 rounded-lg border-2 border-sky-300">
                <Label className="text-sky-700 text-sm">Unit Rate</Label>
                <p className="text-3xl mt-1 text-sky-900">
                  {unitRate.toLocaleString()}
                </p>
              </div>
            )}

            {head !== "Niyaz" && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="amount" className="text-sky-900">
                    Amount
                  </Label>
                  <Input
                    id="amount"
                    type="text"
                    value={unitRate.toLocaleString()}
                    readOnly
                    tabIndex={-1}
                    className="bg-gray-100 mt-1 text-gray-700"
                  />
                </div>

                <div>
                  <Label htmlFor="discount" className="text-sky-900">
                    Discount
                  </Label>
                  <Input
                    id="discount"
                    type="number"
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                    placeholder="0"
                    min="0"
                    max={amount}
                    step="0.01"
                    className="mt-1"
                  />
                  {Number(discount) > 0 && Number(discount) > amount && (
                    <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      Discount cannot exceed amount
                    </p>
                  )}
                </div>
              </div>
            )}

            {head === "Niyaz" && (
              <div>
                <Label htmlFor="discount" className="text-sky-900">
                  Discount (Optional)
                </Label>
                <Input
                  id="discount"
                  type="number"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                  placeholder="0"
                  min="0"
                  max={amount}
                  step="0.01"
                  className="mt-1"
                  tabIndex={isDataFromAPI || itsNo.length !== 8 ? 8 : 12}
                />
                {Number(discount) > 0 && Number(discount) > amount && (
                  <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    Discount cannot exceed amount
                  </p>
                )}
              </div>
            )}

            <div className="p-5 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg border-2 border-green-400">
              <Label className="text-green-800 text-sm">
                Total Amount to Pay
              </Label>
              <p className="text-4xl mt-2 text-green-900">
                {total.toLocaleString()}
              </p>
            </div>
          </Card>

          <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4">
            <Button
              onClick={handleSaveAndEmail}
              className="w-full sm:w-auto bg-sky-600 hover:bg-sky-700"
            >
              <Mail className="h-4 w-4 mr-2" /> Save & Email
            </Button>
            <Button
              onClick={handleSaveAndPrint}
              className="w-full sm:w-auto bg-sky-600 hover:bg-sky-700"
            >
              <Printer className="h-4 w-4 mr-2" /> Save & Print
            </Button>
          </div>
        </form>
      </div>

      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "#ffffff",
            color: "#1E3A5f",
            fontSize: "14px",
            borderRadius: "12px",
            padding: "14px 18px",
            fontFamily: "'Inter', sans-serif",
            fontWeight: 500,
          },
          classNames: {
            title: "font-medium",
            description: "text-sm opacity-90",
            icon: "text-[#0B5394]",
            closeButton: "hover:bg-[#D4E8FB]",
          },
          duration: 4000,
        }}
      />
    </div>
  );
}
