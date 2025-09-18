import { T } from "@/i18n";
import { theme } from "@/theme/ThemeProvider.tsx";
import {
  transferProcessStateBgColor,
  transferProcessStateHoverColor,
} from "@/utilities/transfer-process.ts";
import { Typography } from "@mui/material";
import { TransferProcess } from "@think-it-labs/edc-connector-client/dist/src/entities";
import React, { useMemo, useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

interface Entry {
  name?: string;
  value?: number;
  color?: string;
  hoverColor?: string;
}

interface MousePosition {
  x: number;
  y: number;
}

function CustomLegend({ data }: { data: Entry[] }) {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {data.map((entry, index) => (
        <div key={index} className="flex items-center gap-2">
          <div className="w-8 h-3" style={{ backgroundColor: entry.color }} />
          <span className="text-[10px] text-gray-600">{entry.name}</span>
        </div>
      ))}
    </div>
  );
}

interface HoverEntryProps {
  isHovered: boolean;
  entry: Entry;
  mousePosition: MousePosition;
  onHoverEnd: () => void;
}

function HoverEntry({
  isHovered,
  entry,
  mousePosition,
  onHoverEnd,
}: HoverEntryProps) {
  return (
    <div
      onMouseOver={onHoverEnd}
      onMouseOut={onHoverEnd}
      className="fixed pointer-events-none rounded p-3"
      style={{
        visibility: isHovered ? "visible" : "hidden",
        zIndex: isHovered ? 100 : 0,
        opacity: isHovered ? 1 : 0,
        transition:
          "visibility 0.5s linear, opacity 0.5s linear, z-index 0.5s linear",
        top: mousePosition.y - 15,
        left:
          isHovered && window.innerWidth < 700 ? "10" : mousePosition.x + 10,
        backgroundColor: theme.palette.secondary.main,
      }}
    >
      <Typography color="white" variant="body2">
        {entry.name}
      </Typography>
      <div className="flex gap-x-1 items-center">
        <div
          className="w-3 h-3 border-2 border-white"
          style={{ backgroundColor: entry.color }}
        />
        <Typography color="white" variant="body2">
          <T string="dashboard.numberTransferProcesses" />
          <span> : </span>
          <span>{entry.value}</span>
        </Typography>
      </div>
    </div>
  );
}

interface TransferProcessChartContentProps {
  title: string;
  transferProcesses: TransferProcess[];
}

export function TransferProcessChartContent({
  title,
  transferProcesses,
}: TransferProcessChartContentProps) {
  const [mousePosition, setMousePosition] = useState<MousePosition>({
    x: 0,
    y: 0,
  });
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredEntry, setHoveredEntry] = useState<Entry>({});

  const data = useMemo<Entry[]>(() => {
    const data: { [key: string]: number } = {};
    transferProcesses.forEach((transferProcess) => {
      data[transferProcess.state] = (data[transferProcess.state] || 0) + 1;
    });

    return Object.entries(data).map(([state, count]) => ({
      name: state,
      value: count,
      color: transferProcessStateBgColor(state),
      hoverColor: transferProcessStateHoverColor(state),
    }));
  }, [transferProcesses]);

  const handleMouseEnter = (entry: Entry) => {
    setHoveredEntry(entry);
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleMouseMove = (
    entry: Entry,
    event: React.MouseEvent<SVGElement, MouseEvent>,
  ) => {
    setMousePosition({ x: event.clientX, y: event.clientY });
  };

  return (
    <div>
      <CustomLegend data={data} />

      <div className="relative">
        <HoverEntry
          isHovered={isHovered}
          entry={hoveredEntry}
          mousePosition={mousePosition}
          onHoverEnd={handleMouseLeave}
        />
        <ResponsiveContainer
          width="100%"
          height={300}
          style={{ outline: "none" }}
        >
          <PieChart onMouseLeave={handleMouseLeave}>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={130}
              innerRadius={65}
              dataKey="value"
              startAngle={90}
              endAngle={450}
              onMouseOutCapture={handleMouseLeave}
              onMouseOut={handleMouseLeave}
              onMouseLeave={handleMouseLeave}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`${title}-${entry.name}`}
                  fill={
                    isHovered && entry.name === hoveredEntry.name
                      ? entry.color
                      : entry.hoverColor
                  }
                  stroke={
                    isHovered && entry.name === hoveredEntry.name
                      ? "#cccccc"
                      : "white"
                  }
                  strokeWidth={2}
                  onMouseEnter={() => handleMouseEnter(entry)}
                  onMouseOutCapture={handleMouseLeave}
                  onMouseOver={(event) => handleMouseMove(entry, event)}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="text-center">
        <p className="text-lg text-gray-700">
          <T string="common.total" />
          <span> : </span>
          {data.reduce((sum, item) => sum + (item.value || 0), 0)}
        </p>
      </div>
    </div>
  );
}