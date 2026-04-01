curl 'http://172.16.52.46:8080/dashboard/overview' \
 -H 'Accept-Language: en-GB,en-US;q=0.9,en;q=0.8' \
 -H 'Cache-Control: no-cache' \
 -H 'Connection: keep-alive' \
 -H 'Content-Type: application/json' \
 -H 'Origin: http://172.16.52.46:8080' \
 -H 'Pragma: no-cache' \
 -H 'Referer: http://172.16.52.46:8080/docs' \
 -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36' \
 -H 'accept: application/json' \
 --data-raw $'{\n "location": "Sydney Airport",\n "car_category": "Economy",\n "pickup_date": "2026-04-15",\n "rental_duration": 3,\n "calendar_days": 7\n}' \
 --insecure
payload:
{
"location": "Sydney Airport",
"car_category": "Economy",
"pickup_date": "2026-04-15",
"rental_duration": 3,
"calendar_days": 7
}

response
{
"location": "Sydney Airport",
"car_category": "Economy",
"pickup_date": "2026-04-01",
"rental_duration": 3,
"currency": "USD",
"model_used": "SYD (location-specific)",
"summary": {
"avg_daily_rate": 69.54,
"lowest_rate": {
"price": 53.11,
"competitor": "East Coast Rentals"
},
"highest_rate": {
"price": 123.01,
"competitor": "Avis"
},
"competitor_count": 12,
"total_vehicles_analyzed": 696,
"top_demand_hub": "Cairns Airport"
},
"calendar": [
{
"date": "2026-03-29",
"is_selected": false,
"cheapest_price": 47.2,
"cheapest_company": "Alpha",
"highest_price": 121.86,
"highest_company": "Yesaway",
"our_suggested_price": 63.43,
"vs_cheapest_pct": 34.4
},
{
"date": "2026-03-30",
"is_selected": false,
"cheapest_price": 44.94,
"cheapest_company": "Alpha",
"highest_price": 133.58,
"highest_company": "Yesaway",
"our_suggested_price": 68.72,
"vs_cheapest_pct": 52.9
},
{
"date": "2026-03-31",
"is_selected": false,
"cheapest_price": 61.23,
"cheapest_company": "Alpha",
"highest_price": 143.4,
"highest_company": "Ace Rental Cars",
"our_suggested_price": 74.32,
"vs_cheapest_pct": 21.4
},
{
"date": "2026-04-01",
"is_selected": true,
"cheapest_price": 63.79,
"cheapest_company": "East Coast Rentals",
"highest_price": 126.2,
"highest_company": "Ace Rental Cars",
"our_suggested_price": 80.27,
"vs_cheapest_pct": 25.8
},
{
"date": "2026-04-02",
"is_selected": false,
"cheapest_price": 64.98,
"cheapest_company": "East Coast Rentals",
"highest_price": 142.54,
"highest_company": "Ace Rental Cars",
"our_suggested_price": 85.92,
"vs_cheapest_pct": 32.2
},
{
"date": "2026-04-03",
"is_selected": false,
"cheapest_price": 70.06,
"cheapest_company": "Simba Car Hire",
"highest_price": 129.35,
"highest_company": "Ace Rental Cars",
"our_suggested_price": 83.54,
"vs_cheapest_pct": 19.2
},
{
"date": "2026-04-04",
"is_selected": false,
"cheapest_price": 57.07,
"cheapest_company": "East Coast Rentals",
"highest_price": 173.99,
"highest_company": "Ace Rental Cars",
"our_suggested_price": 74.65,
"vs_cheapest_pct": 30.8
}
],
"competitors": [
{
"channel": "Booking.com",
"competitor": "East Coast Rentals",
"category": "Economy",
"location": "Sydney Airport",
"date": "2026-04-01",
"price_per_day": 53.11,
"total_rate": 159.33,
"confidence": {
"interval": {
"low": 47.11,
"high": 70.19
},
"interval_width": 23.08,
"confidence_score": 0.74,
"confidence_label": "high"
}
},
{
"channel": "Booking.com",
"competitor": "Alpha",
"category": "Economy",
"location": "Sydney Airport",
"date": "2026-04-01",
"price_per_day": 58.52,
"total_rate": 175.56,
"confidence": {
"interval": {
"low": 39.53,
"high": 71.09
},
"interval_width": 31.56,
"confidence_score": 0.62,
"confidence_label": "medium"
}
},
{
"channel": "Booking.com",
"competitor": "Simba Car Hire",
"category": "Economy",
"location": "Sydney Airport",
"date": "2026-04-01",
"price_per_day": 63.66,
"total_rate": 190.98,
"confidence": {
"interval": {
"low": 52.58,
"high": 62.18
},
"interval_width": 9.6,
"confidence_score": 0.89,
"confidence_label": "high"
}
},
{
"channel": "Booking.com",
"competitor": "Ace Rental Cars",
"category": "Economy",
"location": "Sydney Airport",
"date": "2026-04-01",
"price_per_day": 66.68,
"total_rate": 200.04,
"confidence": {
"interval": {
"low": 40.54,
"high": 63.52
},
"interval_width": 22.98,
"confidence_score": 0.71,
"confidence_label": "high"
}
},
{
"channel": "Booking.com",
"competitor": "Crazy Clark's Car Rentals",
"category": "Economy",
"location": "Sydney Airport",
"date": "2026-04-01",
"price_per_day": 66.68,
"total_rate": 200.04,
"confidence": {
"interval": {
"low": 40.54,
"high": 63.52
},
"interval_width": 22.98,
"confidence_score": 0.71,
"confidence_label": "high"
}
},
{
"channel": "Booking.com",
"competitor": "Europcar",
"category": "Economy",
"location": "Sydney Airport",
"date": "2026-04-01",
"price_per_day": 69.08,
"total_rate": 207.24,
"confidence": {
"interval": {
"low": 59.56,
"high": 95.45
},
"interval_width": 35.89,
"confidence_score": 0.69,
"confidence_label": "medium"
}
},
{
"channel": "Booking.com",
"competitor": "Keddy By Europcar",
"category": "Economy",
"location": "Sydney Airport",
"date": "2026-04-01",
"price_per_day": 70,
"total_rate": 210,
"confidence": {
"interval": {
"low": 66.64,
"high": 61.93
},
"interval_width": -4.71,
"confidence_score": 1.05,
"confidence_label": "high"
}
},
{
"channel": "Booking.com",
"competitor": "Green Motion",
"category": "Economy",
"location": "Sydney Airport",
"date": "2026-04-01",
"price_per_day": 73.55,
"total_rate": 220.65,
"confidence": {
"interval": {
"low": 63.34,
"high": 73.84
},
"interval_width": 10.5,
"confidence_score": 0.9,
"confidence_label": "high"
}
},
{
"channel": "Booking.com",
"competitor": "Yesaway",
"category": "Economy",
"location": "Sydney Airport",
"date": "2026-04-01",
"price_per_day": 74.7,
"total_rate": 224.1,
"confidence": {
"interval": {
"low": 64.08,
"high": 94.92
},
"interval_width": 30.84,
"confidence_score": 0.74,
"confidence_label": "high"
}
},
{
"channel": "Booking.com",
"competitor": "Sixt",
"category": "Economy",
"location": "Sydney Airport",
"date": "2026-04-01",
"price_per_day": 81.94,
"total_rate": 245.82,
"confidence": {
"interval": {
"low": 68.56,
"high": 93.22
},
"interval_width": 24.66,
"confidence_score": 0.8,
"confidence_label": "high"
}
},
{
"channel": "Booking.com",
"competitor": "Bargain Car Rentals",
"category": "Economy",
"location": "Sydney Airport",
"date": "2026-04-01",
"price_per_day": 90.78,
"total_rate": 272.34,
"confidence": {
"interval": {
"low": 57.18,
"high": 98.63
},
"interval_width": 41.45,
"confidence_score": 0.65,
"confidence_label": "medium"
}
},
{
"channel": "Booking.com",
"competitor": "Avis",
"category": "Economy",
"location": "Sydney Airport",
"date": "2026-04-01",
"price_per_day": 123.01,
"total_rate": 369.03,
"confidence": {
"interval": {
"low": 65.55,
"high": 110.98
},
"interval_width": 45.43,
"confidence_score": 0.66,
"confidence_label": "medium"
}
}
],
"context": {
"weather": {
"source": "forecast",
"temp_max_c": 26,
"precip_mm": 0,
"condition": "Foggy",
"condition_type": "cloudy",
"season": null,
"summary": "Foggy, 26.0°C, 0mm rain"
},
"events": {
"count": 2,
"impact_level": "medium",
"summary": "2 events in city",
"sources": {
"unknown": 2
},
"events": [
{
"name": "The Prom",
"category": "Arts & Theatre",
"date": "2026-04-01",
"venue": "Teatro - At The Italian Forum",
"expected_impact": null,
"source": null,
"url": "https://www.ticketmaster.com.au/the-prom-leichhardt-01-04-2026/event/2500638FBDDD4C74"
},
{
"name": "The Diary of Anne Frank",
"category": "Arts & Theatre",
"date": "2026-04-01",
"venue": "State Theatre, Sydney",
"expected_impact": null,
"source": null,
"url": "https://www.ticketmaster.com.au/the-diary-of-anne-frank-sydney-01-04-2026/event/1300635AE0D7C9BC"
}
]
},
"public_holidays": [
{
"date": "2026-04-03",
"name": "Good Friday"
}
],
"demand_drivers": [
"Events in city (impact: medium)"
]
}
}
