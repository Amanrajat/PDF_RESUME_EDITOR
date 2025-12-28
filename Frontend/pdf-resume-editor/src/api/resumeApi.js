import axios from "axios";

//  Base backend URL
const BASE_URL = "http://127.0.0.1:8000/api/resume/";

/**
 *  Upload resume (initial upload)
 * Returns: { resume_id, download_url }
 */
export const uploadResume = async (formData) => {
  const res = await axios.post(
    `${BASE_URL}upload/`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return res.data;
};

/**
 *  Extract all text blocks from PDF
 * Sejda-like editable mode ka base
 * Returns: { blocks: [...] }
 */
export const extractBlocks = async (resumeId) => {
  const res = await axios.post(
    `${BASE_URL}extract-blocks/`,
    { resume_id: resumeId },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return res.data;
};

/**
 *  Save edited blocks & regenerate PDF
 * Returns: { download_url }
 */
export const saveEditedBlocks = async (resumeId, blocks) => {
  const res = await fetch(
    "http://127.0.0.1:8000/api/resume/save-edits/",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        resume_id: resumeId,
        blocks: blocks,
      }),
    }
  );

  if (!res.ok) {
    throw new Error("Failed to save edited PDF");
  }

  return await res.json();
};
