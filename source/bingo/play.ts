import { Wordlist } from "."

const parameters: any = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop: string) => searchParams.get(prop)
})

async function populateBingo(wordlistURL: string, words: string[]) {
    const response = await fetch(wordlistURL)
    const wordlist: Wordlist = await response.json()

    let num = 0
    for (const word of words) {
        let found = false
        for (const find of wordlist) {
            let thisWord: string
            if (Array.isArray(find.en)) {
                thisWord = find.en[0]
            } else {
                thisWord = find.en
            }
            if (thisWord !== word) continue

            // We found the word, add it to the bingo card
            const itemOutside = document.createElement("div")
            const itemInside = document.createElement("div")
            itemOutside.id = `option${num}`
            itemOutside.classList.add("item")
            itemInside.classList.add("itemInside")
            if (find.image) {
                itemInside.style.backgroundImage = `url('${find.image}')`
                itemInside.style.backgroundRepeat = "no-repeat"
                itemInside.style.backgroundPosition = "center"
                itemInside.style.backgroundSize = "contain"
            }

            itemInside.innerText = thisWord
            itemOutside.appendChild(itemInside)
            const cell = document.getElementById(`cell${num}`)
            cell.appendChild(itemOutside)
            found = true
            num += 1
            break
        }
        if (!found) {
            // We have an error to deal with
            throw `We didn't find the word ${word} in ${wordlistURL}.`
        }
    }
}

if (parameters.category && parameters.list && parameters.words) {
    const words = (parameters.words as string).split("🔥")
    populateBingo(`../wordlists/${parameters.category}/${parameters.list}.json`, words)
}

export {}