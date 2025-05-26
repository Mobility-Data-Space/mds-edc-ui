import { ConnectorStatusChildProps } from "@think-it-labs/edc-connector-ui/connector";
import { Indicator } from "@/components/atoms/indicator";

export function HealthState(
  { status, isLoading, error }: ConnectorStatusChildProps,
) {
  if (error) {
    return (
      <Indicator variant="danger">
        Network error
      </Indicator>
    );
  }

  if (status?.isSystemHealthy === true) {
    return (
      <Indicator variant="success">
        Ok
      </Indicator>
    );
  }

  if (status?.isSystemHealthy === false) {
    return (
      <Indicator variant="danger">
        Error
      </Indicator>
    );
  }

  if (isLoading) {
    return (
      <Indicator variant="warning">
        Loading...
      </Indicator>
    );
  }

  return (
    <Indicator>
      Unkown
    </Indicator>
  );
}
