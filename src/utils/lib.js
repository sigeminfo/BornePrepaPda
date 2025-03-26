export function getUrlParameter(paramName) {
    const hash = window.location.hash;
    const searchParams = new URLSearchParams(hash.split('?')[1]);
    return searchParams.get(paramName);
}