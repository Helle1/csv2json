class CsvToJson {

    csv: string
    skipLinesOnTop: number = 0
    headers: string[] = []
    constructor(csv: string, skipLinesOnTop: number = 0) {
        this.csv = csv
        this.skipLinesOnTop = skipLinesOnTop
    }

    getHeaders(): string[] {
        return this.headers
    }

    convert(): object[] {
        let rawlines = this.csv.split('\n')
        let headers: string[] = rawlines[this.skipLinesOnTop].split(',')
        let lines: string[] = this.extractLines(this.csv, headers.length, this.skipLinesOnTop+1)
        this.headers = headers
        let result: any[] = []
        for (let i = 0; i < lines.length; i++) {
            let obj:any = {}
            let currentLine: any = lines[i]
            for (let j = 0; j < headers.length; j++) {
                obj[headers[j]] = currentLine[j]
            }
            result.push(obj)
        }

        return result
    }

    extractLines(csv: string, colCount: number, skip:number): any[] {
       const lines :any = []

        // anf => kein beitrich suchen bis wieder anf
        // wenn colcount 0 comma count => neue zeile

        let inField: boolean = false
        let currentField: string = ''
        let currentLine: string[] = []
        let commaCount: number = 0
        let lineCount: number = 1
        for(let i = 0; i < csv.length; i++) {

            if(commaCount === colCount-1) {
                if(lineCount > skip) {
                    lines.push(currentLine)
                }
                lineCount++
                currentLine = []
                commaCount = 0
            }

            if(csv[i] === '"') {
                inField = !inField
                continue
            }

            if( csv[i] != ',' || inField) {
                currentField += csv[i]
            }

            if(csv[i] === ',' && !inField) {
                currentLine.push(currentField)
                currentField = ''
                commaCount++

                continue
            }
        }

        return lines
    }
    splitWithDelimiters(str: string, ...delimiters: string[]): string[] {
        let result: string[] = []
        let current: string = ''
        let isDelimited: boolean = false
        for (let i = 0; i < str.length; i++) {
            if (delimiters.includes(str[i])) {
                if (isDelimited) {
                    result.push(current)
                    current = ''
                    isDelimited = false
                } else {
                    isDelimited = true
                }
            } else {
                current += str[i]
            }
        }
        result.push(current)
        return result
    }

}

export default CsvToJson
