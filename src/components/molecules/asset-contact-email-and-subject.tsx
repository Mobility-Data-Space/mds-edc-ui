import React from "react";
import { DataAddress } from "@think-it-labs/edc-connector-client";
import {Input} from "@/components/atoms/input";
import {T} from "@/i18n";

export interface ContactEmailAndSubjectProps {
  translator: (key: string) => string;
  formData: DataAddress;
  onChange: (formData: any) => void;
  errors: { [key: string]: boolean | string };
  required?: boolean;
}

export function AssetContactEmailAndSubject({ translator, formData, onChange, errors, required = true }: ContactEmailAndSubjectProps): JSX.Element {
  return (
    <>
      <div>
        <label
          htmlFor="data-offer-contact-email"
          className="inline-block text-sm text-black font-medium mb-2"
        >
          <T string="dataOffer.new.contactEmail"/> {required ? " * " : ""}
        </label>
        <Input
          name="data-offer-contact-email"
          id="data-offer-contact-email"
          data-testid="data-offer-contact-email"
          placeholder={translator("dataOffer.new.contactEmail")}
          type="email"
          tooltip={translator("dataOffer.new.contactEmailTooltip")}
          value={formData.email}
          error={errors.email}
          onChange={(event) => onChange({ ...formData, email: event.target.value })}
        />
      </div>
      <div>
        <label
          htmlFor="data-offer-contact-preferred-email-subject"
          className="inline-block text-sm text-black font-medium mb-2"
        >
          <T string="dataOffer.new.dataOfferContactPreferredEmailSubject"/> {required ? " * " : ""}
        </label>
        <Input
          name="data-offer-contact-preferred-email-subject"
          id="data-offer-contact-preferred-email-subject"
          data-testid="data-offer-contact-preferred-email-subject"
          placeholder={translator("dataOffer.new.dataOfferContactPreferredEmailSubject")}
          tooltip={translator("dataOffer.new.dataOfferContactPreferredEmailSubjectTooltip")}
          value={formData.preferred_subject}
          error={errors.preferred_subject}
          onChange={(event) => onChange({ ...formData, preferred_subject: event.target.value })}
        />
      </div>
    </>
  );
}
