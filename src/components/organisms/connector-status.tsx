import { Connector } from "@think-it-labs/edc-connector-ui/connector";
import { HealthState } from "../molecules/health-state";

interface Props {
  className?: string;
  defaultUrl: string;
}

export function ConnectorStatus({ className, defaultUrl }: Props) {
  return (
    <div className={className}>
      <Connector defaultUrl={defaultUrl}>
        <Connector.Health>
          {(props) => <HealthState {...props} />}
        </Connector.Health>
        <Connector.Liveness>
          {(props) => <HealthState {...props} />}
        </Connector.Liveness>
        <Connector.Readiness>
          {(props) => <HealthState {...props} />}
        </Connector.Readiness>
        <Connector.Health>
          {(props) => <HealthState {...props} />}
        </Connector.Health>
      </Connector>
    </div>
  );
}
