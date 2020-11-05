Profiling

http://localhost:8080/appointments


Convert below into script.
- Get PID of gunicorn by name 
  - run on for loop ( can handle multiple, including sub process)

## Python Profiling


```bash

# Get PID of process
pgrep -f gunicorn


sudo py-spy record -o profile.svg --pid 37477


# use  lowest pid to  find parent
sudo py-spy record -o profile.svg --subprocesses --pid 43069
sudo py-spy record -o profile.svg --subprocesses --pid 37055

```


#### Postgres

Patroni - set
 changed `PATRONI_LOG_LEVEL` from `WARNING` to `INFO`
 added `PATRONI_LOG_DIR` set to `/var/log/postgresql/` - note folder already exists but was empty
```

```


## Observations

On `profile-withloadtesting.svg` - should run again with higher levels of load testing.

Preliminary Observations:
- 36% of time spent on validating tokens
- json is 11%, 2% for marshalling and 9% for encoding
- non-framework  controller code is around 11%, all of that is basically just orm requests




## References
https://docs.sqlalchemy.org/en/13/faq/performance.html