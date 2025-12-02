import { supabase } from "../config/supabaseConfig";

export const fetchEducation = async () => {
  const response = await supabase.from("education").select("*");
  return response.data;
};

// Function to add a new education
export const addEducation = async (newEducation) => {
  const response = await supabase.from("education").insert(newEducation);
  return response.data;
};

// Function to update an existing education
export const updateEducation = async ({ id, updatedEducation }) => {
  const response = await supabase
    .from("education")
    .update(updatedEducation)
    .eq("id", id);
  return response.data;
};

// Function to delete an education
export const deleteEducation = async (id) => {
  const response = await supabase.from("education").delete().eq("id", id);
  return response.data;
};

