const env = {
  url: import.meta.env.VITE_API_URL,
};

const API = {
  addTemplate: env.url + "/templates",
  getTemplate: env.url + "/templates",
  deleteTemplate:  env.url + "/templates",
  updateTemplate:  env.url + "/templates",

    getAction: env.url + "/actions",
  addAction: env.url + "/actions",
  deleteAction: env.url + "/actions",
  updateAction: env.url + "/actions",
  dashboard: env.url + "/actions/dashboard",

};

export default API;