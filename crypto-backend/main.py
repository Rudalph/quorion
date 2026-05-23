import oqs
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class KeyRequest(BaseModel):
    algorithm: str


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