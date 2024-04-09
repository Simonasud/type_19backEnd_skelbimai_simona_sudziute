export type AdsObjType = {
  id: number;
  title: string;
  main_image_url: string;
  image_1?: string 
  image_2?: string 
  image_3?: string 
  image_4?: string 
  image_5?: string 
  description: string;
  price: number;
  phone: string;
  TYPE: string;
  town_id?: number 
  user_id?: number 
  category_id?: number 
  created_at?: string 
  is_published: boolean;
}

export type AdsObjTypeNoId = Omit<AdsObjType, 'id'>

export type AdsFormType = {
  title: string,
  description: string,
  price: number,
  phone: string,
  TYPE: string,
  town: string,
  category: string;
}


