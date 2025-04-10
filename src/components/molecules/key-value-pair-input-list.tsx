import {TextFieldProps} from "@mui/material/TextField";
import {KeyValuePairInput, Tag} from "@/components/atoms/key-value-pair-input.tsx";
import {Button, FormHelperText} from "@mui/material";

export type KeyValuePairInputListProps =  Omit<TextFieldProps, "onChange"> & {
  addText?: string;
  removeText?: string;
  errorText?: string;
  helperText?: string;
  keyLabel?: string;
  keyPlaceholder?: string;
  valueLabel?: string;
  valuePlaceholder?: string;
  valueOnly?: boolean;
  additionalActions?: JSX.Element[];
  value: TagsList;
  onChange: (tagList: TagsList) => void;
};

type TagsList = { input: Tag; valid: boolean; id: string }[];

const uid = function(){
  return Date.now().toString(36) + Math.random().toString(36);
}

function tagKeyIsUnique(tagsList: TagsList, key: string, index: number) {
  return !tagsList.find(
    (tag, selectedTagIndex) =>
      tag.input.key === key && selectedTagIndex !== index,
  );
}

const withAddedTag = (tagsList: TagsList): TagsList => {
  return [
    ...tagsList,
    { input: { key: "", value: "" }, valid: true, id: uid() },
  ];
};

function withRemovedTag(tagsList: TagsList, tag: { input: Tag; valid: boolean; id: any }): TagsList {
  return tagsList.filter(
    (currentElement) => currentElement.id !== tag.id,
  );
}
const withUpdatedTag = (
  tagsList: TagsList,
  { input, valid }: { input: Partial<Tag>; valid: boolean },
  tag: any,
  index: number,
): TagsList => {
  let updatedTag = {
    input: { ...tag.input, ...input },
    valid: false,
    id: tag.id,
  };

  if (input.key && !tagKeyIsUnique(tagsList, input.key, index)) {
    updatedTag = { ...updatedTag, valid: false };
  } else {
    updatedTag = { ...updatedTag, valid };
  }

  return tagsList.map((element, elementIndex) => {
    if (index === elementIndex) {
      return updatedTag;
    } else return element;
  });
};

export function KeyValuePairInputList({
  addText = "Add",
  removeText = "Remove",
  errorText = "Please insert valid key/value pair",
  helperText,
  keyLabel = "Key",
  keyPlaceholder = "Key",
  valueLabel = "Value",
  valuePlaceholder = "Value",
  valueOnly = false,
  additionalActions = [],
  value,
  onChange
}: KeyValuePairInputListProps) {

  return (
    <div className="w-full flex flex-col gap-y-3">
      {value.map((tagInput, index) => (
        <KeyValuePairInput
          keyLabel={keyLabel}
          keyPlaceholder={keyPlaceholder}
          valueLabel={valueLabel}
          valuePlaceholder={valuePlaceholder}
          key={tagInput.id}
          onChange={({ input, valid }) => {
            onChange(withUpdatedTag(value, { input, valid }, tagInput, index));
          }}
          value={tagInput.input}
          onRemove={() => onChange(withRemovedTag(value, tagInput))}
          removeText={removeText}
          errorText={errorText}
          valid={tagInput.valid}
          valueOnly={valueOnly}
        />
      ))}

      <FormHelperText>{helperText}</FormHelperText>

      <div>
        <Button onClick={() => onChange(withAddedTag(value))} color="secondary" className="font-medium text-sm">
          {addText}
        </Button>
        {additionalActions}
      </div>
    </div>
  );
}
