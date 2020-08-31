function getDataTimeStamp(dateStr) {
    return Date.parse(dateStr.replace(/-/gi,"/"));
}
console.log(getDataTimeStamp("2019-12-06 19:26:22"));
console.log(getDataTimeStamp("2019-12-06"));