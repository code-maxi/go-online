import { Toast } from "react-bootstrap"

export interface GoToastI {
    from: string,
    text: string,
    autoHide?: number
}

export interface GoToastStackPropsI {
    toasts: GoToastI[],
    onCloseToast: (toast: GoToastI) => void
}

export function GoToastStack(props: GoToastStackPropsI) {
    return <div className="d-flex flex-column pe-5 pb-5" style={{ zIndex: 10, position: 'fixed', bottom: 0, right: 0 }}>
        {
            props.toasts.map((toast, i) => 
                <Toast 
                    key={i} 
                    className="mt-3" 
                    onClose={() => props.onCloseToast(toast)} 
                    delay={toast.autoHide} 
                    autohide={toast.autoHide !== undefined} 
                    animation={false}
                >
                    <Toast.Header>
                        <strong className="me-auto">{toast.from}</strong>
                    </Toast.Header>
                    <Toast.Body>{toast.text}</Toast.Body>
                </Toast>
            )
        }
    </div>
}