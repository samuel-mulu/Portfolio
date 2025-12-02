// Mock API Service Layer
// Provides mock implementations for REST API endpoints (used with axios)

import { delay } from "./mockData";
import {
  mockExperiences,
  mockFeedbacks,
  mockMessages,
  mockSkills,
  mockServices,
} from "./mockData";

// In-memory stores for REST API endpoints
let restApiStores = {
  experiences: JSON.parse(JSON.stringify(mockExperiences)),
  feedbacks: JSON.parse(JSON.stringify(mockFeedbacks)),
  messages: JSON.parse(JSON.stringify(mockMessages)),
  skills: JSON.parse(JSON.stringify(mockSkills)),
  services: JSON.parse(JSON.stringify(mockServices)),
};

// Mock Axios Instance
export const createMockAxiosInstance = () => {
  return {
    get: async (url) => {
      await delay(300);
      const endpoint = url.split("/").pop() || url;
      const data = restApiStores[endpoint] || [];
      return { data, status: 200, statusText: "OK" };
    },
    post: async (url, payload) => {
      await delay(400);
      const endpoint = url.split("/").pop() || url;
      if (!restApiStores[endpoint]) {
        restApiStores[endpoint] = [];
      }
      const newItem = {
        ...payload,
        id: restApiStores[endpoint].length + 1,
        created_at: new Date().toISOString(),
      };
      restApiStores[endpoint].push(newItem);
      return { data: newItem, status: 201, statusText: "Created" };
    },
    put: async (url, payload) => {
      await delay(400);
      const parts = url.split("/");
      const endpoint = parts[parts.length - 2];
      const id = parseInt(parts[parts.length - 1]);
      const index = restApiStores[endpoint]?.findIndex((item) => item.id === id);
      if (index !== -1 && restApiStores[endpoint]) {
        restApiStores[endpoint][index] = {
          ...restApiStores[endpoint][index],
          ...payload,
          updated_at: new Date().toISOString(),
        };
        return {
          data: restApiStores[endpoint][index],
          status: 200,
          statusText: "OK",
        };
      }
      throw new Error("Not found");
    },
    delete: async (url) => {
      await delay(300);
      const parts = url.split("/");
      const endpoint = parts[parts.length - 2];
      const id = parseInt(parts[parts.length - 1]);
      const index = restApiStores[endpoint]?.findIndex((item) => item.id === id);
      if (index !== -1 && restApiStores[endpoint]) {
        const deleted = restApiStores[endpoint].splice(index, 1)[0];
        return { data: deleted, status: 200, statusText: "OK" };
      }
      throw new Error("Not found");
    },
  };
};

// Export helper to reset REST API stores
export const resetRestApiStores = () => {
  restApiStores = {
    experiences: JSON.parse(JSON.stringify(mockExperiences)),
    feedbacks: JSON.parse(JSON.stringify(mockFeedbacks)),
    messages: JSON.parse(JSON.stringify(mockMessages)),
    skills: JSON.parse(JSON.stringify(mockSkills)),
    services: JSON.parse(JSON.stringify(mockServices)),
  };
};

