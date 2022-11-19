const componentExists = require("../utils/componentExists");

module.exports = {
  description: "Add a route/controller/model",
  prompts: [
    {
      type: "input",
      name: "name",
      message: "What should it be called?",
      default: "User",
      validate: (value) => {
        if (/.+/.test(value)) {
          return componentExists(value)
            ? "A route with this name already exists"
            : true;
        }

        return "The name is required";
      },
    },
    {
      tyoe: "input",
      name: "wantCrud",
      default: false,
      message: "Do you want basic CRUD operation created",
    },
  ],
  actions: (data) => {
    const actions = [
      {
        type: "add",
        path: "../../src/api/models/{{camelCase name}}.model.js",
        templateFile: "./route/model.js.hbs",
        abortOnFail: true,
      },
      {
        type: "add",
        path: "../../src/api/controllers/{{camelCase name}}.controller.js",
        templateFile: "./route/controller.js.hbs",
        abortOnFail: true,
      },
      {
        type: "add",
        path: "../../src/api/routes/v1/{{camelCase name}}.route.js",
        templateFile: "./route/route.js.hbs",
        abortOnFail: true,
      },
      {
        type: "add",
        path: "../../src/api/validations/{{camelCase name}}.validation.js",
        templateFile: "./route/validation.js.hbs",
        abortOnFail: true,
      },
    ];
    return actions;
  },
};
