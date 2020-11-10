
const fetch = require('node-fetch');

KEYCLOAK_URI = 'https://dev.oidc.gov.bc.ca/auth'
KEYCLOAK_CLIENT = 'cfms-dev-staff'

// {
//     "realm": "vtkayq4c",
//     "auth-server-url": "https://dev.oidc.gov.bc.ca/auth/",
//     "ssl-required": "external",
//     "resource": "cfms-dev-staff",
//     "public-client": true,
//     "confidential-port": 0
//   }


// This implementation assumes it never has to refresh a token and they never expire
// As most load testing is short lived (minutes, not hours) this works fine.
// Cache auth tokens to a plain old JavaScript object
const authTokenList = {}
async function getAuthToken(username, password){
    if (authTokenList[username]) return authTokenList[username];
    const newToken = await loginToKeycloak(username, password);
    authTokenList[username] = newToken;
    return newToken;
}

// Working
async function loginToKeycloak(username, password) {
    const res = await fetch(`${KEYCLOAK_URI}/realms/vtkayq4c/protocol/openid-connect/token`, {
        "headers": {
            "accept": "*/*",
            "accept-language": "en-US,en;q=0.9",
            "content-type": "application/x-www-form-urlencoded",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-site"
        },
        "body": `grant_type=password&username=${username}&password=${password}&client_id=${KEYCLOAK_CLIENT}`,
        "method": "POST",
        "mode": "cors",
        "credentials": "include"
    })
    const body = await res.json();
    return body;
}

async function setAuthHeader(requestParams, context, ee, next) {
    const {access_token} = await getAuthToken('admin', 'admin')
    // HTTP requests use Authorization
    requestParams.headers.Authorization = `Bearer ${access_token}`
    // Websocket requests use oidc-jwt cookie
    requestParams.headers.cookie = `oidc-jwt=${access_token}`
    next();
}

// Main / script start
(async () => {
    // Only execute if script is called directly, not if imported.
    if (require.main === module){
        // console.log('SHOULD NOT SEE THIS WHEN RUNNING TESTS');
        // console.log('SHOULD see this when running functions directly')
        const {access_token} = await loginToKeycloak('admin', 'admin');
        // console.log('\n\getAccessToken Result:\n\n', access_token)
        console.log( access_token)
        return access_token;
    }
})();

module.exports = {
    setAuthHeader
}


// Scrap - Old Fns, may be useful in future

async function getAccessTokenFromRefresh(refreshToken) {
    const res = await fetch(`${KEYCLOAK_URI}/realms/vtkayq4c/protocol/openid-connect/token`, {
        "headers": {
            "accept": "*/*",
            "accept-language": "en-US,en;q=0.9",
            "content-type": "application/x-www-form-urlencoded",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-site"
        },
        "body": "grant_type=refresh_token&refresh_token=eyJhbGciOiJIUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJlNGQwY2YzNS1jYTVkLTQxM2YtYjY2ZC01NzI3YmE2OTdlMmEifQ.eyJleHAiOjE2MDMxMzg5MTcsImlhdCI6MTYwMzEzNzExNywianRpIjoiZDNjMmVmZjktY2FjYy00YjE5LWE1MzEtNWM3ODBkYTIzMWFhIiwiaXNzIjoiaHR0cHM6Ly9kZXYub2lkYy5nb3YuYmMuY2EvYXV0aC9yZWFsbXMvdnRrYXlxNGMiLCJhdWQiOiJodHRwczovL2Rldi5vaWRjLmdvdi5iYy5jYS9hdXRoL3JlYWxtcy92dGtheXE0YyIsInN1YiI6IjhhZDY2YzAzLTA0NWQtNDFkZi04NjAxLWFiMmM2OGUyMTc3MyIsInR5cCI6IlJlZnJlc2giLCJhenAiOiJjZm1zLWRldi1zdGFmZiIsIm5vbmNlIjoiNjA4ODAxMTUtMDI0NC00NzZmLTg5N2MtNzQ4MjJhNjA4OTI0Iiwic2Vzc2lvbl9zdGF0ZSI6ImI5MjdhMDY2LTY4OGItNDlmMi1hNmFkLTJlM2U4YjgxYjQ5OCIsInNjb3BlIjoib3BlbmlkIHByb2ZpbGUgZW1haWwifQ.-VKmIZB_rDDk5IIZzEzINxj2jEaf8S4L7_JAo40ZjJI&client_id=cfms-dev-staff",
        "body": `grant_type=refresh_token&refresh_token=${refreshToken}&client_id=cfms-dev-staff`,
        "method": "POST",
        "mode": "cors",
        "credentials": "include"
    })
    const body = await res.json();
    // console.log('getAccessToken body', {res, body})
    return body
}