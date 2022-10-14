import { Stack } from "react-bootstrap"

export interface GoTopComponentPropsI {
    bPlayer: string,
    wPlayer: string,
    bLostPoints: number,
    wLostPoints: number,
    turn: string
}

function LostPieces(props: {
    color: string,
    lostNumber: number
}) {
    return <div className="d-flex align-items-center">
        <span className="fs-5 fw-bold me-2">- {props.lostNumber}</span>
        <span className="fs-4">{props.color === 'w' ? '○' : '●'}</span>
    </div>
}

function UserItem(props: {
    name: string,
    color: string,
    turn: boolean
}) {
    return <div className="d-flex flex-column align-items-center">
        <span className="fs-4 fw-bold" style={{
            padding: '3px 8px',
            border: '2px black solid',
            borderRadius: '10px',
            backgroundColor: props.color === 'w' ? 'white' : 'black',
            color: props.color === 'w' ? 'black' : 'white'
        }}>
            {props.name}
        </span>
        <div style={{
            width:'80%',
            height:'5px',
            marginTop: '5px',
            backgroundColor: props.turn ? 'blue' : 'rgba(0,0,0,0)',
            borderRadius: '5px'
        }} />
    </div>
}

export function GoTopComponent(props: GoTopComponentPropsI) {
    return <div className="d-flex flex-row justify-content-between align-items-center mb-3 mt-3 ms-auto me-auto" style={{ maxWidth:'400px' }}>
        <LostPieces color="b" lostNumber={props.bLostPoints} />
        <Stack direction="horizontal" gap={3}>
            <UserItem name={props.bPlayer} color="b" turn={props.turn === 'b'} />
            <span className="fs-5">VS.</span>
            <UserItem name={props.wPlayer} color="w" turn={props.turn === 'w'} />
        </Stack>
        <LostPieces color="w" lostNumber={props.wLostPoints} />
    </div>
}