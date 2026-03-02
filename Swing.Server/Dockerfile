# =========================
# Stage 1: Build frontend
# =========================
FROM node:22-alpine AS client-build
WORKDIR /app/client

# Copy package files first (better cache)
COPY swing.client/package*.json ./
RUN npm ci

# Copy the rest of the client
COPY swing.client/ ./
RUN npm run build


# =========================
# Stage 2: Build backend
# =========================
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS server-build
WORKDIR /app/server

# Copy csproj and restore
COPY Swing.Server/Swing.Server.csproj ./
# Remove the esproj reference before restore (it's not needed in Docker)
RUN sed -i '/<ProjectReference.*esproj/,/<\/ProjectReference>/d' Swing.Server.csproj
RUN dotnet restore

# Copy server source
COPY Swing.Server/ ./
RUN dotnet publish -c Release -o /app/publish --no-restore


# =========================
# Stage 3: Runtime
# =========================
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app

# Copy published server
COPY --from=server-build /app/publish ./

# Copy built client into wwwroot
COPY --from=client-build /app/client/dist ./wwwroot

EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080
ENV ConnectionStrings__DefaultConnection="Data Source=/data/app.db"
ENTRYPOINT ["dotnet", "Swing.Server.dll"]
