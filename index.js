import app from "./app.js";

// constants
const HOST = process.env.HOST;
const PORT = process.env.PORT || 4000;
const NODE_ENV = process.env.NODE_ENV;

// listen
app.listen(PORT, () => {
  console.log(
    `Server is running in ${NODE_ENV} mode on ${HOST}:${PORT}`.blue.bold
  );
});
