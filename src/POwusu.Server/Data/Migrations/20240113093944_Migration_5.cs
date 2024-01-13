using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace POwusu.Server.Data.Migrations
{
    /// <inheritdoc />
    public partial class Migration_5 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Post_Content_ContentId",
                table: "Post");

            migrationBuilder.DropTable(
                name: "Content");

            migrationBuilder.RenameColumn(
                name: "Updated",
                table: "User",
                newName: "UpdatedAt");

            migrationBuilder.RenameColumn(
                name: "Created",
                table: "User",
                newName: "CreatedAt");

            migrationBuilder.RenameColumn(
                name: "Updated",
                table: "Post",
                newName: "UpdatedAt");

            migrationBuilder.RenameColumn(
                name: "Published",
                table: "Post",
                newName: "PublishedAt");

            migrationBuilder.RenameColumn(
                name: "Created",
                table: "Post",
                newName: "Summary");

            migrationBuilder.AlterColumn<string>(
                name: "ContentId",
                table: "Post",
                type: "TEXT",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "TEXT",
                oldNullable: true);

            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "CreatedAt",
                table: "Post",
                type: "TEXT",
                nullable: false,
                defaultValue: new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)));

            migrationBuilder.CreateTable(
                name: "PostContent",
                columns: table => new
                {
                    Id = table.Column<string>(type: "TEXT", nullable: false),
                    Value = table.Column<string>(type: "TEXT", nullable: true),
                    Type = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PostContent", x => x.Id);
                });

            migrationBuilder.AddForeignKey(
                name: "FK_Post_PostContent_ContentId",
                table: "Post",
                column: "ContentId",
                principalTable: "PostContent",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Post_PostContent_ContentId",
                table: "Post");

            migrationBuilder.DropTable(
                name: "PostContent");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "Post");

            migrationBuilder.RenameColumn(
                name: "UpdatedAt",
                table: "User",
                newName: "Updated");

            migrationBuilder.RenameColumn(
                name: "CreatedAt",
                table: "User",
                newName: "Created");

            migrationBuilder.RenameColumn(
                name: "UpdatedAt",
                table: "Post",
                newName: "Updated");

            migrationBuilder.RenameColumn(
                name: "Summary",
                table: "Post",
                newName: "Created");

            migrationBuilder.RenameColumn(
                name: "PublishedAt",
                table: "Post",
                newName: "Published");

            migrationBuilder.AlterColumn<string>(
                name: "ContentId",
                table: "Post",
                type: "TEXT",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "TEXT");

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

            migrationBuilder.AddForeignKey(
                name: "FK_Post_Content_ContentId",
                table: "Post",
                column: "ContentId",
                principalTable: "Content",
                principalColumn: "Id");
        }
    }
}
