// src/components/employee/sections/ProfessionalInfo.tsx
import React from "react";
import type { EmployeeDetail } from "../../../../store/slice/employeeSlice";
import {
  DetailItem,
  SectionHeader,
  EditButton,
} from "../common/DetailItem";

interface ProfessionalInfoProps {
  data: EmployeeDetail;
  onEdit: () => void;
}

const ProfessionalInfo: React.FC<ProfessionalInfoProps> = ({
  data,
  onEdit,
}) => {
  const { professional } = data;
  return (
    <div>
      <SectionHeader
        title="Professional Details"
        action={<EditButton onClick={onEdit} />}
      />
      <div className="space-y-2">
        <DetailItem label="Designation" value={professional.designation} />
        <DetailItem label="Department" value={professional.department} />
        <DetailItem
          label="Joining Date"
          value={new Date(professional.joiningDate).toLocaleDateString()}
        />
        <DetailItem label="Location" value={professional.location} />
        <DetailItem
          label="Reporting Manager"
          value={professional.reportingManager}
        />
        <DetailItem label="Work Week" value={professional.workWeek} />
        <DetailItem label="Annual CTC" value={professional.ctcAnnual} />
        <DetailItem label="Holiday Group" value={professional.holidayGroup} />
        <DetailItem
          label="Payslip Component"
          value={professional.payslipComponent}
        />
      </div>
    </div>
  );
};

export default ProfessionalInfo;
