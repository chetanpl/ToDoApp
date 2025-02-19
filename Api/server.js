const http = require("http");
require('dotenv').config();
const { v4: uuidv4 } = require("uuid"); 
const sendResponse = require("./Utility/response")
const error_messages = require("./Utility/error")


// In-memory tasks storage
let tasks = [];

// Create the server
const server = http.createServer((req, res) => {
  const { method, url } = req;

    // Set CORS headers for all responses
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  
    // Handle OPTIONS request for CORS preflight
    if (method === "OPTIONS") {
      res.writeHead(204);
      res.end();
      return
    }
  // Handle GET /tasks
  if (method === "GET" && url === "/tasks") {
    sendResponse(res, 200, tasks);

  // Handle POST /tasks
  } else if (method === "POST" && url === "/tasks") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      try {
        const { title } = JSON.parse(body);
        if (!title) {
          sendResponse(res, 400, { error: error_messages.ToDo.TTILE_NOT_FOUND });
          return;
        }

        const newTask = { id: uuidv4(), title, completed: false };
        tasks.push(newTask);
        sendResponse(res, 201, newTask);
      } catch (error) {
        sendResponse(res, 400, { error: error_messages.ToDo.INVALID_PAYLOAD });
      }
    }); 

  // Handle PUT /tasks/:id
  } else if (method === "PUT" && url.startsWith("/tasks/")) {
    const id = url.split("/")[2];

    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });
  }
    else if (method === "DELETE" && url === "/tasks") {
    tasks = [];
    sendResponse(res, 204, null);

  // Handle 404 Not Found
  } 

  else if (method === "DELETE" && url.startsWith("/tasks/single")) {
    try{
    const id = url.split("/")[3];
    const result=  tasks.filter((taskId)=> {
     console.log(id);
     return  taskId.id!==id;
    });
    tasks=result;
    sendResponse(res, 200, tasks);
  }
  catch(res){
    console.log(res);
  }
  //  sendResponse(res, 204, null);

  // Handle 404 Not Found
  } 

  
  else {
    sendResponse(res, 404, { error: error_messages.ToDo.ROUTE_NOT_FOUND});
  }
});

// Start the server
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
