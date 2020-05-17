class Calculator
{
    private _audio: HTMLAudioElement = new Audio('./assets/click.mp3')
    private _audioOnOff: boolean = false
    private _lastOperator: string = ''
    private _lastNumber: string = ''

    private _operation: any[] = []
    private _locale: string = 'pt-BR'
    private _display = document.querySelector("#display-operation") as HTMLElement
    private _date = document.querySelector('#display-date') as HTMLElement
    private _hour = document.querySelector('#display-hour') as HTMLElement
    

    constructor()
    {
        this.initialize()
        this.initButtonsEvents()
    }

    private initialize(): void
    {
        this.setDisplayDateTime()
        
        setInterval( (): void => this.setDisplayDateTime(), 1000)

        this.setNumberToDisplay()

        document.querySelectorAll('#btn-ac').forEach( (btn): void => {
            btn.addEventListener('dblclick', (): void => this.toggleAudio())
        })
    }

    private toggleAudio():void
    {
        this._audioOnOff = !this._audioOnOff
    }

    private playAudio(): void
    {
        if (this._audioOnOff)
        {
            this._audio.currentTime = 0
            this._audio.play()
        }
    }

    private addEventListenerAll(element: HTMLElement, events: string, fn: (e: Event) => void )
    {
        events.split(" ").forEach( event => {
            element.addEventListener(event, fn, false)
        })
    }

    private clearAll(): void
    {
        this._operation = []
        this._lastNumber = ''
        this._lastOperator = ''
        this.setNumberToDisplay()
    }

    private clearEntry(): void
    {
        this._operation.pop()
        this.setNumberToDisplay()
    }

    private getLastOperation(): any
    {
        return this._operation[this._operation.length - 1]
    }

    private setLastOperation(value: string | number): void
    {
        this._operation[this._operation.length - 1] = value
    }

    private isOperator(value: string): boolean
    {
        return ['+','-', '*', '%', '/'].indexOf(value) > -1
    }

    private pushOperation(value: string | number): void
    {
        this._operation.push(value)

        if (this._operation.length > 3)
        {
            this.calc()
        }
    }

    private getResult()
    {
        try{
            return eval(this._operation.join(''))
        }catch(e)
        {
            setTimeout( (): void => this.setError(), 1)
        }
    }

    private calc(): void
    {
        let last: string = ''

        this._lastOperator = this.getLastItem()

        if (this._operation.length < 3)
        {
            let firstNumber: number = this._operation[0]
            this._operation = [firstNumber, this._lastOperator, this._lastNumber]
        }

        if (this._operation.length > 3)
        {
            last = this._operation.pop()
            this._lastNumber = this.getResult()
        }else if (this._operation.length == 3)
        {
            this._lastNumber = this.getLastItem(false)
        }

        let result = this.getResult()

        if (last == '%')
        {
            result /= 100
            this._operation = [result]
        }else 
        {
            this._operation = [result]

            if (last) this._operation.push(last)
        }

        this.setNumberToDisplay()
    }

    private getLastItem(isOperator: boolean = true): string
    {
        let lastItem: any

        for (let i = this._operation.length-1; i >= 0; i--)
        {
            if (this.isOperator(this._operation[i]) == isOperator)
            {
                lastItem = this._operation[i]
                break;
            }
        }

        if (!lastItem)
        {
            lastItem = isOperator ? this._lastOperator : this._lastNumber
        }

        return lastItem
    }

    private setNumberToDisplay(): void
    {
        let lastNumber: any = this.getLastItem(false)

        if (!lastNumber) lastNumber = 0

        this.display = lastNumber

    }

    private addOperation(value: string): void
    {
        if (isNaN(this.getLastOperation()))
        {

            if (this.isOperator(value)) 
            {
                this.setLastOperation(value)

            } else 
            {
                this.pushOperation(value)
                this.setNumberToDisplay()
            }
            
        } else 
        {
            let newValue: string = this.getLastOperation().toString() + value
            
            this.isOperator(value) ? this.pushOperation(value) : this.setLastOperation(newValue)
            
            this.setNumberToDisplay()
        }
    }

    private setError(): void
    {
        this._display.innerHTML = 'Error'
    }

    private addDot(): void
    {
        let lastOperation: string = this.getLastOperation()

        if (typeof lastOperation === 'string' && lastOperation.split('').indexOf('.') > -1) return

        if ( this.isOperator(lastOperation) || !lastOperation)
        {
            this.pushOperation('0.');
        }else
        {
            this.setLastOperation(lastOperation.toString() + '.')
        }

        this.setNumberToDisplay()
    }

    private execBtn(value: string): void
    {

        this.playAudio()

        switch(value)
        {
            case 'AC':
                this.clearAll()
                break
            case 'CE':
                this.clearEntry()
                break
            case '+':
                this.addOperation('+')
                break;
            case '-':
                this.addOperation('-')
                break
            case '/':
                this.addOperation('/')
                break
            case 'X':
                this.addOperation('*')
                break
            case '%':
                this.addOperation('%')
                break
            case '=':
                this.calc()
                break
            case '.':
                this.addDot()
                break
            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                this.addOperation(value)
                break

            default:
                this.setError()
                break
        }
    }

    private initButtonsEvents(): void
    {
        let buttons = document.querySelectorAll<HTMLElement>(".buttons")

       buttons.forEach( (btn) => {

            this.addEventListenerAll(btn, 'click drag ', (): void => {
                let textBtn = btn.innerHTML

                this.execBtn(textBtn)
            })

            this.addEventListenerAll(btn, 'mouseover mouseup mousedown', (): void => {
                btn.style.cursor = 'pointer'
            })


       })
    }

    private setDisplayDateTime(): void
    {
        this.date = this.currentDate.toLocaleDateString(this._locale)
        this.hour = this.currentDate.toLocaleTimeString(this._locale)
    }

    // Getters & Setters
    public get display(): string
    {
        return this._display?.innerHTML
    }

    public set display(value: string)
    {

        this._display.innerHTML = (value.length > 9) ? 'Error' : value
        
    }

    public get currentDate(): Date
    {
        return new Date()
    }

    public get date(): string
    {
        return this._date.innerHTML
    }

    public set date(value: string)
    {
        this._date.innerHTML = value
    }
    
    public get hour(): string
    {
        return this._hour.innerHTML
    }

    public set hour(value: string)
    {
        this._hour.innerHTML = value
    }
}


const calc = new Calculator