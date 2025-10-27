export enum ProductInventoryType {
  Production,
  NonProduction,
}
export const ProductInventoryTypeLabels: Record<ProductInventoryType, string> = {
  [ProductInventoryType.Production]: 'تولیدی',
  [ProductInventoryType.NonProduction]: 'غیر تولیدی',
};
