# The public minio/minio Docker Hub repository was withdrawn upstream. Build a
# reproducible image from the official, pinned source release instead.
FROM golang:1.24-alpine AS builder
ARG MINIO_RELEASE=RELEASE.2025-10-15T17-29-55Z
RUN apk add --no-cache git make gcc musl-dev
RUN git clone --depth 1 --branch "${MINIO_RELEASE}" https://github.com/minio/minio.git /src
WORKDIR /src
RUN CGO_ENABLED=0 go build -trimpath -ldflags="-s -w" -o /out/minio ./

FROM alpine:3.21
RUN apk add --no-cache ca-certificates curl && addgroup -S minio && adduser -S -G minio minio
COPY --from=builder /out/minio /usr/local/bin/minio
USER minio
VOLUME ["/data"]
EXPOSE 9000 9001
ENTRYPOINT ["minio"]
