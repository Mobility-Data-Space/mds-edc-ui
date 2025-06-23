import React, {useMemo} from "react";
import {Card, CardContent} from "@mui/material";
import {T} from "@/i18n";
import {TitleWithIcon} from "@/components/atoms/TitleWithIcon.tsx";
import { PieChart, Pie, Sector, Cell, ResponsiveContainerProps } from 'recharts';
import {TransferProcess} from "@think-it-labs/edc-connector-client/dist/src/entities";
import {TransferProcessStates} from "@think-it-labs/edc-connector-client";
import {STATE_ERROR, STATE_RUNNING} from "@/constants/transfer-process.ts";

interface TransferProcessStatusCharCardProps {
  title: string;
  transferProcesses: TransferProcess[];
}

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  chrome: {
    label: "Chrome",
    color: "var(--chart-1)",
  },
  safari: {
    label: "Safari",
    color: "var(--chart-2)",
  },
  firefox: {
    label: "Firefox",
    color: "var(--chart-3)",
  },
  edge: {
    label: "Edge",
    color: "var(--chart-4)",
  },
  other: {
    label: "Other",
    color: "var(--chart-5)",
  },
}

const COLORS: { [key: string]: string } = {
  [STATE_RUNNING]: "#7eb0d5",
  [TransferProcessStates.STARTED]: "#b2e061",
  [TransferProcessStates.DEPROVISIONED]: "#fd7f6f",
  [STATE_ERROR]: "#fd7f6f",
  [TransferProcessStates.TERMINATED]: "#b2e061",
};

export function TransferProcessStatusCharCard2({ title, transferProcesses }: TransferProcessStatusCharCardProps): JSX.Element {
  const data = useMemo(() => {
    const data: { [key: string]: number } = {};
    transferProcesses.forEach(transferProcess => {
      data[transferProcess.state] = (data[transferProcess.type] || 0) + 1;
    });

    return Object.entries(data).map(([state, count]) => ({
      name: state,
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

          <div className="flex justify-center">
            <PieChart width={300} height={300}>
              <Pie data={data} dataKey="value" cx="50%" cy="50%" innerRadius={70} outerRadius={125} paddingAngle={1}>
                {data.map((entry, index) => <Cell key={entry.name} fill={COLORS[entry.name]}/>)}
              </Pie>
            </PieChart>
          </div>
      </CardContent>
    </Card>
  );
}
