import hashlib, hmac, json, re, secrets, time, uuid
from decimal import Decimal, InvalidOperation
import pymysql
from pymysql.cursors import DictCursor
from flask import request, jsonify
from itsdangerous import URLSafeTimedSerializer
from silence.server import manager, default_endpoints
from silence.auth import tokens
from silence.db import dal, connector
from silence.settings import settings
from silence.exceptions import HTTPError, TokenError
from silence.utils.silence_json_encoder import SilenceJSONSerializer

# ===== Bloqueo por fuerza bruta en el login =====
MAX_INTENTOS = 5
BLOQUEO_SEG = 300
fallos = {}

def login_protegido():
    datos = request.json if request.is_json else request.form
    username = datos.get("username", "")
    estado = fallos.get(username, {"n": 0, "hasta": 0})
    restante = estado["hasta"] - time.time()
    if restante > 0:
        raise HTTPError(429, f"Demasiados intentos fallidos. Inténtalo en {int(restante)} s")
    try:
        respuesta = default_endpoints.login()
    except HTTPError:
        estado["n"] += 1
        if estado["n"] >= MAX_INTENTOS:
            estado["hasta"] = time.time() + BLOQUEO_SEG
            estado["n"] = 0
        fallos[username] = estado
        raise
    fallos.pop(username, None)
    return respuesta

def login_protegido_por_ip():
    ip_origen = request.remote_addr #para coger la IP del dispositivo cliente
    
    estado = fallos.get(ip_origen, {"n": 0, "hasta": 0})
    restante = estado["hasta"] - time.time()
    
    if restante > 0:
        raise HTTPError(429, f"Dispositivo bloqueado por demasiados intentos. Espera {int(restante)} s")
    
    try:
        respuesta = default_endpoints.login()
    except HTTPError:
        estado["n"] += 1
        if estado["n"] >= MAX_INTENTOS:
            estado["hasta"] = time.time() + BLOQUEO_SEG
            estado["n"] = 0
        fallos[ip_origen] = estado
        raise
        
    fallos.pop(ip_origen, None)
    return respuesta

# ===== (aquí iréis pegando los arreglos de los siguientes pasos) =====

# ===== Clave de sesión para firmar las transferencias =====
ITERACIONES_CLAVE = 100_000
claves_sesion = {}   # token -> clave HMAC de 256 bits

def login_con_clave():
    respuesta, codigo = login_protegido_por_ip()
    datos = respuesta.get_json()
    password = (request.json if request.is_json else request.form).get("password", "")
    salt = secrets.token_bytes(16)
    claves_sesion[datos["sessionToken"]] = hashlib.pbkdf2_hmac(
        "sha256", password.encode(), salt, ITERACIONES_CLAVE)
    datos["hmacSalt"] = salt.hex()   # el salt viaja; la clave no
    return jsonify(datos), codigo

manager.setup()
manager.APP.view_functions["login"] = login_con_clave
manager.run()