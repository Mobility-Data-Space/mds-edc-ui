import {pascalCase} from "@/utilities/utilities";

export const TRAFFIC_INFORMATION = 'Traffic Information';
export const ROADWORKS_AND_ROAD_CONDITIONS = 'Roadworks and Road Conditions';
export const TRAFFIC_FLOW_INFORMATION = 'Traffic Flow Information';
export const PARKING_INFORMATION = 'Parking Information';
export const ELECTROMOBILITY = 'Electromobility';
export const TRAFFIC_SIGNS_AND_SPEED_INFORMATION = 'Traffic Signs and Speed Information';
export const WEATHER_INFORMATION = 'Weather Information';
export const PUBLIC_TRANSPORT_INFORMATION = 'Public Transport Information';
export const SHARED_AND_ON_DEMAND_MOBILITY = 'Shared and On-Demand Mobility';
export const INFRASTRUCTURE_AND_LOGISTICS = 'Infrastructure and Logistics';
export const VARIOUS = 'Various';

export type TYPE_DATA_CATEGORY = typeof TRAFFIC_INFORMATION | typeof ROADWORKS_AND_ROAD_CONDITIONS | typeof TRAFFIC_FLOW_INFORMATION | typeof PARKING_INFORMATION | typeof ELECTROMOBILITY | typeof TRAFFIC_SIGNS_AND_SPEED_INFORMATION | typeof WEATHER_INFORMATION | typeof PUBLIC_TRANSPORT_INFORMATION | typeof SHARED_AND_ON_DEMAND_MOBILITY | typeof INFRASTRUCTURE_AND_LOGISTICS | typeof VARIOUS


export const SUBCATEGORIES = {
  [TRAFFIC_INFORMATION]: [
    'Accvalueents',
    'Hazard Warnings',
  ],
  [ROADWORKS_AND_ROAD_CONDITIONS]: [
    'Roadworks',
    'Road Conditions',
  ],
  [TRAFFIC_FLOW_INFORMATION]: [
    'Realtime Traffic Flow Data',
    'Forecast Traffic Flow Data',
  ],
  [PARKING_INFORMATION]: [
    'Availability and Forecast',
    'Prices',
  ],
  [ELECTROMOBILITY]: [
    'Location of Charging Station',
    'Prices at Charging Station',
    'Availability of Charging Station',
  ],
  [TRAFFIC_SIGNS_AND_SPEED_INFORMATION]: [
    'Dynamic Speed Information',
    'Dynamic Traffic Signs',
    'Static Traffic Signs',
  ],
  [WEATHER_INFORMATION]: [
    'Current Weather Conditions',
    'Weather Forecast ',
    'Special Events or Disruptions',
  ],
  [PUBLIC_TRANSPORT_INFORMATION]: [
    'Timetables',
    'Fare',
    'Location Information',
  ],
  [SHARED_AND_ON_DEMAND_MOBILITY]: [
    'Vehicle Information ',
    'Availability ',
    'Location ',
    'Range ',
  ],
  [INFRASTRUCTURE_AND_LOGISTICS]: [
    'General Information About Planning Of Routes',
    'Pedestrian Networks',
    'Cycling Networks',
    'Road Network',
    'Water Routes',
    'Cargo Logistics',
    'Toll Information',
  ],
  [VARIOUS]: [],
}

export const DATA_CATEGORY_SELECT_DATA = Object.keys(SUBCATEGORIES).map(value => ({
  text: value,
  value: `${pascalCase(value)}`,
}));

const _DATA_SUBCATEGORIES_DATA: { [key: string]: {text: string, value: string}[] } = {};
Object.entries(SUBCATEGORIES).forEach(([category, subCategories]) => {
  _DATA_SUBCATEGORIES_DATA[`${pascalCase(category)}`] = subCategories.map(subcategory => ({
    text: subcategory,
    value: `${pascalCase(subcategory)}`,
  }))
});
export const DATA_SUBCATEGORIES_DATA = _DATA_SUBCATEGORIES_DATA;

export const GEO_REFERENCE_DATA = [
  { text: "Rail", value: `Rail` },
  { text: "Road", value: `Road` },
  { text: "Water", value: `Water` },
  { text: "Air", value: `Air` },
];
