import React from "react";
import { Alert, Button, Form, InputGroup, Spinner, Stack } from "react-bootstrap";

function checkIfNameIsValid(name: string, currentUsers: string[]): string | undefined {
    if (currentUsers.includes(name)) return "The name '"+name+"' does already exist."
    else if (name.matchAll(/[ab]{3,7}/)) return "The name '"+name+"' must only contain letters, numbers and '-'."
    else return undefined
}

export interface JoinGameStateI {
    onJoin: (name: string) => void,
    error?: string,
    gameName: string,
    futureRole: string | null,
    bPlayer: string | null,
    wPlayer: string | null,
    loading?: boolean
}

function JoinGameBody(props: JoinGameStateI) {
    const [name, setName] = React.useState('')

    React.useEffect(() => {
        document.getElementById('go-join-text-field')?.focus()
    }, [])

    return <div className="d-flex flex-column align-items-center">
        <h3 className="font-monospace mb-3">#{props.gameName}</h3>

        <Form.Label className="mb-3">
            Join {!props.bPlayer && !props.wPlayer ? 'empty' : ''} Game <b>{props.gameName+' '}</b> 
            as <b>{props.futureRole ? (props.futureRole === 'b' ? 'black player' : 'white player') : 'a viewer'}</b>
            {props.futureRole && (props.wPlayer || props.bPlayer) ? <> and play against <b>{(props.futureRole === 'b' ? props.wPlayer : props.bPlayer)}</b></> : ''}.
        </Form.Label>

        <InputGroup hasValidation>
            <Form.Control
                type="text"
                placeholder="Type your name here..."
                value={name}
                isInvalid={props.error !== undefined}
                onChange={evt => setName(evt.currentTarget.value)}
                onKeyDown={evt => {if (evt.code === 'Enter') props.onJoin(name)} }
                id="go-join-text-field"
            />
            
            <Button 
                variant={ props.futureRole ? (props.futureRole === 'w' ? 'outline-dark' : 'dark') : 'secondary' } 
                onClick={() => props.onJoin(name)}
            >
                Join as {props.futureRole ? (props.futureRole === 'b' ? 'black' : 'white') : 'viewer'}!
            </Button>

            <Form.Control.Feedback type="invalid" className={props.error ? '' : 'd-none'}>
                {props.error}
            </Form.Control.Feedback>
        </InputGroup>
    </div>
    
}

function JoinGameSpinner(props: {errorText?: string}) {
    return props.errorText ? <Alert variant="danger">{props.errorText}</Alert> : <span className="d-flex justify-content-center">
        <Spinner animation="border" role="status" className="me-3" />
        <h4>Loading...</h4>
    </span>
}

export function JoinGame(
    props: JoinGameStateI
) {
    return <GoGameBackground>
        <div className="d-block ms-auto me-auto mt-5 p-4 bg-light rounded" style={{ maxWidth: '370px', boxShadow: '0 0 70px rgba(0,0,0,0.7)' }}>
            {
                props.loading === true ? <JoinGameSpinner errorText={props.error} /> : <JoinGameBody {...props} />
            }
        </div>
    </GoGameBackground>
}

export function GameDoesNotExistError(props: { gameName: string }) {
    return <GoGameBackground>
        <div className="w-100 d-block mt-5 ms-auto me-auto" style={{ maxWidth: '300px' }}>
            <Alert variant="danger" style={{ boxShadow: '0 0 70px rgba(0,0,0,0.7)' }}>
                <h4 className="alert-heading">Oh no – we can't see anything!</h4>
                <p>It seems as the game "{props.gameName}" does not exist anymore. We're sorry!</p>
            </Alert>
        </div>
    </GoGameBackground>
}

export function GoGameBackground(props: React.PropsWithChildren<{}>) {
    return <div className="d-flex justify-content-center align-items-center w-100" style={{
        height: '100vh',
        backgroundImage: 'url(/images/go_background.jpg)',
        backgroundSize: 'cover'
    }}>
        {props.children}
    </div>
}

/*
<Spinner animation="border" role="status">
      <span className="visually-hidden">Loading...</span>
    </Spinner>
*/