import React from "react";
import {
  DetailItem,
  SectionHeader,
  EditButton,
  AddButton,
} from "../common/DetailItem";

// --- TYPE DEFINITIONS ---

// Shape of the 'pf' object, updated to match your API response
// where booleans are returned as strings.
interface PfData {
  id?: string;
  pfNum: string | null;
  uanNum: string | null;
  esiNum: string | null;
  employeePfEnable: string;
  professionalTax: string;
  esiEnable: string;
  employeerPfEnable: string;
  labourWelfare: string;
}

// Props for the component
interface PfEsiComponentProps {
  data?: { pf?: Partial<PfData> };
  onEdit: () => void;
}

// --- COMPONENT ---

const PfEsiComponent: React.FC<PfEsiComponentProps> = ({ data, onEdit }) => {
  const pfDetails = data?.pf;

  // Check if data exists by looking for a unique ID.
  const hasData = !!pfDetails?.id;

  // Dynamically create the details array from props.
  const pfEsiDetailsMap = [
    {
      label: "Employee PF Enabled",
      // Explicitly check against the string 'true'
      value: pfDetails?.employeePfEnable === "true" ? "Yes" : "No",
    },
    {
      label: "Employee PF Number",
      value: pfDetails?.pfNum || "--",
    },
    {
      label: "Employee UAN Number",
      value: pfDetails?.uanNum || "--",
    },
    {
      label: "Employer PF Enabled",
      value: pfDetails?.employeerPfEnable === "true" ? "Yes" : "No",
    },
    {
      label: "ESI Enabled",
      value: pfDetails?.esiEnable === "true" ? "Yes" : "No",
    },
    {
      label: "ESI Number",
      value: pfDetails?.esiNum || "--",
    },
    {
      label: "Professional Tax Enabled",
      value: pfDetails?.professionalTax === "true" ? "Yes" : "No",
    },
    {
      label: "Labour Welfare Fund Enabled",
      value: pfDetails?.labourWelfare === "true" ? "Yes" : "No",
    },
  ];

  return (
    <div>
      <SectionHeader
        title="PF, ESI & PT Detail"
        action={
          hasData ? (
            <EditButton onClick={onEdit} />
          ) : (
            <AddButton onClick={onEdit} text="Add Details" />
          )
        }
      />

      {hasData ? (
        // If data exists, show the details.
        <div className="space-y-2">
          {pfEsiDetailsMap.map((detail) => (
            <DetailItem
              key={detail.label}
              label={detail.label}
              value={detail.value}
            />
          ))}
        </div>
      ) : (
        // If no data, show a placeholder message.
        <div className="text-center py-10 px-6 bg-gray-50 rounded-lg">
          <p className="text-gray-500">
            No PF, ESI, or PT details have been added yet.
          </p>
          <p className="text-gray-400 text-sm mt-1">
            Click "Add Details" to get started.
          </p>
        </div>
      )}
    </div>
  );
};

export default PfEsiComponent;
