const app = require("./app");

const dotenv =require("dotenv");
const connectDatabase =require("./config/database")  //database export

process.on("uncaughtException", (err) => {
    console.log(`Error:${err.message}`);
    console.log(`shuting down the server due to uncaught excoeption `);


    process.exit(1);

})
//config
dotenv.config({path:"backend/config/config.env"});

//connecting with database
connectDatabase()

const server =app.listen(process.env.PORT,()=>{
    console.log(`server is start on http://localhost:${process.env.PORT}`)
})

//unhandle promise rejection  (Error handle)
process.on("unhandledRejection", (err) => {
    console.log(`Error:${err.message}`);
    console.log(`shuting down the server due to unhandled promise rejection`);

    server.close(() => {
        process.exit(1);
    });

});