import { Request, Response } from "express";

import { api } from "../..";

export default {
    route: '/id/sign-in',
    accepts: ['POST'],
    handlers: {
        POST: (req: Request, res: Response) => {
            if(res.silent) return res.end();
            
            api.errors.stop(1000, res)
        }
    }
}