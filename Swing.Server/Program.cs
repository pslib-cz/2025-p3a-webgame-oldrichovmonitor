
using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
string? connectionString = builder.Configuration
    .GetConnectionString("DefaultConnection");

builder.Services.AddControllers();
builder.Services.AddAuthorization();
builder.Services.AddOptions();

// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    
    app.MapScalarApiReference(); // https://localhost:7205/scalar
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();