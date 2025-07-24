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
      value: connector.curatorName,
      icon: 'apartment',
    },
    {
      label: "dashboard.curatorUrl",
      value: connector.curatorUrl,
      icon: 'apartment',
    },
    {
      label: "common.description",
      value: connector.description,
      icon: 'title',
    },
    {
      label: "dashboard.maintainerName",
      value: connector.maintainerName,
      icon: 'contact_support',
    },
    {
      label: "dashboard.maintainerUrl",
      value: connector.maintainerUrl,
      icon: 'contact_support',
    },
    {
      label: "dashboard.dapsTokenUrl",
      value: connector.dapsUrl,
      icon: 'vpn_key',
    }
  ];
};
