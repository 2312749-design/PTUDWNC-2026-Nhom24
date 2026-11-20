-- This script is applied only when PostgreSQL initializes a brand-new Docker
-- volume. It keeps accounts and application content while removing credentials
-- that are tied to the source machine or an old browser session.

TRUNCATE TABLE "RefreshTokens" CASCADE;
TRUNCATE TABLE "TwoFactorRecoveryCodes" CASCADE;
TRUNCATE TABLE "EmailChangeRequests" CASCADE;
TRUNCATE TABLE "AspNetUserTokens" CASCADE;
TRUNCATE TABLE "UserActivityLogs" CASCADE;
TRUNCATE TABLE "AdminAuditLogs" CASCADE;

UPDATE "Users"
SET
  "TwoFactorEnabled" = FALSE,
  "TwoFactorSecretProtected" = NULL,
  "AccessFailedCount" = 0,
  "LockoutEnd" = NULL,
  "IsSuspended" = FALSE,
  "SuspendedUntil" = NULL,
  "SuspensionReason" = NULL,
  "LastLoginIp" = NULL,
  "LastLoginUserAgent" = NULL;
