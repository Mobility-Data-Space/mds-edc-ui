export const CONTEXT_DCT = {prefix: "dct:", value: "http://purl.org/dc/terms/"};
export const CONTEXT_DCAT = {prefix: "dcat:", value: "http://www.w3.org/ns/dcat#"};
export const CONTEXT_MOBILITYDCAT_AP = {prefix: "mobilitydcatap:", value: "https://w3id.org/mobilitydcat-ap/"};
export const CONTEXT_MOBILITYDCAT_AP_THEME = {
  prefix: "mobilitydcatap-theme:",
  value: "https://w3id.org/mobilitydcat-ap/mobility-theme/"
};
export const CONTEXT_ADMS = {prefix: "adms:", value: "http://www.w3.org/ns/adms#"};
export const CONTEXT_OWL = {prefix: "owl:", value: "http://www.w3.org/2002/07/owl#"};
export const CONTEXT_SKOS = {prefix: "skos:", value: "http://www.w3.org/2002/07/owl#"};
export const CONTEXT_RDFS = {prefix: "rdfs:", value: "http://www.w3.org/2000/01/rdf-schema#"};
export const CONTEXT_XSD = {prefix: "xsd:", value: "http://www.w3.org/2001/XMLSchema#"};
export const CONTEXT_ODRL = {prefix: "odrl:", value: "http://www.w3.org/ns/odrl/2/"};
export const CONTEXT_EDC = {prefix: "edc:", value: "https://w3id.org/edc/v0.0.1/ns/"};
export const TRACTUS_X_CONTEXT = {prefix: "tx:", value: "https://w3id.org/tractusx/v0.0.1/ns/"};

export const contextsList = [CONTEXT_DCT, CONTEXT_DCAT, CONTEXT_MOBILITYDCAT_AP, CONTEXT_MOBILITYDCAT_AP_THEME, CONTEXT_ADMS, CONTEXT_OWL, CONTEXT_SKOS, CONTEXT_RDFS, CONTEXT_XSD, CONTEXT_ODRL, CONTEXT_EDC];

export const contextPrefixes: { [key: string]: string } = {};

contextsList.forEach(context => {
  contextPrefixes[context.value] = context.prefix;
});
