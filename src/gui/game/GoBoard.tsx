import React, { KeyboardEvent } from "react"

export type PreviewItemT = {gridX: number, gridY: number} | undefined

export interface GoBoardPropsI {
    pieces: string[][]
    intersectionPoints?: { x:number, y:number }[]
}

const GoBoardStyleConsts = {
    padding: 50,
    backgroundColor: '#B07C4F',
    gridStrokeWidth: 2,
    gridColor: 'black',
    gridIntersectionPointRadius: 5,
    relativePieceRadiusCalibre: 0.85,
    borderRadius: 30,
    boxShaddow: '10px 10px 30px grey',
    normalCanvasWidth: 400
}

function paintGoBoard(gc: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number, board?: GoBoardPropsI, playerColor?: string, previewItem?: PreviewItemT) {
    // Painting the grid...

    const padding = GoBoardStyleConsts.padding * (canvasWidth / GoBoardStyleConsts.normalCanvasWidth)

    gc.fillStyle = GoBoardStyleConsts.backgroundColor
    gc.fillRect(0,0,canvasWidth,canvasHeight)

    if (board) {
        gc.save()
        gc.translate(padding, padding)

        gc.lineWidth = GoBoardStyleConsts.gridStrokeWidth
        gc.strokeStyle = GoBoardStyleConsts.gridColor

        gc.beginPath()

        const boardWidth = canvasWidth - padding*2
        const boardHeight = canvasHeight - padding*2

        gc.moveTo(0,0)
        gc.lineTo(boardWidth,0)
        gc.lineTo(boardWidth,boardHeight)
        gc.lineTo(0,boardHeight)

        const rowNumber = board.pieces.length
        const columnNumber = board.pieces[0].length
        
        const cellWidth = (boardWidth) / (columnNumber-1)
        const cellHeight = (boardHeight) / (rowNumber-1)

        for (let column = 0; column < columnNumber-1; column ++) { 
            gc.moveTo(column * cellWidth, 0)
            gc.lineTo(column * cellWidth, boardHeight) 
        }
        for (let row = 0; row < rowNumber-1; row ++) {
            gc.moveTo(0, row * cellHeight)
            gc.lineTo(boardWidth, row * cellHeight)
        }
        
        gc.stroke()

        // Painting the points of intersection

        gc.beginPath()
        board.intersectionPoints?.forEach(point => {
            gc.arc(point.x * cellWidth, point.y * cellHeight, GoBoardStyleConsts.gridIntersectionPointRadius, 0, 2*Math.PI)
        })
        gc.fill()

        // Painting the Pieces

        for (let y = 0; y < rowNumber; y ++) {
            for (let x = 0; x < columnNumber; x ++) {
                const piece = board.pieces[y][x]
                if (piece !== ' ') {
                    gc.fillStyle = piece === 'b' ? 'black' : 'white'
                    gc.beginPath()
                    gc.arc(x * cellWidth, y * cellHeight, GoBoardStyleConsts.relativePieceRadiusCalibre * cellWidth / 2, 0, Math.PI*2)
                    gc.fill()
                }
                else if (previewItem && playerColor && previewItem.gridX === x && previewItem.gridY === y) {
                    gc.fillStyle = playerColor === 'b' ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.5)'
                    gc.beginPath()
                    gc.arc(x * cellWidth, y * cellHeight, GoBoardStyleConsts.relativePieceRadiusCalibre * cellWidth / 2, 0, Math.PI*2)
                    gc.fill()
                }
            }
        }

        gc.restore()
    }
    else {
        gc.textAlign = 'center'
        gc.textBaseline = 'middle'
        gc.font = '30px monospace'
        gc.lineWidth = 2
        gc.fillStyle = 'black'
        gc.fillText('Go Board loading...', canvasWidth/2, canvasHeight/2)
    }
}

function getMouseGridPosition(mouseX: number, mouseY: number, board: GoBoardPropsI, canvasWidth: number, canvasHeight: number): PreviewItemT {
    const padding = GoBoardStyleConsts.padding * (canvasWidth / GoBoardStyleConsts.normalCanvasWidth)

    const scaledXPos = (mouseX - padding) / (canvasWidth  - padding*2) * (board.pieces[0].length - 1)
    const scaledYPos = (mouseY - padding) / (canvasHeight - padding*2) * (board.pieces.length - 1)

    return {
        gridX: Math.round(scaledXPos),
        gridY: Math.round(scaledYPos),
    }
}

export interface GoGUIBoardPropsI {
    board?: GoBoardPropsI, 
    width: number, 
    height: number,
    previewColor?: string,
    onMoveClicked: (gridX: number, gridY: number) => void
}

export interface GoGUIBoardStateI {
    previewState?: PreviewItemT,
    canvasSize: number
}

export class GoBoard extends React.Component<GoGUIBoardPropsI, GoGUIBoardStateI> {
    canvasRef: HTMLCanvasElement | null = null

    constructor(props: any) {
        super(props)
        this.state = {
            previewState: undefined,
            canvasSize: 0
        }
    }

    componentDidMount() {
        const resize = () => {
            const canvasParent = this.canvasRef!.parentElement!
            const maxHeight = window.innerHeight - 100
            const size = canvasParent.clientWidth > maxHeight ? maxHeight : canvasParent.clientWidth
            this.setState({
                ...this.state,
                canvasSize: size
            })
        }

        resize()
        window.addEventListener('resize', resize)

        const updateMousePreview = (ev: MouseEvent) => {
            if (this.props.board) {
                const mouseX = ev.clientX - this.canvasRef!.getBoundingClientRect().left
                const mouseY = ev.clientY - this.canvasRef!.getBoundingClientRect().top

                const mouseGridPosition = getMouseGridPosition(
                    mouseX, 
                    mouseY, 
                    this.props.board,
                    this.canvasRef!.width, 
                    this.canvasRef!.height
                )

                if (JSON.stringify(mouseGridPosition) !== JSON.stringify(this.state.previewState)) {
                    this.setState({
                        ...this.state,
                        previewState: mouseGridPosition
                    })
                }
            }
        }

        this.canvasRef!.onmousemove = updateMousePreview
        this.canvasRef!.onmouseenter = updateMousePreview
        this.canvasRef!.onmouseleave = () => { this.setState({...this.state, previewState: undefined}) }

        this.canvasRef!.onmouseup = () => { 
            if (this.props.previewColor && this.state.previewState) {
                this.props.onMoveClicked(this.state.previewState.gridX, this.state.previewState.gridY)
            }
            console.log(this.props.previewColor)
        }
    }

    componentDidUpdate() {
        if (this.canvasRef) {
            const gc = this.canvasRef.getContext('2d')
            if (gc) paintGoBoard(
                gc,
                this.canvasRef.width, 
                this.canvasRef.height,
                this.props.board,
                this.props.previewColor ? this.props.previewColor : undefined,
                this.props.previewColor ? this.state.previewState : undefined
            )
        }
    }

    render() {
        return <div className="w-100 d-flex justify-content-center align-items-center">
            <canvas
                style={{
                    borderRadius: GoBoardStyleConsts.borderRadius * (this.state.canvasSize / GoBoardStyleConsts.normalCanvasWidth) + 'px',
                    boxShadow: GoBoardStyleConsts.boxShaddow
                }}
                    ref={(element) => this.canvasRef = element}
                    width={this.state.canvasSize}
                    height={this.state.canvasSize}
                />
        </div>
    }    
}