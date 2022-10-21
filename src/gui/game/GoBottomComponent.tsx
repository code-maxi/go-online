import { Button, Collapse } from "react-bootstrap"
import { getIcon } from "../Icons"

export interface GoBottomComponentPropsI {
    volumeOn: boolean,
    onVolumeToggled: (b: boolean) => void,
    maxWidth: string,
    errorMessage?: string,
    otherWantsToPass?: boolean,
    otherWantsToGiveup?: boolean,
    giveUpText: string,
    onPass: () => void,
    onGiveUp: () => void,
    disableButtons: boolean,
    buttonsVisible: boolean,
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

function InvitePerson(props: {onInvite: () => void}) {
    return <Button variant="success" onClick={props.onInvite}>
        { getIcon('invite-person', 22) }
        Invite Person
    </Button>
}

export function GoBottomComponent(props: GoBottomComponentPropsI) {
    return <div className="d-flex w-100 flex-column align-items-center mt-4 " style={{ maxWidth: props.maxWidth }}>
        <div className={props.otherWantsToGiveup === true ? undefined : 'd-none'}>
            <GoAlert 
                text={"The other one wants to give up. Do you agree?"} 
                variant="danger"
            />
        </div>
        <div className={props.otherWantsToPass === true ? undefined : 'd-none'}>
            <GoAlert 
                text={"The other one wants to pass. Do you agree?"} 
                variant="primary"
            />
        </div>
        <div className="d-flex mt-2">
            <SoundButton on={props.volumeOn} onVolumeToggled={props.onVolumeToggled} />
            <Button className={(props.buttonsVisible ? '' : 'd-none') + "flex-grow-0 ms-auto me-2"} disabled={props.disableButtons} variant="outline-danger" onClick={props.onGiveUp}>{props.giveUpText}</Button>
            <Button className={props.buttonsVisible ? '' : 'd-none'} disabled={props.disableButtons} variant="primary" onClick={props.onPass}>Pass</Button>
        </div>
    </div>
}