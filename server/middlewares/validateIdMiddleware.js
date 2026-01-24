import express from "express";
import { ObjectId } from "mongodb";

export function validateIdMiddleware(req, res, next, value, name) {
  if (!ObjectId.isValid(value)) {
    return res.status(400).json({ message: "Invalid ID" });
  }

  next();
}
