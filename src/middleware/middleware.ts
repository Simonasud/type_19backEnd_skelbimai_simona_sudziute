import { NextFunction, Request, Response } from "express";
import * as Yup from 'yup'

export async function checkAdsBody(req: Request, res: Response, next: NextFunction) {
  console.log(' req.body ===',  req.body);

  const adsValidationsSchema = Yup.object({
    title: Yup.string().min(3).max(255).required(),
    description: Yup.string().min(3).max(255).required(),
    price: Yup.number().min(0).required(),
    phone: Yup.string().min(3).max(255).required(),
    TYPE: Yup.string().required(),
    user_id: Yup.number(),
    town_id: Yup.number(),
    category_id: Yup.number(),
    main_image_url: Yup.string().min(3).required()
  })

  try {
    const rez = await adsValidationsSchema.validate(req.body, {abortEarly: false})
    console.log('rez ===', rez);
     next()
  } catch (error: any) {
    const yupError = error as Yup.ValidationError;
    console.log('validation fail')
    // suformuoti atsakyma kad griztu klaidu masyvas su objektais kuriame yra path ir error message
    let obj = {}
    yupError.inner.forEach((eObj) => {
      const key = eObj.path;
      obj = { ...obj, [key || '_']: eObj.message}
       
    })
    return res.status(400).json(obj)
  }
}

export async function checkTownBody(req: Request, res: Response, next: NextFunction) {
  console.log(' req.body ===',  req.body);

  const townValidationsSchema = Yup.object({
    name: Yup.string().min(3).max(255).required(),
    population: Yup.number().min(0).required(),
    area: Yup.number().min(0).required(),
    
  })

  try {
    const rez = await townValidationsSchema.validate(req.body, {abortEarly: false})
    console.log('rez ===', rez);
     next()
  } catch (error: any) {
    const yupError = error as Yup.ValidationError;
    console.log('validation fail')
    // suformuoti atsakyma kad griztu klaidu masyvas su objektais kuriame yra path ir error message
    let obj = {}
    yupError.inner.forEach((eObj) => {
      const key = eObj.path;
      obj = { ...obj, [key || '_']: eObj.message}
       
    })
    return res.status(400).json(obj)
  }
}