using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace POwusu.Server.Data.Migrations
{
    /// <inheritdoc />
    public partial class Migration_4 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Body",
                table: "Post");

            migrationBuilder.AddColumn<string>(
                name: "ContentId",
                table: "Post",
                type: "TEXT",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Content",
                columns: table => new
                {
                    Id = table.Column<string>(type: "TEXT", nullable: false),
                    Value = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Content", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Post_ContentId",
                table: "Post",
                column: "ContentId");

            migrationBuilder.AddForeignKey(
                name: "FK_Post_Content_ContentId",
                table: "Post",
                column: "ContentId",
                principalTable: "Content",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Post_Content_ContentId",
                table: "Post");

            migrationBuilder.DropTable(
                name: "Content");

            migrationBuilder.DropIndex(
                name: "IX_Post_ContentId",
                table: "Post");

            migrationBuilder.DropColumn(
                name: "ContentId",
                table: "Post");

            migrationBuilder.AddColumn<string>(
                name: "Body",
                table: "Post",
                type: "TEXT",
                nullable: false,
                defaultValue: "");
        }
    }
}
