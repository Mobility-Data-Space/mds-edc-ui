import { Table } from "@/components/atoms/table.tsx";
import { Edr } from "@think-it-labs/edc-connector-client";
import { Copy, Eye, EyeOff } from "lucide-react";
import React, { PropsWithChildren, useState } from "react";
import { EdrView } from "../../../vendors/think-it-labs/edc-connector-ui/src/edr-view";
import { proxyConnectorManagement } from "../../constants/proxy";

export default function EdrTableRow({ edr }: { edr: Edr }) {
  return (
    <Table.Row className="edr-row">
      <Table.Cell className="min-w-0">
        <div className="text-xs mb-1">
          <p className="text-xs mb-1">{edr.assetId}</p>
        </div>
      </Table.Cell>
      <Table.Cell className="min-w-0">
        <div className="text-xs mb-1">
          <p className="text-xs mb-1">{edr.createdAt}</p>
        </div>
      </Table.Cell>
      <Table.Cell className="min-w-0">
        <div className="text-xs mb-1">
          <p className="text-xs mb-1">{edr.providerId}</p>
        </div>
      </Table.Cell>

      <Table.Cell className="min-w-0">
        <div className="flex flex-col gap-y-2">
          <HiddenDetails>
            <EdrView id={edr.id} managementUrl={proxyConnectorManagement}>
              <EdrView.Loading fallback={<div>Loading...</div>}>
                <EdrView.Properties.Endpoint />
              </EdrView.Loading>
            </EdrView>
          </HiddenDetails>
        </div>
      </Table.Cell>

      <Table.Cell className="min-w-0">
        <div className="flex flex-col gap-y-2">
          <HiddenDetails>
            <EdrView id={edr.id} managementUrl={proxyConnectorManagement}>
              <EdrView.Loading fallback={<div>Loading...</div>}>
                <EdrView.Properties.Authorization />
              </EdrView.Loading>
            </EdrView>
          </HiddenDetails>
        </div>
      </Table.Cell>
    </Table.Row>
  );
}

function HiddenDetails({ children }: PropsWithChildren) {
  const [isDetailsShown, setIsDetailsShown] = useState(false);

  const copyToClipboard = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
    } catch (err) {
      console.error("Failed to copy to clipboard:", err);
    }
  };

  const extractTextFromChildren = (children: React.ReactNode): string => {
    if (typeof children === "string") {
      return children;
    }
    if (React.isValidElement(children)) {
      return extractTextFromChildren(children.props.children);
    }
    if (Array.isArray(children)) {
      return children.map(extractTextFromChildren).join("");
    }
    return "";
  };

  return (
    <div className="flex items-start gap-2">
      <button
        className="p-1 hover:bg-gray-100 rounded cursor-pointer"
        onClick={() => setIsDetailsShown(!isDetailsShown)}
        title={isDetailsShown ? "Hide details" : "Show details"}
      >
        {isDetailsShown ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>

      <button
        className="p-1 hover:bg-gray-100 rounded cursor-pointer"
        onClick={() => copyToClipboard(extractTextFromChildren(children))}
        title="Copy to clipboard"
      >
        <Copy size={16} />
      </button>

      {isDetailsShown && (
        <div className="break-all font-mono text-xs w-full min-w-0">
          {children}
        </div>
      )}
    </div>
  );
}
