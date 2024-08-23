import express from "express";

const router = express.Router();

router.get("/api/users/signin" , (req,res) => {
  res.send("signin route called");
})

export { router as signInRoute };