import oqs
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class KeyRequest(BaseModel):
    algorithm: str

class SignRequest(BaseModel):
    algorithm: str
    privateKey: str
    message: str

class VerifyRequest(BaseModel):
    algorithm: str
    publicKey: str
    message: str
    signature: str


@app.post("/generate-keys")
def generate_keys(data: KeyRequest):
    try:
        algo_map = {
            "ML-DSA (Dilithium)": "ML-DSA-65",
            "SLH-DSA (SPHINCS+)": "SLH_DSA_PURE_SHA2_128S",
        }

        if data.algorithm not in algo_map:
            return {"error": "Invalid algorithm"}

        oqs_algo = algo_map[data.algorithm]

        sig = oqs.Signature(oqs_algo)

        print("Using algorithm:", oqs_algo)

        public_key = sig.generate_keypair()
        private_key = sig.export_secret_key()

        if not public_key or not private_key:
            raise Exception("Key generation failed - empty output")

        return {
            "publicKey": bytes(public_key).hex(),
            "privateKey": bytes(private_key).hex(),
            "algorithm": oqs_algo,
            "status": "success"
        }

    except Exception as e:
        print("ERROR:", str(e))
        return {
            "error": "Key generation failed",
            "details": str(e)
        }
    

@app.post("/sign-message")
def sign_message(data: SignRequest):
    try:
        algo_map = {
            "ML-DSA (Dilithium)": "ML-DSA-65",
            "SLH-DSA (SPHINCS+)": "SLH_DSA_PURE_SHA2_128S",
        }

        if data.algorithm not in algo_map:
            return {"error": "Invalid algorithm"}

        oqs_algo = algo_map[data.algorithm]

        # Decode hex private key back to bytes
        private_key_bytes = bytes.fromhex(data.privateKey)
        message_bytes = data.message.encode("utf-8")

        sig = oqs.Signature(oqs_algo, private_key_bytes)

        signature = sig.sign(message_bytes)

        print(f"[{oqs_algo}] Signature length: {len(signature)} bytes")

        return {
            "signature": bytes(signature).hex(),
            "algorithm": oqs_algo,
            "status": "success"
        }

    except Exception as e:
        print("ERROR:", str(e))
        return {
            "error": "Signing failed",
            "details": str(e)
        }
    
@app.post("/verify-message")
def verify_message(data: VerifyRequest):
    try:
        algo_map = {
            "ML-DSA (Dilithium)": "ML-DSA-65",
            "SLH-DSA (SPHINCS+)": "SLH_DSA_PURE_SHA2_128S",
        }

        if data.algorithm not in algo_map:
            return {"error": "Invalid algorithm"}

        oqs_algo = algo_map[data.algorithm]

        public_key_bytes = bytes.fromhex(data.publicKey)
        message_bytes = data.message.encode("utf-8")
        signature_bytes = bytes.fromhex(data.signature)

        sig = oqs.Signature(oqs_algo)

        is_valid = sig.verify(message_bytes, signature_bytes, public_key_bytes)

        print(f"[{oqs_algo}] Verification result: {is_valid}")

        return {
            "isValid": is_valid,
            "algorithm": oqs_algo,
            "status": "success"
        }

    except Exception as e:
        print("ERROR:", str(e))
        return {
            "error": "Verification failed",
            "details": str(e)
        }


@app.get("/algos")
def algos():
    import oqs
    return oqs.get_enabled_sig_mechanisms()

@app.get("/debug-algos")
def debug():
    import oqs

    usable = []
    for algo in oqs.get_enabled_sig_mechanisms():
        try:
            oqs.Signature(algo)
            usable.append(algo)
        except Exception:
            pass

    return usable