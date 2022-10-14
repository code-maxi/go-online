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
    relativePieceRadiusCalibre: 0.8,
    borderRadius: '30px',
    boxShaddow: '10px 10px 30px grey'
}

function paintGoBoard(gc: CanvasRenderingContext2D, board: GoBoardPropsI, canvasWidth: number, canvasHeight: number, playerColor: string, previewItem: PreviewItemT) {
    // Painting the grid...

    gc.fillStyle = GoBoardStyleConsts.backgroundColor
    gc.fillRect(0,0,canvasWidth,canvasHeight)
    
    gc.save()
    gc.translate(GoBoardStyleConsts.padding, GoBoardStyleConsts.padding)

    gc.lineWidth = GoBoardStyleConsts.gridStrokeWidth
    gc.strokeStyle = GoBoardStyleConsts.gridColor

    gc.beginPath()

    const boardWidth = canvasWidth - GoBoardStyleConsts.padding*2
    const boardHeight = canvasHeight - GoBoardStyleConsts.padding*2

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
            else if (previewItem && previewItem.gridX === x && previewItem.gridY === y) {
                gc.fillStyle = playerColor === 'b' ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.5)'
                gc.beginPath()
                gc.arc(x * cellWidth, y * cellHeight, GoBoardStyleConsts.relativePieceRadiusCalibre * cellWidth / 2, 0, Math.PI*2)
                gc.fill()
            }
        }
    }

    gc.restore()
}

function getMouseGridPosition(mouseX: number, mouseY: number, board: GoBoardPropsI, canvasWidth: number, canvasHeight: number): PreviewItemT {
    const scaledXPos = (mouseX - GoBoardStyleConsts.padding) / (canvasWidth  - GoBoardStyleConsts.padding*2) * (board.pieces[0].length - 1)
    const scaledYPos = (mouseY - GoBoardStyleConsts.padding) / (canvasHeight - GoBoardStyleConsts.padding*2) * (board.pieces.length - 1)

    return {
        gridX: Math.round(scaledXPos),
        gridY: Math.round(scaledYPos),
    }
}

export function GoBoard(
    props: {
        board: GoBoardPropsI, 
        width: number, 
        height: number, 
        playerColor: string
    }
) {
    const refCanvas = React.useRef<HTMLCanvasElement>(null)
    const [previewState, setPreviewState] = React.useState<PreviewItemT>(undefined)
    
    React.useEffect(() => {
        if (refCanvas.current) {
            const gc = refCanvas.current.getContext('2d')
            if (gc) paintGoBoard(gc, props.board, refCanvas.current.width, refCanvas.current.height, props.playerColor, previewState)
        }
    })

    React.useEffect(() => {
        const updateMousePreview = (ev: MouseEvent) => {
            const mouseX = ev.clientX - refCanvas.current!.getBoundingClientRect().left
            const mouseY = ev.clientY - refCanvas.current!.getBoundingClientRect().top

            const mouseGridPosition = getMouseGridPosition(
                mouseX, 
                mouseY, 
                props.board, 
                refCanvas.current!.width, 
                refCanvas.current!.height
            )

            console.log(mouseGridPosition)

            if (JSON.stringify(mouseGridPosition) !== JSON.stringify(previewState)) {
                setPreviewState(mouseGridPosition)
            }
        }

        refCanvas.current!.addEventListener('mousemove', updateMousePreview)
        refCanvas.current!.addEventListener('mouseenter', updateMousePreview)

        refCanvas.current!.addEventListener('mouseleave', (ev) => {
            setPreviewState(undefined)
        })
    }, [])

    return <canvas
        style={{
            borderRadius: GoBoardStyleConsts.borderRadius,
            boxShadow: GoBoardStyleConsts.boxShaddow
        }}
        ref={refCanvas}
        width={props.width}
        height={props.height}
    />
}