  export enum ProductGroupType {
   FixedAsset,
   Operation,
   Waste,
  }

  export const ProductGroupTypeLabels: Record<ProductGroupType, string> = {
    [ProductGroupType.FixedAsset]: 'دارایی ثابت',
    [ProductGroupType.Operation]: 'کالای عملیاتی',
    [ProductGroupType.Waste]: 'خروج ضایعات',
  };