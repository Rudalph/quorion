FROM ubuntu:22.04

WORKDIR /app

ENV DEBIAN_FRONTEND=noninteractive

# =========================
# System dependencies
# =========================
RUN apt-get update && apt-get install -y \
    git \
    cmake \
    gcc \
    g++ \
    ninja-build \
    python3 \
    python3-pip \
    python3-dev \
    libssl-dev \
    swig \
    pkg-config \
    libssl3 \
    && rm -rf /var/lib/apt/lists/*

# =========================
# Install liboqs (C library)
# =========================
RUN git clone --depth 1 https://github.com/open-quantum-safe/liboqs.git

WORKDIR /app/liboqs
RUN mkdir build && cd build && \
    cmake -GNinja -DBUILD_SHARED_LIBS=ON .. && \
    ninja && ninja install

# register system libs
RUN ldconfig

# =========================
# Install Python bindings
# =========================
WORKDIR /app
RUN git clone --depth 1 https://github.com/open-quantum-safe/liboqs-python.git

WORKDIR /app/liboqs-python
ENV LD_LIBRARY_PATH=/usr/local/lib

RUN pip3 install --no-cache-dir .

# =========================
# App setup
# =========================
WORKDIR /app

COPY . .

RUN pip3 install --no-cache-dir fastapi uvicorn

# =========================
# Expose API
# =========================
EXPOSE 8000

# =========================
# Run server
# =========================
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]