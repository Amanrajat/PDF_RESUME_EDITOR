import axios from "axios";

// Backend base URL (Render / Local both)
const BASE_URL = `${import.meta.env.REACT_APP_API_URL}/api/resume/`;

/**
 * Upload resume
 */
export const uploadResume = async (formData) => {
  const res = await axios.post(`${BASE_URL}upload/`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

/**
 * Extract text blocks
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
 * Save edited blocks & regenerate PDF
 */
export const saveEditedBlocks = async (resumeId, blocks) => {
  const res = await axios.post(
    `${BASE_URL}save-edits/`,
    {
      resume_id: resumeId,
      blocks: blocks,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return res.data;
};
