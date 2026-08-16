                 API REQUEST
                      │
                      ▼
            ┌──────────────────┐
            │ Request Interceptor│
            └────────┬─────────┘
                     │
              Get accessToken
                     │
                     ▼
          Authorization: Bearer TOKEN
                     │
                     ▼
                 BACKEND
                     │
            ┌────────┴─────────┐
            │                  │
          200 OK              401
            │                  │
            ▼                  ▼
         RETURN         Check _retry
                              │
                         ┌────┴────┐
                         │         │
                        YES       NO
                         │         │
                         ▼         ▼
                      Logout   isRefreshing?
                                  │
                             ┌────┴────┐
                             │         │
                            YES       NO
                             │         │
                             ▼         ▼
                           QUEUE    START REFRESH
                                       │
                                       ▼
                              getRefreshToken()
                                       │
                              ┌────────┴────────┐
                              │                 │
                           SUCCESS            FAIL
                              │                 │
                              ▼                 ▼
                         New Token           Logout
                              │
                              ▼
                     Update Zustand
                              │
                              ▼
                     Resolve Queue
                              │
                              ▼
                     Retry Original
                              │
                              ▼
                     Request Interceptor
                              │
                              ▼
                       NEW ACCESS TOKEN
                              │
                              ▼
                           BACKEND
                              │
                              ▼
                            200 OK