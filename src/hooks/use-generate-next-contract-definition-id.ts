import { proxyConnectorManagement } from "@/constants/proxy";
import { useEdcConnectorClient } from "@think-it-labs/edc-connector-ui/hooks/use-edc-connector-client";

import { useState, useEffect } from "react";

type NextContractDefinitionId = {
  error: null;
  id: string;
} & {
  error: string;
  id: null;
};

export const useGenerateNextContractDefinitionId =
  (): NextContractDefinitionId => {
    const [id, setId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const client = useEdcConnectorClient({
      management: proxyConnectorManagement,
    });

    useEffect(() => {
      const generateId = async () => {
        try {
          setError(null);

          const prefix = "mds-data-offer-";
          const now = new Date();
          const day = String(now.getDate()).padStart(2, "0");
          const month = String(now.getMonth() + 1).padStart(2, "0");
          const year = now.getFullYear();
          const datePrefix = `${day}${month}${year}`;

          const existingTodayIds = (
            await client.management.contractDefinitions.queryAll({
              offset: 0,
              limit: 1000,
              filterExpression: [
                {
                  operandLeft: "id",
                  operator: "like",
                  operandRight: `${prefix}${datePrefix}_%`,
                },
              ],
            })
          ).map((contract) => contract["@id"]);

          const maxUid = existingTodayIds
            .filter((id) => id.startsWith(`${prefix}${datePrefix}_`))
            .map((id) => {
              const uidPart = id.substring(`${prefix}${datePrefix}_`.length);
              return parseInt(uidPart, 10);
            })
            .filter((uid) => !isNaN(uid))
            .reduce((max, uid) => Math.max(max, uid), 0);

          const nextUid = maxUid + 1;
          console.log("next uid is ", nextUid);

          setId(`${prefix}${datePrefix}_${nextUid}`);
        } catch (err) {
          setError(err as string);
        }
      };

      generateId();
    }, [client]);

    return { nextId: id, error } as NextContractDefinitionId;
  };
