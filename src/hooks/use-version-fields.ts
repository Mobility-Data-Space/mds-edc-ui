import { useState, useEffect } from 'react';
import {FieldShowProps} from "@/components/molecules/field-show.tsx";

interface VersionInfo {
  mdsEdcUiVersion: string;
  mdsEdcVersion: string;
}

export const useVersionFields = (): FieldShowProps[] => {
  const [versionInfo, setVersionInfo] = useState<VersionInfo | null>(null);

  useEffect(() => {
    const fetchVersionInfo = async () => {
      try {
        const response = await fetch('/version');
        if (response.ok) {
          const data: VersionInfo = await response.json();
          setVersionInfo(data);
        }
      } catch (err) {
        console.error('Failed to fetch version info:', err);
      }
    };

    fetchVersionInfo();
  }, [setVersionInfo]);

  if (!versionInfo) {
    return [];
  }

  return [
    {
      label: "dashboard.connector",
      value: versionInfo.mdsEdcVersion,
      icon: 'link',
    },
    {
      label: "dashboard.uiVersion", 
      value: versionInfo.mdsEdcUiVersion,
      icon: 'link',
    }
  ];
};