// Mock Supabase Client
// Simulates Supabase database and storage operations for development

import {
  mockLandingContent,
  mockAboutData,
  mockProjects,
  mockSkills,
  mockServices,
  mockExperiences,
  mockEducation,
  mockFeedbacks,
  mockMessages,
  delay,
} from "./mockData";

// In-memory data stores (simulating database tables)
let dataStores = {
  landing: [JSON.parse(JSON.stringify(mockLandingContent))],
  about: [JSON.parse(JSON.stringify(mockAboutData))],
  projects: JSON.parse(JSON.stringify(mockProjects)),
  skills: JSON.parse(JSON.stringify(mockSkills)),
  services: JSON.parse(JSON.stringify(mockServices)),
  experiences: JSON.parse(JSON.stringify(mockExperiences)),
  education: JSON.parse(JSON.stringify(mockEducation)),
  feedbacks: JSON.parse(JSON.stringify(mockFeedbacks)),
  messages: JSON.parse(JSON.stringify(mockMessages)),
};

// In-memory file storage (simulating Supabase storage)
let fileStorage = {};

// Helper to get table data
const getTableData = (table) => {
  if (!dataStores[table]) {
    dataStores[table] = [];
  }
  return dataStores[table];
};

// Mock Supabase client - Returns promises that resolve to { data, error } objects
const createMockSupabase = () => {
  return {
    from: (table) => ({
      select: (columns = "*") => {
        console.log(`[Mock Supabase] SELECT from ${table}`, { columns });
        
        // Create a promise that resolves to { data, error }
        const selectPromise = (async () => {
          await delay(200);
          const data = getTableData(table);
          console.log(`[Mock Supabase] SELECT result from ${table}:`, data);
          return { data, error: null };
        })();
        
        // Return an object with both promise methods and single() method
        const result = {
          single: async () => {
            await delay(200);
            const data = getTableData(table);
            console.log(`[Mock Supabase] SELECT single from ${table}:`, data);
            if (data.length === 0) {
              return { data: null, error: { message: "No rows found" } };
            }
            return { data: data[0], error: null };
          },
        };
        
        // Make it thenable so it can be awaited directly
        result.then = selectPromise.then.bind(selectPromise);
        result.catch = selectPromise.catch.bind(selectPromise);
        
        return result;
      },
      insert: (values) => {
        console.log(`[Mock Supabase] INSERT into ${table}:`, values);
        return (async () => {
          await delay(300);
          const tableData = getTableData(table);
          const newItems = Array.isArray(values) ? values : [values];
          const insertedItems = newItems.map((item, index) => {
            const newItem = {
              ...item,
              id: tableData.length + index + 1,
              created_at: new Date().toISOString(),
            };
            tableData.push(newItem);
            return newItem;
          });
          console.log(`[Mock Supabase] INSERT result into ${table}:`, insertedItems);
          return { data: insertedItems, error: null };
        })();
      },
      update: (values) => ({
        eq: (column, value) => {
          console.log(`[Mock Supabase] UPDATE ${table} WHERE ${column} = ${value}:`, values);
          return (async () => {
            await delay(300);
            const tableData = getTableData(table);
            const index = tableData.findIndex((item) => item[column] === value);
            if (index !== -1) {
              tableData[index] = { ...tableData[index], ...values };
              console.log(`[Mock Supabase] UPDATE result:`, tableData[index]);
              return { data: [tableData[index]], error: null };
            }
            console.warn(`[Mock Supabase] UPDATE failed: No item found with ${column} = ${value}`);
            return { data: null, error: { message: "Not found" } };
          })();
        },
      }),
      delete: () => ({
        eq: (column, value) => {
          console.log(`[Mock Supabase] DELETE from ${table} WHERE ${column} = ${value}`);
          return (async () => {
            await delay(300);
            const tableData = getTableData(table);
            const index = tableData.findIndex((item) => item[column] === value);
            if (index !== -1) {
              const deleted = tableData.splice(index, 1)[0];
              console.log(`[Mock Supabase] DELETE result:`, deleted);
              return { data: [deleted], error: null };
            }
            console.warn(`[Mock Supabase] DELETE failed: No item found with ${column} = ${value}`);
            return { data: null, error: { message: "Not found" } };
          })();
        },
      }),
    }),
    storage: {
      from: (bucket) => ({
        upload: async (path, file) => {
          await delay(500);
          const fileKey = `${bucket}/${path}`;
          fileStorage[fileKey] = {
            path: fileKey,
            name: file.name,
            size: file.size,
            type: file.type,
            uploadedAt: new Date().toISOString(),
          };
          return { data: { path: fileKey }, error: null };
        },
        download: async (path) => {
          await delay(300);
          const fileKey = `${bucket}/${path}`;
          if (fileStorage[fileKey]) {
            // Return a mock Blob
            const blob = new Blob(["mock file content"], { type: "application/octet-stream" });
            return { data: blob, error: null };
          }
          return { data: null, error: { message: "File not found" } };
        },
        remove: async (paths) => {
          await delay(200);
          const pathsArray = Array.isArray(paths) ? paths : [paths];
          pathsArray.forEach((path) => {
            const fileKey = `${bucket}/${path}`;
            delete fileStorage[fileKey];
          });
          return { data: pathsArray, error: null };
        },
      }),
    },
  };
};

export const mockSupabase = createMockSupabase();

// Export helper to reset mock data (useful for testing)
export const resetMockData = () => {
  dataStores = {
    landing: [JSON.parse(JSON.stringify(mockLandingContent))],
    about: [JSON.parse(JSON.stringify(mockAboutData))],
    projects: JSON.parse(JSON.stringify(mockProjects)),
    skills: JSON.parse(JSON.stringify(mockSkills)),
    services: JSON.parse(JSON.stringify(mockServices)),
    experiences: JSON.parse(JSON.stringify(mockExperiences)),
    education: JSON.parse(JSON.stringify(mockEducation)),
    feedbacks: JSON.parse(JSON.stringify(mockFeedbacks)),
    messages: JSON.parse(JSON.stringify(mockMessages)),
  };
  fileStorage = {};
};

