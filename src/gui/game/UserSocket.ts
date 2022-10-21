import { GoGame, ServerGoGameStateI } from "./GoGame"
import * as $ from 'jquery'
import { GoToastI } from "./GoToasts"

export interface ResponseResultI {
    successful: boolean
    errorText?: string
}

export interface GoMoveI {
    pos?: {
        gridX: number,
        gridY: number,
    },
    pass?: boolean,
    giveup?: boolean
}

export interface JoinInterestedGameI {
    name: string,
}

export interface SendFormatI {
    header: string,
    value: any
}

export interface InterestIntoGameI {
    gameName: string
}

export class UserSocket {
    static instance: UserSocket

    static startUserSocket() {
        console.log(typeof UserSocket.instance)
        if (typeof UserSocket.instance === 'undefined') {
            UserSocket.instance = new UserSocket()

            $.get('http://' + 'localhost:2304' + '/ws-url', (data) => { // TODO
                console.log('Websocket url Data: ' + data)

                UserSocket.instance.connect(''+data, () => {
                    const currentUrl = window.location.href
                    let pathparts = new URL(currentUrl).pathname.split('/')
                    pathparts = pathparts.filter(pp => pp.length > 0)
                    const gameName = pathparts[pathparts.length - 1]

                    UserSocket.instance.interestIntoGame(gameName)

                    window.onbeforeunload = (ev) => {
                        console.log('BEFORUNLOAD!')
                        UserSocket.instance.close('I just closed the website.')
                    }
                })
            })
        }
    }

    private socket: WebSocket | undefined = undefined

    connect(wsUrl: string, onopen?: () => void) {
        console.log('Connecting Websocket to URL "' + wsUrl + '".')
        this.socket = new WebSocket(wsUrl)

        this.socket.onopen = () => {
            console.log('Websocket opened to "' + wsUrl + '".')
            if (onopen) onopen()
        }

        this.socket.onerror = (ev) => {
            GoGame.instance.updateGameState({
                joinError: 'WEBSOCKET ERROR: The websocket could not connect to "' + wsUrl + '".'
            })
        }

        this.socket.onmessage = (ev) => {
            try {
                const data = JSON.parse(''+ev.data) as SendFormatI
                this.onMessage(data.header, data.value)
            }
            catch (e) { alert('Format Exception: The format of the message "' + ev.data + '" could not be parsed as SendFormatI.') }
        }
    }

    joinInterestedGame(userName: string) {
        //console.log('I want to join the game "' + gameName + '" with user name "' + userName + '".')
        const joinMessage: JoinInterestedGameI = { name: userName }
        this.send('join-game', joinMessage)
    }

    doMove(gridX: number, gridY: number) {
        const moveMessage: GoMoveI = {
            pos: {
                gridX: gridX,
                gridY: gridY
            }
        }
        this.send('go-move', moveMessage)
    }

    passMove() {
        const moveMessage: GoMoveI = { pass: true }
        this.send('go-move', moveMessage)
    }

    giveupMove() {
        const moveMessage: GoMoveI = { giveup: true }
        this.send('go-move', moveMessage)
    }

    close(reason: string) {
        this.socket?.close(1000, reason)
    }

    interestIntoGame(gameName: string) {
        const interestedMessage: InterestIntoGameI = { gameName: gameName }
        this.send('interested-into-game', interestedMessage)
    }
    
    send(h: string, v: any) {
console.log('Client sends message with header "' + h + '":')
console.log(v)
        this.socket?.send(JSON.stringify({ header: h, value: v }))
    }
    onMessage(h: string, v: any) {
        const wrongformatException = () => { alert('The format of the message header:"' + h + '" | value:"' + JSON.stringify(v) + '" is wrong!') }

console.log('Client recieves message with header "' + h + '":')
console.log(v)
console.log('__________')

        if (h === 'go-game-state') {
            try {
                const state = v as ServerGoGameStateI
                GoGame.instance.updateGameState(state)
            }
            catch (e) { wrongformatException() }
        }

        if (h === 'display-toasts') {
            try {
                const toasts = v as GoToastI[]
                GoGame.instance.displayToasts(toasts)
            }
            catch (e) { wrongformatException() }
        }
    }
}