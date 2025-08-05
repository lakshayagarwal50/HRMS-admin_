// src/components/employee/sections/GeneralInfo.tsx
import React from "react";
import type { EmployeeDetail } from "../../../../store/slice/employeeSlice";
import {
  DetailItem,
  SectionHeader,
  EditButton,
} from "../common/DetailItem";

interface GeneralInfoProps {
  data: EmployeeDetail;
  onEdit: () => void;
}

const GeneralInfo: React.FC<GeneralInfoProps> = ({ data, onEdit }) => {
  const { general } = data;
  const fullName = `${general.name.first || ""} ${
    general.name.last || ""
  }`.trim();

  return (
    <div>
      <SectionHeader
        title="General Info"
        action={<EditButton onClick={onEdit} />}
      />
      <div className="space-y-2">
        <DetailItem label="Name" value={fullName} />
        <DetailItem label="Employee ID" value={general.empCode} />
        <DetailItem label="Status" value={general.status} />
        <DetailItem label="Gender" value={general.gender} />
        <DetailItem
          label="Phone Number"
          value={`${general.phoneNum.code} ${general.phoneNum.num}`}
        />
        <DetailItem label="Email Primary" value={general.primaryEmail} />
      </div>
    </div>
  );
};

export default GeneralInfo;
