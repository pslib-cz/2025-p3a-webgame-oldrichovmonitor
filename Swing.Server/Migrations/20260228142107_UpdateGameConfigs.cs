using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Swing.Server.Migrations
{
    /// <inheritdoc />
    public partial class UpdateGameConfigs : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "GameConfigs",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "IntValue1", "IntValue2" },
                values: new object[] { 5000, 12000 });

            migrationBuilder.UpdateData(
                table: "GameConfigs",
                keyColumn: "Id",
                keyValue: 3,
                column: "IntValue1",
                value: 15);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "GameConfigs",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "IntValue1", "IntValue2" },
                values: new object[] { 1000, 5000 });

            migrationBuilder.UpdateData(
                table: "GameConfigs",
                keyColumn: "Id",
                keyValue: 3,
                column: "IntValue1",
                value: 50);
        }
    }
}
