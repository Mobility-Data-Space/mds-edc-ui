import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import * as React from 'react';

import { InfoOutlined } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";

type Option = { text: string; value: string, tooltip?: string };

interface RadioButtonsGroup {
  name: string;
  id?: string;
  label?: React.ReactNode;
  defaultValue: string;
  options: Option[];
  onChange: (newValue: string) => void;
}

export default function RadioButtonsGroup({ name, id = "", label = "", defaultValue, options, onChange }: RadioButtonsGroup) {
  return (
    <FormControl color="secondary">
      <label
        htmlFor={id}
        className="inline-block text-sm text-black font-medium"
      >
        {label}
      </label>
      <RadioGroup
        onChange={(event) => onChange(event.target.value)}
        defaultValue={defaultValue}
        name={name}
        id={id}
      >
        {options.map((option) => <div key={option.value} className="flex flex-row">
          <FormControlLabel
            data-testid={`offer-publish-mode-${option.value}`}
            value={option.value}
            control={<Radio color="default" />}
            label={option.text || option.value}
          />
          {!option.tooltip ? "" : <Tooltip title={option.tooltip}><IconButton><InfoOutlined /></IconButton></Tooltip>}
        </div>)}
      </RadioGroup>
    </FormControl>
  );
}
