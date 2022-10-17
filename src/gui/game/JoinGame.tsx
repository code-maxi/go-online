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
    return <div className="d-flex flex-column align-items-center">
        <h3 className="font-monospace mb-3">{props.gameName}</h3>
        <Form.Label className="mb-3">
            Join {!props.bPlayer && !props.wPlayer ? 'empty' : ''} Game <b>{props.gameName+' '}</b> 
            as <b>{props.futureRole ? (props.futureRole === 'b' ? 'black player' : 'white player') : 'a viewer'}</b>
            {props.futureRole ? <> and play against <b>{(props.futureRole === 'b' ? props.wPlayer : props.bPlayer)}</b></> : ''}.
        </Form.Label>

        <InputGroup hasValidation>
            <Form.Control
                type="text"
                placeholder="Type your name here..."
                value={''}
                isInvalid={props.error !== undefined}
                onChange={evt => setName(evt.currentTarget.value)}
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
    return <div className="d-block ms-auto me-auto mt-5" style={{ maxWidth: '340px' }}>
        {
            props.loading === true ? <JoinGameSpinner errorText={props.error} /> : <JoinGameBody {...props} />
        }
    </div>
}

/*
<Spinner animation="border" role="status">
      <span className="visually-hidden">Loading...</span>
    </Spinner>
*/