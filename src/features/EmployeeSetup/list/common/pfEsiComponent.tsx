import React from "react";
import { Pencil } from "lucide-react";
import { DetailItem, SectionHeader, EditButton } from "../common/DetailItem"; // ✅ Reuse the same components

// Define a TypeScript type for the data structure
interface Detail {
  label: string;
  value: string | number;
}

// Mock data
const pfEsiDetails: Detail[] = [
  { label: "Employee PF Enabled", value: "Yes" },
  { label: "Employee PF Number", value: "9874563210" },
  { label: "Employee UAN Number", value: "4567893215" },
  { label: "Employer PF Enabled", value: "Yes" },
  { label: "ESI Enabled", value: "Yes" },
  { label: "ESI Number", value: "9874563210" },
  { label: "Professional Tax Enabled", value: "Yes" },
  { label: "Labour Welfare Fund Enabled", value: "Yes" },
];

const PfEsiComponent: React.FC = () => {
  return (
    <div>
      <SectionHeader
        title="PF, ESI & PT Detail"
        action={<EditButton onClick={() => {}} />}
      />
      <div className="space-y-2">
        {pfEsiDetails.map((detail) => (
          <DetailItem
            key={detail.label}
            label={detail.label}
            value={detail.value}
          />
        ))}
      </div>
    </div>
  );
};

export default PfEsiComponent;
