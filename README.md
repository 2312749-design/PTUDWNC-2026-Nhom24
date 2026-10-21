# Culinary Blog

Recipe-sharing application with a .NET 10 Minimal API, PostgreSQL, and a Next.js
16 / React 19 frontend.

## Project structure

- `src/CulinaryBlog.Api/` — versioned HTTP API, authentication, rate limiting,
  CORS, and generated OpenAPI documentation.
- `src/CulinaryBlog.Application/` — application abstractions.
- `src/CulinaryBlog.Domain/` — recipe and author-account entities.
- `src/CulinaryBlog.Infrastructure/` — EF Core persistence and migrations.
- `frontend/culinary-blog-web/` — Next.js App Router app, Tailwind CSS 4 UI,
  shared components, Zustand auth state, and typed API client.

## Local setup

Prerequisites: .NET 10 SDK, Node.js/npm, and PostgreSQL.

1. Configure the PostgreSQL connection string `DefaultConnection` for the API.
   Keep credentials in .NET User Secrets or environment variables rather than
   committing them.
2. Set a private JWT signing key of at least 32 UTF-8 bytes. For local
   development, initialize User Secrets and set a unique key:

   ```powershell
   dotnet user-secrets init --project src\CulinaryBlog.Api\CulinaryBlog.Api.csproj
   dotnet user-secrets set "Jwt:SigningKey" "<your-private-32-byte-or-longer-secret>" --project src\CulinaryBlog.Api\CulinaryBlog.Api.csproj
   ```

   `Jwt:Issuer`, `Jwt:Audience`, and `Jwt:TokenLifetimeMinutes` can optionally be
   overridden in configuration. The default token lifetime is 60 minutes.
3. Apply database migrations and start the API:

   ```powershell
   dotnet ef database update --project src\CulinaryBlog.Infrastructure\CulinaryBlog.Infrastructure.csproj --startup-project src\CulinaryBlog.Api\CulinaryBlog.Api.csproj
   dotnet run --project src\CulinaryBlog.Api\CulinaryBlog.Api.csproj
   ```

   Password recovery uses SMTP. Configure these values in User Secrets or
   environment variables before requesting a reset link:

   ```powershell
   dotnet user-secrets set "Frontend:BaseUrl" "http://localhost:3000" --project src\CulinaryBlog.Api\CulinaryBlog.Api.csproj
   dotnet user-secrets set "Email:Smtp:Host" "<smtp-host>" --project src\CulinaryBlog.Api\CulinaryBlog.Api.csproj
   dotnet user-secrets set "Email:Smtp:Port" "587" --project src\CulinaryBlog.Api\CulinaryBlog.Api.csproj
   dotnet user-secrets set "Email:Smtp:FromAddress" "<sender-email>" --project src\CulinaryBlog.Api\CulinaryBlog.Api.csproj
   dotnet user-secrets set "Email:Smtp:Username" "<smtp-username>" --project src\CulinaryBlog.Api\CulinaryBlog.Api.csproj
   dotnet user-secrets set "Email:Smtp:Password" "<smtp-password>" --project src\CulinaryBlog.Api\CulinaryBlog.Api.csproj
   ```

   `Email:Smtp:EnableSsl` defaults to `true`. Omit SMTP username/password for
   relays that do not require authentication. `Frontend:BaseUrl` must be the
   public frontend origin so recovery links lead to the correct application.

4. Start the frontend in a second terminal:

   ```powershell
   cd frontend\culinary-blog-web
   npm ci
   $env:API_BASE_URL = "http://localhost:5217"
   npm run dev
   ```

Set `Cors:AllowedOrigins` to the exact frontend origins allowed to call the API.
For local development the default is `http://localhost:3000`; configure
`Cors__AllowedOrigins__0` through environment variables for another origin.
`API_BASE_URL` is the backend origin (without a trailing slash); it is used by
Next.js server-side fetches and its `/api/*` rewrite.

## API security and documentation

- API routes use URL-segment versioning, currently `/api/v1`.
- `POST /api/v1/auth/register` creates an author account; `POST
  /api/v1/auth/login` returns a short-lived JWT bearer token. Passwords are
  hashed with ASP.NET Core's versioned password hasher.
- Authenticated account routes provide profile retrieval/update and password
  changes. `POST /api/v1/auth/forgot-password` sends a one-time, 30-minute
  password reset link by SMTP; reset tokens are stored as hashes.
- Recipe reads remain public. All recipe, ingredient, and step writes require an
  `Author` bearer token and are restricted to the recipe's author. The author ID
  is taken from the token, not the request body.
- `GET /api/v1/categories` lists categories and published recipe counts;
  `GET /api/v1/categories/{id}/recipes` returns a paginated category listing.
- CORS is origin-allowlisted. A per-IP global limiter allows 120 requests/minute;
  authentication endpoints additionally allow 5 requests/minute per IP. Rejected
  requests return HTTP 429.
- In the Development environment, Swagger UI is available at `/swagger` and the
  versioned OpenAPI document at `/swagger/v1/swagger.json`.

## Checks

```powershell
dotnet build src\CulinaryBlog.Api\CulinaryBlog.Api.csproj
cd frontend\culinary-blog-web
npm run lint
npm run typecheck
npm run build
```
