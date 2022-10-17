import { GoGame, ServerGoGameStateI } from "./GoGame"

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

export interface JoinGameI {
    name: string,
    gameName: string
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

    private wsUrl: string
    private socket: WebSocket | undefined = undefined

    constructor() {
        this.wsUrl = 'ws://' + new URL(window.location.href).hostname + ':' + 3002 + '/' // TODO!
        UserSocket.instance = this
    }

    connect(onopen?: () => void) {
        this.socket = new WebSocket(this.wsUrl)

        this.socket.onopen = () => {
            console.log('Websocket connected to "' + this.wsUrl + '".')
            if (onopen) onopen()
        }
        this.socket.onerror = (ev) => {
            GoGame.instance.updateGameState({
                joinError: 'WEBSOCKET ERROR: The websocket could not connect to "' + this.wsUrl + '".'
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

    joinGame(gameName: string, userName: string) {
        console.log('I want to join the game "' + gameName + '" with user name "' + userName + '".')
        const joinMessage: JoinGameI = { gameName: gameName, name: userName }
        this.send('join-game', joinMessage)
    }

    interestIntoUrlGame() {
        const currentUrl = window.location.href
        let pathparts = new URL(currentUrl).pathname.split('/')
        pathparts = pathparts.filter(pp => pp.length > 0)
        const gameName = pathparts[pathparts.length - 1]

        this.interestIntoGame(gameName)
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

    private interestIntoGame(gameName: string) {
        const interestedMessage: InterestIntoGameI = { gameName: gameName }
        this.send('interested-into-game', interestedMessage)
    }
    
    send(h: string, v: any) {
        this.socket?.send(JSON.stringify({ header: h, value: v }))
    }
    onMessage(h: string, v: any) {
        const wrongformatException = () => { alert('The format of the message header:"' + h + '" | value:"' + JSON.stringify(v) + '" is wrong!') }

        if (h === 'go-game-state') {
            try {
                const state = v as ServerGoGameStateI
                GoGame.instance.updateGameState(state)
            }
            catch (e) { wrongformatException() }
        }
    }
}