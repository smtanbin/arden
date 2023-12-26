import React from 'react';
import { Button } from 'react-bootstrap';
import styled from 'styled-components';




interface IconButtonProps {
    onClick?: () => void;
}

const StyledIconButton = styled(Button)`
  background-color: transparent;
  border: none;
  cursor: pointer;
`;

const IconButton: React.FC<IconButtonProps> = ({ onClick }) => {
    return (
        <StyledIconButton onClick={onClick}>
            <YourIconComponent size={24} />
        </StyledIconButton>
    );
};

export default IconButton;
