import { Stack } from "react-bootstrap"

export interface GoBottomComponentPropsI {
    bPlayer: string,
    wPlayer: string,
    bLostPoints: number,
    wLostPoints: number,
    turn: string
}
export function GoTopComponent(props: GoBottomComponentPropsI) {
    return <div className="d-flex flex-row justify-content-between align-items-center mb-3 mt-3 ms-auto me-auto" style={{ maxWidth:'400px' }}>
        
    </div>
}