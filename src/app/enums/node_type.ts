export enum NodeType {
  Start = 0,
  Action = 1,
  Expression = 2,
  End = 3,
}
export const NodeTypeLabels: Record<NodeType, string> = {
  [NodeType.Start]: 'شروع فرآیند',
  [NodeType.End]: 'پایان فرآیند',
  [NodeType.Action]: 'اجرایی',
  [NodeType.Expression]: 'شرطی',
};
