import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useAuth } from '../apps/useAuth';
import { useNavigate } from 'react-router-dom';


interface LogoutProps {
    visible: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

const LogoutModal: React.FC<LogoutProps> = ({ visible, onConfirm, onCancel }) => {
    const [confirmLoading, setConfirmLoading] = useState(false);
    const auth = useAuth();
    const navigate = useNavigate();


    const handleConfirm = () => {
        setConfirmLoading(true);
        logout();
    };

    const logout = async () => {
        const headers: Record<string, string> = {
            "Content-Type": "application/json",
        };

        const data: { username: string; refreshToken: string } = {
            username: auth.username || '', // Assuming you have a valid username in your auth context
            refreshToken: auth.token?.refreshToken || '',
        };

        try {
            const response = await fetch("http://192.168.0.133:4000/api/v1/oauth/logout", {
                method: "POST",
                headers,
                body: JSON.stringify(data),
            });

            if (response.ok) {
                auth.logout(); // Assuming you have a logout method in your useAuth hook
                onConfirm(); // Close the modal after successful logout
                navigate("/login", { replace: true });
            } else {
                console.error("Logout failed:", response.status, response.statusText);
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.error("Logout failed:", error.message);
        } finally {
            setConfirmLoading(false);
        }
    };

    return (
        <Modal show={visible} onHide={onCancel}>
            <Modal.Header closeButton>
                <Modal.Title>Logout Confirmation</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>
                    Are you sure you want to log out? All your unsaved data will be lost.
                </p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onCancel}>
                    Cancel
                </Button>
                <Button variant="primary" disabled={confirmLoading} onClick={handleConfirm}>
                    {confirmLoading ? 'Logging out...' : 'Logout'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default LogoutModal;
