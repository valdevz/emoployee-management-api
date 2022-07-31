const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Employee management API for free",
      version: "1.0.0",
      description:
        "This is an initial version of a free management API",
      license: {
        name: "MIT",
        url: "https://spdx.org/licenses/MIT.html",
      },
      contact: {
        name: "Pending",
        url: "localhost:4000/v1/api/",
        email: "j.valdevz@gmail.com",
      },
    },
    "schemes": ["http"],
    "consumes": ["application/json"],
    "produces": ["application/json"],
    servers: [
      {
        url: "localhost:4000/v1/api/"
      }
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer"
        }
      }
    },
    paths: {
      "/users": {
        "get": {
          "summary": "Returns a list of all employees.",
          "security": [
            {
              "BearerAuth": ["All roles"]
            }
          ],
          "responses": {
            "200" : {
              "description" : "Ok",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "userId": {type: "string"},
                      "uName": {type: "string"},
                      "lastname": {type: "string"},
                      "address": {type: "array", items: {"type": "number"}},
                    }
                  }
                }
              }
            },
            "401":{
              "description": "Not authenticated"
            },
            "403":{
              "description": "Access token does not have the required scope"
            }
          }
        }
      },
      "/users/{:id}": {
        "get": {
          "summary": "Returns a JSON with employee details.",
            "parameters": [
              {
                "name": "userId",
                "in": "path",
                "required": true,
                "description": "Parameter description in CommonMark or HTML.",
                "schema": {
                  "type": "string",
                  "format": "string",
                  "minimum": 6
                }
              }
            ],
          "security": [
            {
              "BearerAuth": ["All roles"]
            }
          ],
          "responses": {
            "200" : {
              "description" : "Ok"
            },
            "401":{
              "description": "Not authenticated"
            },
            "403":{
              "description": "Access token does not have the required scope"
            }
          }
        }
      },
      "/auth/refreshToken": {
        "get": {
          "summary": "Returns a new token.",
          "security": [
            {
              "BearerAuth": ["All roles"]
            }
          ],
          "responses": {
            "200" : {
              "description" : "Ok",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "token": {type: "string" }
                    }
                  }
                }
              }
            },
            "401":{
              "description": "Not authenticated"
            },
            "403":{
              "description": "Access token does not have the required scope"
            }
          }
        }
      },
      "/users/editUser": {
        "post": {
          "summary": "Enpoint to update employee data.",
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "userId": { type: "string" },
                    "phoneNo": { type: "number" },
                    "emailId": { type: "string" },
                    "inCharge": { type: "string" },
                  }
                }
              }
            }
          },
          "security": [
            {
              "BearerAuth": ["All roles"]
            }
          ],
          "responses": {
            "200" : {
              "description" : "Ok",
            },
            "401":{
              "description": "Not authenticated"
            },
            "403":{
              "description": "Access token does not have the required scope"
            }
          }
        }
      }
    }
  },
  apis: ["../Routes/routes/drivers.js"],
};

module.exports = {
  options
}