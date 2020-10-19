# Load testing

## Installation

```bash
# Make sure to be in `tests/loadtesting` folder
cd tests/loadtesting

npm install
```


## TODO / Notes

Idea... move this into frontend entirely? Have artillery as a `devDependency` of frontend/package.json?

AUTHENTICATION
    - Skip keycloak page, just set headers. "Bearer: $token"
    - Question: How get keycloak token? 
      - Will need to make HTTP/cURL requests, just need to find out which one
      - Might need Sumesh to create a bunch of testing CSR accounts?

```bash
# Appears to be working
# Not sure if only with admin:admin account though?
# NOTE: CHANGE CLIENT_ID to cfms-dev-staff TO GET PROPER!
# KEYCLOAK_URI=https://dev.oidc.gov.bc.ca/auth
# ACCESS_TOKEN=$(curl -s -X POST $KEYCLOAK_URI/realms/vtkayq4c/protocol/openid-connect/token \
#         -d grant_type=password \
#         -d client_id=admin-cli \
#         -d username=admin -d password=admin | jq -r '.access_token')
KEYCLOAK_URI=https://dev.oidc.gov.bc.ca/auth
ACCESS_TOKEN=$(curl -s -X POST $KEYCLOAK_URI/realms/vtkayq4c/protocol/openid-connect/token \
        -d grant_type=password \
        -d client_id=cfms-dev-staff \
        -d username=admin -d password=admin | jq -r '.access_token')


## not working - goal is to just test basic auth.
# do we need to set Authorization header? cookie? what?
# curl 'https://dev-theq.pathfinder.gov.bc.ca/api/v1/services/refresh/?office_id=3' \
curl 'https://dev-theq.pathfinder.gov.bc.ca/api/v1/csrs/me/' \
  -H 'Connection: keep-alive' \
  -H 'Accept: application/json' \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.80 Safari/537.36' \
  -H 'Sec-Fetch-Site: same-origin' \
  -H 'Sec-Fetch-Mode: cors' \
  -H 'Sec-Fetch-Dest: empty' \
  -H 'Referer: https://dev-theq.pathfinder.gov.bc.ca/queue' \
  -H 'Accept-Language: en-US,en;q=0.9' \
  --cookie "oidc-jwt=$ACCESS_TOKEN" \
  --compressed

# not working, another auth replacement attempt
# WORKING, BUT WHERE DOES IT GET TOKENS FROM?
# This looks like it's a refresh request, so needs a refresh token not at?
# curl "$KEYCLOAK_URI/realms/vtkayq4c/protocol/openid-connect/token" \
#   -H 'Connection: keep-alive' \
#   -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.80 Safari/537.36' \
#   -H 'Content-type: application/x-www-form-urlencoded' \
#   -H 'Accept: */*' \
#   -H 'Origin: https://dev-theq.pathfinder.gov.bc.ca' \
#   -H 'Sec-Fetch-Site: same-site' \
#   -H 'Sec-Fetch-Mode: cors' \
#   -H 'Sec-Fetch-Dest: empty' \
#   -H 'Referer: https://dev-theq.pathfinder.gov.bc.ca/' \
#   -H 'Accept-Language: en-US,en;q=0.9' \
#   -H 'Cookie: AUTH_SESSION_ID=b927a066-688b-49f2-a6ad-2e3e8b81b498.sso-dev-37-qqlcf; KEYCLOAK_IDENTITY=eyJhbGciOiJIUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJlNGQwY2YzNS1jYTVkLTQxM2YtYjY2ZC01NzI3YmE2OTdlMmEifQ.eyJleHAiOjE2MDMxNzEzMDYsImlhdCI6MTYwMzEzNTMwNiwianRpIjoiOTdhNTZkZmYtMjAxOS00Y2Q5LTg4NWYtOTAyMjAzMWRjZGJjIiwiaXNzIjoiaHR0cHM6Ly9kZXYub2lkYy5nb3YuYmMuY2EvYXV0aC9yZWFsbXMvdnRrYXlxNGMiLCJzdWIiOiI4YWQ2NmMwMy0wNDVkLTQxZGYtODYwMS1hYjJjNjhlMjE3NzMiLCJ0eXAiOiJTZXJpYWxpemVkLUlEIiwic2Vzc2lvbl9zdGF0ZSI6ImI5MjdhMDY2LTY4OGItNDlmMi1hNmFkLTJlM2U4YjgxYjQ5OCIsInN0YXRlX2NoZWNrZXIiOiJnb052N3NzbmJPdjYzUlRJa2syaDhWcGRqT2FOSWhCNzNKM1I5b0piOE84In0.pd1681SzEdG3_W-qxvE3qU-7HeldxKyPNCiuxVANa7s; KEYCLOAK_IDENTITY_LEGACY=eyJhbGciOiJIUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJlNGQwY2YzNS1jYTVkLTQxM2YtYjY2ZC01NzI3YmE2OTdlMmEifQ.eyJleHAiOjE2MDMxNzEzMDYsImlhdCI6MTYwMzEzNTMwNiwianRpIjoiOTdhNTZkZmYtMjAxOS00Y2Q5LTg4NWYtOTAyMjAzMWRjZGJjIiwiaXNzIjoiaHR0cHM6Ly9kZXYub2lkYy5nb3YuYmMuY2EvYXV0aC9yZWFsbXMvdnRrYXlxNGMiLCJzdWIiOiI4YWQ2NmMwMy0wNDVkLTQxZGYtODYwMS1hYjJjNjhlMjE3NzMiLCJ0eXAiOiJTZXJpYWxpemVkLUlEIiwic2Vzc2lvbl9zdGF0ZSI6ImI5MjdhMDY2LTY4OGItNDlmMi1hNmFkLTJlM2U4YjgxYjQ5OCIsInN0YXRlX2NoZWNrZXIiOiJnb052N3NzbmJPdjYzUlRJa2syaDhWcGRqT2FOSWhCNzNKM1I5b0piOE84In0.pd1681SzEdG3_W-qxvE3qU-7HeldxKyPNCiuxVANa7s; KEYCLOAK_SESSION=vtkayq4c/8ad66c03-045d-41df-8601-ab2c68e21773/b927a066-688b-49f2-a6ad-2e3e8b81b498; KEYCLOAK_SESSION_LEGACY=vtkayq4c/8ad66c03-045d-41df-8601-ab2c68e21773/b927a066-688b-49f2-a6ad-2e3e8b81b498; bfbea0cc864a2aa655e148dea6518a43=dc754f8eb6cf78949dcebba4c8213c4d; FAILREASON=0; SMSESSION=LOGGEDOFF' \
#   --data-raw 'grant_type=refresh_token&refresh_token=eyJhbGciOiJIUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJlNGQwY2YzNS1jYTVkLTQxM2YtYjY2ZC01NzI3YmE2OTdlMmEifQ.eyJleHAiOjE2MDMxMzc3MTYsImlhdCI6MTYwMzEzNTkxNiwianRpIjoiMWQzZTMzNjEtMTcxZC00NzFmLTg5ODUtMmQ1OGFmZjRjMDkzIiwiaXNzIjoiaHR0cHM6Ly9kZXYub2lkYy5nb3YuYmMuY2EvYXV0aC9yZWFsbXMvdnRrYXlxNGMiLCJhdWQiOiJodHRwczovL2Rldi5vaWRjLmdvdi5iYy5jYS9hdXRoL3JlYWxtcy92dGtheXE0YyIsInN1YiI6IjhhZDY2YzAzLTA0NWQtNDFkZi04NjAxLWFiMmM2OGUyMTc3MyIsInR5cCI6IlJlZnJlc2giLCJhenAiOiJjZm1zLWRldi1zdGFmZiIsIm5vbmNlIjoiNjA4ODAxMTUtMDI0NC00NzZmLTg5N2MtNzQ4MjJhNjA4OTI0Iiwic2Vzc2lvbl9zdGF0ZSI6ImI5MjdhMDY2LTY4OGItNDlmMi1hNmFkLTJlM2U4YjgxYjQ5OCIsInNjb3BlIjoib3BlbmlkIHByb2ZpbGUgZW1haWwifQ.dg9HR33w4qUWyYhxWMzDc2XgCmyqxWtW8CY5qj6_kuk&client_id=cfms-dev-staff' \
#   --compressed

# IS IT USING RIGHT TOKEN? MAYBE WRONG TGYPE
# todo - how get refresh token?
# Hardcoded refresh token for admin:admin user.  Will likely expire.
REFRESH_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJlNGQwY2YzNS1jYTVkLTQxM2YtYjY2ZC01NzI3YmE2OTdlMmEifQ.eyJleHAiOjE2MDMxMzg2MTYsImlhdCI6MTYwMzEzNjgxNiwianRpIjoiODQ3NjAzODktMTg5YS00YzU0LTgxNTYtOTM3ZjMwN2Y2ZWViIiwiaXNzIjoiaHR0cHM6Ly9kZXYub2lkYy5nb3YuYmMuY2EvYXV0aC9yZWFsbXMvdnRrYXlxNGMiLCJhdWQiOiJodHRwczovL2Rldi5vaWRjLmdvdi5iYy5jYS9hdXRoL3JlYWxtcy92dGtheXE0YyIsInN1YiI6IjhhZDY2YzAzLTA0NWQtNDFkZi04NjAxLWFiMmM2OGUyMTc3MyIsInR5cCI6IlJlZnJlc2giLCJhenAiOiJjZm1zLWRldi1zdGFmZiIsIm5vbmNlIjoiNjA4ODAxMTUtMDI0NC00NzZmLTg5N2MtNzQ4MjJhNjA4OTI0Iiwic2Vzc2lvbl9zdGF0ZSI6ImI5MjdhMDY2LTY4OGItNDlmMi1hNmFkLTJlM2U4YjgxYjQ5OCIsInNjb3BlIjoib3BlbmlkIHByb2ZpbGUgZW1haWwifQ.4HZ6FjGeXM97u-LOOyoMO-eP_hxhttw34yp-S69eRgQ"

curl "$KEYCLOAK_URI/realms/vtkayq4c/protocol/openid-connect/token" \
  -H 'Connection: keep-alive' \
  -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.80 Safari/537.36' \
  -H 'Content-type: application/x-www-form-urlencoded' \
  -H 'Accept: */*' \
  -H 'Origin: https://dev-theq.pathfinder.gov.bc.ca' \
  -H 'Sec-Fetch-Site: same-site' \
  -H 'Sec-Fetch-Mode: cors' \
  -H 'Sec-Fetch-Dest: empty' \
  -H 'Referer: https://dev-theq.pathfinder.gov.bc.ca/' \
  -H 'Accept-Language: en-US,en;q=0.9' \
  --data-raw "grant_type=refresh_token&refresh_token=${REFRESH_TOKEN}&client_id=cfms-dev-staff" \
  --compressed

```


