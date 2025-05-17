import React from "react";

// Merge Fields Data
const facilityMergeFields = [
  "FacilityNumber",
  "FacilityName",
  "Address",
  "MapCategory",
  "Latitude",
  "Longitude",
  "ReceivingPlant",
  "TrunkLine",
  "SiteElevation",
];
const inspectionMergeFields = ["InspectionCompleteDate", "InspectionEventType"];

// Helper Functions
const copyStringToClipboard = (str) => {
  const el = document.createElement("textarea");
  el.value = str;
  el.setAttribute("readonly", "");
  el.style = { position: "absolute", left: "-9999px" };
  document.body.appendChild(el);
  el.select();
  document.execCommand("copy");
  document.body.removeChild(el);
};

const createOptionGroupElement = (mergeFields, optionGrouplabel) => {
  const optionGroupElement = document.createElement("optgroup");
  optionGroupElement.setAttribute("label", optionGrouplabel);
  mergeFields.forEach((field) => {
    const optionElement = document.createElement("option");
    optionElement.setAttribute("class", "merge-field-select-option");
    optionElement.setAttribute("value", field);
    optionElement.text = field;
    optionGroupElement.appendChild(optionElement);
  });
  return optionGroupElement;
};

// Toolbar Buttons
export const buttons = [
  "undo",
  "redo",
  "bold",
  "strikethrough",
  "underline",
  "italic",
  "superscript",
  "subscript",
  "align",
  "ul",
  "ol",
  "outdent",
  "indent",
  "font",
  "fontsize",
  "brush",
  "paragraph",
  "image",
  "link",
  "table",
  "hr",
  "eraser",
  "copyformat",
  "fullsize",
  "selectall",
  "print",
  "source",
  {
    name: "insertMergeField",
    tooltip: "Insert Merge Field",
    iconURL: "images/merge.png",
    popup: (editor) => {
      const onSelected = (e) => {
        const mergeField = e.target.value;
        if (mergeField) {
          editor.selection.insertNode(
            editor.create.inside.fromHTML("{{" + mergeField + "}}")
          );
        }
      };

      const divElement = editor.create.div("merge-field-popup");
      const labelElement = document.createElement("label");
      labelElement.setAttribute("class", "merge-field-label");
      labelElement.textContent = "Merge field: ";
      divElement.appendChild(labelElement);

      const selectElement = document.createElement("select");
      selectElement.setAttribute("class", "merge-field-select");
      selectElement.appendChild(
        createOptionGroupElement(facilityMergeFields, "Facility")
      );
      selectElement.appendChild(
        createOptionGroupElement(inspectionMergeFields, "Inspection")
      );
      selectElement.onchange = onSelected;
      divElement.appendChild(selectElement);

      return divElement;
    },
  },
  {
    name: "copyContent",
    tooltip: "Copy HTML to Clipboard",
    iconURL: "images/copy.png",
    exec: (editor) => {
      const html = editor.value;
      copyStringToClipboard(html);
    },
  },
];

// Toolbar Component
const JToolbar = () => {
  return buttons; // Return buttons directly for integration in the editor
};

export default JToolbar;
