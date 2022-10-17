import { Button, Collapse, Stack } from "react-bootstrap"
import { getIcon } from "../Icons"

export interface GoBottomComponentPropsI {
    volumeOn: boolean,
    onVolumeToggled: (b: boolean) => void,
    maxWidth: string,
    errorMessage?: string,
    otherWantsToPass?: boolean,
    otherWantsToGiveup?: boolean
}

function SoundButton(props: { on: boolean, onVolumeToggled: (b: boolean) => void }) {
    return <Button variant={props.on ? 'secondary' : 'outline-secondary'} onClick={() => props.onVolumeToggled(!props.on)}>
        { props.on ? getIcon('sound-mute-button', 22) : getIcon('sound-volume-button', 22) }
    </Button>
}

function GoAlert(props: { text: string, variant: string, onButtonPressed?: () => void, button?: string }) {
    return <div className={'d-flex mb-2 px-3 py-2 w-100 align-items-center justify-content-between rounded-3 ' + 'bg-' + props.variant + ' bg-gradient'}>
        <div className="flex-grow-1 pe-2 text-start text-light">{props.text}</div>
        { props.button ? <Button variant="light" className="flex-grow-0 ms-auto" onClick={props.onButtonPressed}>{props.button}</Button> : undefined}
    </div>
}

export function GoBottomComponent(props: GoBottomComponentPropsI) {
    return <div className="ms-auto me-auto d-flex flex-column mt-4 " style={{ maxWidth: props.maxWidth }}>
        <Collapse className={props.errorMessage !== undefined ? '' : 'd-none'}>
            <GoAlert 
                text={props.errorMessage ? props.errorMessage : ''} 
                variant="danger"
            />
        </Collapse>
        <Collapse className={props.otherWantsToGiveup === true ? '' : 'd-none'}>
            <GoAlert 
                text={"The other one wants to give up. Do you agree?"} 
                variant="danger"
                button="Agree"
                onButtonPressed={() => console.log('agree pressed!')}
            />
        </Collapse>
        <Collapse className={props.otherWantsToPass === true ? '' : 'd-none'}>
            <GoAlert 
                text={"The other one wants to pass. Do you agree?"} 
                variant="primary"
                button="Agree"
                onButtonPressed={() => console.log('agree pressed 2!')}
            />
        </Collapse>
        <div className="d-flex mt-2 align-items-start">
            <SoundButton on={props.volumeOn} onVolumeToggled={props.onVolumeToggled} />
            <Button variant="outline-danger" className="flex-grow-0 ms-auto me-2">Giveup</Button>
            <Button variant="primary">Pass</Button>
        </div>
    </div>
}