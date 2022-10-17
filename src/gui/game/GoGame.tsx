import React from "react"
import { JoinGame } from "./EnterName"
import { GoBoard } from "./GoBoard"
import { GoBottomComponent } from "./GoBottomComponent"
import { GoTitleComponent } from "./GoTitleComponenet"
import { GoTopComponent } from "./GoTopComponent"
import { ResponseResultI, UserSocket } from "./UserSocket"

export function otherColor(color?: string): string | null | undefined {
    return color ? (color === 'w' ? 'b' : (color === 'b' ? 'w' : null)) : undefined
}

export interface GoEndI {
    blackPoints: number,
    whitePoints: number,
    givenUpUser?: string
}

export interface ServerGoGameStateI {
    boardError?: string,
    pieces?: string[][],
    viewers?: string[],
    blackPlayer?: string | null,
    blackPiecesCaught?: number,
    whitePiecesCaught?: number,
    whitePlayer?: string | null,
    passingRoles?: string[],
    givingUpRoles?: string[],
    turn?: string | null,
    gameName?: string,
    goEnd?: GoEndI | null,
    myRole?: string | null
    myName?: string,
    boardSize?: number,
    boardIntersectionPoints?: { x:number, y:number }[],
    advance?: number,
    guiMode?: 'join-mode' | 'game-mode',
    joinError?: string,
    gameDoesNotExistError?: string,
    futureRole?: string,
    connected?: boolean
}

export interface GoGameStateI extends ServerGoGameStateI {
    volumeOn: boolean
}

const testDataset: ServerGoGameStateI = {
    boardError: undefined,
    pieces:
        [
          ['b','w',' ', 'b', ' '],
          [' ','w',' ', 'b', ' '],
          [' ',' ','w', 'b', ' '],
          ['w','w','b', 'b', ' '],
          ['b','w',' ', 'b', ' ']
        ]
    ,
    viewers: ['Mama', 'Papa', 'Franzi'],
    blackPlayer: 'Maxi',
    blackPiecesCaught: 3,
    whitePlayer: 'Felix',
    passingRoles: [],
    givingUpRoles: [],
    turn: 'w',
    gameName: '#go-game',
    goEnd: null,
    myRole: 'w',
    myName: 'Felix',
    boardSize: 5,
    advance: 4.5
}

function def<T>(def: T, v?: T | null): T {
    return v !== undefined && v !== null ? v : def
}

export class GoGame extends React.Component<{}, GoGameStateI> {
    static instance: GoGame

    constructor(props: any) {
        super(props)
        this.state = {
            ...testDataset,
            volumeOn: false,
            guiMode: 'join-mode'
        }
    }

    componentDidMount(): void {
        GoGame.instance = this
        // get interested into  game...
        new UserSocket()
        UserSocket.instance.connect(() => {
            UserSocket.instance.interestIntoUrlGame()
        })
    }

    updateGameState(state: ServerGoGameStateI) {
        this.setState({
            ...this.state,
            ...state
        })
    }

    render() {
        const amIPlayer = this.state.myRole === 'b' || 'w'
        const isItMyTurn = amIPlayer ? this.state.turn === this.state.myRole : false

        const otherPlayerWantsToPass = amIPlayer ? this.state.passingRoles?.indexOf(otherColor(this.state.myRole!)!) === 0 : false
        const otherPlayerWantsToGiveUp = amIPlayer ? this.state.passingRoles?.indexOf(otherColor(this.state.myRole!)!) === 0 : false

        return this.state.guiMode !== 'game-mode' ? 
            (
                this.state.gameDoesNotExistError ? 
                    <div className="alert alert-danger" role="alert">
                        <h4 className="alert-heading">Oh no!</h4>
                        <p>It seems as the game "{this.state.gameDoesNotExistError}" does not exist anymore. We're sorry!</p>
                    </div>
                    :
                    <JoinGame 
                        error={this.state.joinError} 
                        gameName={def('Loading...', this.state.gameName)}
                        futureRole={def(null, this.state.futureRole)}
                        wPlayer={def('Waiting...', this.state.whitePlayer)}
                        bPlayer={def('Waiting...', this.state.blackPlayer)}
                        onJoin={(name) => UserSocket.instance.joinGame('#go-game', name)}
                        loading={this.state.connected !== true}
                    /> 
            )
            
            : 
            
            <div className="d-flex flex-column px-5 pb-5 ms-auto me-auto w-100 mt-4" style={{ maxWidth:'750px' }}>
                <GoTitleComponent viewers={def([], this.state.viewers)} gameName={def('WAITING...', this.state.gameName)} />

                <GoTopComponent
                    bPlayer={def('Waiting...', this.state.blackPlayer)}
                    bLostPoints={def(0, this.state.blackPiecesCaught)}
                    wPlayer={def('Waiting...', this.state.whitePlayer)}
                    wLostPoints={def(0, this.state.whitePiecesCaught)}
                    passingRoles={def([], this.state.passingRoles)}
                    givingUpRoles={def([], this.state.givingUpRoles)}
                    turn={this.state.turn}
                    maxWidth="400px"
                    advance={this.state.advance}
                />

                <GoBoard 
                    board={ this.state.pieces ? {
                        pieces: this.state.pieces,
                        intersectionPoints: this.state.boardIntersectionPoints
                    } : undefined }
                    width={400}
                    height={400}
                    previewColor={ isItMyTurn ? this.state.myRole! : undefined }
                    onMoveClicked={
                        (gridX: number, gridY: number) => {
                            console.log('Move ' + gridX + '|' + gridY + ' clicked!')
                            UserSocket.instance.doMove(gridX, gridY)
                        }
                    }
                />

                <GoBottomComponent
                    onVolumeToggled={
                        (b) => this.setState({...this.state, volumeOn: b})
                    }
                    volumeOn={this.state.volumeOn}
                    maxWidth="400px"
                    errorMessage={this.state.boardError}
                    otherWantsToPass={otherPlayerWantsToPass}
                    otherWantsToGiveup={otherPlayerWantsToGiveUp}
                />
            </div>
    }
}