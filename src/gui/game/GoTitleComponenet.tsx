export interface GoTitleComponentPropsI {
    gameName: string,
    viewers: string[]
}

export function GoTitleComponent(props: GoTitleComponentPropsI) {
    return <div className="d-flex flex-column mt-3 mb-2">
        <span className="font-monospace fs-2 fw-bold mb-1">{props.gameName}</span>
        <div className="flex-grow-1 px-2 fs-6 text-secondary"><b>{ props.viewers.length > 0 ? 'Viewers (' + props.viewers.length + ') ': '' }</b>{ props.viewers.length > 0 ? props.viewers.join(', ') : 'There aren\'t any users yet.' }</div>
    </div>
}