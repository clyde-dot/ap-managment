import { NextFunction, Request, Response } from 'express'

export function logger(req: Request, res: Response, next: NextFunction) {
  console.log(`
    Date: ${new Date().toISOString()}
    Method: ${req.method}
    URL: ${req.url}
    BODY: ${req.body ? JSON.stringify(req.body) : 'empty'}
    RESPONSE Status: ${res.statusCode}
    `)

  next()
}
