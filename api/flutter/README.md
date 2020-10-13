# Flutter

Lightweight custom ORM using Express Server & NeDB. This project was made to have the ability to initialize a complete backend within minutes.

To get started in terminal run these commands:

1) npm install
2) npm run dev

After that last command you should have a server running in the terminal. This package comes with some premade models & Schemas. The endpoints are set up as RESTful routes (index, show, create, update, delete). The endpoints.js file will be reused by all endpoints and should never be updated. 

To build your own table, go into routes/api/index.js. This file exports 1 object that has an array of the table names and the means to parse the data and validate. 

1) Add you table name to the array in the data object
2) Make a new case which will hold your schema and validations
3) Follow the naming standards in place and use those as a guide to build your own schema and validations.

After you have built that, you can jump over to Postman (or use fetch in Chrome console) to test your new API endpoint.`