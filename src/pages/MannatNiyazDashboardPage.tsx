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
import { Checkbox } from "../ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  BarChart3,
  CheckCircle,
  FileText,
  Filter,
  Download,
  Plus,
  Printer,
} from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  getAllReceipts,
  getAllMumeen,
  Mumeen,
  searchReceipts,
  approveReceipt,
} from "../services/mumeenService";
import logoImage from "../assets/receiptLogo.png";
import { getAllCurrencies, Currency } from "../services/currencyService";
import { getReceiptSummary } from "../services/summaryService";

const locations = [
  { value: "KRB", label: "Karbala (KRB)" },
  { value: "NAJ", label: "Najaf (NAJ)" },
  { value: "ALL", label: "All Locations" },
];

const heads = [
  { id: 0, value: "ALL", label: "All Heads" },
  { id: 2, value: "Zabihat", label: "Zabihat" },
  { id: 3, value: "Mannat", label: "Mannat" },
  { id: 1, value: "Niyaz", label: "Niyaz" },
];

const approvalStatuses = [
  { value: "0", label: "Pending Approval" },
  { value: "1", label: "Approved" },
  { value: "ALL", label: "All Statuses" },
];

const localCurrencySymbols = [
  { value: "GBP", symbol: "£" },
  { value: "USD", symbol: "$" },
  { value: "INR", symbol: "₹" },
  { value: "PKR", symbol: "Rs" },
  { value: "IRQ", symbol: "د.ع" },
  { value: "KWT", symbol: "د.ك" },
  { value: "KWD", symbol: "د.ك" },
  { value: "AED", symbol: "د.إ" },
];

