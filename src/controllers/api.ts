"use strict";

import async from "async";
import request from "request";
import graph from "fbgraph";
import { Response, Request, NextFunction } from "express";


/**
 * GET /api
 * List of API examples.
 */
export const getPing = (req: Request, res: Response) => {
  res.json( {
    pong: "true"
  } );
};