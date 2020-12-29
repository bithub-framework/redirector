# Redirector

## Register

Assume that your service listens at `<service-hostname>:<service-port>`.

Make an http request to `http://<redirector-hostname>:<redirector-port>/<service-name>` with

- method: `PUT`
- Content-Type: `text/plain`
- body: `http://<service-hostname>:<service-port>`

`redirector-port` defaults to 12000

## Redirection

After register,

`http://<redirector-hostname>:<redirector-port>/<service-name>/<path>`

will redirect to

`http://<service-hostname>:<service-port>/<path>`.

Note that `path` mustn't be empty, the root url `http://<service-hostname>:<service-port>` will return 404.

Queries `?key=value` and hash `#hash` are supported.
