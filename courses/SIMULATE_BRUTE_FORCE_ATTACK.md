# Simulate Brute Force Attack

```
docker run -it --rm --network host --name load-brute-force-attack busybox sh -c "while sleep 1; do wget -q -O- http://host.docker.internal/v1/course; done"
```
