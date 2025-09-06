import { isDevMode } from '@angular/core'

export const BaseUrl = isDevMode()
  ? 'https://localhost:7036/'
  : 'http://ikidout.ikidmis.com/'
// export const BaseUrl = 'http://localhost:5108/'
// export const BaseUrl = 'https://localhost:7037/'
export const API_V1 = 'api/v1/'
export const PAGE_SIZE = 100
export const IMAGES_PAGE_SIZE = 20

/** Images */
export const API_DOWNLOAD_FILE_URL = BaseUrl + API_V1 + 'Files/download'
export const API_DOWNLOAD_PERSON_IMAGE_URL =
  BaseUrl + API_V1 + 'Personely/image'
/** Accounts API EndPoints Start */
export const API_LOGIN = BaseUrl + API_V1 + 'account/login'
export const API_CONFIRM_CODE = BaseUrl + API_V1 + 'account/confirmcode'
export const API_CHANGE_PASSWORD = BaseUrl + API_V1 + 'account/change/password'
export const API_LOGOUT = BaseUrl + API_V1 + 'account/logout'
export const API_REFRESH_TOKEN = BaseUrl + API_V1 + 'account/refreshtoken'

/** Accounts API EndPoints End */

/** Users */
export const API_ACCOUNTS = BaseUrl + API_V1 + 'account'
export const API_GET_ALL_USERS = BaseUrl + API_V1 + 'Account/all'

/** Permissions */
export const API_PERMISSIONS = BaseUrl + API_V1 + 'permissions'

/** Roles */
export const API_ROLES = BaseUrl + API_V1 + 'Roles'

/**Departments */
export const API_DEPARTMENTS = BaseUrl + API_V1 + 'Departments'
export const API_FILTER_DEPARTMENTS = API_DEPARTMENTS + '/filter'

/**Settings */
export const API_SETTINGS = BaseUrl + API_V1 + 'Settings'

//SignalR Hub
export const SignalRHub = BaseUrl + 'serverhub'

/** Product Send Out Flows API EndPoints Start */
export const API_GET_PRODUCT_SEND_OUT_FLOWS =
  BaseUrl + API_V1 + 'ProductSendOutFlow/all'

/** Product Send Out Flows API EndPoints End */
