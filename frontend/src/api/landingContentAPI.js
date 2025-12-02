// ==============================================================================
import { supabase } from "../config/supabaseConfig";
export const fetchLandingContent = async () => {
  try {
    console.log("[API] Fetching landing content...");
    const response = await supabase.from("landing").select("*").single();
    console.log("[API] Landing content response:", response);
    if (response.error) {
      console.error("[API] Error fetching landing content:", response.error);
      throw response.error;
    }
    return response.data;
  } catch (error) {
    console.error("[API] fetchLandingContent error:", error);
    throw error;
  }
};

export const updateLandingContent = async (data) => {
  const response = await supabase
    .from("landing")
    .update(data)
    .eq("id", "5c389ee8-c493-467b-9729-effb78c00a01"); // Ensure this matches your row ID
  return response.data;
};

export const uploadFile = async ({ file, type }) => {
  if (!file) return null;

  // Delete the previous file if it exists
  if (type === "cv") {
    const { data, error } = await supabase
      .from("landing")
      .select("cv_path")
      .single();

    if (!error && data.cv_path) await deleteFile(data.cv_path);
  } else if (type === "image") {
    const { data, error } = await supabase
      .from("landing")
      .select("image_path")
      .single();
    if (!error && data.image_path) await deleteFile(data.image_path);
  }

  // Generate a unique file path for the uploaded file
  const filePath = `${type}/${file.name}`;

  const response = await supabase.storage
    .from("portfolio_files")
    .upload(filePath, file);

  return response.data;
};

export const deleteFile = async (filePath) => {
  if (!filePath || filePath.trim() == "") return null;
  const response = await supabase.storage
    .from("portfolio_files")
    .remove(filePath);
  return response.data;
};

export const downloadCv = async () => {
  const { data, error } = await supabase
    .from("landing")
    .select("cv_path")
    .single();

  if (error) throw new Error("Failed to fetch CV path");

  const cvPath = data.cv_path;
  if (!cvPath) throw new Error("CV path not found");

  // Check if path is from public folder (starts with /)
  if (cvPath.startsWith("/")) {
    // Public folder path - fetch and download
    try {
      const response = await fetch(cvPath);
      if (!response.ok) {
        throw new Error(`Failed to fetch CV: ${response.statusText}`);
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = cvPath.split("/").pop() || "samuel_mulu.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (fetchError) {
      console.error("Error downloading CV from public folder:", fetchError);
      throw new Error(`Failed to download CV: ${fetchError.message}`);
    }
  } else {
    // Supabase storage path - download from storage
    const response = await supabase.storage
      .from("portfolio_files")
      .download(cvPath);

    if (!response.data) throw new Error("Failed to download CV");

    const url = URL.createObjectURL(response.data);
    const link = document.createElement("a");
    link.href = url;
    link.download = "samuel_mulu.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
};
