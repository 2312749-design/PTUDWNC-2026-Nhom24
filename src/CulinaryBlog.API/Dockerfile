FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY ["src/CulinaryBlog.API/CulinaryBlog.API.csproj", "src/CulinaryBlog.API/"]
COPY ["src/CulinaryBlog.Application/CulinaryBlog.Application.csproj", "src/CulinaryBlog.Application/"]
COPY ["src/CulinaryBlog.Domain/CulinaryBlog.Domain.csproj", "src/CulinaryBlog.Domain/"]
COPY ["src/CulinaryBlog.Infrastructure/CulinaryBlog.Infrastructure.csproj", "src/CulinaryBlog.Infrastructure/"]

RUN dotnet restore "src/CulinaryBlog.API/CulinaryBlog.API.csproj"

COPY . .
WORKDIR "/src/src/CulinaryBlog.API"
RUN dotnet publish "CulinaryBlog.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
RUN apt-get update \
    && apt-get install -y --no-install-recommends libgssapi-krb5-2 \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY --from=build /app/publish .
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080
ENTRYPOINT ["dotnet", "CulinaryBlog.API.dll"]
