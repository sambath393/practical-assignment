export const chunkArray = (a) => {
    var chunk
    let x = []

    while (a.length > 0) {

        chunk = a.splice(0, 3)

        x.push(chunk)
    }

    return x
}

export const autocompleteFn = (options, keyword) => {
    let array = [...options]

    let index = array.findIndex(ele => ele.value === keyword)

    if (index === -1) {
        if (array.length >= 5) {
            array.splice(array.length - 1, 1)
        }

        array.unshift({
            value: keyword
        })
    } else {
        array.splice(index, 1)
        array.unshift({
            value: keyword
        })
    }


    localStorage.setItem("@remember", JSON.stringify(array))

    return array
}