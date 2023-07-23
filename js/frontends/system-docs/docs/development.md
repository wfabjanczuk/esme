---
sidebar_position: 4
---

# Development

Source code is available on [GitHub](https://github.com/wfabjanczuk/esme) and it is licensed under the MIT License. The
repository structure is summarized below:

```
/envs
    /dev
    /prod
/tests
    /performance
/go
    /services
        /messenger-api
        /participant-api
/js
    /backends
        /organizer-api
    /frontends
        /organizer-ui
        /participant-ui
```

Single repository has been used to store code in all programming languages. There are in total 5 applications
communicating with each other along with two PostgreSQL databases, one MongoDB database and RabbitMQ server. All
the backend infrastructure components are documented in
[/envs/dev/docker-compose.yml](https://github.com/wfabjanczuk/esme/blob/main/envs/dev/docker-compose.yml), which can
be used to set up development environment.

Running frontends in development mode require Node.js with `npm` package manager, a browser and either Android or
iOS simulator. Mobile frontend can also be run on a physical device using the Expo platform.