## Scratch


Keycloak cURL
https://github.com/dcm4che/dcm4chee-arc-light/wiki/Getting-OIDC-Access-Token-using-curl

Somewhat working - make sure to be on correct domain (even if not logged in) for CORS:

fetch("https://dev-theq.pathfinder.gov.bc.ca/api/v1/csrs/me/", {
  "headers": {
    "accept": "application/json",
    "accept-language": "en-US,en;q=0.9",
    "authorization": "Bearer eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJZUktnVzA0QmJ4QUxpODQ1cy1DdjRURElkMkdZWDc2aHgzM2RIekFCUEZjIn0.eyJleHAiOjE2MDMxMzU2MTYsImlhdCI6MTYwMzEzNTMxNiwiYXV0aF90aW1lIjoxNjAzMTM1MzA2LCJqdGkiOiJjNTViNWViMC01MDQxLTRkOTAtYTdhYy05N2JjODI2YmZhM2YiLCJpc3MiOiJodHRwczovL2Rldi5vaWRjLmdvdi5iYy5jYS9hdXRoL3JlYWxtcy92dGtheXE0YyIsImF1ZCI6WyJjZm1zLWRldiIsImFjY291bnQiXSwic3ViIjoiOGFkNjZjMDMtMDQ1ZC00MWRmLTg2MDEtYWIyYzY4ZTIxNzczIiwidHlwIjoiQmVhcmVyIiwiYXpwIjoiY2Ztcy1kZXYtc3RhZmYiLCJub25jZSI6IjYwODgwMTE1LTAyNDQtNDc2Zi04OTdjLTc0ODIyYTYwODkyNCIsInNlc3Npb25fc3RhdGUiOiJiOTI3YTA2Ni02ODhiLTQ5ZjItYTZhZC0yZTNlOGI4MWI0OTgiLCJhY3IiOiIxIiwiYWxsb3dlZC1vcmlnaW5zIjpbImh0dHBzOi8vZGV2LXRoZXEucGF0aGZpbmRlci5nb3YuYmMuY2EvKiIsImxvY2FsaG9zdDo4MDgwIiwiaHR0cDovL2xvY2FsaG9zdDo1MDAwIiwiKiJdLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsib2ZmbGluZV9hY2Nlc3MiLCJ1bWFfYXV0aG9yaXphdGlvbiIsImludGVybmFsX3VzZXIiXX0sInJlc291cmNlX2FjY2VzcyI6eyJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX19LCJzY29wZSI6Im9wZW5pZCBwcm9maWxlIGVtYWlsIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJuYW1lIjoiQWRtaW4gQWRtaW4iLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJhZG1pbiIsImdpdmVuX25hbWUiOiJBZG1pbiIsImZhbWlseV9uYW1lIjoiQWRtaW4ifQ.bBc0yBX8B4dJRNFjTCbe2nzVGx0qVxuHs7FgGoVbhbKYsahGaofmRDVumk3Mhd64h-M2dC0xSWz7FREXFy_Bv6lvVPI5gmWlper0C89b4CRkfAsbXGl7VzvmdgMMM8C_THnL9IorpTvJTSFIRIwc6_Sj79MVE3fQ7nRFCzsX_2E2wDXiu-GasW95wiGeeIl85uFCUMcBghgFWN2Bp9_AYVePIA-A_kqYukCAMVyEK7VcRttNDWySAq9gHzWEYdEqScjUAk4xl0Ruyht2C42-C4mSycIWUJ5Z40WJMilI_aHIUZsMoRS4qgUCYl7zgrHn5pVv4mWWyoAFZrOxQrfmCQ",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin"
  },
  "referrer": "https://dev-theq.pathfinder.gov.bc.ca/queue",
  "referrerPolicy": "strict-origin-when-cross-origin",
  "body": null,
  "method": "GET",
  "mode": "cors",
  "credentials": "include"
});