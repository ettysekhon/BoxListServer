## Critical Path
---
The following scenarios are critical for our customer experience:

1. Submitting order
  * The customer should be ALWAYS able to submit an order. *When user is offline or when the API is down, we should allow the user to save the order in client application memory and the send when the API is available or when the customer has a connection.*

2. Viewing products
  * The customer should ALWAYS be able to see products. *When user is offline or when the API is down, the products can be viewed from products that are cached in client application.*

## Monitoring, Alerts & Logs
---
We want to be able to set up alerts and create a dashboard so that we are able to easily view the status of our operations. We also want to easily view our logs.

## Scaling
---
We can either create further instances or create additional containers that can be load balanced. The later is cheaper but may be less resilient.

## Backup & Recovery
---
We need to handle the following scenarios:

### Our host is down:

##### Backup plan

  a) We take automatic weekly backups paying $4 to DO.

##### Recovery plan  
  a) Login to DO dashboard and restart instance.
  b) If a) does not work then restore instance from a weekly backup [This should be tested] and then docker-compose up.
  c) We should develop auto recovery scripts to detect when host or containers down and then automatically start these. This does NOT mean we do not investigate incidents further. When we get alerts, we must also check our logs as a minimum. This should help shape the auto-recovery process.

### A container is down or unavailable:

##### Recovery plan
If more than 1 container is down then run docker-compose down then docker-compose up; otherwise start individual container.

## Security
---
1. We need to secure our endpoints.
2. We need to be able to handle DDoS attacks.  https://www.nginx.com/blog/mitigating-ddos-attacks-with-nginx-and-nginx-plus/

## Next steps:
---
1. NGINX dashboard
2. NGINX alerts (docker-mem-cache, docker-cpu-user, docker-cpu-system)
3. API dashboard
4. API alerts (docker-mem-cache, docker-cpu-user, docker-cpu-system)
5. RethinkDB dashboard
6. RethinkDB alerts (docker-mem-cache, docker-cpu-user, docker-cpu-system)
7. load testing + test alerts
8. Implement custom metrics to monitor errors in our application and also be able to monitor our RethinkDB instance. E.g. number of connections, read time, write time.
9. Implement RethinkDB fine tuning i.e. caching settings.
10. Implement redis caching on server and client caching too.
