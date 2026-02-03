using Microsoft.EntityFrameworkCore;
using Swing.Server.classes;

var builder = WebApplication.CreateBuilder(args);


builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddSingleton<PrecisionSlider>();
builder.Services.AddSingleton<MemoryPattern>();
builder.Services.AddSingleton<MinePattern>();
builder.Services.AddSingleton<TimeSwing>();
builder.Services.AddScoped<GameState>();


builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy
            .AllowAnyOrigin()
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();


app.UseCors("AllowFrontend");

app.UseAuthorization();

app.MapControllers();
app.MapFallbackToFile("/index.html");

app.Run();