curl 'https://ai.webapp01.hblab.dev/predict/matrix' \
 -H 'Accept-Language: en-GB,en-US;q=0.9,en;q=0.8' \
 -H 'Cache-Control: no-cache' \
 -H 'Connection: keep-alive' \
 -H 'Content-Type: application/json' \
 -H 'Origin: https://ai.webapp01.hblab.dev' \
 -H 'Pragma: no-cache' \
 -H 'Referer: https://ai.webapp01.hblab.dev/docs' \
 -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36' \
 -H 'accept: application/json' \
 --data-raw $'{\n "location": "Sydney Airport",\n "car_category": "Economy",\n "start_date": "2026-04-01",\n "end_date": "2026-04-30",\n "competitors": [\n "Avis",\n "Hertz",\n "Budget"\n ]\n}' \
 --insecure

response
{
"location": "Sydney Airport",
"car_category": "Economy",
"start_date": "2026-04-01",
"end_date": "2026-04-30",
"total_days": 30,
"currency": "USD",
"model_used": "SYD (location-specific)",
"competitors": [
"Avis",
"Hertz",
"Budget"
],
"matrix": {
"Avis": [
{
"date": "2026-04-01",
"predicted_price": 100.76
},
{
"date": "2026-04-02",
"predicted_price": 105.02
},
{
"date": "2026-04-03",
"predicted_price": 117.38
},
{
"date": "2026-04-04",
"predicted_price": 82.37
},
{
"date": "2026-04-05",
"predicted_price": 103.36
},
{
"date": "2026-04-06",
"predicted_price": 74.45
},
{
"date": "2026-04-07",
"predicted_price": 72.91
},
{
"date": "2026-04-08",
"predicted_price": 61.72
},
{
"date": "2026-04-09",
"predicted_price": 55.14
},
{
"date": "2026-04-10",
"predicted_price": 67.47
},
{
"date": "2026-04-11",
"predicted_price": 63.68
},
{
"date": "2026-04-12",
"predicted_price": 89.2
},
{
"date": "2026-04-13",
"predicted_price": 76.62
},
{
"date": "2026-04-14",
"predicted_price": 79.79
},
{
"date": "2026-04-15",
"predicted_price": 79.05
},
{
"date": "2026-04-16",
"predicted_price": 75.38
},
{
"date": "2026-04-17",
"predicted_price": 84.43
},
{
"date": "2026-04-18",
"predicted_price": 77.08
},
{
"date": "2026-04-19",
"predicted_price": 91.78
},
{
"date": "2026-04-20",
"predicted_price": 93.19
},
{
"date": "2026-04-21",
"predicted_price": 98.84
},
{
"date": "2026-04-22",
"predicted_price": 96.62
},
{
"date": "2026-04-23",
"predicted_price": 93.34
},
{
"date": "2026-04-24",
"predicted_price": 99.82
},
{
"date": "2026-04-25",
"predicted_price": 84.97
},
{
"date": "2026-04-26",
"predicted_price": 83.99
},
{
"date": "2026-04-27",
"predicted_price": 93.09
},
{
"date": "2026-04-28",
"predicted_price": 99.15
},
{
"date": "2026-04-29",
"predicted_price": 98.18
},
{
"date": "2026-04-30",
"predicted_price": 94.72
}
],
"Hertz": [
{
"date": "2026-04-01",
"predicted_price": 126.2
},
{
"date": "2026-04-02",
"predicted_price": 142.54
},
{
"date": "2026-04-03",
"predicted_price": 129.35
},
{
"date": "2026-04-04",
"predicted_price": 173.99
},
{
"date": "2026-04-05",
"predicted_price": 115.84
},
{
"date": "2026-04-06",
"predicted_price": 114.07
},
{
"date": "2026-04-07",
"predicted_price": 103.04
},
{
"date": "2026-04-08",
"predicted_price": 91.92
},
{
"date": "2026-04-09",
"predicted_price": 120.55
},
{
"date": "2026-04-10",
"predicted_price": 133.28
},
{
"date": "2026-04-11",
"predicted_price": 148.08
},
{
"date": "2026-04-12",
"predicted_price": 123.5
},
{
"date": "2026-04-13",
"predicted_price": 137.77
},
{
"date": "2026-04-14",
"predicted_price": 147.37
},
{
"date": "2026-04-15",
"predicted_price": 145.75
},
{
"date": "2026-04-16",
"predicted_price": 134.33
},
{
"date": "2026-04-17",
"predicted_price": 130.08
},
{
"date": "2026-04-18",
"predicted_price": 135.67
},
{
"date": "2026-04-19",
"predicted_price": 103.75
},
{
"date": "2026-04-20",
"predicted_price": 120.43
},
{
"date": "2026-04-21",
"predicted_price": 192.44
},
{
"date": "2026-04-22",
"predicted_price": 182.64
},
{
"date": "2026-04-23",
"predicted_price": 176.29
},
{
"date": "2026-04-24",
"predicted_price": 188.12
},
{
"date": "2026-04-25",
"predicted_price": 153.75
},
{
"date": "2026-04-26",
"predicted_price": 105.42
},
{
"date": "2026-04-27",
"predicted_price": 142.3
},
{
"date": "2026-04-28",
"predicted_price": 211.72
},
{
"date": "2026-04-29",
"predicted_price": 209.29
},
{
"date": "2026-04-30",
"predicted_price": 209.86
}
],
"Budget": [
{
"date": "2026-04-01",
"predicted_price": 126.2
},
{
"date": "2026-04-02",
"predicted_price": 142.54
},
{
"date": "2026-04-03",
"predicted_price": 129.35
},
{
"date": "2026-04-04",
"predicted_price": 173.99
},
{
"date": "2026-04-05",
"predicted_price": 115.84
},
{
"date": "2026-04-06",
"predicted_price": 114.07
},
{
"date": "2026-04-07",
"predicted_price": 103.04
},
{
"date": "2026-04-08",
"predicted_price": 91.92
},
{
"date": "2026-04-09",
"predicted_price": 120.55
},
{
"date": "2026-04-10",
"predicted_price": 133.28
},
{
"date": "2026-04-11",
"predicted_price": 148.08
},
{
"date": "2026-04-12",
"predicted_price": 123.5
},
{
"date": "2026-04-13",
"predicted_price": 137.77
},
{
"date": "2026-04-14",
"predicted_price": 147.37
},
{
"date": "2026-04-15",
"predicted_price": 145.75
},
{
"date": "2026-04-16",
"predicted_price": 134.33
},
{
"date": "2026-04-17",
"predicted_price": 130.08
},
{
"date": "2026-04-18",
"predicted_price": 135.67
},
{
"date": "2026-04-19",
"predicted_price": 103.75
},
{
"date": "2026-04-20",
"predicted_price": 120.43
},
{
"date": "2026-04-21",
"predicted_price": 192.44
},
{
"date": "2026-04-22",
"predicted_price": 182.64
},
{
"date": "2026-04-23",
"predicted_price": 176.29
},
{
"date": "2026-04-24",
"predicted_price": 188.12
},
{
"date": "2026-04-25",
"predicted_price": 153.75
},
{
"date": "2026-04-26",
"predicted_price": 105.42
},
{
"date": "2026-04-27",
"predicted_price": 142.3
},
{
"date": "2026-04-28",
"predicted_price": 211.72
},
{
"date": "2026-04-29",
"predicted_price": 209.29
},
{
"date": "2026-04-30",
"predicted_price": 209.86
}
]
},
"cheapest_per_day": [
{
"date": "2026-04-01",
"cheapest_company": "Avis",
"cheapest_price": 100.76
},
{
"date": "2026-04-02",
"cheapest_company": "Avis",
"cheapest_price": 105.02
},
{
"date": "2026-04-03",
"cheapest_company": "Avis",
"cheapest_price": 117.38
},
{
"date": "2026-04-04",
"cheapest_company": "Avis",
"cheapest_price": 82.37
},
{
"date": "2026-04-05",
"cheapest_company": "Avis",
"cheapest_price": 103.36
},
{
"date": "2026-04-06",
"cheapest_company": "Avis",
"cheapest_price": 74.45
},
{
"date": "2026-04-07",
"cheapest_company": "Avis",
"cheapest_price": 72.91
},
{
"date": "2026-04-08",
"cheapest_company": "Avis",
"cheapest_price": 61.72
},
{
"date": "2026-04-09",
"cheapest_company": "Avis",
"cheapest_price": 55.14
},
{
"date": "2026-04-10",
"cheapest_company": "Avis",
"cheapest_price": 67.47
},
{
"date": "2026-04-11",
"cheapest_company": "Avis",
"cheapest_price": 63.68
},
{
"date": "2026-04-12",
"cheapest_company": "Avis",
"cheapest_price": 89.2
},
{
"date": "2026-04-13",
"cheapest_company": "Avis",
"cheapest_price": 76.62
},
{
"date": "2026-04-14",
"cheapest_company": "Avis",
"cheapest_price": 79.79
},
{
"date": "2026-04-15",
"cheapest_company": "Avis",
"cheapest_price": 79.05
},
{
"date": "2026-04-16",
"cheapest_company": "Avis",
"cheapest_price": 75.38
},
{
"date": "2026-04-17",
"cheapest_company": "Avis",
"cheapest_price": 84.43
},
{
"date": "2026-04-18",
"cheapest_company": "Avis",
"cheapest_price": 77.08
},
{
"date": "2026-04-19",
"cheapest_company": "Avis",
"cheapest_price": 91.78
},
{
"date": "2026-04-20",
"cheapest_company": "Avis",
"cheapest_price": 93.19
},
{
"date": "2026-04-21",
"cheapest_company": "Avis",
"cheapest_price": 98.84
},
{
"date": "2026-04-22",
"cheapest_company": "Avis",
"cheapest_price": 96.62
},
{
"date": "2026-04-23",
"cheapest_company": "Avis",
"cheapest_price": 93.34
},
{
"date": "2026-04-24",
"cheapest_company": "Avis",
"cheapest_price": 99.82
},
{
"date": "2026-04-25",
"cheapest_company": "Avis",
"cheapest_price": 84.97
},
{
"date": "2026-04-26",
"cheapest_company": "Avis",
"cheapest_price": 83.99
},
{
"date": "2026-04-27",
"cheapest_company": "Avis",
"cheapest_price": 93.09
},
{
"date": "2026-04-28",
"cheapest_company": "Avis",
"cheapest_price": 99.15
},
{
"date": "2026-04-29",
"cheapest_company": "Avis",
"cheapest_price": 98.18
},
{
"date": "2026-04-30",
"cheapest_company": "Avis",
"cheapest_price": 94.72
}
]
}
