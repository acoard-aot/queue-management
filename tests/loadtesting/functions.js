
const fetch = require('node-fetch');

QUEUE_URI = 'https://dev-theq.pathfinder.gov.bc.ca/';
KEYCLOAK_URI = 'https://dev.oidc.gov.bc.ca/auth'
// TODO - Get this from API call, make fn
// REFRESH_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJlNGQwY2YzNS1jYTVkLTQxM2YtYjY2ZC01NzI3YmE2OTdlMmEifQ.eyJleHAiOjE2MDMxMzg2MTYsImlhdCI6MTYwMzEzNjgxNiwianRpIjoiODQ3NjAzODktMTg5YS00YzU0LTgxNTYtOTM3ZjMwN2Y2ZWViIiwiaXNzIjoiaHR0cHM6Ly9kZXYub2lkYy5nb3YuYmMuY2EvYXV0aC9yZWFsbXMvdnRrYXlxNGMiLCJhdWQiOiJodHRwczovL2Rldi5vaWRjLmdvdi5iYy5jYS9hdXRoL3JlYWxtcy92dGtheXE0YyIsInN1YiI6IjhhZDY2YzAzLTA0NWQtNDFkZi04NjAxLWFiMmM2OGUyMTc3MyIsInR5cCI6IlJlZnJlc2giLCJhenAiOiJjZm1zLWRldi1zdGFmZiIsIm5vbmNlIjoiNjA4ODAxMTUtMDI0NC00NzZmLTg5N2MtNzQ4MjJhNjA4OTI0Iiwic2Vzc2lvbl9zdGF0ZSI6ImI5MjdhMDY2LTY4OGItNDlmMi1hNmFkLTJlM2U4YjgxYjQ5OCIsInNjb3BlIjoib3BlbmlkIHByb2ZpbGUgZW1haWwifQ.4HZ6FjGeXM97u-LOOyoMO-eP_hxhttw34yp-S69eRgQ'
// REFRESH_TOKEN='eyJhbGciOiJIUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJlNGQwY2YzNS1jYTVkLTQxM2YtYjY2ZC01NzI3YmE2OTdlMmEifQ.eyJleHAiOjE2MDMxNDAxMTcsImlhdCI6MTYwMzEzODMxNywianRpIjoiZDdjYWQzOGItZTY1ZS00Y2E3LTgyNTctY2MyNjhhNGMzMjJjIiwiaXNzIjoiaHR0cHM6Ly9kZXYub2lkYy5nb3YuYmMuY2EvYXV0aC9yZWFsbXMvdnRrYXlxNGMiLCJhdWQiOiJodHRwczovL2Rldi5vaWRjLmdvdi5iYy5jYS9hdXRoL3JlYWxtcy92dGtheXE0YyIsInN1YiI6IjhhZDY2YzAzLTA0NWQtNDFkZi04NjAxLWFiMmM2OGUyMTc3MyIsInR5cCI6IlJlZnJlc2giLCJhenAiOiJjZm1zLWRldi1zdGFmZiIsIm5vbmNlIjoiNjA4ODAxMTUtMDI0NC00NzZmLTg5N2MtNzQ4MjJhNjA4OTI0Iiwic2Vzc2lvbl9zdGF0ZSI6ImI5MjdhMDY2LTY4OGItNDlmMi1hNmFkLTJlM2U4YjgxYjQ5OCIsInNjb3BlIjoib3BlbmlkIHByb2ZpbGUgZW1haWwifQ._vyD7p7hxayPFzbwDaDs0CFtDb7BeqBGAdpnhzoQnEw'

KEYCLOAK_CLIENT = 'TODO'

// {
//     "realm": "vtkayq4c",
//     "auth-server-url": "https://dev.oidc.gov.bc.ca/auth/",
//     "ssl-required": "external",
//     "resource": "cfms-dev-staff",
//     "public-client": true,
//     "confidential-port": 0
//   }

async function getAccessToken(username, password) {
    const res = await fetch(`${KEYCLOAK_URI}/realms/vtkayq4c/protocol/openid-connect/token`, {
        "headers": {
            "accept": "*/*",
            "accept-language": "en-US,en;q=0.9",
            "content-type": "application/x-www-form-urlencoded",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-site"
        },
        "body": `grant_type=password&username=${username}&password=${password}&client_id=cfms-dev-staff`,
        // "body": `grant_type=password&username=admin&password=admin&client_id=cfms-dev-staff`,
        "method": "POST",
        "mode": "cors",
        "credentials": "include"
    })
    const body = await res.json();
    return body;
}

// Main / script start
(async () => {
    // const accessTokenFromRefresh = await getAccessTokenFromRefresh(REFRESH_TOKEN);
    // console.log('\n\getAccessTokenFromRefresh Result:', {accessToken: accessTokenFromRefresh})

    const accessToken = await getAccessToken('admin', 'admin');
    console.log('\n\getAccessToken Result:', {accessToken: accessToken})
})();




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