import { useState, useEffect } from 'react';
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
  DialogOverlay,
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
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Globe, 
  MapPin, 
  RefreshCw,
  AlertCircle,
  Database,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { toast } from 'sonner';
import { addCity, addCountry, ApiCity, ApiCountry, deleteCity, deleteCountry, getAllCities, getAllCountries, getCountriesWithCities, updateCity, updateCountry } from "../services/countryCityService";


interface City {
  id: string;
  name: string;
  displayName?: string; // Optional manual override
  code: string;
  status: 'active' | 'inactive' | 'deprecated';
}

interface Country {
  id: string;
  name: string;
  displayName?: string; // Optional manual override
  code: string;
  cities: City[];
  status: 'active' | 'inactive';
}

// Comprehensive list of world countries with ISO codes
const WORLD_COUNTRIES = [
  { name: 'Afghanistan', code: 'AF' },
  { name: 'Albania', code: 'AL' },
  { name: 'Algeria', code: 'DZ' },
  { name: 'Andorra', code: 'AD' },
  { name: 'Angola', code: 'AO' },
  { name: 'Argentina', code: 'AR' },
  { name: 'Armenia', code: 'AM' },
  { name: 'Australia', code: 'AU' },
  { name: 'Austria', code: 'AT' },
  { name: 'Azerbaijan', code: 'AZ' },
  { name: 'Bahrain', code: 'BH' },
  { name: 'Bangladesh', code: 'BD' },
  { name: 'Belarus', code: 'BY' },
  { name: 'Belgium', code: 'BE' },
  { name: 'Bhutan', code: 'BT' },
  { name: 'Bolivia', code: 'BO' },
  { name: 'Bosnia and Herzegovina', code: 'BA' },
  { name: 'Brazil', code: 'BR' },
  { name: 'Brunei', code: 'BN' },
  { name: 'Bulgaria', code: 'BG' },
  { name: 'Cambodia', code: 'KH' },
  { name: 'Canada', code: 'CA' },
  { name: 'Chile', code: 'CL' },
  { name: 'China', code: 'CN' },
  { name: 'Colombia', code: 'CO' },
  { name: 'Croatia', code: 'HR' },
  { name: 'Cuba', code: 'CU' },
  { name: 'Cyprus', code: 'CY' },
  { name: 'Czech Republic', code: 'CZ' },
  { name: 'Denmark', code: 'DK' },
  { name: 'Egypt', code: 'EG' },
  { name: 'Estonia', code: 'EE' },
  { name: 'Ethiopia', code: 'ET' },
  { name: 'Finland', code: 'FI' },
  { name: 'France', code: 'FR' },
  { name: 'Georgia', code: 'GE' },
  { name: 'Germany', code: 'DE' },
  { name: 'Ghana', code: 'GH' },
  { name: 'Greece', code: 'GR' },
  { name: 'Hungary', code: 'HU' },
  { name: 'Iceland', code: 'IS' },
  { name: 'India', code: 'IN' },
  { name: 'Indonesia', code: 'ID' },
  { name: 'Iran', code: 'IR' },
  { name: 'Iraq', code: 'IQ' },
  { name: 'Ireland', code: 'IE' },
  { name: 'Israel', code: 'IL' },
  { name: 'Italy', code: 'IT' },
  { name: 'Japan', code: 'JP' },
  { name: 'Jordan', code: 'JO' },
  { name: 'Kazakhstan', code: 'KZ' },
  { name: 'Kenya', code: 'KE' },
  { name: 'Kuwait', code: 'KW' },
  { name: 'Kyrgyzstan', code: 'KG' },
  { name: 'Latvia', code: 'LV' },
  { name: 'Lebanon', code: 'LB' },
  { name: 'Libya', code: 'LY' },
  { name: 'Lithuania', code: 'LT' },
  { name: 'Luxembourg', code: 'LU' },
  { name: 'Malaysia', code: 'MY' },
  { name: 'Maldives', code: 'MV' },
  { name: 'Malta', code: 'MT' },
  { name: 'Mexico', code: 'MX' },
  { name: 'Morocco', code: 'MA' },
  { name: 'Nepal', code: 'NP' },
  { name: 'Netherlands', code: 'NL' },
  { name: 'New Zealand', code: 'NZ' },
  { name: 'Nigeria', code: 'NG' },
  { name: 'Norway', code: 'NO' },
  { name: 'Oman', code: 'OM' },
  { name: 'Pakistan', code: 'PK' },
  { name: 'Palestine', code: 'PS' },
  { name: 'Peru', code: 'PE' },
  { name: 'Philippines', code: 'PH' },
  { name: 'Poland', code: 'PL' },
  { name: 'Portugal', code: 'PT' },
  { name: 'Qatar', code: 'QA' },
  { name: 'Romania', code: 'RO' },
  { name: 'Russia', code: 'RU' },
  { name: 'Saudi Arabia', code: 'SA' },
  { name: 'Serbia', code: 'RS' },
  { name: 'Singapore', code: 'SG' },
  { name: 'Slovakia', code: 'SK' },
  { name: 'Slovenia', code: 'SI' },
  { name: 'South Africa', code: 'ZA' },
  { name: 'South Korea', code: 'KR' },
  { name: 'Spain', code: 'ES' },
  { name: 'Sri Lanka', code: 'LK' },
  { name: 'Sudan', code: 'SD' },
  { name: 'Sweden', code: 'SE' },
  { name: 'Switzerland', code: 'CH' },
  { name: 'Syria', code: 'SY' },
  { name: 'Taiwan', code: 'TW' },
  { name: 'Tajikistan', code: 'TJ' },
  { name: 'Tanzania', code: 'TZ' },
  { name: 'Thailand', code: 'TH' },
  { name: 'Tunisia', code: 'TN' },
  { name: 'Turkey', code: 'TR' },
  { name: 'Turkmenistan', code: 'TM' },
  { name: 'Uganda', code: 'UG' },
  { name: 'Ukraine', code: 'UA' },
  { name: 'United Arab Emirates', code: 'AE' },
  { name: 'United Kingdom', code: 'GB' },
  { name: 'United States', code: 'US' },
  { name: 'Uzbekistan', code: 'UZ' },
  { name: 'Venezuela', code: 'VE' },
  { name: 'Vietnam', code: 'VN' },
  { name: 'Yemen', code: 'YE' },
  { name: 'Zambia', code: 'ZM' },
  { name: 'Zimbabwe', code: 'ZW' },
].sort((a, b) => a.name.localeCompare(b.name));

