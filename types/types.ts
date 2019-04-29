export interface Bus {
  id: number;
  model: string;
  averageSpeed: number;
  year: number;
}

export interface Driver {
  id: number;
  fullName: string;
  birthday: string;
  buses: string[];
}

export type CitySuggestion = {
  id: string;
  type: string;
  center: [number, number];
  text: string;
  place_name: string;
};

export type CitySuggestionsResponse = {
  type: string;
  query: string[];
  features: CitySuggestion[];
};

export type Route = {
  distance: number;
};

export type RouteResponse = {
  code: "Ok" | "NoRoute";
  routes: Route[];
  message?: string;
};
