// 1) we are importing exprss module which we installed using npm i
import express from "express";

// 2) call/invoke the function
const app = express();

app.get("/", (req, res) => {
  // req,res -> object
  //   res.send("welcome");
  res
    .status(500)
    .json({ success: true, message: "okay", data: { username: "abc" } });
});

app.get("/about", (req, res) => {
  res.status(200).send("hi");
});

// 3) assign a port number to our server
// app.listen(PORT_NUMBER, callback)
app.listen(3000, () => {
  console.log("Server Started...");
});
