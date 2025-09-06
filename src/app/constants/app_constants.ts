import { isDevMode } from '@angular/core'

export const ASSETS_PATH = isDevMode() ? '/assets' : '/dashboard/assets'
export const LOGO_PATH = `${ASSETS_PATH}/images/ikid.png`
export const LOGIN_BG_PATH1 = `${ASSETS_PATH}/images/login_bg1.jpg`
export const LOGIN_BG_PATH2 = `${ASSETS_PATH}/images/login_bg2.jpg`
export const PROFILE_COVER_BG1_PATH = `${ASSETS_PATH}/images/img_cover_1.jpg`

export const IMG_IMAGE_CLASSIFICATION_1 = `${ASSETS_PATH}/images/image-classification-1.png`
export const IMG_IMAGE_CLASSIFICATION_2 = `${ASSETS_PATH}/images/image-classification-2.png`

export const IMG_IMAGE_NOT_FOUND = `${ASSETS_PATH}/images/img_empty_list.jpg`
export const IMG_CONFIRM_CODE = `${ASSETS_PATH}/images/img_confirm_code.png`
export const IMG_LOCKED_FOLDER = `${ASSETS_PATH}/images/locked_folder.png`
export const IMG_CLASSIFYING = `${ASSETS_PATH}/images/classifying-2.png`
export const IMG_AI_HAND = `${ASSETS_PATH}/images/ai-hand.png`
export const IMG_LOGO = `${ASSETS_PATH}/images/app-logo.png`

export const AUTH_BG_IMAGES = [`${ASSETS_PATH}/images/login_bg1.jpg`, `${ASSETS_PATH}/images/login_bg2.jpg`]
export const TOAST_DURATION = 5000