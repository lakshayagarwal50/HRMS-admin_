import React, { useEffect } from "react";
import toast from "react-hot-toast";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import type { Project } from "../../../../types/project";
import {
  createProject,
  updateProject as updateProjectAction,
} from "../../../../store/slice/projectSlice";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../../../store/store";
import Input from "../../../../components/common/Input";

interface ProjectFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  project?: Project | null;
  mode: "create" | "edit";
}

// const validationSchema = yup.object().shape({
//   projectName: yup.string().required("Project name is required").min(3, "Project name must be at least 3 characters long"),
//   billingType: yup.string().required("Billing type is required"),
//   creationDate: yup.date().required("Creation date is required").max(new Date(), "Creation date cannot be in the future"),
//   status: yup.string().required("Status is required"),
// });

const validationSchema = yup.object().shape({
  projectName: yup
    .string()
    .required("Project name is required")
    .min(3, "Project name must be at least 3 characters long")
    // 👇 This is the line you need to add
    .matches(
      /^[a-zA-Z\s]+$/,
      "Project name can only contain letters and spaces"
    ),
  billingType: yup.string().required("Billing type is required"),
  creationDate: yup
    .date()
    .typeError("Please enter a valid date")
    .required("Creation date is required")
    .max(new Date(), "Creation date cannot be in the future"),
  status: yup.string().required("Status is required"),
});

const ProjectFormModal: React.FC<ProjectFormModalProps> = ({
  isOpen,
  onClose,
  project,
  mode,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Omit<Project, "id" | "teamMember" | "isDeleted" | "resources">>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      projectName: "",
      billingType: "TimeAndMaterial",
      creationDate: "",
      status: "Active",
    },
  });

  useEffect(() => {
    if (isOpen && mode === "edit" && project) {
      reset({
        projectName: project.projectName,
        billingType: project.billingType,
        creationDate: project.creationDate,
        status: project.status,
      });
    } else {
      reset({
        projectName: "",
        billingType: "TimeAndMaterial",
        creationDate: "",
        status: "Active",
      });
    }
  }, [isOpen, mode, project, reset]);

  const onSubmit = (
    data: Omit<Project, "id" | "teamMember" | "isDeleted" | "resources">
  ) => {
    let promise;
    let messages;

    if (mode === "create") {
      promise = dispatch(createProject(data)).unwrap();
      messages = {
        loading: "Creating project...",
        success: "Project created successfully!",
        error: (err: any) => `Error: ${err || "Could not create project."}`,
      };
    } else if (mode === "edit" && project) {
      promise = dispatch(
        updateProjectAction({ id: project.id, data })
      ).unwrap();
      messages = {
        loading: "Updating project...",
        success: "Project updated successfully!",
        error: (err: any) => `Error: ${err || "Could not update project."}`,
      };
    } else {
      return;
    }

    toast
      .promise(promise, messages)
      .then(() => {
        onClose();
      })
      .catch(() => {
        // Error is already handled by the toast
      });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-end z-50 bg-black/50">
      <div className="bg-white h-full w-full max-w-md shadow-xl transform transition-all duration-300 flex flex-col">
        <header className="flex justify-between items-center p-6 border-b border-slate-200">
          <h2 className="text-xl font-bold text-gray-800">
            {mode === "create" ? "Add Project" : "Edit Project"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            &times;
          </button>
        </header>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex-grow p-6 space-y-4 overflow-y-auto"
        >
          <div>
            <label
              htmlFor="projectName"
              className="block text-sm font-medium text-slate-600 mb-1.5"
            >
              Project Name <span className="text-red-500">*</span>
            </label>
            <Controller
              name="projectName"
              control={control}
              render={({ field }) => (
                <Input {...field} id="projectName" type="text" />
              )}
            />
            {errors.projectName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.projectName.message}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="billingType"
              className="block text-sm font-medium text-slate-600 mb-1.5"
            >
              Billing type <span className="text-red-500">*</span>
            </label>
            <Controller
              name="billingType"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  id="billingType"
                  className="w-full p-2 border border-slate-300 rounded-md bg-slate-50 text-slate-800 focus:ring-2 focus:ring-[#714CDD] focus:border-[#714CDD]"
                >
                  <option value="FixedCost">Fixed Cost</option>
                  <option value="TimeAndMaterial">
                    Time and Material (TNM)
                  </option>
                </select>
              )}
            />
            {errors.billingType && (
              <p className="text-red-500 text-sm mt-1">
                {errors.billingType.message}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="creationDate"
              className="block text-sm font-medium text-slate-600 mb-1.5"
            >
              Creation Date <span className="text-red-500">*</span>
            </label>
            <Controller
              name="creationDate"
              control={control}
              render={({ field }) => (
                <Input {...field} id="creationDate" type="date" />
              )}
            />
            {errors.creationDate && (
              <p className="text-red-500 text-sm mt-1">
                {errors.creationDate.message}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="status"
              className="block text-sm font-medium text-slate-600 mb-1.5"
            >
              Status <span className="text-red-500">*</span>
            </label>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  id="status"
                  className="w-full p-2 border border-slate-300 rounded-md bg-slate-50 text-slate-800 focus:ring-2 focus:ring-[#714CDD] focus:border-[#714CDD]"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              )}
            />
            {errors.status && (
              <p className="text-red-500 text-sm mt-1">
                {errors.status.message}
              </p>
            )}
          </div>
        </form>
        <footer className="flex items-center justify-center gap-4 p-6 border-t border-slate-200">
          <button
            type="button"
            onClick={onClose}
            className="py-2.5 px-8 font-semibold bg-slate-100 text-slate-700 rounded-md hover:bg-slate-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit(onSubmit)}
            className="py-2.5 px-8 font-semibold text-white bg-[#714CDD] rounded-md hover:bg-[#5f3dbb] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#714CDD] transition-colors shadow-sm"
          >
            {mode === "create" ? "Submit" : "Update"}
          </button>
        </footer>
      </div>
    </div>
  );
};

export default ProjectFormModal;
