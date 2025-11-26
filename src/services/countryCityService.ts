import axiosInstance from "./axiosInstance";

export interface ApiCity {
  cityId: number;
  cityName: string;
  postalCode: string;
  countryId: number;
}

export interface ApiCountry {
  countryId: number;
  countryName: string;
  iso2: string;
  iso3: string;
  countryCode: string;
  cities: ApiCity[];
}

// GET: /City/countries-with-cities
export const getCountriesWithCities = async () => {
  const res = await axiosInstance.get("/City/countries-with-cities");
  return res.data;
};

// GET: /City  (get all cities)
export const getAllCities = async () => {
  const res = await axiosInstance.get("/City");
  return res.data; 
};

// POST: /City
export const addCity = async (payload: {
  cityName: string;
  postalCode: string; 
  countryId: number;
}) => {
  const res = await axiosInstance.post("/City", payload);
  return res.data; 
};

// GET all countries
export const getAllCountries = async (): Promise<ApiCountry[]> => {
  const res = await axiosInstance.get("/Country");
  return res.data;
};

// POST new country
export const addCountry = async (payload: {
  countryName: string;
  iso2: string;
  iso3: string;
  countryCode: string;
}) => {
  const res = await axiosInstance.post("/Country", payload);
  return res.data; // { countryId: number }
};