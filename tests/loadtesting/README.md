# Load testing

## Installation

```bash
# Make sure to be in `tests/loadtesting` folder
cd tests/loadtesting

npm install

# Make bash scripts executable
chmod +x profile-python.sh
chmod +x TODO-FAIZS-SCRIPT.sh TODO TODO TODO TODO TODO TODO TODO 
```


## Usage

We have created a number of npm scripts in `package.json` that expose the functionality we worked on.  For example, `npm run tests:all` runs all loadtesting - websocket and HTTP.  There is also `tests:http` and `tests:socket`.




### Python Profiling

  npm run profile:python

Run this command on the same machine that already has the API running.  It will ask for `sudo` password. It will scan for the parent gunicorn process by name and profile it.  Let this command run for the durattion of the profiling.  Typically, you start profiling, then run load testing, then exit profiling.

**Why sudo?** *The profiler we use, `pyspy` can profile already running Python processes.  This is great for profiling  real world performance, but sudo is required in order to spy on another process. This is Linux security to stop a non-sudo process from inspecting/modifying other processes which should not be allowed.*

Press "CTRL+C" to exit profiling.  Only press it once.  It will then write the report as a svg file.  If you press it twice quickly you can cancel out of it creating the report.

Typically, to combine profiling with load testing, you would...

  1. Run `npm run profile:python` on server machine.
  2. On separate load-testing machine (e.g. dev laptop), `npm run tests:all`
  3. After #2 is complete, end profiliing (Select terminal for #1 then CTRL+C to stop).

This command outputs a `profile-12345.svg` file, with the # being the pid of the parent python process running gunicorn. The file is a [flamegraph](http://www.brendangregg.com/flamegraphs.html), an interactive graph that shows what processes took the most time.


### Example Load Testing Report

After running load tests, you'll see a report (example provided):

    All virtual users finished
    Summary report @ 12:02:42(-0800) 2020-11-09
    Scenarios launched:  619
    Scenarios completed: 618
    Requests completed:  3953
    Mean response/sec: 28.49
    Response time (msec):
        min: 0
        max: 30051.4
        median: 3412
        p95: 11993.4
        p99: 17865.3
    Scenario counts:
        CSR – Login, load data, idle: 200 (32.31%)
        CSR - Websockets: 206 (33.279%)
        CSR – Create and delete appointments: 213 (34.41%)
    Codes:
        0: 412
        200: 2690
        201: 425
        204: 425
        504: 1

Some notes:

Scenarios launched is 619, which means it simulated 619 CSRs load. We ensure that the maximum concurrent users never surpasses `maxVusers` (in .yaml).   So, there are never more than 200 users _at once_, but as those users complete their load-testing tasks they are replaced with more virtual users (419 more, to be exact).


The results are mostly under "Codes".   The `0: 412` line means 412 websocket connections were made.  We can also see that for all but 1 request, we got status codes in the 200s (success).

There was one 504 error.  In order to see errors, you must monitor the pods in OpenShift.  Artillery does not expose errors.

In this case, the error was related to greenlet.

```
        [2020-11-09 19:57:08,715] ERROR    (socketio.server) <kombu_manager.py>._listen: Connection error while reading from queue
    Traceback (most recent call last):
    File "/opt/app-root/lib/python3.6/site-packages/socketio/kombu_manager.py", line 118, in _listen
        message.ack()
    File "/opt/app-root/lib/python3.6/site-packages/kombu/message.py", line 126, in ack
        self.channel.basic_ack(self.delivery_tag, multiple=multiple)
    File "/opt/app-root/lib/python3.6/site-packages/amqp/channel.py", line 1394, in basic_ack
        spec.Basic.Ack, argsig, (delivery_tag, multiple),
    File "/opt/app-root/lib/python3.6/site-packages/amqp/abstract_channel.py", line 59, in send_method
        conn.frame_writer(1, self.channel_id, sig, args, content)
    File "/opt/app-root/lib/python3.6/site-packages/amqp/method_framing.py", line 189, in write_frame
        write(view[:offset])
    File "/opt/app-root/lib/python3.6/site-packages/amqp/transport.py", line 305, in write
        self._write(s)
    File "/opt/app-root/lib/python3.6/site-packages/eventlet/greenio/base.py", line 402, in sendall
        tail = self.send(data, flags)
    File "/opt/app-root/lib/python3.6/site-packages/eventlet/greenio/base.py", line 396, in send
        return self._send_loop(self.fd.send, data, flags)
    File "/opt/app-root/lib/python3.6/site-packages/eventlet/greenio/base.py", line 383, in _send_loop
        return send_method(data, *args)
    TimeoutError: [Errno 110] Connection timed out

    During handling of the above exception, another exception occurred:

    Traceback (most recent call last):
    File "/opt/app-root/lib/python3.6/site-packages/socketio/kombu_manager.py", line 119, in _listen
        yield message.payload
    File "/opt/app-root/lib/python3.6/site-packages/kombu/simple.py", line 24, in __exit__
        self.close()
    File "/opt/app-root/lib/python3.6/site-packages/kombu/simple.py", line 92, in close
        self.consumer.cancel()
    File "/opt/app-root/lib/python3.6/site-packages/kombu/messaging.py", line 488, in cancel
        cancel(tag)
    File "/opt/app-root/lib/python3.6/site-packages/amqp/channel.py", line 1440, in basic_cancel
        wait=None if nowait else spec.Basic.CancelOk,
    File "/opt/app-root/lib/python3.6/site-packages/amqp/abstract_channel.py", line 59, in send_method
        conn.frame_writer(1, self.channel_id, sig, args, content)
    File "/opt/app-root/lib/python3.6/site-packages/amqp/method_framing.py", line 189, in write_frame
        write(view[:offset])
    File "/opt/app-root/lib/python3.6/site-packages/amqp/transport.py", line 305, in write
        self._write(s)
    File "/opt/app-root/lib/python3.6/site-packages/eventlet/greenio/base.py", line 402, in sendall
        tail = self.send(data, flags)
    File "/opt/app-root/lib/python3.6/site-packages/eventlet/greenio/base.py", line 396, in send
        return self._send_loop(self.fd.send, data, flags)
    File "/opt/app-root/lib/python3.6/site-packages/eventlet/greenio/base.py", line 383, in _send_loop
        return send_method(data, *args)
    BrokenPipeError: [Errno 32] Broken pipe
```

Running with 400 conurrent users caused many more errors:

    All virtual users finished
    Summary report @ 14:25:35(-0800) 2020-11-09
    Scenarios launched:  859
    Scenarios completed: 836
    Requests completed:  5263
    Mean response/sec: 32.75
    Response time (msec):
        min: 0
        max: 31556.1
        median: 6828.8
        p95: 22619.4
        p99: 30031
    Scenario counts:
        CSR – Login, load data, idle: 277 (32.247%)
        CSR - Websockets: 305 (35.506%)
        CSR – Create and delete appointments: 277 (32.247%)
    Codes:
        0: 610
        200: 3503
        201: 530
        204: 527
        504: 93
    Errors:
        ECONNRESET: 1







## Resources

* PySpy https://github.com/benfred/py-spy


