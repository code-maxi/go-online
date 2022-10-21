import React from "react"
import { GameDoesNotExistError, JoinGame } from "./JoinGame"
import { GoBoard } from "./GoBoard"
import { GoBottomComponent } from "./GoBottomComponent"
import { GoTitleComponent } from "./GoTitleComponenet"
import { GoTopComponent } from "./GoTopComponent"
import { ResponseResultI, UserSocket } from "./UserSocket"
import { GoToastI, GoToastStack } from "./GoToasts"

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
    futureRole?: string
}

export interface GoGameStateI extends ServerGoGameStateI {
    volumeOn: boolean,
    toastMessages: GoToastI[]
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
            volumeOn: false,
            guiMode: 'join-mode',
            toastMessages: []
        }
    }

    componentDidMount(): void {
        GoGame.instance = this
        // get interested into  game...
        UserSocket.startUserSocket()
    }

    componentDidUpdate(): void {
        if (this.state.boardError) {
            setTimeout(() => {
                this.setState({
                    ...this.state,
                    boardError: undefined
                })
            }, 3000)
        }
    }

    updateGameState(state: ServerGoGameStateI) {
        this.setState({
            ...this.state,
            ...state
        })
    }

    displayToasts(toasts: GoToastI[]) {
        this.setState({
            ...this.state,
            toastMessages: [...this.state.toastMessages, ...toasts]
        })
    }

    render() {
        const amIPlayer = this.state.myRole === 'b' || this.state.myRole === 'w'
        const isItMyTurn = amIPlayer && this.state.blackPlayer && this.state.whitePlayer ? this.state.turn === this.state.myRole : false && this.state.blackPlayer && this.state.whitePlayer

        const otherPlayerWantsToPass = amIPlayer ? this.state.passingRoles?.indexOf(otherColor(this.state.myRole!)!) === 0 : false
        const otherPlayerWantsToGiveUp = amIPlayer ? this.state.givingUpRoles?.indexOf(otherColor(this.state.myRole!)!) === 0 : false

        return <React.Fragment>
            {
                this.state.guiMode !== 'game-mode' ? 
                (
                    this.state.gameDoesNotExistError ? 
                        <GameDoesNotExistError gameName={this.state.gameDoesNotExistError} />
                        :
                        <JoinGame 
                            error={this.state.joinError} 
                            gameName={def('Loading...', this.state.gameName)}
                            futureRole={def(null, this.state.futureRole)}
                            wPlayer={this.state.whitePlayer ? this.state.whitePlayer : null}
                            bPlayer={this.state.blackPlayer ? this.state.blackPlayer : null}
                            onJoin={(name) => UserSocket.instance.joinInterestedGame(name)}
                            loading={this.state.gameName === undefined}
                        /> 
                )
                
                : 
                
                <div className="d-flex flex-column px-5 pb-5 ms-auto me-auto w-100 mt-4 justify-content-center align-items-center" style={{ maxWidth:'750px' }}>
                    <GoTitleComponent 
                        viewers={def([], this.state.viewers)}
                        gameName={def('WAITING...', this.state.gameName)}
                        myName={this.state.myName}
                        myRole={this.state.myRole}
                    />
    
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
                        message={this.state.boardError ? this.state.boardError : (this.state.pieces ? (!this.state.blackPlayer || !this.state.whitePlayer ? "Waiting for opponent..." : undefined) : "Loading Go Board...")}
                        messageVariant={this.state.boardError ? 'danger' : undefined}
                    />
    
                    <GoBottomComponent
                        onVolumeToggled={
                            (b) => this.setState({...this.state, volumeOn: b})
                        }
                        volumeOn={this.state.volumeOn}
                        maxWidth="400px"
                        otherWantsToPass={otherPlayerWantsToPass}
                        otherWantsToGiveup={otherPlayerWantsToGiveUp}
                        giveUpText={this.state.givingUpRoles?.length === 0 || !this.state.givingUpRoles ? 'Give Up' : 'Accept Others Giveup'}
                        onPass={() => UserSocket.instance.passMove()}
                        onGiveUp={() => UserSocket.instance.giveupMove()}
                        disableButtons={!isItMyTurn}
                        buttonsVisible={amIPlayer}
                    />
                </div>
            }
            <GoToastStack toasts={this.state.toastMessages} onCloseToast={toast => {
                this.setState({
                    ...this.state,
                    toastMessages: this.state.toastMessages.filter(t => JSON.stringify(t) !== JSON.stringify(toast))
                })
            }} />
        </React.Fragment>
    }
}