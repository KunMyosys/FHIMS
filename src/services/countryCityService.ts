import axiosInstance from "./axiosInstance";

export interface ApiCity {
  cityId: number;
  cityName: string;
  cityCode: string;
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
  cityCode: string; 
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
  return res.data; 
};

// PUT: /City  (update existing city)
export const updateCity = async (payload: {
  cityId: number;
  cityName: string;
  cityCode: string;
  countryId: number;
}) => {
  const res = await axiosInstance.put("/City", payload);
  return res.data; 
};

// DELETE: /City/{id}
export const deleteCity = async (cityId: number) => {
  const res = await axiosInstance.delete(`/City/${cityId}`);
  return res.data; 
};

// PUT: /Country  (update existing country)
export const updateCountry = async (payload: {
  countryId: number;
  countryName: string;
  iso2: string;
  iso3: string;
  countryCode: string;
}) => {
  const res = await axiosInstance.put("/Country", payload);
  return res.data; 
};

// DELETE: /Country/{countryId}
export const deleteCountry = async (countryId: number) => {
  const res = await axiosInstance.delete(`/Country/${countryId}`);
  return res.data; 
};