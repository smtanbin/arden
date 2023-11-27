

interface ErrorPageProps {
    errorMessage?: any; // Use 'any' if you want to allow any type for errorMessage
}

const ErrorPage: React.FC<ErrorPageProps> = ({ errorMessage }) => {
    return (
        <div id="error-page">
            <h1>Oops!</h1>
            <p>Sorry, an unexpected error has occurred.</p>
            <p>{errorMessage ? errorMessage.toString() : "Unknown Error"}</p>
        </div>
    );
}

export default ErrorPage;
