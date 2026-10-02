export const CONTEXT_DCT = {
  prefix: "dct:",
  value: "http://purl.org/dc/terms/",
} as const;
export const CONTEXT_DCAT = {
  prefix: "dcat:",
  value: "http://www.w3.org/ns/dcat#",
} as const;
export const CONTEXT_MOBILITYDCAT_AP = {
  prefix: "mobilitydcatap:",
  value: "https://w3id.org/mobilitydcat-ap/",
} as const;
export const CONTEXT_MOBILITYDCAT_AP_THEME = {
  prefix: "mobilitydcatap-theme:",
  value: "https://w3id.org/mobilitydcat-ap/mobility-theme/",
} as const;
export const CONTEXT_ADMS = {
  prefix: "adms:",
  value: "http://www.w3.org/ns/adms#",
} as const;
export const CONTEXT_OWL = {
  prefix: "owl:",
  value: "http://www.w3.org/2002/07/owl#",
} as const;
export const CONTEXT_SKOS = {
  prefix: "skos:",
  value: "http://www.w3.org/2004/02/skos/core#",
} as const;
export const CONTEXT_RDF = {
  prefix: "rdf:",
  value: "http://www.w3.org/2000/01/rdf-schema#",
} as const;
const CONTEXT_XSD = {
  prefix: "xsd:",
  value: "http://www.w3.org/2001/XMLSchema#",
} as const;
const CONTEXT_ODRL = {
  prefix: "odrl:",
  value: "http://www.w3.org/ns/odrl/2/",
} as const;
export const CONTEXT_EDC = {
  prefix: "edc:",
  value: "https://w3id.org/edc/v0.0.1/ns/",
} as const;
const contextsList = [
  CONTEXT_DCT,
  CONTEXT_DCAT,
  CONTEXT_MOBILITYDCAT_AP,
  CONTEXT_MOBILITYDCAT_AP_THEME,
  CONTEXT_ADMS,
  CONTEXT_OWL,
  CONTEXT_SKOS,
  CONTEXT_RDF,
  CONTEXT_XSD,
  CONTEXT_ODRL,
  CONTEXT_EDC,
] as const;

export const contextToCompact: { [key: string]: string } = {};

export const contextWithNoPrefixToCompact: { [key: string]: string } = {};

contextsList.forEach((context) => {
  contextToCompact[context.prefix.replace(":", "")] = context.value;
});

contextsList.forEach((context) => {
  contextWithNoPrefixToCompact[context.value] = context.value;
});
