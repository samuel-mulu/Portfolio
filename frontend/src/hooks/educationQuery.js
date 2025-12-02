import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchEducation,
  addEducation,
  updateEducation,
  deleteEducation,
} from "../api/educationApi";
import { handleToast } from "../common/handleToast";

export const useEducationQuery = () => {
  return useQuery({
    queryKey: ["education"],
    queryFn: fetchEducation,
  });
};

/** Mutation Hook: Add a new education */
export const useAddEducationMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addEducation,
    onSuccess: () => {
      queryClient.invalidateQueries(["education"]);
      handleToast(200, "Education added successfully!");
    },
    onError: (error) => {
      handleToast(500, `Failed to add education: ${error.message}`);
    },
  });
};

/** Mutation Hook: Update an existing education */
export const useUpdateEducationMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateEducation,
    onSuccess: () => {
      queryClient.invalidateQueries(["education"]);
      handleToast(200, "Education updated successfully!");
    },
    onError: (error) => {
      handleToast(500, `Failed to update education: ${error.message}`);
    },
  });
};

/** Mutation Hook: Delete an education */
export const useDeleteEducationMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteEducation,
    onSuccess: () => {
      queryClient.invalidateQueries(["education"]);
      handleToast(200, "Education deleted successfully!");
    },
    onError: (error) => {
      handleToast(500, `Failed to delete education: ${error.message}`);
    },
  });
};

