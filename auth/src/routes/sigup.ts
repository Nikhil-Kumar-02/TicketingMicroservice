import express from "express";

const router = express.Router();

router.get("/api/users/signup" , (req,res) => {
  res.send("signup route called");
})

export { router as signUpRoute };