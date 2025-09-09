

export function isStringArray(variable: any): variable is string[] {
  return (
    Array.isArray(variable) &&
    variable.every((item) => typeof item === 'string')
  )
}

export const sortArrayOfObjects = <T>(
  data: T[],
  keyToSort: keyof T,
  ascending: boolean
) => {
  const compare = (objectA: T, objectB: T) => {
    const valueA = objectA[keyToSort]
    const valueB = objectB[keyToSort]

    if (valueA === valueB) {
      return 0
    }

    if (valueA > valueB) {
      return ascending ? 1 : -1
    } else {
      return ascending === false ? -1 : 1
    }
  }

  return data.slice().sort(compare)
}

export function isValidIranianNationalCode(input: string): boolean {
  if (!/^\d{10}$/.test(input)) return false
  const check: number = +input[9]
  const sum: number =
    input
      .split('')
      .slice(0, 9)
      .reduce((acc: number, x: string, i: number) => acc + +x * (10 - i), 0) %
    11
  return sum < 2 ? check === sum : check + sum === 11
}

export const mobileRegex = new RegExp('^(\\+98|0)?9\\d{9}$')

export function onlyFarsiLetters(event: any) {
  event.target.value = event.target.value.replace(/[^آ-ی ]/g, '')
}

export function onlyEnglishLetters(event: any) {
  event.target.value = event.target.value.replace(/[^a-zA-Z ]/g, '')
}

export function saveBlobAsFile(data: Blob, filename: string) {
  const blob = new Blob([data], { type: data.type || 'image/jpeg' })
  const url = window.URL.createObjectURL(blob)

  // Create a link element
  const a = document.createElement('a')
  a.href = url
  a.download = filename

  // Append to the DOM
  document.body.appendChild(a)

  // Trigger the download
  a.click()

  // Clean up
  window.URL.revokeObjectURL(url)
  document.body.removeChild(a)
}
// export function printImage(appImage: ImageComponent) {
//   const imageDataUrl = appImage.image // Get the base64 data URL

//   // if (!imageDataUrl) {
//   //   this.showToast(ToastTypes.DANGER, ERR_CAN_NOT_PRINT_IMAGE)
//   //   return
//   // }
//   const printWindow = window.open(
//     '',
//     '',
//     'left=500,top=100,width=900,height=900,toolbar=0,scrollbars=0,status=0'
//   )

//   if (printWindow) {
//     printWindow.document.open()
//     printWindow.document.write(`
//       <html>
//         <head>
//           <title>Print Image</title>
//           <style>
//             body {
//               margin: 0;
//               text-align: center;
//               background-color: white;
//             }
//             img {
//               max-width: 100%;
//               height: auto;
//             }
//           </style>
//         </head>
//         <body>
//           <img src="${imageDataUrl}" alt="Image" />
//         </body>
//       </html>
//     `)
//     printWindow.document.close()

//     // Wait for the window to load
//     printWindow.onload = () => {
//       printWindow.document.body.addEventListener('contextmenu', (event) => {
//         event.preventDefault()
//       })

//       printWindow.document.body.addEventListener('dragstart', (event) => {
//         event.preventDefault()
//       })
//       printWindow.document.body.addEventListener('dragover', (event) => {
//         event.preventDefault()
//       })

//       printWindow.document.body.addEventListener('drop', (event) => {
//         event.preventDefault()
//       })

//       printWindow.focus()
//       printWindow.print()
//     }
//   // } else {
//   //   this.showToast(ToastTypes.DANGER, ERR_CAN_NOT_PRINT_IMAGE)
//   // }
// }
// }
export function getPersianName(permissionEnglishName: string) {
  const permissions: Record<string, string>[] = [
    { 'CanPrint': 'پرینت' },
    { 'CanDownload': 'دانلود' },
  ]

  // Find the object containing 'CanPrint'
  const permission = permissions.find(
    (permission) => permissionEnglishName in permission
  )

  // Access the value if the object was found
  const persianName = permission ? permission[permissionEnglishName] : undefined
  return persianName
}
export function validatePassword(password: string): boolean {
  const digitRegex = /[0-9]/;
  const lowercaseRegex = /[a-z]/;
  const uppercaseRegex = /[A-Z]/;
  const nonAlphanumericRegex = /[!@#$&()]/;

  return (
      password.length >= 8 &&  
      digitRegex.test(password) &&           
      lowercaseRegex.test(password) &&      
      uppercaseRegex.test(password) &&         
      nonAlphanumericRegex.test(password)      
  );
}

export function randomIntFromInterval(min: number, max: number) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60)

  const remainingSeconds = seconds % 60
  return `${padZero(minutes)}:${padZero(remainingSeconds)}`
}
function padZero(value: number): string {
  return value < 10 ? '0' + value : value.toString()
}