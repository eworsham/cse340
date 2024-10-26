// Convert UTC timestamp to local timezone
const timestampElementArray = document.querySelectorAll("#timestamp")

timestampElementArray.forEach(timestampElement => {
    const date = new Date(timestampElement.innerHTML)
    timestampElement.innerHTML = date.toLocaleString()
})