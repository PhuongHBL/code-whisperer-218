curl 'http://172.16.52.27:8080/api/v1/auth/login' \
 -H 'Accept-Language: en-GB,en-US;q=0.9,en;q=0.8' \
 -H 'Cache-Control: no-cache' \
 -H 'Connection: keep-alive' \
 -H 'Content-Type: application/json' \
 -H 'Origin: http://172.16.52.27:8080' \
 -H 'Pragma: no-cache' \
 -H 'Referer: http://172.16.52.27:8080/docs' \
 -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36' \
 -H 'accept: application/json' \
 --data-raw $'{\n "email": "admin@carrental.com",\n "password": "Admin@2026\u0021"\n}' \
 --insecure

response:
admin
{
"access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhN2JiMzNkYi03NzEwLTQzOGItYWU3Yy0wMzc1OGMxYTc4NWQiLCJ0eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzc1MDY5NjM2fQ.QKEoUAOXo6vvDTNpKD-zv01NdwSe_wB2TJt_cs1yHmw",
"refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhN2JiMzNkYi03NzEwLTQzOGItYWU3Yy0wMzc1OGMxYTc4NWQiLCJ0eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTY3MjYzNn0.j9GfointDEot6Plk_Fc8hgGvm4gG62xSCDOdKodFVuM",
"token_type": "bearer",
"is_admin": true,
"full_name": "Fleet Manager"
}

normal user:
{
"access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhMmYzZWIzMC05MDhlLTQ2NWItYTdmNS1iZTRkM2U2NWY0MTUiLCJ0eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzc1MDY5Nzk1fQ.l6yINY8q3FMntYbpj16yjwadyFKyuTT4i4ipCrD8LXY",
"refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhMmYzZWIzMC05MDhlLTQ2NWItYTdmNS1iZTRkM2U2NWY0MTUiLCJ0eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTY3Mjc5NX0.hPysEDe_P5kq8uGWfKBlJgjqvuRK7h9nn4g50GiryVc",
"token_type": "bearer",
"is_admin": false,
"full_name": "Alice Johnson"
}
