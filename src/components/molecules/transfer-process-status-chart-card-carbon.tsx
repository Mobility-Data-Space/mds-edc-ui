import React, {useMemo} from "react";
import {Card, CardContent} from "@mui/material";
import {T} from "@/i18n";
import {TitleWithIcon} from "@/components/atoms/TitleWithIcon.tsx";
import {DonutChart, DonutChartOptions} from '@carbon/charts-react'
import '@carbon/charts-react/styles.css'
import {TransferProcess} from "@think-it-labs/edc-connector-client/dist/src/entities";
import {STATE_ERROR, STATE_RUNNING} from "@/constants/transfer-process.ts";
import {TransferProcessStates} from "@think-it-labs/edc-connector-client";

interface TransferProcessStatusCharCardProps {
  title: string;
  transferProcesses: TransferProcess[];
}

const options: DonutChartOptions = {
  resizable: true,
  legend: {
    position: 'top',
    truncation: {
      type: 'none'
    }
  },
  toolbar: { enabled: false },
  donut: {
    center: {
      label: 'Browsers'
    },
    alignment: 'center',
  },
  height: '400px',
  getFillColor: (group: string) => COLORS[group],
};

const COLORS: { [key: string]: string } = {
  [STATE_RUNNING]: "#7eb0d5",
  [TransferProcessStates.STARTED]: "#b2e061",
  [TransferProcessStates.DEPROVISIONED]: "#fd7f6f",
  [STATE_ERROR]: "#fd7f6f",
  [TransferProcessStates.TERMINATED]: "#b2e061",
};

export function TransferProcessStatusChartCardCarbon({ title, transferProcesses }: TransferProcessStatusCharCardProps): JSX.Element {
  const data = useMemo(() => {
    const data: { [key: string]: number } = {};
    transferProcesses.forEach(transferProcess => {
      data[transferProcess.state] = (data[transferProcess.type] || 0) + 1;
    });

    return Object.entries(data).map(([state, count]) => ({
      group: state,
      value: count
    }));
  }, [transferProcesses]);

  return (
    <Card >
      <CardContent className="flex flex-col gap-y-4">
        <TitleWithIcon
          title={<T string={title} />}
          subtitle={<T string="dashboard.transferProcesses" />}
        />

        <div className="p-4">
          <DonutChart
            data={data}
            options={options}
          />
        </div>
      </CardContent>
    </Card>
  );
}
