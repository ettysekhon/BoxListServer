docker configuration

docker-compose commands

build (build or rebuild)
up (create and start) --no-deps (partial -updo not recreate services that node depends on)
down --rmi all (remove all images) --volumes (remove all volumes)
logs
ps
stop
start
rm


docker run -d
--name dd-agent
-v /var/run/docker.sock:/var/run/docker.sock:ro
-v /proc/:/host/proc/:ro
-v /sys/fs/cgroup/:/host/sys/fs/cgroup:ro
-e API_KEY=9a890044eb035102724a01565e964182
datadog/docker-dd-agent:latest

datadog:
  build: datadog
  links:
   - redis # ensures that redis is a host that the container can find
  environment:
   - API_KEY=9a890044eb035102724a01565e964182
  volumes:
   - /var/run/docker.sock:/var/run/docker.sock:ro
   - /proc/:/host/proc/:ro
   - /sys/fs/cgroup:/host/sys/fs/cgroup:ro
