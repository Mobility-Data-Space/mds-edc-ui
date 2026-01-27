import { upperAndSnakeCase } from "@/utilities/utilities";

export const AIR_AND_SPACE_TRAVEL = "Air and Space Travel";
export const CYCLE_NETWORK_DATA = "Cycle Network Data";
export const DYNAMIC_TRAFFIC_SIGNS_AND_REGULATIONS =
  "Dynamic Traffic Signs and Regulations";
export const FILLING_AND_CHARGING_STATIONS = "Filling and Charging Stations";
export const FREIGHT_AND_LOGISTICS = "Freight and Logistics";
export const GENERAL_INFORMATION_FOR_TRIP_PLANNING =
  "General Information for Trip-Planning";
export const OTHER = "Other";
export const PARKING_SERVICE_AND_REST_AREA_INFORMATION =
  " Parking Service and Rest Area Information";
export const PEDESTRIAN_NETWORK_DATA = "Pedestrian Network Data";
export const PUBLIC_TRANSPORT_NON_SCHEDULED_TRANSPORT =
  "Public Transport non Scheduled Transport";
export const PUBLIC_TRANSPORT_SCHEDULED_TRANSPORT =
  "Public Transport Scheduled Transport";
export const REAL_TIME_TRAFFIC_DATA = "Real Time Traffic Data";
export const ROAD_EVENTS_AND_CONDITIONS = "Road Events and Conditions";
export const ROAD_WORK_INFORMATION = "Road Work Information";
export const SHARING_AND_HIRING_SERVICES = "Sharing and Hiring Services";
export const STATIC_ROAD_NETWORK_DATA = "Static Road Network Data";
export const STATIC_TRAFFIC_SIGNS_AND_REGULATIONS =
  " Static Traffic Signs and Regulations";
export const TOLL_INFORMATION = "Toll Information";
export const WATERWAYS_AND_WATER_BODIES = "Waterways and Water Bodies";

export type TYPE_DATA_CATEGORY =
  | typeof AIR_AND_SPACE_TRAVEL
  | typeof CYCLE_NETWORK_DATA
  | typeof DYNAMIC_TRAFFIC_SIGNS_AND_REGULATIONS
  | typeof FILLING_AND_CHARGING_STATIONS
  | typeof FREIGHT_AND_LOGISTICS
  | typeof GENERAL_INFORMATION_FOR_TRIP_PLANNING
  | typeof OTHER
  | typeof PARKING_SERVICE_AND_REST_AREA_INFORMATION
  | typeof PEDESTRIAN_NETWORK_DATA
  | typeof PUBLIC_TRANSPORT_NON_SCHEDULED_TRANSPORT
  | typeof PUBLIC_TRANSPORT_SCHEDULED_TRANSPORT
  | typeof REAL_TIME_TRAFFIC_DATA
  | typeof ROAD_EVENTS_AND_CONDITIONS
  | typeof ROAD_WORK_INFORMATION
  | typeof SHARING_AND_HIRING_SERVICES
  | typeof STATIC_ROAD_NETWORK_DATA
  | typeof STATIC_TRAFFIC_SIGNS_AND_REGULATIONS
  | typeof TOLL_INFORMATION
  | typeof WATERWAYS_AND_WATER_BODIES;

