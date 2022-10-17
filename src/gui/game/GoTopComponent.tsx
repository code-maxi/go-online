import { Stack } from "react-bootstrap"

export interface GoTopComponentPropsI {
    bPlayer: string,
    wPlayer: string,
    bLostPoints: number,
    wLostPoints: number,
    passingRoles: string[],
    givingUpRoles: string[],
    turn?: string | null,
    maxWidth: string,
    advance?: number
}

function LostPieces(props: {
    color: string,
    lostNumber: number,
    addClasses?: string,
    advance?: number
}) {
    return <div className={"d-flex align-items-center " + (props.addClasses ? props.addClasses : '')}>
        <span className="fs-5 fw-bold me-2">{props.advance ? '+' + props.advance : '' } - {props.lostNumber}</span>
        <span className="fs-4">{props.color === 'w' ? '○' : '●'}</span>
    </div>
}

function PassActionBadge(props: { type?: 'pass' | 'giveup' | 'accept-giveup' }) {
    return props.type ? <span className={"bg-" + (props.type === 'pass' ? 'primary' : 'danger') + " px-2 py-1 fs-6 rounded text-light"}>
        { props.type === 'pass' ? 'PASSED' : (props.type === 'giveup' ? 'GIVEUP' : 'ACCEPTED') }
    </span> : <></>
}

function UserItem(props: {
    name: string,
    color: string,
    turn: boolean,
}) {
    return <div className="d-flex flex-column align-items-center ">
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
    return <div className="d-flex w-100 flex-row justify-content-between align-items-center mb-3 mt-3 ms-auto me-auto">
        <LostPieces color="b" lostNumber={props.bLostPoints} />
        <Stack direction="horizontal" gap={2}>
            <PassActionBadge type={
                props.passingRoles.includes('b') ? 'pass' 
                    : (props.givingUpRoles.indexOf('b') === 0 ? 'giveup' 
                        : (props.givingUpRoles.indexOf('b') === 1 ? 'accept-giveup' 
                            : undefined))
                } 
            />
            <UserItem name={props.bPlayer} color="b" turn={props.turn === 'b'} />
            <span className="fs-5">VS.</span>
            <UserItem name={props.wPlayer} color="w" turn={props.turn === 'w'} />
            <PassActionBadge type={
                props.passingRoles.includes('w') ? 'pass' 
                    : (props.givingUpRoles.indexOf('w') === 0 ? 'giveup' 
                        : (props.givingUpRoles.indexOf('w') === 1 ? 'accept-giveup' 
                            : undefined))
                } 
            />
        </Stack>
        <LostPieces color="w" lostNumber={props.wLostPoints} advance={props.advance} />
    </div>
}