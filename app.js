const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");

const databasePath = path.join(__dirname, "todoApplication.db");

const app = express();

app.use(express.json());

let database = null;

const initializeDbAndServer = async () => {
  try {
    database = await open({
      filename: databasePath,
      driver: sqlite3.Database,
    });

    app.listen(3000, () =>
      console.log("Server Running at http://localhost:3000/")
    );
  } catch (error) {
    console.log(`DB Error: ${error.message}`);
    process.exit(1);
  }
};

initializeDbAndServer();

const hasPriorityAndStatusProperties = (requestQuery) => {
  return (
    requestQuery.priority !== undefined && requestQuery.status !== undefined
  );
};

const hasPriorityProperty = (requestQuery) => {
  return requestQuery.priority !== undefined;
};

const hasStatusProperty = (requestQuery) => {
  return requestQuery.status !== undefined;
};

const hasCategoryProperty = (requestQuery) => {
  return requestQuery.category !== undefined;
};

const hasCategoryAndStatusProperty = (requestQuery) => {
  return (
    requestQuery.category !== undefined && requestQuery.status !== undefined
  );
};

const hasCategoryAndPriorityProperty = (requestQuery) => {
  return (
    requestQuery.category !== undefined && requestQuery.priority !== undefined
  );
};



app.get("/todos/", async (request, response) => {
  let data = null;
  let getTodosQuery = "";
  let validityCheck = "";
  const { search_q = "", priority, status, category, date } = request.query;

        if (hasPriorityAndStatusProperties(request.query)===true){
            if (priority==="HIGH" || priority==="LOW" || priority==="MEDIUM"){
                if (status==="TO DO" || status==="IN PROGRESS" || status==="DONE"){
                    getTodosQuery = `
                        SELECT
                            *
                        FROM
                            todo 
                        WHERE
                            todo LIKE '%${search_q}%'
                            AND status = '${status}'
                            AND priority = '${priority}';`;
                     data = await database.all(getTodosQuery);
                         response.send(data);

                }else{
                    response.status(400);
                    response.send("Invalid Todo Status")
                }
            }else{
                response.status(400);
                response.send("Invalid Todo Priority")
            }

        }else if (hasPriorityProperty(request.query)===true){
                 if (priority==="HIGH" || priority==="LOW" || priority==="MEDIUM"){
               
                    getTodosQuery = `
                        SELECT
                            *
                        FROM
                            todo 
                        WHERE
                            todo LIKE '%${search_q}%'
                            AND status = '${status}'
                            AND priority = '${priority}';`;
                     data = await database.all(getTodosQuery);
                         response.send(data);

               
                
            }else{
                response.status(400);
                response.send("Invalid Todo Priority")
        }else if (hasStatusProperty(request.query)===true){
             
                if (status==="TO DO" || status==="IN PROGRESS" || status==="DONE"){
                    getTodosQuery = `
                        SELECT
                            *
                        FROM
                            todo 
                        WHERE
                            todo LIKE '%${search_q}%'
                            AND status = '${status}'
                            AND priority = '${priority}';`;
                     data = await database.all(getTodosQuery);
                         response.send(data);

                }else{
                    response.status(400);
                    response.send("Invalid Todo Status")
                }
           
        }else if (hasCategoryAndPriorityProperty(request.query)===true){
                if (priority==="HIGH" || priority==="LOW" || priority==="MEDIUM"){
                if (category==="WORK" || category==="HOME" || category==="LEARNING"){
                    getTodosQuery = `
                        SELECT
                            *
                        FROM
                            todo 
                        WHERE
                            todo LIKE '%${search_q}%'
                            AND category = '${category}'
                            AND priority = '${priority}';`;
                     data = await database.all(getTodosQuery);
                         response.send(data);

                }else{
                    response.status(400);
                    response.send("Invalid Todo Category")
                }
            }else{
                response.status(400);
                response.send("Invalid Todo Priority")
            }
        }else if (hasCategoryProperty(request.query)===true){

             if (category==="WORK" || category==="HOME" || category==="LEARNING"){
                    getTodosQuery = `
                        SELECT
                            *
                        FROM
                            todo 
                        WHERE
                            todo LIKE '%${search_q}%'
                            AND category = '${category}'
                           ;`;
                     data = await database.all(getTodosQuery);
                         response.send(data);

                }else{
                    response.status(400);
                    response.send("Invalid Todo Category")
                }

        }else if (hasCategoryAndStatusProperty(request.query)===true){

             if (hasPriorityAndStatusProperties(request.query)===true){
            if (category==="WORK" || category==="HOME" || category==="LEARNING"){
                if (status==="TO DO" || status==="IN PROGRESS" || status==="DONE"){
                    getTodosQuery = `
                        SELECT
                            *
                        FROM
                            todo 
                        WHERE
                            todo LIKE '%${search_q}%'
                            AND status = '${status}'
                            AND category = '${category}';`;
                     data = await database.all(getTodosQuery);
                         response.send(data);

                }else{
                    response.status(400);
                    response.send("Invalid Todo Status")
                }
            }else{
                response.status(400);
                response.send("Invalid Todo Category")
            }

        }else{
             getTodosQuery = `
      SELECT
        *
      FROM
        todo 
      WHERE
        todo LIKE '%${search_q}%';`;

          data = await database.all(getTodosQuery);
                         response.send(data);
        }
        
});

app.get("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;

  const getTodoQuery = `
    SELECT
      *
    FROM
      todo
    WHERE
      id = ${todoId};`;
  const todo = await database.get(getTodoQuery);
  response.send(todo);
});


app.get("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;

  const getTodoQuery = `
    SELECT
      *
    FROM
      todo
    WHERE
      id = ${todoId};`;
  const todo = await database.get(getTodoQuery);
  response.send(todo);
});

module.exports = app;
