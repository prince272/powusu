using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace POwusu.Server.Data.Migrations
{
    /// <inheritdoc />
    public partial class Migration_6 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "Deleted",
                table: "Post",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "DeletedAt",
                table: "Post",
                type: "TEXT",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Deleted",
                table: "Post");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                table: "Post");
        }
    }
}
