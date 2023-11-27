import React, { useState } from 'react';
import ErrorPage from '../Pages/errorPage';



// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ErrorBoundary: React.FC<any> = ({ children }) => {
    const [hasError, setHasError] = useState(false);
    const [errorMassage, setErrorMassage] = useState<Error>();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const handleErrors = (error: Error) => {
        // Update state so the next render will show the fallback UI.
        setHasError(true);
        setErrorMassage(error)
        // You can also log the error to an error reporting service
        console.error(error);
    };

    return hasError ? (
        <ErrorPage errorMessage={errorMassage} />
    ) : (
        <React.Fragment>{children}</React.Fragment>
    );
};

export default ErrorBoundary;