export const SUBCATEGORIES = {
  [AIR_AND_SPACE_TRAVEL]: [],
  [CYCLE_NETWORK_DATA]: [
    "Network Closures Diversions",
    "Network Detailed Attributes",
    "Network Geometry and Lane Character",
  ],
  [DYNAMIC_TRAFFIC_SIGNS_AND_REGULATIONS]: [
    "Bridge Closures and Access Conditions",
    "Direction of Travel on Reversible Lanes",
    "Dynamic Overtaking Bans on Heavy Goods Vehicles",
    "Dynamic Speed Limits",
    "Lane Closures and Access Conditions",
    "Other Access Restrictions and Traffic Regulations",
    "Other Temporary Traffic Management Measures or Plans",
    "Road Closures and Access Conditions",
    "Tunnel Closures and Access Conditions",
  ],
  [FILLING_AND_CHARGING_STATIONS]: [
    "Availability of Charging Points For Electric Vehicles",
    "Availability of Filling Stations",
    "Location And Conditions of Charging Points",
    "Location And Conditions of Filling Stations",
  ],
  [FREIGHT_AND_LOGISTICS]: [
    "Availability of Delivery Areas",
    "Freight Delivery Regulations",
    " Location of Delivery Areas",
  ],
  [GENERAL_INFORMATION_FOR_TRIP_PLANNING]: [
    "Address Identifiers",
    "Parameters Needed to Calculate Costs",
    "Parameters Needed to Calculate Environmental Factors",
    "Points of Interests",
    "Topographic Places",
  ],
  [OTHER]: [],
  [PARKING_SERVICE_AND_REST_AREA_INFORMATION]: [
    "Bike Parking Locations",
    "Car Parking Availability",
    "Car Parking Locations and Conditions",
    "Park and Ride Stops",
    "Service and Rest Area Availability",
    "Service and Rest Area Locations and Conditions",
    "Truck Parking Availability",
    "Truck Parking Locations And Conditions",
  ],
  [PEDESTRIAN_NETWORK_DATA]: [
    "Pedestrian Accessibility Facilities",
    "Pedestrian Network Geometry",
  ],
  [PUBLIC_TRANSPORT_NON_SCHEDULED_TRANSPORT]: [
    "Accesibility Information for Vehicles",
    "Environmental Standards for Vehicles",
    "Fares",
    "Locations and Stations",
    "Provider Data",
    "Reservation and Purchase Options",
    "Service Areas and Service Times",
  ],
  [PUBLIC_TRANSPORT_SCHEDULED_TRANSPORT]: [
    "Basic Commercial Conditions",
    "Basic Common Standard Fares",
    "Common Fare Products",
    "Connection Links",
    "Disruptions Delays Cancellations",
    "Environmental Standards for Vehicles",
    "Hours of Operation",
    "Network Topology and Routes Lines",
    "Operational Calendar",
    "Passenger Classes",
    "Planned Interchanges Between Scheduled Services",
    "Purchase Information",
    "Real Time Estimated Departure and Arrival Times",
    "Special Fare Products",
    "Stop Facilities Accessibility and Paths Within Facility",
    "Stop Facilities Geometry and Map Layout",
    "Stop Facilities Location and Features",
    "Stop Facilities Status of Features",
    "Timetables Static",
    "Transport Operators",
    "Vehicle Details",
  ],
  [REAL_TIME_TRAFFIC_DATA]: [
    "Current Travel Time",
    "Expected Delays",
    "Location and Length of Queues",
    "Predicted Travel Time",
    "Speed",
    "Traffic Data at Border Crossings to Third Countries",
    "Traffic Volume",
    "Waiting Time at Border Crossings to Non-Eu Member States",
  ],
  [ROAD_EVENTS_AND_CONDITIONS]: [
    "Accidents and Incidents",
    "Hazard Warnings",
    "Poor Road Conditions",
    "Road Weather Conditions",
  ],
  [ROAD_WORK_INFORMATION]: ["Long Term Road Works", "Short Term Road Works"],
  [SHARING_AND_HIRING_SERVICES]: [
    "Bike Hiring Availability",
    "Bike Hiring Stations",
    "Bike Sharing Availability",
    "Bike Sharing Locations and Stations",
    "Car Hiring Availability",
    "Car Hiring Stations",
    "Car Sharing Availability",
    "Car Sharing Locations And Stations",
    "E Scooter Sharing Availability",
    "E Scooter Sharing Locations and Stations",
    "Environmental Standards for Vehicles",
    "Payment Methods",
  ],
  [STATIC_ROAD_NETWORK_DATA]: [
    "Geometry",
    "Gradients",
    "Junctions",
    "Number of Lanes",
    "Road Classification",
    "Road Width",
  ],
  [STATIC_TRAFFIC_SIGNS_AND_REGULATIONS]: [
    "Bridge Access Conditions",
    "Other Static Traffic Signs",
    "Other Traffic Regulations",
    "Permanent Access Restrictions",
    "Speed Limits",
    "Traffic Circulation Plans",
    "Tunnel Access Conditions",
  ],
  [TOLL_INFORMATION]: [
    "Applicable Road User Charges and Payment Methods",
    "Identification of Tolled Roads",
    "Location of Tolling Stations",
    "Payment Methods for Tolls",
  ],
  [WATERWAYS_AND_WATER_BODIES]: [],
};

export const DATA_CATEGORY_SELECT_DATA = Object.keys(SUBCATEGORIES).map(
  (value) => ({
    text: value,
    value: upperAndSnakeCase(value),
  }),
);

const _DATA_SUBCATEGORIES_DATA: {
  [key: string]: { text: string; value: string }[];
} = {};
Object.entries(SUBCATEGORIES).forEach(([category, subCategories]) => {
  _DATA_SUBCATEGORIES_DATA[upperAndSnakeCase(category)] = subCategories.map(
    (subcategory) => ({
      text: subcategory,
      value: upperAndSnakeCase(subcategory),
    }),
  );
});
export const DATA_SUBCATEGORIES_DATA = _DATA_SUBCATEGORIES_DATA;

export const GEO_REFERENCE_DATA = [
  {
    text: "Air",
    value: "AIR",
  },
  {
    text: "Bicycle",
    value: "BICYCLE",
  },
  {
    text: "Bike Hire",
    value: "BIKE_HIRE",
  },
  {
    text: "Bike Sharing",
    value: "BIKE_SHARING",
  },
  {
    text: "Bus",
    value: "BUS",
  },
  {
    text: "Car",
    value: "CAR",
  },
  {
    text: "Car Hire",
    value: "CAR_HIRE",
  },
  {
    text: "Car Pooling",
    value: "CAR_POOLING",
  },
  {
    text: "Car Sharing",
    value: "CAR_SHARING",
  },
  {
    text: "E Scooter",
    value: "E_SCOOTER",
  },
  {
    text: "Long Distance Coach",
    value: "LONG_DISTANCE_COACH",
  },
  {
    text: "Long Distance Rail",
    value: "LONG_DISTANCE_RAIL",
  },
  {
    text: "Maritime",
    value: "MARITIME",
  },
  {
    text: "Metro Subway Train",
    value: "METRO_SUBWAY_TRAIN",
  },
  {
    text: "Motorcycle",
    value: "MOTORCYCLE",
  },
  {
    text: "Other",
    value: "OTHER",
  },
  {
    text: "Pedestrian",
    value: "PEDESTRIAN",
  },
  {
    text: "Regional and Local Rail",
    value: "REGIONAL_AND_LOCAL_RAIL",
  },
  {
    text: "Ride Pooling",
    value: "RIDE_POOLING",
  },
  {
    text: "Shuttle Bus",
    value: "SHUTTLE_BUS",
  },
  {
    text: "Shuttle Ferry",
    value: "SHUTTLE_FERRY",
  },
  {
    text: "Taxi",
    value: "TAXI",
  },
  {
    text: "Tram Light Rail",
    value: "TRAM_LIGHT_RAIL",
  },
  {
    text: "Truck",
    value: "TRUCK",
  },
];
