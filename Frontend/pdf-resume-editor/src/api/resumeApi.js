import axios from "axios";

const BASE_URL = `${import.meta.env.VITE_API_URL}/api/resume`;

export const uploadResume = async (formData) => {
  const res = await axios.post(
    `${BASE_URL}/upload/`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return res.data;
};

export const extractBlocks = async (resumeId) => {
  const res = await axios.post(
    `${BASE_URL}/extract-blocks/`,
    { resume_id: resumeId },
    { headers: { "Content-Type": "application/json" } }
  );
  return res.data;
};

export const saveEditedBlocks = async (resumeId, blocks) => {
  const res = await axios.post(
    `${BASE_URL}/save-edits/`,
    { resume_id: resumeId, blocks }
  );
  return res.data;
};
