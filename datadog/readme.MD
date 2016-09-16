# Monitoring Containers Tips:

1. Monitor all layers of your stack together, so that you can see what is happening everywhere, at the same time, with no gaps

2. Tag your containers so that you can monitor them as queryable sets rather than as individuals

## Key Docker resource metrics
  1. user CPU
  2. system CPU
  3. throttling (count)
  4. throttling (time)


# NGINX metrics to report on:

## Basic activity metrics
---
  1. **Dropped connections**  

      *The number of connections that have been dropped is equal to the difference between accepts and handled (NGINX) or is exposed directly as a standard metric (NGINX Plus). Under normal circumstances, dropped connections should be zero. If your rate of dropped connections per unit time starts to rise, look for possible resource saturation.*
  2. **Requests per second**  

      *Sampling your request data (requests in open-source, or total in Plus) with a fixed time interval provides you with the number of requests you’re receiving per unit of time—often minutes or seconds. Monitoring this metric can alert you to spikes in incoming web traffic, whether legitimate or nefarious, or sudden drops, which are usually indicative of problems. A drastic change in requests per second can alert you to problems brewing somewhere in your environment, even if it cannot tell you exactly where those problems lie. Note that all requests are counted the same, regardless of their URLs.*

## Error metrics
---
  1. **Server error rate**  

  *Your server error rate is equal to the number of 5xx errors, such as “502 Bad Gateway”, divided by the total number of status codes (1xx, 2xx, 3xx, 4xx, 5xx), per unit of time (often one to five minutes). If your error rate starts to climb over time, investigation may be in order. If it spikes suddenly, urgent action may be required, as clients are likely to report errors to the end user*

## Performance metrics
---
  1. **Request processing time**  

## Availability metrics
---