export function MannatNiyazDashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const role = (user.role || "").toLowerCase();
    const isAdminRole = role.includes("admin");
    const isFinanceRole =
      role.includes("finance") || role.includes("mannat-finance");

    setIsAdmin(isAdminRole);
    setIsFinance(isFinanceRole);
    if (!isAdminRole && !isFinanceRole) {
      setFilterUser(user.name || "ALL");
    } else {
      setFilterUser("ALL");
    }
  }, [user]);

  const [receipts, setReceipts] = useState<any[]>([]);
  const [enrichedReceipts, setEnrichedReceipts] = useState<any[]>([]);
  const [filteredReceipts, setFilteredReceipts] = useState<any[]>([]);
  const [selectedReceipts, setSelectedReceipts] = useState<string[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isFinance, setIsFinance] = useState(false);
  const [loading, setLoading] = useState(false);

  const [filterLocation, setFilterLocation] = useState("ALL");
  const [filterApproved, setFilterApproved] = useState("0");
  const [filterHead, setFilterHead] = useState("ALL");
  const [filterCurrency, setFilterCurrency] = useState("ALL");
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");
  const [filterUser, setFilterUser] = useState("ALL");
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [allCreators, setAllCreators] = useState<string[]>([]);

  const [loadingReceipts, setLoadingReceipts] = useState(true);
  const [loadingSummary, setLoadingSummary] = useState(false);

  const [currencySummaryData, setCurrencySummaryData] = useState<any[]>([]);
  const [headSummaryData, setHeadSummaryData] = useState<any[]>([]);

  const [filterReceiptNo, setFilterReceiptNo] = useState("");
  const [filterItsNo, setFilterItsNo] = useState("");

  const [allUsers, setAllUsers] = useState<string[]>([]);
  const [mumeenList, setMumeenList] = useState<Mumeen[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [totalPages, setTotalPages] = useState(1);

  const headIdToLabel: Record<number, string> = {
    1: "Niyaz",
    2: "Zabihat",
    3: "Mannat",
  };

  const fetchReceiptSummary = async () => {
    try {
      setLoadingSummary(true);

      const payload = {
        receiptNo: filterReceiptNo || "",
        itsNo: filterItsNo || "",
        locationCode: filterLocation === "ALL" ? "" : filterLocation,
        isApproved:
          filterApproved === "ALL"
            ? undefined
            : filterApproved === "1"
              ? true
              : false,
        fromDate: new Date(`${filterDateFrom}T00:00:00`).toISOString(),
        toDate: new Date(`${filterDateTo}T23:59:59`).toISOString(),

        userName: filterUser === "ALL" ? "" : filterUser,
        pageNumber: 1,
        pageSize: 1000,
      };

      const data = await getReceiptSummary(payload);
      setCurrencySummaryData(data.currencySummaries || []);
      setHeadSummaryData(data.headSummaries || []);

      if (
        (!data.currencySummaries || data.currencySummaries.length === 0) &&
        (!data.headSummaries || data.headSummaries.length === 0)
      ) {
        toast.info("No summary data found for selected filters");
      }
    } catch (error) {
    } finally {
      setLoadingSummary(false);
    }
  };

  useEffect(() => {
    if (
      !user ||
      !filterDateFrom ||
      !filterDateTo ||
      loadingReceipts ||
      enrichedReceipts.length === 0
    )
      return;

    fetchReceiptSummary();
  }, [
    filterDateFrom,
    filterDateTo,
    filterLocation,
    filterApproved,
    filterCurrency,
    filterHead,
    filterUser,
  ]);

  useEffect(() => {
    const loadBaseData = async () => {
      try {
        const [currencyData, mumeenData] = await Promise.all([
          getAllCurrencies(),
          getAllMumeen(),
        ]);
        setCurrencies(currencyData || []);
        setMumeenList(mumeenData || []);
      } catch (err) {}
    };
    loadBaseData();
  }, []);

  const getCurrencySymbol = (code?: string): string => {
    if (!code) return "";
    const local = localCurrencySymbols.find(
      (c) => c.value.toUpperCase() === code.toUpperCase()
    );
    if (local) return local.symbol;
    const backend = currencies.find(
      (c) => c.currencyCode?.toUpperCase() === code.toUpperCase()
    );
    return backend?.currencySymbol || code;
  };

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setFilterDateFrom(today);
    setFilterDateTo(today);
    setFilterLocation("ALL");
    setFilterApproved("0"); 
    setFilterHead("ALL");
    setFilterCurrency("ALL");
  }, []);

  useEffect(() => {
    if (enrichedReceipts.length === 0 || !filterDateFrom || !filterDateTo)
      return;

    const from = new Date(`${filterDateFrom}T00:00:00`);
    const to = new Date(`${filterDateTo}T23:59:59`);

    const filteredByDate = enrichedReceipts.filter((r) => {
      const created = new Date(r.createdAt);
      return created >= from && created <= to;
    });

    setFilteredReceipts(filteredByDate);
    setCurrentPage(1);
    setTotalPages(Math.ceil(filteredByDate.length / pageSize) || 1);

    console.log(
      `Date filter applied: ${filterDateFrom} → ${filterDateTo}, ${filteredByDate.length} receipts`
    );
  }, [enrichedReceipts, filterDateFrom, filterDateTo, pageSize]);

  const handleSearch = async () => {
    try {
      let filtered = [...enrichedReceipts];

      // Receipt No filter
      if (filterReceiptNo.trim()) {
        filtered = filtered.filter((r) =>
          r.receiptNumber
            ?.toLowerCase()
            .includes(filterReceiptNo.trim().toLowerCase())
        );
      }

      // ITS No filter
      if (filterItsNo.trim()) {
        filtered = filtered.filter((r) =>
          r.itsNo?.toString().includes(filterItsNo.trim())
        );
      }

      // Location filter
      if (filterLocation !== "ALL") {
        if (filterLocation === "KRB")
          filtered = filtered.filter((r) =>
            r.locationCode?.toUpperCase().includes("KARB")
          );
        else if (filterLocation === "NAJ")
          filtered = filtered.filter((r) =>
            r.locationCode?.toUpperCase().includes("NAJ")
          );
      }

      // Approval filter
      if (filterApproved !== "ALL") {
        const wantApproved = filterApproved === "1";
        filtered = filtered.filter((r) => r.isApproved === wantApproved);
      }

      // Head filter
      if (filterHead !== "ALL") {
        filtered = filtered.filter((r) => r.head === filterHead);
      }

      // Currency filter
      if (filterCurrency !== "ALL") {
        filtered = filtered.filter(
          (r) =>
            (r.currencyCode || "").toUpperCase() ===
            filterCurrency.toUpperCase()
        );
      }

      if (filterDateFrom) {
        filtered = filtered.filter(
          (r) => new Date(r.createdAt) >= new Date(filterDateFrom)
        );
      }
      if (filterDateTo) {
        filtered = filtered.filter(
          (r) => new Date(r.createdAt) <= new Date(filterDateTo)
        );
      }

      // User filter
      if (filterUser !== "ALL") {
        filtered = filtered.filter(
          (r) =>
            (r.createdByFullName || r.createdByUserName || "")
              .trim()
              .toLowerCase() === filterUser.trim().toLowerCase()
        );
      }

      // Role-based visibility (normal user sees own receipts only)
      const role = (user?.role || "").toLowerCase();

      if (filterUser !== "ALL") {
        // If a specific user is selected (like Mustafa-Mannatuser), show only their receipts
        filtered = filtered.filter(
          (r) =>
            (r.createdByFullName || r.createdByUserName || "")
              .trim()
              .toLowerCase() === filterUser.trim().toLowerCase()
        );
      } else if (!role.includes("admin") && !role.includes("finance")) {
        // If normal user (not admin/finance), show only their own receipts
        filtered = filtered.filter(
          (r) =>
            (r.createdByFullName || r.createdByUserName || "")
              .trim()
              .toLowerCase() === (user?.name || "").trim().toLowerCase()
        );
      }

      setFilteredReceipts(filtered);
      setCurrentPage(1);
      setTotalPages(Math.ceil(filtered.length / pageSize) || 1);

      if (filtered.length > 0)
        toast.success(`${filtered.length} receipt(s) found`);
      else toast.info("No receipts found for selected filters");
      await fetchReceiptSummary();
    } catch (err) {
      toast.error("Search failed");
    }
  };

  useEffect(() => {
    toast.info("Sonner toast system working!");
  }, []);

  //   useEffect(() => {
  //     const load = async () => {
  // if (!mumeenList.length || !filterDateFrom || !filterDateTo || !user) return;

  //     const role = (user.role || "").toLowerCase();
  //     const isAdminRole = role.includes("admin");
  //     const isFinanceRole =
  //       role.includes("finance") || role.includes("mannat-finance");

  //     // Wait for role and filterUser readiness
  //     if (!isAdminRole && !isFinanceRole && (!filterUser || filterUser === "ALL")) {
  //       console.log("Waiting for user filter to be ready...");
  //       return;
  //     }

  //       setLoadingReceipts(true);
  //       setLoadingSummary(true);

  //       try {
  //         const rData = await getAllReceipts(1, 1000);
  //         const receiptsData = Array.isArray(rData) ? rData : [];

  //         const enriched = receiptsData.map((r: any) => {
  //           const detail = r.details?.[0] || {};
  //           return {
  //             receiptId: r.receiptId || r.id || 0,
  //             receiptNumber: r.receiptNo,
  //             itsNo: r.itsNo,
  //             mumeenFullName:
  //               mumeenList.find((m) => m.itsNo === r.itsNo)?.fullName ||
  //               r.mumeenInfo?.fullName ||
  //               "N/A",
  //             head:
  //               r.headName ||
  //               r.head ||
  //               detail.headName ||
  //               detail.head ||
  //               (r.headId && headIdToLabel[r.headId]) ||
  //               (detail.headId && headIdToLabel[detail.headId]) ||
  //               "N/A",
  //             locationCode: r.locationCode || "N/A",
  //             createdByFullName:
  //               r.createdByFullName || r.createdByUserName || "Unknown",
  //             createdByUserName: r.createdByUserName || "Unknown",
  //             createdAt: r.createdAt,
  //             currencyCode: detail.currencyCode || r.currencyCode || "N/A",
  //             units: detail.units || r.units || 0,
  //             amount: detail.amount || r.amount || 0,
  //             discount: detail.discount || r.discount || 0,
  //             totalAmount: detail.finalTotal || r.totalAmount || 0,
  //             isApproved: r.isApproved || false,
  //           };
  //         });

  //         // Populate user dropdown from receipts
  // const uniqueCreators = Array.from(
  //   new Set(
  //     enriched
  //       .map((r) => r.createdByFullName || r.createdByUserName)
  //       .filter(
  //         (name) =>
  //           typeof name === "string" &&
  //           name.trim().length > 0 &&
  //           name.toLowerCase() !== "unknown"
  //       )
  //   )
  // ).sort((a, b) => a.localeCompare(b));

  // setAllCreators(uniqueCreators);

  //         const today = new Date();
  //         const startOfDay = new Date(today.setHours(0, 0, 0, 0));
  //         const endOfDay = new Date(today.setHours(23, 59, 59, 999));

  //         const todaysReceipts = enriched.filter((r) => {
  //           const created = new Date(r.createdAt);
  //           return created >= startOfDay && created <= endOfDay;
  //         });

  //         let filteredByStatus = [...todaysReceipts];
  //         if (filterApproved !== "ALL") {
  //           const wantApproved = filterApproved === "1";
  //           filteredByStatus = todaysReceipts.filter(
  //             (r) => r.isApproved === wantApproved
  //           );
  //         }

  //         // Apply user filter
  // const role = (user?.role || "").toLowerCase();

  // const normalizedUserName = (user?.name || "").trim().toLowerCase();
  // let filteredByUser = [...filteredByStatus];

  // if (!isAdmin && !isFinance) {
  //   // Normal users: only their own receipts
  //   filteredByUser = filteredByUser.filter(
  //     (r) =>
  //       (r.createdByFullName || r.createdByUserName || "")
  //         .trim()
  //         .toLowerCase() === normalizedUserName
  //   );
  // } else if (filterUser !== "ALL") {
  //   // Admin/Finance selected a specific user
  //   filteredByUser = filteredByUser.filter(
  //     (r) =>
  //       (r.createdByFullName || r.createdByUserName || "")
  //         .trim()
  //         .toLowerCase() === filterUser.trim().toLowerCase()
  //   );
  // }

  //          setAllCreators(uniqueCreators);
  //         setReceipts(enriched);
  //         setEnrichedReceipts(enriched);
  // setFilteredReceipts(filteredByUser);
  // setTotalPages(Math.ceil(filteredByUser.length / pageSize) || 1);

  //         setCurrentPage(1);

  //         toast.info(
  //   `Showing today's ${
  //     filterApproved === "1"
  //       ? "approved"
  //       : filterApproved === "0"
  //       ? "pending"
  //       : "all"
  //   } receipts for ${
  //     filterUser !== "ALL"
  //       ? filterUser
  //       : !isAdmin && !isFinance
  //       ? user?.name || "current user"
  //       : "all users"
  //   } (${filteredByUser.length})`
  // );

  //       } catch (err) {
  //         toast.error("Failed to load receipts");
  //       } finally {
  //         setLoadingReceipts(false);
  //         setLoadingSummary(false);
  //       }
  //     };

  //     load();
  // }, [mumeenList, filterDateFrom, filterDateTo, user, filterUser, isAdmin, isFinance]);

  useEffect(() => {
    const load = async () => {
      if (
        !mumeenList.length ||
        !filterDateFrom ||
        !filterDateTo ||
        !user ||
        (filterUser === "ALL" && !isAdmin && !isFinance)
      ) {
        // Wait until user roles and filterUser are properly set
        return;
      }

      setLoadingReceipts(true);
      setLoadingSummary(true);

      try {
        const rData = await getAllReceipts(1, 1000);
        const receiptsData = Array.isArray(rData) ? rData : [];

        const enriched = receiptsData.map((r: any) => {
          const detail = r.details?.[0] || {};
          return {
            receiptId: r.receiptId || r.id || 0,
            receiptNumber: r.receiptNo,
            itsNo: r.itsNo,
            mumeenFullName:
              mumeenList.find((m) => m.itsNo === r.itsNo)?.fullName ||
              r.mumeenInfo?.fullName ||
              "N/A",
            head:
              r.headName ||
              r.head ||
              detail.headName ||
              detail.head ||
              (r.headId && headIdToLabel[r.headId]) ||
              (detail.headId && headIdToLabel[detail.headId]) ||
              "N/A",
            locationCode: r.locationCode || "N/A",
            createdByFullName:
              r.createdByFullName || r.createdByUserName || "Unknown",
            createdByUserName: r.createdByUserName || "Unknown",
            createdAt: r.createdAt,
            currencyCode: detail.currencyCode || r.currencyCode || "N/A",
            units: detail.units || r.units || 0,
            amount: detail.amount || r.amount || 0,
            discount: detail.discount || r.discount || 0,
            totalAmount: detail.finalTotal || r.totalAmount || 0,
            isApproved: r.isApproved || false,
          };
        });

        const uniqueCreators = Array.from(
          new Set(
            enriched
              .map((r) => r.createdByFullName || r.createdByUserName)
              .filter(
                (name) =>
                  typeof name === "string" &&
                  name.trim().length > 0 &&
                  name.toLowerCase() !== "unknown"
              )
          )
        ).sort((a, b) => a.localeCompare(b));

        setAllCreators(uniqueCreators);
        let filteredByUser = [...enriched];

        if (!isAdmin && !isFinance) {
          const normalizedUserName = (user?.name || "").trim().toLowerCase();
          const normalizedLoginName = (
            (user as any)?.username ||
            (user as any)?.userName ||
            ""
          )
            .trim()
            .toLowerCase();
          const currentUserId = Number(user?.id || 0);

          filteredByUser = filteredByUser.filter((r) => {
            const createdByName = (r.createdByFullName || "")
              .trim()
              .toLowerCase();
            const createdByUser = (r.createdByUserName || "")
              .trim()
              .toLowerCase();
            const createdById = Number(
              r.createdByUserName || r.createdByUserName || 0
            );

            return (
              createdById === currentUserId ||
              createdByName === normalizedUserName ||
              createdByUser === normalizedUserName ||
              createdByUser === normalizedLoginName
            );
          });
        } else if (filterUser !== "ALL") {
          const normalizedFilterUser = filterUser.trim().toLowerCase();

          filteredByUser = filteredByUser.filter((r) => {
            const createdByName = (r.createdByFullName || "")
              .trim()
              .toLowerCase();
            const createdByUser = (r.createdByUserName || "")
              .trim()
              .toLowerCase();
            return (
              createdByName === normalizedFilterUser ||
              createdByUser === normalizedFilterUser
            );
          });
        }

        setReceipts(enriched);
        setEnrichedReceipts(enriched);
        setFilteredReceipts(filteredByUser);
        setTotalPages(Math.ceil(filteredByUser.length / pageSize) || 1);
        setCurrentPage(1);

        toast.info(
          `Loaded ${filteredByUser.length} receipt(s) for ${
            !isAdmin && !isFinance
              ? user?.name
              : filterUser === "ALL"
                ? "all users"
                : filterUser
          }`
        );
      } catch (err) {
        toast.error("Failed to load receipts");
      } finally {
        setLoadingReceipts(false);
        setLoadingSummary(false);
      }
    };

    load();
  }, [
    mumeenList,
    filterDateFrom,
    filterDateTo,
    user,
    filterUser,
    isAdmin,
    isFinance,
    pageSize,
  ]);

  useEffect(() => {
    const total = Math.ceil(filteredReceipts.length / pageSize) || 1;
    setTotalPages(total);
    if (currentPage > total) {
      setCurrentPage(1);
    }
  }, [filteredReceipts, pageSize, currentPage]);

  const paginatedReceipts = React.useMemo(() => {
    return filteredReceipts.slice(
      (currentPage - 1) * pageSize,
      currentPage * pageSize
    );
  }, [filteredReceipts, currentPage, pageSize]);

  useEffect(() => {
    if (!loadingReceipts && filteredReceipts.length > 0) {
      const total = Math.ceil(filteredReceipts.length / pageSize) || 1;
      setTotalPages(total);
    }
  }, [
    filteredReceipts,
    loadingReceipts,
    pageSize,
    filterDateFrom,
    filterDateTo,
  ]);

  const handleApprove = async () => {
    if (!isAdmin && !isFinance) {
      toast.error("Only admins or finance users can approve receipts");
      return;
    }

    if (selectedReceipts.length === 0) {
      toast.error("Select at least one receipt to approve");
      return;
    }

    const toastId = toast.loading("Approving selected receipts...");

    try {
      const receiptsToApprove = enrichedReceipts.filter((r) =>
        selectedReceipts.includes(r.receiptId)
      );

      if (receiptsToApprove.length === 0) {
        toast.dismiss(toastId);
        toast.info("No valid receipts found to approve");
        return;
      }

      const results = await Promise.allSettled(
        receiptsToApprove.map(async (r) => {
          const receiptId = Number(r.receiptId);
          const approvedByUserId = Number(user?.id || 0);
          return approveReceipt(receiptId, approvedByUserId);
        })
      );

      const approvedCount = results.filter(
        (r) => r.status === "fulfilled" && r.value
      ).length;

      toast.dismiss(toastId);

      if (approvedCount > 0) {
        toast.success(`${approvedCount} receipt(s) approved successfully!`, {
          description: "Email notifications sent to respective Mumeens",
          duration: 4000,
        });

        setEnrichedReceipts((prev) =>
          prev.map((r) =>
            selectedReceipts.includes(r.receiptId)
              ? { ...r, isApproved: true }
              : r
          )
        );

        if (filterApproved === "0") {
          setFilteredReceipts((prev) =>
            prev.filter((r) => !selectedReceipts.includes(r.receiptId))
          );
        }
      } else {
        toast.error("No receipts were approved. Please try again.");
      }

      setSelectedReceipts([]);
    } catch (error) {
      toast.dismiss(toastId);
      toast.error("Error approving receipts. Please try again.");
    }
  };

  const handleSelectAll = (checked: any) => {
    const isChecked = checked === true;
    if (isChecked) {
      const pending = filteredReceipts
        .filter((r) => !r.isApproved)
        .map((r) => r.receiptId);
      setSelectedReceipts(pending);
    } else {
      setSelectedReceipts([]);
    }
  };

  const enrichReceipts = (data: any[], mumeenList: Mumeen[]) => {
    return data.map((r) => {
      const detail = r.details?.[0] || {};
      let headLabel =
        r.headName ||
        r.head ||
        detail.headName ||
        detail.head ||
        headIdToLabel[r.headId] ||
        headIdToLabel[detail.headId] ||
        "N/A";

      if (!headLabel || headLabel === "N/A") {
        const localReceipts = JSON.parse(
          localStorage.getItem("mannatNiyazReceipts") || "[]"
        );
        const match = localReceipts.find(
          (lr: any) =>
            lr.receiptNumber === r.receiptNo ||
            lr.receiptNumber === r.receiptNumber
        );
        if (match?.headName) headLabel = match.headName;
        else if (match?.head) headLabel = match.head;
      }

      if ((!headLabel || headLabel === "N/A") && r.headId) {
        headLabel = headIdToLabel[r.headId] || "N/A";
      }
      if ((!headLabel || headLabel === "N/A") && detail.headId) {
        headLabel = headIdToLabel[detail.headId] || "N/A";
      }

      return {
        receiptId: r.receiptId || r.id || 0,
        receiptNumber: r.receiptNo || "N/A",
        itsNo: r.itsNo || "N/A",
        mumeenFullName:
          r.mumeenInfo?.fullName ||
          mumeenList.find((m) => m.itsNo === r.itsNo)?.fullName ||
          "N/A",
        head: headLabel,
        locationCode: r.locationCode || "N/A",
        createdByFullName:
          r.createdByFullName || r.createdByUserName || "Unknown",
        createdByUserName: r.createdByUserName || "Unknown",
        createdAt: r.createdAt,
        currencyCode: detail.currencyCode || r.currencyCode || "N/A",
        units: detail.units || r.units || 0,
        amount: detail.amount || r.amount || 0,
        discount: detail.discount || r.discount || 0,
        totalAmount: detail.finalTotal || r.totalAmount || 0,
        isApproved: r.isApproved || false,
      };
    });
  };

  const CurrencySummary = React.useMemo(() => {
    return Object.entries(
      paginatedReceipts.reduce(
        (acc, r) => {
          const code = r.currencyCode || "N/A";
          acc[code] = (acc[code] || 0) + (Number(r.totalAmount) || 0);
          return acc;
        },
        {} as Record<string, number>
      )
    ).map(([currencyCode, totalAmount]) => ({ currencyCode, totalAmount }));
  }, [paginatedReceipts]);

  const HeadSummary = React.useMemo(() => {
    return Object.entries(
      paginatedReceipts.reduce(
        (acc, r) => {
          const head = r.head || "N/A";
          acc[head] = (acc[head] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      )
    ).map(([head, receiptCount]) => ({ head, receiptCount }));
  }, [paginatedReceipts]);

  const handleExportCSV = () => {
    if (filteredReceipts.length === 0) {
      toast.error("No receipts to export");
      return;
    }
    const headers = [
      "Receipt No",
      "Location",
      "User",
      "Date",
      "Mumeen",
      "Head",
      "Currency",
      "Units",
      "Amount",
      "Discount",
      "Total",
      "Status",
    ];

    const rows = filteredReceipts.map((r) => [
      r.receiptNumber,
      r.locationCode,
      user?.name || "System User",
      new Date(r.createdAt).toLocaleString(),
      r.mumeenFullName || "N/A",
      r.head,
      r.currencyCode,
      r.units,
      r.amount,
      r.discount,
      r.totalAmount,
      r.isApproved ? "Approved" : "Pending",
    ]);

    const currencySection = [
      [],
      ["Currency-wise Collection"],
      ["Currency", "Total Amount"],
      ...CurrencySummary.map((item) => [
        item.currencyCode,
        `${(item.totalAmount || 0).toLocaleString()}`,
      ]),
    ];

    const headSection = [
      [],
      ["Head-wise Transactions"],
      ["Head", "Number of Transactions"],
      ...HeadSummary.map((item) => [
        item.head || item.head || "N/A",
        item.receiptCount?.toLocaleString() || "0",
      ]),
    ];

    const csv = [
      ["Receipts Data"],
      headers,
      ...rows,
      ...currencySection,
      ...headSection,
    ]
      .map((row) =>
        row.map((c) => `"${String(c ?? "").replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mannat_receipts_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    toast.success("Receipts and summaries exported as CSV!");
  };

  const getReceiptUserName = (
    receipt: any,
    allLocal: any[],
    currentUser: any
  ) => {
    if (receipt.createdByUserName) return receipt.createdByUserName;

    const match = allLocal.find(
      (r: any) =>
        r.userId === receipt.createdByUserID ||
        r.userId === receipt.createdByUserId
    );
    if (match?.userName) return match.userName;

    if (currentUser && receipt.createdByUserID === currentUser.id)
      return currentUser.name;

    return "Unknown User";
  };

  const handleViewReceipt = (r: any) => {
    if (!r) return;

    const detail = r.details?.[0] || {};

    const unitRate = Number(r.unitRate ?? detail.unitRate ?? 0);
    const amount = Number(r.amount ?? detail.amount ?? 0);
    const totalAmount = Number(r.totalAmount ?? detail.finalTotal ?? 0);

    const mumeenName = r.mumeenFullName || "N/A";
    const headLabel =
      r.head ||
      r.headName ||
      headIdToLabel[r.headId] ||
      headIdToLabel[detail.headId] ||
      "N/A";

    const locationLabel = (r.locationCode || "").toUpperCase().includes("KARB")
      ? "Karbala (KRB)"
      : (r.locationCode || "").toUpperCase().includes("NAJ")
        ? "Najaf (NAJ)"
        : r.locationCode || "N/A";

    const currencySymbol = getCurrencySymbol(
      r.currencyCode || detail.currencyCode
    );

    const fullDateTime = new Date(r.createdAt).toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });

    const printWindow = window.open("", "_blank", "width=800,height=700");
    if (!printWindow) {
      toast.error("Unable to open print window");
      return;
    }

    printWindow.document.write(`
    <html>
      <head>
        <title>Receipt ${r.receiptNumber}</title>
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

          <p><i>Afzalus salam</i> ${mumeenName},</p>
          <p>Thank you for your contribution. Here are your transaction details:</p>
          <p><strong>Receipt:</strong> ${r.receiptNumber}</p>
          <p><strong>Date & Time:</strong> ${fullDateTime}</p>
          <p><strong>Head:</strong> ${headLabel}</p>
          <p><strong>Location:</strong> ${locationLabel}</p>

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
                <td>${r.currencyCode || detail.currencyCode} ${
                  r.head === "Niyaz"
                    ? amount.toLocaleString()
                    : unitRate.toLocaleString()
                }</td>
                <td>${r.units || detail.units || 1}</td>
                <td>${amount.toLocaleString()}</td>
                <td>0</td>
                <td><strong>${totalAmount.toLocaleString()}</strong></td>
              </tr>
            </tbody>
          </table>

          <div class="footer">
            Receipt generated by ${user?.name || "System User"}
          </div>
        </div>

        <script>
          window.onload = function() {
            window.print();
            setTimeout(function(){ window.close(); }, 600);
          };
        </script>
      </body>
    </html>
  `);

    printWindow.document.close();
  };

  const currencySummary: Record<string, number> = filteredReceipts.reduce(
    (acc, r) => {
      acc[r.currencyCode] =
        (acc[r.currencyCode] || 0) + (Number(r.totalAmount) || 0);
      return acc;
    },
    {} as Record<string, number>
  );

  const headSummary: Record<string, number> = filteredReceipts.reduce(
    (acc, r) => {
      const h = r.head || headIdToLabel[r.headId] || String(r.headId);
      acc[h] = (acc[h] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((p) => p + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((p) => p - 1);
  };

  const today = new Date().toISOString().split("T")[0];

  const isAnyFilterActive =
    filterReceiptNo.trim() !== "" ||
    filterItsNo.trim() !== "" ||
    filterLocation !== "ALL" ||
    filterApproved !== "0" ||
    filterHead !== "ALL" ||
    filterCurrency !== "ALL" ||
    filterUser !== "ALL" ||
    (filterDateFrom && filterDateTo && filterDateFrom !== filterDateTo);

  return (
    <div className="min-h-screen pb-20">
      <div className="hidden md:block">
        <PageHeader
          title="Mannat & Niyaz Dashboard"
          description="View and manage Zabihat, Mannat, and Niyaz receipts"
          icon={<BarChart3 className="w-6 h-6" />}
        />
      </div>

      <div className="max-w-7xl mx-auto py-8 space-y-6">
        <Card className="p-6 bg-white/80 border-sky-200">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-5 w-5 text-sky-600" />
            <span className="font-medium text-sky-900">Filters</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label>Location</Label>
              <Select value={filterLocation} onValueChange={setFilterLocation}>
                <SelectTrigger className="mt-1">
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
            </div>

            <div>
              <Label>Approval Status</Label>
              <Select value={filterApproved} onValueChange={setFilterApproved}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {approvalStatuses.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>
                User {!isAdmin && !isFinance && "(Your receipts only)"}
              </Label>

              {isAdmin || isFinance ? (
                <Select value={filterUser} onValueChange={setFilterUser}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select User" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Users</SelectItem>
                    {allCreators.map((u) => (
                      <SelectItem key={u} value={u}>
                        {u}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  value={user?.name || ""}
                  readOnly
                  className="bg-gray-100 mt-1"
                  title="You can only view your own receipts"
                />
              )}
            </div>

            <div>
              <Label>Head</Label>
              <Select value={filterHead} onValueChange={setFilterHead}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {heads.map((h) => (
                    <SelectItem key={h.value} value={h.value}>
                      {h.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="filterCurrency" className="text-sky-900">
                Currency
              </Label>
              <Select value={filterCurrency} onValueChange={setFilterCurrency}>
                <SelectTrigger id="filterCurrency" className="mt-1">
                  <SelectValue placeholder="Select Currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Currencies</SelectItem>
                  {currencies.map((curr) => (
                    <SelectItem key={curr.currencyId} value={curr.currencyCode}>
                      {curr.currencyName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="filterDateFrom" className="text-sky-900">
                Date From
              </Label>
              <Input
                id="filterDateFrom"
                type="date"
                value={filterDateFrom}
                onChange={(e) => setFilterDateFrom(e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="filterDateTo" className="text-sky-900">
                Date To
              </Label>
              <Input
                id="filterDateTo"
                type="date"
                value={filterDateTo}
                onChange={(e) => setFilterDateTo(e.target.value)}
                className="mt-1"
              />
            </div>

            <div className="flex items-end gap-3 mt-2">
              <Button
                className={`flex-1 ${
                  isAnyFilterActive
                    ? "bg-sky-600 hover:bg-sky-700 text-white"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
                disabled={!isAnyFilterActive}
                onClick={isAnyFilterActive ? handleSearch : undefined}
              >
                Search
              </Button>

              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  const today = new Date().toISOString().split("T")[0];
                  setFilterDateFrom(today);
                  setFilterDateTo(today);
                  setFilterLocation("ALL");
                  setFilterApproved("0");
                  setFilterHead("ALL");
                  setFilterCurrency("ALL");
                  setFilterUser("ALL");
                  const start = new Date(today + "T00:00:00");
                  const end = new Date(today + "T23:59:59");

                  const todays = enrichedReceipts.filter((r) => {
                    const created = new Date(r.createdAt);
                    return created >= start && created <= end;
                  });

                  setFilteredReceipts(todays);
                  setCurrentPage(1);
                  setTotalPages(Math.ceil(todays.length / pageSize) || 1);

                  toast.success("Showing today's receipts");
                }}
              >
                Reset
              </Button>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white/80 border-sky-200">
          <div className="flex justify-end">
            <Button
              style={{ width: "180px" }}
              variant="outline"
              onClick={handleExportCSV}
            >
              <Download className="h-4 w-4 mr-2" /> Export CSV
            </Button>
          </div>

          <Card className="p-2 md:p-6 bg-white/80 border-sky-200">
            <div className="flex justify-between items-center mb-5">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-sky-600" />
                <span className="font-medium text-sky-900">
                  Receipts ({filteredReceipts.length})
                </span>
              </div>
              <div className="hidden md:block">
                <div className="flex gap-2">
                  <Button onClick={() => navigate("/mannat")}>
                    <Plus className="h-4 w-4 mr-2" /> New Receipt
                  </Button>
                  {(isAdmin || isFinance) && (
                    <Button
                      onClick={handleApprove}
                      disabled={selectedReceipts.length === 0}
                      className="min-w-[180px]"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" /> Approve Selected
                      ({selectedReceipts.length})
                    </Button>
                  )}
                </div>
              </div>
            </div>
            <div className="flex gap-2 md:hidden">
              <Button onClick={() => navigate("/mannat")}>
                <Plus className="h-4 w-4 mr-2" /> New Receipt
              </Button>
              {(isAdmin || isFinance) && (
                <Button
                  onClick={handleApprove}
                  disabled={selectedReceipts.length === 0}
                  className="min-w-[130px]"
                >
                  <CheckCircle className="h-4 w-4 mr-2" /> Approve(
                  {selectedReceipts.length})
                </Button>
              )}
            </div>

            <div className="overflow-x-auto">
              <Table className="min-w-full text-sm text-left">
                <TableHeader>
                  <TableRow className="bg-sky-50">
                    {(isAdmin || isFinance) && (
                      <TableHead className="w-12">
                        <Checkbox
                          checked={
                            selectedReceipts.length > 0 &&
                            selectedReceipts.length ===
                              filteredReceipts.filter((r) => !r.isApproved)
                                .length
                          }
                          onCheckedChange={(c) => handleSelectAll(c)}
                        />
                      </TableHead>
                    )}
                    <TableHead>Receipt #</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Mumeen</TableHead>
                    <TableHead>Head</TableHead>
                    <TableHead>Curr</TableHead>
                    <TableHead style={{ textAlign: "right" }}>Units</TableHead>
                    <TableHead style={{ textAlign: "right" }}>Amount</TableHead>
                    <TableHead style={{ textAlign: "right" }}>
                      Discount
                    </TableHead>
                    <TableHead style={{ textAlign: "right" }}>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loadingReceipts ? (
                    <TableRow>
                      <TableCell
                        colSpan={14}
                        className="text-center text-sky-700 py-10 font-medium"
                      >
                        Loading receipts...
                      </TableCell>
                    </TableRow>
                  ) : paginatedReceipts.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={14}
                        className="text-center text-gray-500 py-10"
                      >
                        <FileText className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                        <p>No receipts found matching the filters</p>
                        <p className="text-sm mt-1">
                          Try adjusting the filter criteria or create a new
                          receipt
                        </p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedReceipts.map((r) => (
                      <TableRow
                        key={r.receiptNumber}
                        className="hover:bg-sky-50/50 cursor-pointer"
                      >
                        {(isAdmin || isFinance) && (
                          <TableCell onClick={(e) => e.stopPropagation()}>
                            <Checkbox
                              checked={selectedReceipts.includes(r.receiptId)}
                              onCheckedChange={() =>
                                setSelectedReceipts((prev) =>
                                  prev.includes(r.receiptId)
                                    ? prev.filter((id) => id !== r.receiptId)
                                    : [...prev, r.receiptId]
                                )
                              }
                              disabled={r.isApproved}
                            />
                          </TableCell>
                        )}
                        <TableCell>{r.receiptNumber}</TableCell>
                        <TableCell>{r.locationCode}</TableCell>
                        <TableCell>
                          {r.createdByFullName ||
                            r.createdByUserName ||
                            "Unknown"}
                        </TableCell>
                        <TableCell>
                          {new Date(r.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{r.mumeenFullName}</TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex px-2 py-1 rounded text-xs ${
                              r.head === "Zabihat"
                                ? "bg-red-100 text-red-800"
                                : r.head === "Mannat"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-green-100 text-green-800"
                            }`}
                          >
                            {r.head}
                          </span>
                        </TableCell>
                        <TableCell>{r.currencyCode}</TableCell>
                        <TableCell style={{ textAlign: "right" }}>
                          {r.units}
                        </TableCell>
                        <TableCell style={{ textAlign: "right" }}>
                          {getCurrencySymbol(r.currencyCode)}{" "}
                          {(Number(r.amount) || 0).toLocaleString()}
                        </TableCell>
                        <TableCell style={{ textAlign: "right" }}>
                          {getCurrencySymbol(r.currencyCode)}{" "}
                          {(Number(r.discount) || 0).toLocaleString()}
                        </TableCell>
                        <TableCell style={{ textAlign: "right" }}>
                          {getCurrencySymbol(r.currencyCode)}{" "}
                          {(Number(r.totalAmount) || 0).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          {r.isApproved ? (
                            <span className="text-green-600 font-medium">
                              Approved
                            </span>
                          ) : (
                            <span className="text-yellow-600 font-medium">
                              Pending
                            </span>
                          )}
                        </TableCell>

                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-sky-600 hover:text-sky-700"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewReceipt(r);
                            }}
                          >
                            <Printer className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
            {!loadingReceipts && totalPages > 1 && (
              <div className="flex flex-wrap justify-between items-center mt-4 border-t pt-3 gap-3">
                <div className="flex items-center gap-3">
                  <span>
                    Page {currentPage} of {totalPages}
                  </span>

                  <div className="flex items-center gap-2">
                    <Select
                      value={String(pageSize)}
                      onValueChange={(value) => {
                        setPageSize(Number(value));
                        setCurrentPage(1);
                      }}
                    >
                      <SelectTrigger className="w-[80px]">
                        <SelectValue placeholder={pageSize.toString()} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="25">25</SelectItem>
                        <SelectItem value="100">100</SelectItem>
                      </SelectContent>
                    </Select>
                    <Label className="text-sm text-gray-700">Records</Label>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </Card>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6 border-sky-300">
              <h3 className="text-lg font-semibold mb-2">
                Currency-wise Collection
              </h3>
              {loadingReceipts || loadingSummary ? (
                <p className="text-sky-700 text-center py-10 font-medium">
                  Loading transactions...
                </p>
              ) : CurrencySummary.length === 0 ? (
                <p className="text-gray-500">No data</p>
              ) : (
                CurrencySummary.map((item: any, idx: number) => (
                  <div key={idx} className="flex justify-between">
                    <span>{item.currencyCode}</span>
                    <span>
                      {getCurrencySymbol(item.currencyCode)}{" "}
                      {(item.totalAmount || 0).toLocaleString()}
                    </span>
                  </div>
                ))
              )}
            </Card>

            <Card className="p-6 border-green-300">
              <h3 className="text-lg font-semibold mb-2">
                Head-wise Transactions
              </h3>

              {loadingReceipts || loadingSummary ? (
                <p className="text-green-700 text-center py-10 font-medium">
                  Loading transactions...
                </p>
              ) : HeadSummary.length === 0 ? (
                <p className="text-gray-500">No data</p>
              ) : (
                HeadSummary.map((item: any, idx: number) => {
                  const headName = item.headName || item.head || "N/A";
                  const receiptCount = Number(item.receiptCount || 0);

                  return (
                    <div key={idx} className="flex justify-between">
                      <span>{headName}</span>
                      <span>
                        {receiptCount.toLocaleString()} transaction
                        {receiptCount !== 1 ? "s" : ""}
                      </span>
                    </div>
                  );
                })
              )}
            </Card>
          </div>
        </Card>
      </div>
    </div>
  ); 
}
