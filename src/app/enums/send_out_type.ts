  export enum SendOutType {
   Temporary,
   Definitely,
   FomModel,
   Service,
   Product,
  }


  export const SendOutTypeLabels: Record<SendOutType, string> = {
    [SendOutType.Temporary]: 'موقت',
    [SendOutType.Definitely]: 'قطعی',
    [SendOutType.FomModel]: 'مدل فومی',
    [SendOutType.Service]: 'خدمات',
    [SendOutType.Product]: 'محصول ساخت',
  };