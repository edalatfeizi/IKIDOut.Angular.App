export type BaseApiResponse<T> = {
  succeed: boolean
  responseCode: number
  message: string
  data: T
  currentPage: number
  pageSize: number
  totalCount: number
}
