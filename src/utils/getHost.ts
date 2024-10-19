export const getHost = () => {
    return process.env.NEXT_PUBLIC_API_HOST || 'http://localhost:3000';
}