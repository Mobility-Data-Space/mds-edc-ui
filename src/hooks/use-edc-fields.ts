import {FieldShowProps} from "@/components/molecules/field-show.tsx";
import {useParticipantConnectorState} from "@/hooks/use-participant-connector-state.ts";

export const useEdcFields = (): FieldShowProps[] => {
  const { connector } = useParticipantConnectorState();

  return [
    {
      label: "dashboard.connectorEndpoint",
      value: connector.protocolUrl,
      icon: 'link',
    },
    {
      label: "dashboard.edcId",
      value: connector.id,
      icon: 'policy',
    },
    {
      label: "common.title",
      value: connector.name,
      icon: 'title',
    },
    {
      label: "dashboard.curatorOrganizationName",
      value: "",
      icon: 'apartment',
    },
    {
      label: "dashboard.curatorUrl",
      value: "",
      icon: 'apartment',
    },
    {
      label: "common.description",
      value: connector.description,
      icon: 'title',
    },
    {
      label: "dashboard.maintainerOrganizationName",
      value: "",
      icon: 'contact_support',
    },
    {
      label: "dashboard.maintainerOrganizationUrl",
      value: "",
      icon: 'contact_support',
    },
    {
      label: "dashboard.dapsTokenUrl",
      value: "",
      icon: 'vpn_key',
    },
    {
      label: "dashboard.miwAuthorityId",
      value: "",
      icon: 'lock',
    },
    {
      label: "dashboard.miwUrl",
      value: "",
      icon: 'link',
    },
    {
      label: "dashboard.miwTokenUrl",
      value: "",
      icon: 'vpn_key',
    },
  ];
};
