export function formDataToJson(string) {
  var arr_data = string.split('&')
  var json = {}
  arr_data.map((item) => {
    var arr = item.split('=')
    json[arr[0]] = arr[1]
  })
  return json
}

export function JsonToformData(json) {
  var str = JSON.stringify(json)
  str = str.replace(/{/g, '').replace(/}/g, '').replace(/"/g, '').replace(/:/g, '=').replace(/,/g, '&')
  return str
}
