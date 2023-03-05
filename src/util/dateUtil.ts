export  function getAMPMTime (time) {
  const splitTime = time.split(':')
  if (splitTime.length > 0) {
    return `${splitTime[0] > 12 ? "PM" : "AM"} ${splitTime[0] > 12 ? splitTime[0] - 12 : splitTime[0]}:${splitTime[1]}`
  } else {
    return ''
  }
}
