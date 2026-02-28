using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Swing.Server.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreateV2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "IntValue3",
                table: "GameConfigs",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.UpdateData(
                table: "GameConfigs",
                keyColumn: "Id",
                keyValue: 1,
                column: "IntValue3",
                value: 0);

            migrationBuilder.UpdateData(
                table: "GameConfigs",
                keyColumn: "Id",
                keyValue: 2,
                column: "IntValue3",
                value: 0);

            migrationBuilder.UpdateData(
                table: "GameConfigs",
                keyColumn: "Id",
                keyValue: 3,
                column: "IntValue3",
                value: 0);

            migrationBuilder.UpdateData(
                table: "GameConfigs",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "FloatValue", "IntValue1", "IntValue2", "IntValue3" },
                values: new object[] { 100000f, 5000, 20000, 50000 });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IntValue3",
                table: "GameConfigs");

            migrationBuilder.UpdateData(
                table: "GameConfigs",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "FloatValue", "IntValue1", "IntValue2" },
                values: new object[] { 300f, 100, 200 });
        }
    }
}
