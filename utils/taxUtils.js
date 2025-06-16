// utils/taxUtils.js

export const taxRatesByState = {
  AL: 0.11, AK: 0.075, AZ: 0.112, AR: 0.115, CA: 0.1025,
  CO: 0.112, CT: 0.0635, DE: 0.0, FL: 0.08, GA: 0.09,
  HI: 0.045, ID: 0.09, IL: 0.11, IN: 0.07, IA: 0.08,
  KS: 0.106, KY: 0.06, LA: 0.1145, ME: 0.055, MD: 0.06,
  MA: 0.0625, MI: 0.06, MN: 0.08375, MS: 0.08, MO: 0.101,
  MT: 0.0, NE: 0.075, NV: 0.08265, NH: 0.0, NJ: 0.0663,
  NM: 0.090625, NY: 0.08875, NC: 0.075, ND: 0.085,
  OH: 0.08, OK: 0.115, OR: 0.0, PA: 0.08, RI: 0.07,
  SC: 0.09, SD: 0.065, TN: 0.1, TX: 0.0825, UT: 0.087,
  VT: 0.07, VA: 0.07, WA: 0.104, DC: 0.06, WV: 0.07,
  WI: 0.056, WY: 0.06,
};

export const stateNameToCode = {
  "Alabama": "AL", "Alaska": "AK", "Arizona": "AZ", "Arkansas": "AR",
  "California": "CA", "Colorado": "CO", "Connecticut": "CT", "Delaware": "DE",
  "Florida": "FL", "Georgia": "GA", "Hawaii": "HI", "Idaho": "ID",
  "Illinois": "IL", "Indiana": "IN", "Iowa": "IA", "Kansas": "KS",
  "Kentucky": "KY", "Louisiana": "LA", "Maine": "ME", "Maryland": "MD",
  "Massachusetts": "MA", "Michigan": "MI", "Minnesota": "MN", "Mississippi": "MS",
  "Missouri": "MO", "Montana": "MT", "Nebraska": "NE", "Nevada": "NV",
  "New Hampshire": "NH", "New Jersey": "NJ", "New Mexico": "NM", "New York": "NY",
  "North Carolina": "NC", "North Dakota": "ND", "Ohio": "OH", "Oklahoma": "OK",
  "Oregon": "OR", "Pennsylvania": "PA", "Rhode Island": "RI", "South Carolina": "SC",
  "South Dakota": "SD", "Tennessee": "TN", "Texas": "TX", "Utah": "UT",
  "Vermont": "VT", "Virginia": "VA", "Washington": "WA", "Washington, D.C.": "DC",
  "West Virginia": "WV", "Wisconsin": "WI", "Wyoming": "WY"
};

export const getTaxRate = (state, country) => {
  if (!state || !country) return 0;

  let stateCode = state;

  if (country === "United States") {
    // Make sure state is a string and has .length
    if (typeof state === "string" && state.length > 2) {
      stateCode = stateNameToCode[state] || "";
    }
    return taxRatesByState[stateCode] || 0;
  }

  return 0;
};

