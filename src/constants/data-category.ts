const TRAFFIC_INFORMATION = 'Traffic Information';
const ROADWORKS_AND_ROAD_CONDITIONS = 'Roadworks and Road Conditions';
const TRAFFIC_FLOW_INFORMATION = 'Traffic Flow Information';
const PARKING_INFORMATION = 'Parking Information';
const ELECTROMOBILITY = 'Electromobility';
const TRAFFIC_SIGNS_AND_SPEED_INFORMATION = 'Traffic Signs and Speed Information';
const WEATHER_INFORMATION = 'Weather Information';
const PUBLIC_TRANSPORT_INFORMATION = 'Public Transport Information';
const SHARED_AND_ON_DEMAND_MOBILITY = 'Shared and On-Demand Mobility';
const INFRASTRUCTURE_AND_LOGISTICS = 'Infrastructure and Logistics';
const VARIOUS = 'Various';

export type TYPE_DATA_CATEGORY = typeof TRAFFIC_INFORMATION | typeof ROADWORKS_AND_ROAD_CONDITIONS | typeof TRAFFIC_FLOW_INFORMATION | typeof PARKING_INFORMATION | typeof ELECTROMOBILITY | typeof TRAFFIC_SIGNS_AND_SPEED_INFORMATION | typeof WEATHER_INFORMATION | typeof PUBLIC_TRANSPORT_INFORMATION | typeof SHARED_AND_ON_DEMAND_MOBILITY | typeof INFRASTRUCTURE_AND_LOGISTICS | typeof VARIOUS


export const DATA_SUBCATEGORIES_DATA = {
  [TRAFFIC_INFORMATION]: [
    { value: 'Accvalueents' },
    { value: 'Hazard Warnings' },
  ],
  [ROADWORKS_AND_ROAD_CONDITIONS]: [
    { value: 'Roadworks' },
    { value: 'Road Conditions' },
  ],
  [TRAFFIC_FLOW_INFORMATION]: [
    { value: 'Realtime Traffic Flow Data' },
    { value: 'Forecast Traffic Flow Data' },
  ],
  [PARKING_INFORMATION]: [
    { value: 'Availability and Forecast' },
    { value: 'Prices' },
  ],
  [ELECTROMOBILITY]: [
    { value: 'Location of Charging Station' },
    { value: 'Prices at Charging Station' },
    { value: 'Availability of Charging Station' },
  ],
  [TRAFFIC_SIGNS_AND_SPEED_INFORMATION]: [
    { value: 'Dynamic Speed Information' },
    { value: 'Dynamic Traffic Signs' },
    { value: 'Static Traffic Signs' },
  ],
  [WEATHER_INFORMATION]: [
    { value: 'Current Weather Conditions' },
    { value: 'Weather Forecast ' },
    { value: 'Special Events or Disruptions' },
  ],
  [PUBLIC_TRANSPORT_INFORMATION]: [
    { value: 'Timetables' },
    { value: 'Fare' },
    { value: 'Location Information' },
  ],
  [SHARED_AND_ON_DEMAND_MOBILITY]: [
    { value: 'Vehicle Information ' },
    { value: 'Availability ' },
    { value: 'Location ' },
    { value: 'Range ' },
  ],
  [INFRASTRUCTURE_AND_LOGISTICS]: [
    { value: 'General Information About Planning Of Routes' },
    { value: 'Pedestrian Networks' },
    { value: 'Cycling Networks' },
    { value: 'Road Network' },
    { value: 'Water Routes' },
    { value: 'Cargo Logistics' },
    { value: 'Toll Information' },
  ],
  [VARIOUS]: [],
}

export const DATA_CATEGORY_SELECT_DATA: { value: string }[] = Object.keys(DATA_SUBCATEGORIES_DATA).map(value => ({ value }));


export const DATA_GEO_REFERENCE_DATA = [
  { value: "Rail" },
  { value: "Road" },
  { value: "Water" },
  { value: "Air" },
];
