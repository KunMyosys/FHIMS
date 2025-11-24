import React, { useEffect, useState } from "react";
import { PageHeader } from "../components/PageHeader";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Printer, ArrowLeft } from "lucide-react";
import logoImage from "../assets/receiptLogo.png";
import { useAuth } from "../contexts/AuthContext";

interface MannatNiyazReceiptViewPageProps {
  onNavigate: (page: string) => void;
}

const currencies = [
  { value: "GBP", label: "GBP (£)", symbol: "£" },
  { value: "USD", label: "USD ($)", symbol: "$" },
  { value: "INR", label: "INR (₹)", symbol: "₹" },
  { value: "PKR", label: "PKR (Rs)", symbol: "Rs" },
  { value: "IRQ", label: "IRQ (د.ع)", symbol: "د.ع" },
  { value: "KWT", label: "KWT (د.ك)", symbol: "د.ك" },
  { value: "AED", label: "AED (د.إ)", symbol: "د.إ" },
];

export function MannatNiyazReceiptViewPage({
  onNavigate,
}: MannatNiyazReceiptViewPageProps) {
  const [receiptData, setReceiptData] = useState<any>(null);
  const { user } = useAuth();

  useEffect(() => {
    const savedReceipts = localStorage.getItem("mannatNiyazReceipts");
    if (savedReceipts) {
      const receipts = JSON.parse(savedReceipts);
      if (receipts.length > 0) {
        const latestReceipt = receipts[receipts.length - 1];
        setReceiptData(latestReceipt);
      }
    }
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleBackToCreate = () => {
    if (onNavigate) {
      onNavigate("mannat");
    }
  };

  if (!receiptData) {
    return (
      <div className="min-h-screen pb-20">
        <PageHeader
          title="Receipt"
          description="Viewing receipt details"
          icon={<Printer className="w-6 h-6" />}
        />
        <div className="max-w-4xl mx-auto px-6 py-8">
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">No receipt found.</p>
            <Button
              onClick={handleBackToCreate}
              className="mt-4 bg-sky-600 hover:bg-sky-700"
            >
              Back to Create Receipt
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  const receiptDate = new Date(receiptData.createdAt);
  const dateStr = receiptDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const timeStr = receiptDate.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
  const fullDateTime = `${dateStr} ${timeStr}`;
  const currencySymbol =
    currencies.find((c) => c.value === receiptData.currency)?.symbol ||
    receiptData.currency;
  const roundoff = 0;

  const generatedBy = user?.name || receiptData.userName || "System User";

  return (
    <div className="min-h-screen pb-20">
      <style>
        {`
          @media print {
            body * {
              visibility: hidden;
            }
            .print-area, .print-area * {
              visibility: visible;
            }
            .print-area {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
            }
            .no-print {
              display: none !important;
            }
            .print-border {
              border: 2px solid #000 !important;
            }
          }
        `}
      </style>

      {/* Header and Buttons - Hidden on Print */}
      <div className="no-print">
        <PageHeader
          title="Receipt"
          description="Viewing generated receipt"
          icon={<Printer className="w-6 h-6" />}
        />

        <div className="max-w-4xl mx-auto px-6 py-4">
          {/* Success Message */}
          <div className="mb-6 p-4 bg-green-100 border-2 border-green-400 rounded-lg">
            <p className="text-green-800 text-left">
              Receipt created successfully.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="mb-6 flex justify-between items-center">
            <Button
              onClick={handleBackToCreate}
              variant="outline"
              className="border-sky-600 text-sky-600 hover:bg-sky-50"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Create Receipt
            </Button>
            <Button
              onClick={handlePrint}
              className="bg-sky-600 hover:bg-sky-700"
            >
              <Printer className="h-4 w-4 mr-2" />
              Print Receipt
            </Button>
          </div>
        </div>
      </div>

      {/* Receipt Template - This gets printed */}
      <div className="max-w-4xl mx-auto px-6 pb-8 print-area">
        <Card className="p-12 bg-white border-2 border-sky-200 print-border">
          <div className="space-y-8">
            {/* Header with Logo and Title */}
            <div className="flex items-start gap-8 pb-6 border-b-2 border-gray-300">
              <img
                src={logoImage}
                alt="FHIMS Logo"
                className="w-24 h-24 object-contain"
              />
              <div className="flex-1 text-right">
                <h1 className="text-4xl italic">FAIZ E HUSAINI - IRAQ</h1>
                <h2 className="text-3xl mt-2">RECEIPT</h2>
              </div>
            </div>

            {/* Greeting */}
            <div className="space-y-4">
              <p className="text-lg">
                <span className="italic">Afzalus salam</span>{" "}
                {receiptData.mumeenInfo.name},
              </p>
              <p className="text-base">
                Thank you for your contribution. Here are your transaction
                details:
              </p>
            </div>

            {/* Receipt Details */}
            <div className="space-y-3 text-base">
              <div className="flex gap-2">
                <span className="font-medium min-w-[120px]">Receipt:</span>
                <span>{receiptData.receiptNumber}</span>
              </div>
              <div className="flex gap-2">
                <span className="font-medium min-w-[120px]">Date & Time:</span>
                <span>{fullDateTime}</span>
              </div>
              <div className="flex gap-2">
                <span className="font-medium min-w-[120px]">Head:</span>
                <span>{receiptData.head}</span>
              </div>
              <div className="flex gap-2">
                <span className="font-medium min-w-[120px]">Location:</span>
                <span>
                  {receiptData.location === "KRB"
                    ? "Karbala (KRB)"
                    : "Najaf (NAJ)"}
                </span>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full border-2 border-gray-900">
                <thead>
                  <tr className="border-b-2 border-gray-900 bg-gray-50">
                    <th className="border-r-2 border-gray-900 p-4 text-left">
                      Currency Value
                    </th>
                    <th className="border-r-2 border-gray-900 p-4 text-left">
                      Unit
                    </th>
                    <th className="border-r-2 border-gray-900 p-4 text-left">
                      Total
                    </th>
                    <th className="border-r-2 border-gray-900 p-4 text-left">
                      Roundoff
                    </th>
                    <th className="p-4 text-left">Final Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-white">
                    <td className="border-r-2 border-gray-900 p-4">
                      {receiptData.currency} {currencySymbol}
                      {receiptData.head === "Niyaz"
                        ? receiptData.amount.toLocaleString()
                        : receiptData.unitRate.toLocaleString()}
                    </td>
                    <td className="border-r-2 border-gray-900 p-4">
                      {receiptData.units}
                    </td>
                    <td className="border-r-2 border-gray-900 p-4">
                      {currencySymbol}
                      {receiptData.amount.toLocaleString()}
                    </td>
                    <td className="border-r-2 border-gray-900 p-4">
                      {currencySymbol}
                      {roundoff.toLocaleString()}
                    </td>
                    <td className="p-4">
                      <strong>
                        {currencySymbol}
                        {receiptData.total.toLocaleString()}
                      </strong>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="pt-6 border-t-2 border-gray-300 text-center">
              <p className="italic text-base">
                Receipt generated by {generatedBy}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
