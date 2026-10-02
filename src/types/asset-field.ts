import type { AssetProperties } from "@/domain/asset/model";

// Shared by the asset form field components; each edits one slice of the asset properties.
export interface AssetFieldProps {
  translator: (key: string) => string;
  formData: AssetProperties;
  onChange: (formData: AssetProperties) => void;
  errors: { [key: string]: boolean | string };
}
