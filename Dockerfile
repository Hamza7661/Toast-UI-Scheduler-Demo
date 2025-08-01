FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["Scheduler/Scheduler.csproj", "Scheduler/"]
RUN dotnet restore "Scheduler/Scheduler.csproj"
COPY . .
WORKDIR "/src/Scheduler"
RUN dotnet build "Scheduler.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Scheduler.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Scheduler.dll"] 