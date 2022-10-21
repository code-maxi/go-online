export interface GoTitleComponentPropsI {
    gameName: string,
    viewers: string[],
    myName?: string,
    myRole?: string | null
}

export function GoTitleComponent(props: GoTitleComponentPropsI) {
    return <div className="d-flex flex-column align-items-center mt-3 mb-2 w-100">
        <div className="d-flex mb-3 justify-content-around align-items-center w-100">
            <span className="pe-3 font-monospace fs-2 fw-bold mb-1">#{props.gameName}</span>
            <div className="ps-3 text-secondary fs-6 text-end">You (name: "<b>{props.myName}</b>") are logged<br />in as a <b>{props.myRole ? (props.myRole === 'b' ? 'black player' : 'white player') : 'viewer'}</b>.</div>
        </div>
        <div className="flex-grow-1 px-2 fs-6 text-dark"><b>{ props.viewers.length > 0 ? 'Viewers (' + props.viewers.length + ') ': '' }</b>{ props.viewers.length > 0 ? props.viewers.join(', ') : 'There aren\'t any users yet.' }</div>
    </div>
}
