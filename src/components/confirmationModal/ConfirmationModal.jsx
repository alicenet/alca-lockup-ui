import React from "react";
import { Modal, Button } from "semantic-ui-react";

export function ConfirmationModal({ 
    children, 
    title = "",
    actionLabel = "confirm",
    onAccept,
    ...props 
}) {
    return (
        <Modal
            {...props}
        >
            <Modal.Header>{title}</Modal.Header>

            <Modal.Content image>
                <Modal.Description>{children}</Modal.Description>
            </Modal.Content>

            <Modal.Actions>
                <Button onClick={props.onClose}>Cancel</Button>
                
                <Button
                    content={actionLabel}
                    color='black'
                    onClick={onAccept}
                />
            </Modal.Actions>
        </Modal>
    );
}
  