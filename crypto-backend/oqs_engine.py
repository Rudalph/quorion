import oqs

# ML-DSA (Dilithium)
def generate_ml_dsa():
    sig = oqs.Signature("Dilithium3")

    public_key = sig.generate_keypair()
    secret_key = sig.export_secret_key()

    return {
        "algorithm": "ML-DSA (Dilithium)",
        "publicKey": public_key.hex(),
        "privateKey": secret_key.hex(),
    }


# SLH-DSA (SPHINCS+)
def generate_slh_dsa():
    sig = oqs.Signature("SPHINCS+-SHA2-128f-simple")

    public_key = sig.generate_keypair()
    secret_key = sig.export_secret_key()

    return {
        "algorithm": "SLH-DSA (SPHINCS+)",
        "publicKey": public_key.hex(),
        "privateKey": secret_key.hex(),
    }