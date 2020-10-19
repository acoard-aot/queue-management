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
KEYCLOAK_URI=https://dev.oidc.gov.bc.ca/auth
ACCESS_TOKEN=$(curl -s -X POST $KEYCLOAK_URI/realms/vtkayq4c/protocol/openid-connect/token \
        -d grant_type=password \
        -d client_id=admin-cli \
        -d username=admin -d password=admin | jq -r '.access_token')
```


## Scratch


Keycloak cURL
https://github.com/dcm4che/dcm4chee-arc-light/wiki/Getting-OIDC-Access-Token-using-curl



fetch("https://dev-theq.pathfinder.gov.bc.ca/api/v1/csr_states/", {
  "headers": {
    "accept": "application/json",
    "accept-language": "en-US,en;q=0.9",
    "authorization": "Bearer eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJZUktnVzA0QmJ4QUxpODQ1cy1DdjRURElkMkdZWDc2aHgzM2RIekFCUEZjIn0.eyJleHAiOjE2MDMxMzIxNDksImlhdCI6MTYwMzEzMTg0OSwiYXV0aF90aW1lIjoxNjAzMTMxODQxLCJqdGkiOiIyMmMyODNkOC02YzBmLTQ5OTItYWZmZi1mZDc5MjE0YmY4ZmQiLCJpc3MiOiJodHRwczovL2Rldi5vaWRjLmdvdi5iYy5jYS9hdXRoL3JlYWxtcy92dGtheXE0YyIsImF1ZCI6WyJjZm1zLWRldiIsImFjY291bnQiXSwic3ViIjoiOGFkNjZjMDMtMDQ1ZC00MWRmLTg2MDEtYWIyYzY4ZTIxNzczIiwidHlwIjoiQmVhcmVyIiwiYXpwIjoiY2Ztcy1kZXYtc3RhZmYiLCJub25jZSI6IjdjY2E1NmYwLWU0OGEtNDI5Yi04YmUwLWJmMjQ5YjljZGZlNCIsInNlc3Npb25fc3RhdGUiOiI3N2FjNjA1YS04Y2I2LTQ3ZWUtOTg3Zi05MzE3M2U3YTc3OTMiLCJhY3IiOiIxIiwiYWxsb3dlZC1vcmlnaW5zIjpbImh0dHBzOi8vZGV2LXRoZXEucGF0aGZpbmRlci5nb3YuYmMuY2EvKiIsImxvY2FsaG9zdDo4MDgwIiwiaHR0cDovL2xvY2FsaG9zdDo1MDAwIiwiKiJdLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsib2ZmbGluZV9hY2Nlc3MiLCJ1bWFfYXV0aG9yaXphdGlvbiIsImludGVybmFsX3VzZXIiXX0sInJlc291cmNlX2FjY2VzcyI6eyJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX19LCJzY29wZSI6Im9wZW5pZCBwcm9maWxlIGVtYWlsIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJuYW1lIjoiQWRtaW4gQWRtaW4iLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJhZG1pbiIsImdpdmVuX25hbWUiOiJBZG1pbiIsImZhbWlseV9uYW1lIjoiQWRtaW4ifQ.Evmq4yHj1ypacSFqLOygllz-bejfJ7Aad7VwrrgAGrwg_gBISW09IcE5WGT1B1qwa2roKmS4Dm8GUFHdV1uZ5hiDkSd4eBHyHNZTNoB75XVTAbnMQ_jWkucPXt6-C_fEZGXzEgsPQUPlTn1BLO0w_TdMG4SM6MmMprtbCPB1tjp2L0xEdmMw5eAOXUJP-8VmOzR-wKfNcSQu9DLH9bmVWaudh875qxs8GAwcNOHf2jcv8Qeqs5AxIIm7nE9r3LTIlyockWnJ6E47Kl5lVZ7QlkKJYxFXEcMoKE4BY4EHfwHaqswdFNQWUxa7L7-ogvBS20m4l62MXbHMwSlVCyVYkw",
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