// Mock cities database by country code


export const CountryCityMasterPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddCountryDialogOpen, setIsAddCountryDialogOpen] = useState(false);
  const [isAddCityDialogOpen, setIsAddCityDialogOpen] = useState(false);
  const [isEditCountryDialogOpen, setIsEditCountryDialogOpen] = useState(false);
  const [isEditCityDialogOpen, setIsEditCityDialogOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [editingCountry, setEditingCountry] = useState<Country | null>(null);
  const [editingCity, setEditingCity] = useState<City | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSynced, setLastSynced] = useState<Date | null>(null);

  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);

  const [allCities, setAllCities] = useState<ApiCity[]>([]);

  const [apiCountryList, setApiCountryList] = useState<ApiCountry[]>([]);

  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [cityToDelete, setCityToDelete] = useState<string | null>(null);

  const [isDeleteCountryOpen, setIsDeleteCountryOpen] = useState(false);
  const [countryToDelete, setCountryToDelete] = useState<string | null>(null);



  // Form state for adding country
  const [countryFormData, setCountryFormData] = useState({
    selectedCountry: '',
    manualCountryName: '',
    status: 'active' as 'active' | 'inactive',
  });

  // Form state for adding city
  const [cityFormData, setCityFormData] = useState({
    selectedCity: '',
    manualCityName: '',
    cityCode: '',
    status: 'active' as 'active' | 'inactive' | 'deprecated',
  });

  // Form state for editing country
  const [editCountryFormData, setEditCountryFormData] = useState({
    name: '',
    displayName: '',
    code: '',
    status: 'active' as 'active' | 'inactive',
  });

  // Form state for editing city
  const [editCityFormData, setEditCityFormData] = useState({
    name: '',
    displayName: '',
    code: '',
    status: 'active' as 'active' | 'inactive' | 'deprecated',
  });

  const [availableCities, setAvailableCities] = useState<string[]>([]);

  useEffect(() => {
    loadDataFromAPI();
    loadCitiesFromAPI();
    }, []);

  const loadDataFromAPI = async () => {
    try {
      setLoading(true);

      const apiData = await getCountriesWithCities();

      const mapped = apiData.map((c: any) => ({
        id: String(c.countryId),
        name: c.countryName,
        displayName: undefined,
        code: c.iso2,          
        iso3: c.iso3,
        countryCode: c.countryCode,
        status: "active",
        cities: c.cities.map((city: any) => ({
          id: String(city.cityId),
          name: city.cityName,
          displayName: undefined,
          code: city.postalCode || "",
          status: "active",
        })),
      }));
      setCountries(mapped);
    } catch (error) {
      console.error("Failed to load countries:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadCitiesFromAPI = async () => {
    try {
      const data = await getAllCities();
      setAllCities(data);
    } catch (err) {
      console.error("Failed to load cities:", err);
    }
  };

  useEffect(() => {
    loadCountriesFromAPI();
  }, []);

  const loadCountriesFromAPI = async () => {
    try {
      const data = await getAllCountries();
      setApiCountryList(data); // For dropdown
    } catch (error) {
      console.error("Failed to load countries:", error);
    }
  };

  // Load available cities when country is selected for adding city
  useEffect(() => {
    if (selectedCountry) {
      const cities = allCities
        .filter(c => c.countryId === Number(selectedCountry.id))
        .map(c => c.cityName)
        .sort();

      setAvailableCities(cities);
    }
  }, [selectedCountry]);

  const filteredCountries = countries.filter(country =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.cities.some(city => 
      city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      city.displayName?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleAddCountry = async () => {
    if (!countryFormData.selectedCountry) {
      toast.error("Please select a country");
      return;
    }

    const selected = apiCountryList.find(
      (c) => String(c.countryId) === countryFormData.selectedCountry
    );

    if (!selected) return;

    try {
      const payload = {
        countryName: countryFormData.manualCountryName || selected.countryName,
        iso2: selected.iso2,
        iso3: selected.iso3,
        countryCode: selected.countryCode,
      };

      await addCountry(payload);
      toast.success("Country added successfully");

      setIsAddCountryDialogOpen(false);
      setCountryFormData({ selectedCountry: "", manualCountryName: "", status: "active" });

      // Refresh countries table
      await loadDataFromAPI();
      await loadCountriesFromAPI();
    } catch (err) {
      console.error("Failed to add country:", err);
      toast.error("Failed to add country");
    }
  };


  const handleAddCity = async () => {
  if (!selectedCountry) return;

  if (!cityFormData.selectedCity && !cityFormData.manualCityName) {
    toast.error('Please select or enter a city name');
    return;
  }

  const cityName = cityFormData.manualCityName || cityFormData.selectedCity;

  try {
    const payload = {
      cityName,
      postalCode: cityFormData.cityCode, // backend expects postalCode
      countryId: Number(selectedCountry.id)
    };

    const response = await addCity(payload); // API call

    toast.success("City created successfully");

    // Refresh cities
    await loadDataFromAPI();
    await loadCitiesFromAPI();

    setIsAddCityDialogOpen(false);
    setCityFormData({
      selectedCity: '',
      manualCityName: '',
      cityCode: '',
      status: 'active'
    });

  } catch (err) {
    console.error(err);
    toast.error("Failed to add city");
  }
  };


  const handleDeleteCity = (cityId: string) => {
    setCityToDelete(cityId);
    setIsDeleteConfirmOpen(true);
  };

  const confirmDeleteCity = async () => {
    if (!cityToDelete) return;

    try {
      const res = await deleteCity(Number(cityToDelete));

      if (res.deleted) {
        toast.success("City deleted successfully");
      } else {
        toast.error("Failed to delete city");
      }

      await loadDataFromAPI();
      await loadCitiesFromAPI();

    } catch (err) {
      console.error("Delete failed:", err);
      toast.error("Failed to delete city");
    }

    setIsDeleteConfirmOpen(false);
    setCityToDelete(null);
  };

  const handleDeleteCountry = (countryId: string) => {
    setCountryToDelete(countryId);
    setIsDeleteCountryOpen(true);
  };

  const confirmDeleteCountry = async () => {
    if (!countryToDelete) return;

    try {
      const res = await deleteCountry(Number(countryToDelete));

      if (res.deleted) {
        toast.success("Country deleted successfully");
      } else {
        toast.error("Failed to delete country");
      }

      await loadDataFromAPI();
      await loadCountriesFromAPI();

    } catch (err) {
      console.error("Failed to delete country:", err);
      toast.error("Failed to delete country");
    }

    setIsDeleteCountryOpen(false);
    setCountryToDelete(null);
  };



  const handleUpdateCityStatus = (countryId: string, cityId: string, newStatus: 'active' | 'inactive' | 'deprecated') => {
    const updatedCountries = countries.map(country =>
      country.id === countryId
        ? {
            ...country,
            cities: country.cities.map(city =>
              city.id === cityId ? { ...city, status: newStatus } : city
            )
          }
        : country
    );

    setCountries(updatedCountries);
    toast.success('City status updated successfully');
  };





  const handleEditCountry = (country: Country) => {
    setEditingCountry(country);
    setEditCountryFormData({
      name: country.name,
      displayName: country.displayName || '',
      code: country.code,
      status: country.status,
    });
    setIsEditCountryDialogOpen(true);
  };

  const handleUpdateCountry = async () => {
    if (!editingCountry) return;

    try {
      const payload = {
        countryId: Number(editingCountry.id),
        countryName: editCountryFormData.displayName || editCountryFormData.name,
        iso2: editingCountry.code,   
        iso3: editingCountry.code + "X", 
        countryCode: editingCountry.code, 
      };

      const res = await updateCountry(payload);

      if (res.updated) {
        toast.success("Country updated successfully");
      } else {
        toast.error("Failed to update country");
      }

      // refresh
      await loadDataFromAPI();
      await loadCountriesFromAPI();

      // cleanup
      setIsEditCountryDialogOpen(false);
      setEditingCountry(null);
      setEditCountryFormData({ name: "", displayName: "", code: "", status: "active" });

    } catch (err) {
      console.error("Update failed:", err);
      toast.error("Failed to update country");
    }
  };


  const handleEditCity = (country: Country, city: City) => {
    setSelectedCountry(country);
    setEditingCity(city);
    setEditCityFormData({
      name: city.name,
      displayName: city.displayName || '',
      code: city.code,
      status: city.status,
    });
    setIsEditCityDialogOpen(true);
  };

  const handleUpdateCity = async () => {
  if (!editingCity || !selectedCountry) return;

  try {
    const payload = {
      cityId: Number(editingCity.id),
      cityName: editCityFormData.displayName || editCityFormData.name,
      postalCode: editCityFormData.code,   // backend uses postalCode
      countryId: Number(selectedCountry.id)
    };

    const res = await updateCity(payload);

    if (res.updated) {
      toast.success("City updated successfully");
    } else {
      toast.error("City update failed");
    }

    // Refresh fresh data
    await loadDataFromAPI();
    await loadCitiesFromAPI();

    // Close dialog & reset
    setIsEditCityDialogOpen(false);
    setEditingCity(null);
    setSelectedCountry(null);
    setEditCityFormData({ name: "", displayName: "", code: "", status: "active" });

  } catch (err) {
    console.error("Failed to update city:", err);
    toast.error("Failed to update city");
  }
  };

 

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      active: "bg-green-100 text-green-700 border-green-300",
      inactive: "bg-gray-100 text-gray-700 border-gray-300",
      deprecated: "bg-orange-100 text-orange-700 border-orange-300",
    };

    return (
      <Badge
        variant="outline"
        className={variants[status] || variants.active}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };


  const formatLastSynced = (date: Date | null) => {
    if (!date) return 'Never synced';
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return `${days} day${days > 1 ? 's' : ''} ago`;
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 style={{ color: '#5B9BD5' }} className="flex items-center gap-2">
            <Globe className="w-6 h-6" />
            Country - City Master
          </h1>
          <p className="text-gray-600 mt-1">
            Manage global country-city mapping for the entire platform
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={() => setIsAddCountryDialogOpen(true)}
            style={{ background: '#5B9BD5' }}
            className="text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Country
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="border-blue-200 bg-blue-50/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600">Total Countries</p>
                <p className="text-2xl font-bold text-blue-900">{countries.length}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Globe className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-emerald-200 bg-emerald-50/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-emerald-600">Total Cities</p>
                <p className="text-2xl font-bold text-emerald-900">
                  {countries.reduce((sum, country) => sum + country.cities.length, 0)}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                <MapPin className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600">Active Countries</p>
                <p className="text-2xl font-bold text-green-900">
                  {countries.filter(c => c.status === 'active').length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card className="bg-white border-[#5B9BD5]/30">
        <CardContent className="p-6">
          <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search countries or cities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border border-gray-300 bg-gray-50 focus:bg-white focus:border-[#5B9BD5] text-base h-11 rounded-lg"
              />
            </div>
        </CardContent>
      </Card>

      {/* Countries Table - Desktop */}
      <Card className="bg-white border-[#5B9BD5]/30 hidden lg:block rounded-2xl">
        <CardHeader className="border-b bg-gradient-to-r from-sky-50 to-blue-50 pb-6">
          <CardTitle className="text-[#5B9BD5]">Countries & Cities</CardTitle>
          <CardDescription>
            {filteredCountries.length} countr{filteredCountries.length !== 1 ? 'ies' : 'y'} found
          </CardDescription>
        </CardHeader>
        <CardContent className="pr-0 pl-0 pb-6">
          <div className="overflow-x-auto">

            {loading && (
              <div className="text-center py-6 text-gray-500">Loading...</div>
            )}

            <Table>
              <TableHeader>
                <TableRow className="bg-gradient-to-r from-sky-50 to-blue-50">
                  <TableHead style={{ color: '#5B9BD5' }} className="px-6 py-4">Country</TableHead>
                  <TableHead style={{ color: '#5B9BD5' }} className="px-6 py-4">Code</TableHead>
                  <TableHead style={{ color: '#5B9BD5' }} className="px-6 py-4">Cities</TableHead>
                  <TableHead style={{ color: '#5B9BD5' }} className="px-6 py-4">Status</TableHead>
                  <TableHead style={{ color: '#5B9BD5' }} className="px-6 py-4 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredCountries.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-10 px-6 text-gray-500">
                      No countries found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCountries.map((country) => (
                    <TableRow
                      key={country.id}
                      className="hover:bg-sky-50/30 py-6 border-b last:border-b-0"
                    >
                      {/* COUNTRY NAME */}
                      <TableCell className="px-6 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-sky-100 to-blue-100 flex items-center justify-center">
                            <Globe className="w-6 h-6 text-[#5B9BD5]" />
                          </div>

                          <div className="flex flex-col">
                            <span className="text-gray-900 font-medium text-lg">
                              {country.displayName || country.name}
                            </span>
                            {country.displayName && (
                              <span className="text-xs text-gray-500">({country.name})</span>
                            )}
                          </div>
                        </div>
                      </TableCell>

                      {/* COUNTRY CODE */}
                      <TableCell className="px-6 py-6">
                        <Badge variant="outline" className="border-[#5B9BD5]/30 text-[#5B9BD5] font-medium">
                          {country.code}
                        </Badge>
                      </TableCell>

                      {/* CITY LIST */}
                      <TableCell className="px-6 py-6">
                        <div className="space-y-4">

                          {country.cities.length === 0 ? (
                            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                              <MapPin className="w-4 h-4 text-gray-400" />
                              <p className="text-sm text-gray-500 italic">No cities added yet</p>
                            </div>
                          ) : (
                            country.cities.map((city) => (
                              <div
                                key={city.id}
                                className="flex items-center justify-between gap-3 p-4 bg-gradient-to-r from-sky-50 to-blue-50 rounded-lg border border-sky-200 hover:border-sky-300 transition-colors"
                              >
                                <div className="flex items-center gap-4 flex-1 min-w-0">
                                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                                    <MapPin className="w-4 h-4 text-[#5B9BD5]" />
                                  </div>

                                  <div className="flex flex-col flex-1 min-w-0">
                                    <span className="text-sm font-medium text-gray-900 truncate">
                                      {city.displayName || city.name}
                                    </span>
                                    {city.displayName && (
                                      <span className="text-xs text-gray-500 truncate">
                                        ({city.name})
                                      </span>
                                    )}
                                  </div>

                                  <Badge variant="outline" className="text-xs border-[#5B9BD5]/30 text-[#5B9BD5] font-medium">
                                    {city.code}
                                  </Badge>
                                </div>

                                <div className="flex items-center gap-2">
                                  {getStatusBadge(city.status)}
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleEditCity(country, city)}
                                    className="text-[#5B9BD5] hover:bg-white h-9 w-9 p-0"
                                  >
                                    <Edit2 className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleDeleteCity(city.id)}
                                    className="text-red-600 hover:bg-white h-9 w-9 p-0"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>

                                </div>
                              </div>
                            ))
                          )}

                          {/* ADD CITY BUTTON */}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setSelectedCountry(country);
                              setIsAddCityDialogOpen(true);
                            }}
                            className="w-full mt-3 text-[#5B9BD5] hover:bg-sky-100 border border-dashed border-sky-300 py-3"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Add City to {country.displayName || country.name}
                          </Button>
                        </div>
                      </TableCell>

                      {/* COUNTRY STATUS */}
                      <TableCell className="px-6 py-6">
                        {getStatusBadge(country.status)}
                      </TableCell>

                      {/* ACTIONS */}
                      <TableCell className="px-6 py-6 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEditCountry(country)}
                            className="text-[#5B9BD5] hover:bg-sky-50"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>

                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteCountry(country.id)}
                            className="text-red-600 hover:bg-red-50"
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


      {/* Mobile Cards - same data & actions, single codebase */}
      <div className="space-y-4 lg:hidden">
        {filteredCountries.length === 0 ? (
          <Card className="border-[#5B9BD5]/30">
            <CardContent className="p-8 text-center">
              <p className="text-gray-500">No countries found</p>
            </CardContent>
          </Card>
        ) : (
          filteredCountries.map((country) => (
            <Card key={country.id} className="border-[#5B9BD5]/30">
              <CardHeader className="pb-3 bg-white">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-100 to-blue-100 flex items-center justify-center flex-shrink-0">
                      <Globe className="w-5 h-5 text-[#5B9BD5]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base text-gray-900 truncate">
                        {country.displayName || country.name}
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="border-[#5B9BD5]/30 text-[#5B9BD5] text-xs">
                          {country.code}
                        </Badge>
                        {getStatusBadge(country.status)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEditCountry(country)}
                      className="text-[#5B9BD5] hover:bg-white h-8 w-8 p-0"
                      title="Edit country"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      // onClick={() => handleDeleteCountry(country.id)}
                      className="text-red-600 hover:bg-red-50 h-8 w-8 p-0"
                      title="Delete country"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-3 space-y-2">
                <div className="text-xs text-gray-600 mb-2">
                  Cities ({country.cities.length})
                </div>

                {country.cities.length === 0 ? (
                  <div className="flex items-center gap-2 p-3 bg-white rounded-lg border border-gray-200">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <p className="text-sm text-gray-500 italic">No cities added yet</p>
                  </div>
                ) : (
                  country.cities.map((city) => (
                    <div key={city.id} className="p-3 bg-white rounded-lg border border-sky-200">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2 flex-1 min-w-0">
                          <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center flex-shrink-0 mt-0.5">
                            <MapPin className="w-3.5 h-3.5 text-[#5B9BD5]" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-gray-900 truncate">
                              {city.displayName || city.name}
                            </div>
                            <div className="flex items-center gap-2 mt-1 flex-wrap">
                              <Badge variant="outline" className="text-xs border-[#5B9BD5]/30 text-[#5B9BD5]">
                                {city.code}
                              </Badge>
                              {getStatusBadge(city.status)}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEditCity(country, city)}
                            className="text-[#5B9BD5] hover:bg-white h-7 w-7 p-0"
                            title="Edit city"
                          >
                            <Edit2 className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            // onClick={() => handleDeleteCity(country.id, city.id)}
                            className="text-red-600 hover:bg-red-50 h-7 w-7 p-0"
                            title="Delete city"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}

                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => { setSelectedCountry(country); setIsAddCityDialogOpen(true); }}
                  className="w-full text-[#5B9BD5] hover:bg-sky-100 border border-dashed border-sky-300 py-2 text-xs"
                >
                  <Plus className="w-3.5 h-3.5 mr-1.5" />
                  Add City
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Add Country Dialog */}
      <Dialog open={isAddCountryDialogOpen} onOpenChange={setIsAddCountryDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle style={{ color: '#5B9BD5' }}>Add New Country</DialogTitle>
            <DialogDescription>
              Select a country from the dropdown and optionally provide a custom display name
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="countrySelect">
                Country <span className="text-red-500">*</span>
              </Label>
              <Select 
                value={countryFormData.selectedCountry} 
                onValueChange={(value) => {
                  setCountryFormData({ ...countryFormData, selectedCountry: value });
                }}
              >
                <SelectTrigger id="countrySelect">
                  <SelectValue placeholder="Select a country" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  {apiCountryList.map((country) => (
                    <SelectItem key={country.countryId} value={String(country.countryId)}>
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-[#5B9BD5]" />
                        {country.countryName} ({country.iso2})
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500">Select from the complete list of world countries</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="manualCountryName">
                Custom Display Name <span className="text-gray-500">(Optional)</span>
              </Label>
              <Input
                id="manualCountryName"
                placeholder="e.g., Kingdom of Saudi Arabia"
                value={countryFormData.manualCountryName}
                onChange={(e) => setCountryFormData({ ...countryFormData, manualCountryName: e.target.value })}
              />
              <p className="text-xs text-gray-500">
                Override the default country name with a custom label (e.g., "KSA" instead of "Saudi Arabia")
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="countryStatus">Status</Label>
              <Select
                value={countryFormData.status}
                onValueChange={(value: any) => setCountryFormData({ ...countryFormData, status: value })}
              >
                <SelectTrigger id="countryStatus">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {countryFormData.selectedCountry && (
              <Card className="p-3 bg-blue-50/50 border-blue-200">
                <div className="flex items-start gap-2">
                  <Database className="w-4 h-4 text-blue-600 mt-0.5" />
                  <div className="text-xs text-blue-800">
                    <strong>Preview:</strong> This country will be saved as "
                    {countryFormData.manualCountryName || 
                     WORLD_COUNTRIES.find(c => c.code === countryFormData.selectedCountry)?.name}"
                    {countryFormData.manualCountryName && (
                      <span> (Original: {WORLD_COUNTRIES.find(c => c.code === countryFormData.selectedCountry)?.name})</span>
                    )}
                  </div>
                </div>
              </Card>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsAddCountryDialogOpen(false);
                setCountryFormData({ selectedCountry: '', manualCountryName: '', status: 'active' });
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddCountry}
              disabled={!countryFormData.selectedCountry}
              style={{ background: '#5B9BD5' }}
              className="text-white"
            >
              Add Country
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Country Dialog */}
      <Dialog open={isEditCountryDialogOpen} onOpenChange={setIsEditCountryDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle style={{ color: '#5B9BD5' }}>Edit Country</DialogTitle>
            <DialogDescription>
              Update the country details and display name
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Country Name</Label>
              <Input
                value={editCountryFormData.name}
                disabled
                className="bg-gray-50 cursor-not-allowed"
              />
              <p className="text-xs text-gray-500">Country name cannot be changed</p>
            </div>

            <div className="space-y-2">
              <Label>Country Code</Label>
              <Input
                value={editCountryFormData.code}
                disabled
                className="bg-gray-50 cursor-not-allowed"
              />
              <p className="text-xs text-gray-500">Country code cannot be changed</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="editCountryDisplayName">
                Custom Display Name <span className="text-gray-500">(Optional)</span>
              </Label>
              <Input
                id="editCountryDisplayName"
                placeholder="e.g., Kingdom of Saudi Arabia"
                value={editCountryFormData.displayName}
                onChange={(e) => setEditCountryFormData({ ...editCountryFormData, displayName: e.target.value })}
              />
              <p className="text-xs text-gray-500">
                Override the default country name with a custom label
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="editCountryStatus">Status</Label>
              <Select
                value={editCountryFormData.status}
                onValueChange={(value: any) => setEditCountryFormData({ ...editCountryFormData, status: value })}
              >
                <SelectTrigger id="editCountryStatus">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {editCountryFormData.displayName && (
              <Card className="p-3 bg-blue-50/50 border-blue-200">
                <div className="flex items-start gap-2">
                  <Database className="w-4 h-4 text-blue-600 mt-0.5" />
                  <div className="text-xs text-blue-800">
                    <strong>Preview:</strong> This country will be displayed as "
                    {editCountryFormData.displayName}" (Original: {editCountryFormData.name})
                  </div>
                </div>
              </Card>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditCountryDialogOpen(false);
                setEditingCountry(null);
                setEditCountryFormData({ name: '', displayName: '', code: '', status: 'active' });
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateCountry}
              style={{ background: '#5B9BD5' }}
              className="text-white"
            >
              Update Country
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit City Dialog */}
      <Dialog open={isEditCityDialogOpen} onOpenChange={setIsEditCityDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle style={{ color: '#5B9BD5' }}>Edit City</DialogTitle>
            <DialogDescription>
              Update the city details, display name, and code
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>City Name</Label>
              <Input
                value={editCityFormData.name}
                disabled
                className="bg-gray-50 cursor-not-allowed"
              />
              <p className="text-xs text-gray-500">City name cannot be changed</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="editCityDisplayName">
                Custom Display Name <span className="text-gray-500">(Optional)</span>
              </Label>
              <Input
                id="editCityDisplayName"
                placeholder="e.g., Makkah instead of Mecca"
                value={editCityFormData.displayName}
                onChange={(e) => setEditCityFormData({ ...editCityFormData, displayName: e.target.value })}
              />
              <p className="text-xs text-gray-500">
                Override the default city name with a custom label for localization
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="editCityCode">
                City Code <span className="text-red-500">*</span>
              </Label>
              <Input
                id="editCityCode"
                placeholder="e.g., KRB"
                value={editCityFormData.code}
                onChange={(e) => setEditCityFormData({ ...editCityFormData, code: e.target.value.toUpperCase() })}
                maxLength={5}
              />
              <p className="text-xs text-gray-500">Internal reference code (2-5 characters)</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="editCityStatus">Status</Label>
              <Select
                value={editCityFormData.status}
                onValueChange={(value: any) => setEditCityFormData({ ...editCityFormData, status: value })}
              >
                <SelectTrigger id="editCityStatus">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="deprecated">Deprecated</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {editCityFormData.displayName && (
              <Card className="p-3 bg-blue-50/50 border-blue-200">
                <div className="flex items-start gap-2">
                  <Database className="w-4 h-4 text-blue-600 mt-0.5" />
                  <div className="text-xs text-blue-800">
                    <strong>Preview:</strong> This city will be displayed as "
                    {editCityFormData.displayName}" (Original: {editCityFormData.name})
                  </div>
                </div>
              </Card>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditCityDialogOpen(false);
                setEditingCity(null);
                setSelectedCountry(null);
                setEditCityFormData({ name: '', displayName: '', code: '', status: 'active' });
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateCity}
              disabled={!editCityFormData.code}
              style={{ background: '#5B9BD5' }}
              className="text-white"
            >
              Update City
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add City Dialog */}
      <Dialog open={isAddCityDialogOpen} onOpenChange={setIsAddCityDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle style={{ color: '#5B9BD5' }}>
              Add City to {selectedCountry?.displayName || selectedCountry?.name}
            </DialogTitle>
            <DialogDescription>
              Select a city from the dropdown or enter a custom city name if not available
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="citySelect">
                City <span className="text-gray-500">(Optional if manual name provided)</span>
              </Label>
              <Select 
                value={cityFormData.selectedCity} 
                onValueChange={(value) => {
                  setCityFormData({ ...cityFormData, selectedCity: value });
                }}
              >
                <SelectTrigger id="citySelect">
                  <SelectValue placeholder="Select a city (optional)" />
                </SelectTrigger>
                <SelectContent className="max-h-[200px]">
                  {availableCities.length === 0 ? (
                    <div className="p-4 text-center text-sm text-gray-500">
                      No cities available in database. Use manual entry below.
                    </div>
                  ) : (
                    availableCities.map((city) => (
                      <SelectItem key={city} value={city}>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-[#5B9BD5]" />
                          {city}
                        </div>
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500">
                {availableCities.length > 0 
                  ? `${availableCities.length} cities available for ${selectedCountry?.name}`
                  : 'No cities in database - please use manual entry'
                }
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="manualCityName">
                Manual City Name <span className="text-gray-500">(Required if city not in dropdown)</span>
              </Label>
              <Input
                id="manualCityName"
                placeholder="e.g., Karbala or custom name like 'Holy Karbala'"
                value={cityFormData.manualCityName}
                onChange={(e) => setCityFormData({ ...cityFormData, manualCityName: e.target.value })}
              />
              <p className="text-xs text-gray-500">
                {cityFormData.selectedCity 
                  ? 'This will override the display name of the selected city'
                  : 'Enter the city name if not available in the dropdown above'
                }
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cityCode">
                City Code <span className="text-red-500">*</span>
              </Label>
              <Input
                id="cityCode"
                placeholder="e.g., KRB"
                value={cityFormData.cityCode}
                onChange={(e) => setCityFormData({ ...cityFormData, cityCode: e.target.value.toUpperCase() })}
                maxLength={5}
              />
              <p className="text-xs text-gray-500">Internal reference code (2-5 characters)</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cityStatus">Status</Label>
              <Select
                value={cityFormData.status}
                onValueChange={(value: any) => setCityFormData({ ...cityFormData, status: value })}
              >
                <SelectTrigger id="cityStatus">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="deprecated">Deprecated</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {(cityFormData.selectedCity || cityFormData.manualCityName) && (
              <Card className="p-3 bg-blue-50/50 border-blue-200">
                <div className="flex items-start gap-2">
                  <Database className="w-4 h-4 text-blue-600 mt-0.5" />
                  <div className="text-xs text-blue-800">
                    <strong>Preview:</strong> This city will be saved as "
                    {cityFormData.manualCityName || cityFormData.selectedCity}"
                    {cityFormData.manualCityName && cityFormData.selectedCity && (
                      <span> (Original: {cityFormData.selectedCity})</span>
                    )}
                  </div>
                </div>
              </Card>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsAddCityDialogOpen(false);
                setSelectedCountry(null);
                setCityFormData({ selectedCity: '', manualCityName: '', cityCode: '', status: 'active' });
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddCity}
              disabled={(!cityFormData.selectedCity && !cityFormData.manualCityName) || !cityFormData.cityCode}
              style={{ background: '#5B9BD5' }}
              className="text-white"
            >
              Add City
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete City Dialog */}
      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen} modal={false}>
        <DialogOverlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" />
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-red-600">Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this city? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteConfirmOpen(false)}
            >
              No
            </Button>

            <Button
              style={{ background: "#c6110bff" }}
              className="text-white"
              onClick={confirmDeleteCity}
            >
              Yes, Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Country Dialog */}
      <Dialog open={isDeleteCountryOpen} onOpenChange={setIsDeleteCountryOpen} modal={false}>
        <DialogOverlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" />
        <DialogContent className="sm:max-w-[400px] z-50">
          <DialogHeader>
            <DialogTitle className="text-red-600">Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this country? All its cities will be removed. 
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteCountryOpen(false)}>
              No
            </Button>

            <Button
              style={{ background: "#c6110bff" }}
              className="text-white"
              onClick={confirmDeleteCountry}
            >
              Yes, Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
};