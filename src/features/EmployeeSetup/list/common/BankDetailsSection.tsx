import React from "react";
import type { EmployeeDetail } from "../../../../store/slice/employeeSlice";
import {
  DetailItem,
  SectionHeader,
  EditButton,
  AddButton,
} from "../common/DetailItem";

interface BankDetailsSectionProps {
  data: EmployeeDetail;
  onEdit: () => void;
}

const BankDetailsSection: React.FC<BankDetailsSectionProps> = ({
  data,
  onEdit,
}) => {
  return (
    <div>
      <SectionHeader
        title="Bank Detail"
        action={
          data.bankDetails && data.bankDetails.id ? (
            <EditButton onClick={onEdit} />
          ) : (
            <AddButton onClick={onEdit} />
          )
        }
      />
      <div className="space-y-2">
        <DetailItem
          label="Bank Name"
          value={data.bankDetails?.bankName ?? "--"}
        />
        <DetailItem
          label="Account Name"
          value={data.bankDetails?.accountName ?? "--"}
        />
        <DetailItem
          label="Branch Name"
          value={data.bankDetails?.branchName ?? "--"}
        />
        <DetailItem
          label="Account Type"
          value={data.bankDetails?.accountType ?? "--"}
        />
        <DetailItem
          label="Account No"
          value={data.bankDetails?.accountNum ?? "--"}
        />
        <DetailItem
          label="IFSC Code"
          value={data.bankDetails?.ifscCode ?? "--"}
        />
      </div>
    </div>
  );
};

export default BankDetailsSection;
