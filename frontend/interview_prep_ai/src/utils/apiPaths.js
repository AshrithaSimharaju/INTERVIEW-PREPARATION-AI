export const BASE_URL = "http://localhost:5000/api";

export const API_PATHS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
  },
  IMAGE: {
    UPLOAD_IMAGE: "/auth/upload-image",
  },
  AI: {
    GENERATE_QUESTIONS: "/ai/generate-questions",
    GENERATE_EXPLAINATION: "/ai/generate-explanation",
  },
  SESSION: {
    CREATE: "/sessions/create",
    GET_ALL: "/sessions/my-sessions",
    GET_ONE: (id) => `/sessions/${id}`,
    DELETE: (id) => `/sessions/${id}`,
    ADD: "/sessions/add",
  },
  QUESTION: {
    ADD_TO_SESSION: "/questions/add",
    PIN: (id) => `/questions/${id}/pin`,
    UPDATE_NOTE: (id) => `/questions/${id}/note`,
  },
};















